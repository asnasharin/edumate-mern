import { Router } from "express";
import { getMyCourse } from "../controller/courseController";
import { protect } from "../middleware/authMiddleware";

const router: Router = Router()

router.get("/mycourses/:id", protect, getMyCourse)

export default router