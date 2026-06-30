import { Router } from "express";
import { adminSigninController } from "../../controllers/adminSigninController";

const router = Router();

router.post("/signin", adminSigninController);

export default router;