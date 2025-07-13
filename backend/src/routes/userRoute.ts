import { Router } from "express";

import { userSignup } from "../controller/userController";


const router: Router = Router();

router.post("/signup", userSignup)

export default router;