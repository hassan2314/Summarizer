import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { UserService } from "../services/UserService.js";
import verifyJwt from "../middleware/auth.middleware.js";

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.get("/:id", verifyJwt, userController.findById);
router.post("/", userController.create);
router.post("/login", userController.login);
router.post("/refresh-token", userController.refreshAccessToken);
router.put("/logout", verifyJwt, userController.logout);
router.put("/:id", verifyJwt, userController.updatePassword);
router.delete("/:id", verifyJwt, userController.delete);

export default router;
