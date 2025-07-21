import { Router } from "express";
import {
    createCourse
} from "../controller/courseController"
import { isLoggedIn, protect } from "../middleware/authMiddleware";

const router: Router = Router()

router.post("/create",protect, isLoggedIn, createCourse)

export default router;