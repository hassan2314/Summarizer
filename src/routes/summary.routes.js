import { Router } from "express";
import { SummaryController } from "../controllers/SummaryController.js";
import { SummaryService } from "../services/SummaryService.js";
import verifyJwt from "../middleware/auth.middleware.js";

const router = Router();
const summaryService = new SummaryService();
const summaryController = new SummaryController(summaryService);

router.use(verifyJwt);
router.get("/", summaryController.getSummary);
router.get("/top-tags", summaryController.getTopTags);
router.post("/", summaryController.create);
router.get("/:id", summaryController.getSummaryById);
router.delete("/:id", summaryController.deleteSummary);
router.put("/:id", summaryController.updateSummary);

export default router;
