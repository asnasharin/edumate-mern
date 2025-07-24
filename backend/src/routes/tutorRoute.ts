import { Router } from "express";
import { getMyCourse } from "../controller/courseController";
import { protect } from "../middleware/authMiddleware";
import { getProfile, updateProfilePicture, updateTutorProfile } from "../controller/tutorProfileController";

const router: Router = Router()

router.get("/mycourses/:id", protect, getMyCourse)
router.get("/tutorprofile", protect, getProfile)
router.patch("/updateprofilepicture", protect, updateProfilePicture)
router.post("/updateprofile", protect, updateTutorProfile)

export default router