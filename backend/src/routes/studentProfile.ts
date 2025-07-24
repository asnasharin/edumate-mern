import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { getProfile, updateProfile, updateStudentProfile } from "../controller/studentProfileController";

const router: Router = Router()

router.get("/studentprofile", protect, getProfile)
router.post("/updatestudentprofile", protect, updateProfile)
router.patch("/updateprofilepicture", protect, updateStudentProfile)