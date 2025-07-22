import { Router } from "express";
import {
    createCourse,
    deletecourse,
    editCourse,
    getCourse,
    viewCourse
} from "../controller/courseController"
import { isLoggedIn, protect } from "../middleware/authMiddleware";

const router: Router = Router()

router.post("/create",protect, isLoggedIn, createCourse)
router.get("/courses", isLoggedIn, getCourse)
router.get("/viewcourse/:id", isLoggedIn, viewCourse)
router.put("/editcourse/:id", protect, editCourse)
router.delete("/deletecourse/:id", deletecourse)

export default router;

