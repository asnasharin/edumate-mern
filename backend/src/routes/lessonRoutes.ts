import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { createLesson, deleteLesson, editLesson, getLessons } from "../controller/lessonController";


const router: Router = Router()

router.post("/createlesson", protect, createLesson)
router.get("/getlessons/:id", protect, getLessons)
router.patch("/deltelesson", protect, deleteLesson)
router.put("/editlesson", protect, editLesson)

export default router;