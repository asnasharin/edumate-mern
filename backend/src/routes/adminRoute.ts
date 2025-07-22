import { Router } from "express"
import { getAdminProfile, updateProfilePicture } from "../controller/adminProfileController"
import { protect } from "../middleware/authMiddleware"


const router: Router = Router()

router.get("/adminprofile", protect, getAdminProfile)
router.patch("/updateprofilepicture", protect, updateProfilePicture)

export default router