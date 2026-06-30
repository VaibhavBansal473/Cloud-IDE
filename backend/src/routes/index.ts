import { Router } from "express";
import authRouter from './user/auth'   
import authAdminRouter from "./admin/auth"
import addAdmin from "../controllers/addAdmin";
import superAdminValidation from "../middlewares/superAdminValidation";
import SAdminSignin from "../controllers/SAdminSignin";
import userProblemRouter from './user/problem'
import adminProblemRouter from './admin/problem'
import submissionCallback from "../controllers/submission-callback";

const router = Router ();

router.use("/user/auth", authRouter);
router.use("/admin/auth" , authAdminRouter);
router.use("/user", userProblemRouter)
router.use("/admin", adminProblemRouter)
router.post("/superAdmin/addAdmin",superAdminValidation,addAdmin);
router.post("/superAdmin/signin",SAdminSignin);

router.put("/submission_callback", submissionCallback)

export default router;