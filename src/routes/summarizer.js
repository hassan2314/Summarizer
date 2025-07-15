import express from "express";
import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { dialogue, mode } = req.body;

    if (!dialogue || !mode) {
      throw new ApiError(400, "Dialogue and Mode is required.");
    }

    const response = await axios.post("http://127.0.0.1:8000/summarize", {
      dialogue,
      mode,
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, response.data, "Summary fetched successfully")
      );
  } catch (error) {
    console.error("🔴 Summarizer API Error:", error.message);
    throw new ApiError(500, error.message);
  }
});

export default router;
