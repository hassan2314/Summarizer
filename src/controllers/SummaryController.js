import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export class SummaryController {
  constructor(summaryService) {
    this.summaryService = summaryService;
  }

  create = async (req, res) => {
    const { originalText, response, tags, type, name } = req.body;
    const userId = req.user.id;
    try {
      const summarySaved = await this.summaryService.create({
        originalText,
        response,
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

  getSummary = async (req, res) => {
    try {
      const { tag } = req.query;
      const userId = req.user.id;

      const summary = tag
        ? await this.summaryService.findByUserIdAndTag(userId, tag)
        : await this.summaryService.findByUserId(userId);

      return res.status(200).json(new ApiResponse(200, summary));
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  };

  getTopTags = async (req, res) => {
    try {
      const userId = req.user.id;
      const topTags = await this.summaryService.getTopTags(userId);
      return res.status(200).json(new ApiResponse(200, topTags));
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  };

  deleteSummary = async (req, res) => {
    try {
      const summary = await this.summaryService.delete(req.params.id);
      return res.status(200).json(new ApiResponse(200, summary));
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  };

  updateSummary = async (req, res) => {
    const { response } = req.body;
    if (!response) throw new ApiError(400, "Summary is required");
    try {
      const summaryUpdated = await this.summaryService.update(req.params.id, {
        response,
      });
      return res.status(200).json(new ApiResponse(200, summaryUpdated));
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  };

  getSummaryById = async (req, res) => {
    try {
      const summary = await this.summaryService.findById(req.params.id);
      if (!summary) throw new ApiError(404, "Summary not found");
      return res.status(200).json(new ApiResponse(200, summary));
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  };
}
