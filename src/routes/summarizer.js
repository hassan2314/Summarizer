import express from "express";
import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { dialogue, mode } = req.body;

    // Validation
    if (!dialogue?.trim()) {
      throw new ApiError(400, "Dialogue text is required");
    }
    if (!mode || !["bullets", "paragraph", "questions"].includes(mode)) {
      throw new ApiError(
        400,
        "Mode must be either 'bullets' or 'paragraph' or 'questions"
      );
    }

    const response = await axios.post(`${process.env.FASTAPI_URL}/summarize`, {
      dialogue: dialogue.trim(),
      mode,
    });

    // Forward the response from FastAPI
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          response.data,
          response.data.message || "Summary generated successfully"
        )
      );
  } catch (error) {
    // Handle Axios errors
    if (error.isAxiosError) {
      const apiError = error.response?.data || {
        message: error.message,
        statusCode: error.response?.status || 500,
      };
      return next(
        new ApiError(apiError.statusCode, apiError.detail || apiError.message)
      );
    }

    // Handle other errors
    next(error);
  }
});

export default router;
