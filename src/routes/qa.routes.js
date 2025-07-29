import { Router } from "express";
import { QAController } from "../controllers/QAController.js";
import { QAService } from "../services/QAService.js";
import verifyJwt from "../middleware/auth.middleware.js";

const router = Router();
const qaService = new QAService();
const qaController = new QAController(qaService);

router.use(verifyJwt);
router.get("/", qaController.getQA);
router.post("/", qaController.createQA);
router.put("/:id", qaController.updateQA);
router.delete("/:id", qaController.deleteQA);

export default router;
