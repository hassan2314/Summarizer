import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  generateAccessToken = (user) => {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
  };

  generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
  };

  refreshAccessToken = async (req, res) => {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) {
        throw new ApiError(401, "Refresh token not found");
      }

      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

      const user = await this.userService.findById(decoded.id);
      if (!user || user.refreshToken !== token) {
        throw new ApiError(403, "Invalid refresh token");
      }

      const accessToken = this.generateAccessToken(user);

      const { password, refreshToken, ...safeUser } = user;

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            accessToken,
            user: safeUser,
          },
          "Access token refreshed"
        )
      );
    } catch (error) {
      return res
        .status(401)
        .json(
          new ApiError(401, error.message || "Invalid or expired refresh token")
        );
    }
  };

  create = async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email and password are required");
    }

    try {
      const existUser = await this.userService.findByEmail(email);
      if (existUser) {
        throw new ApiError(400, "User already exist");
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await this.userService.create({
        name,
        email,
        password: passwordHash,
      });
      if (!user) {
        throw new ApiError(400, "User not created");
      }
      return res.status(201).json(new ApiResponse(201, user));
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new ApiError(400, "User not found");
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new ApiError(400, "Password is incorrect");
      }
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);
      await this.userService.updateUser(user.id, { refreshToken });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, { accessToken }, "Login successful"));
    } catch (error) {
      throw new ApiError(400, error.message);
    }
  };

  logout = async (req, res) => {
    await this.userService.updateUser(req.user.id, { refreshToken: null });
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Logout successful"));
  };

  findById = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await this.userService.findById(id);
      return res.status(200).json(new ApiResponse(200, user));
    } catch (error) {
      throw new ApiError(400, error.message);
    }
  };

  updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;
    try {
      const user = await this.userService.findById(id);
      const passwordMatch = await bcrypt.compare(
        oldPassword,
        user.passwordHash
      );
      if (!passwordMatch) {
        throw new ApiError(400, "Old password is incorrect");
      }
      const passwordHash = await bcrypt.hash(newPassword, 10);
      const updatedUser = await this.userService.updateUser(id, {
        passwordHash,
      });
      return res.status(200).json(new ApiResponse(200, updatedUser));
    } catch (error) {
      throw new ApiError(400, error.message);
    }
  };

  delete = async (req, res) => {
    const { id } = req.user;
    try {
      const deletedUser = await this.userService.deleteUser(id);
      return res.status(200).json(new ApiResponse(200, deletedUser));
    } catch (error) {
      throw new ApiError(400, error.message);
    }
  };
}
