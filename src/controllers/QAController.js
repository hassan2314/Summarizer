import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export class QAController {
  constructor(qaService) {
    this.qaService = qaService;
  }

  createQA = async (req, res) => {
    const { originalText, questions, answers, feedback, tags, type, name } =
      req.body;
    const userId = req.user.id;
    try {
      const summarySaved = await this.summaryService.create({
        originalText,
        questions,
        answers,
        feedback,
        tags,
        type,
        name,
        userId,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, summarySaved, "saved in history"));
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  };

  getQA = async (req, res) => {
    try {
      const userId = req.user.id;
      const summary = await this.qaService.findByUserId(userId);
      return res.status(200).json(new ApiResponse(200, summary, "success"));
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  };

  updateQA = async (req, res) => {
    const { id } = req.params;
    const { originalText, questions, answers, feedback, tags, type, name } =
      req.body;
    const userId = req.user.id;
    try {
      const summarySaved = await this.qaService.update(id, {
        originalText,
        questions,
        answers,
        feedback,
        tags,
        type,
        name,
        userId,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, summarySaved, "saved in history"));
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  };

  deleteQA = async (req, res) => {
    const { id } = req.params;
    try {
      const summarySaved = await this.qaService.delete(id);
      return res
        .status(200)
        .json(new ApiResponse(200, summarySaved, "deleted from history"));
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  };
}
