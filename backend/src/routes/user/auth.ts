import { Router } from "express";
import {userSignupController ,userSignupVerifyController } from "../../controllers/userSignup"
import { userSigninController, userSigninVerifyController  } from "../../controllers/userSigin";
import uservalidation from "../../middlewares/userValidation";
import userLogoutController from "../../controllers/userLogout";
const router = Router();

router.post("/signup" , userSignupController);
router.post("/signup/verify", userSignupVerifyController);
router.post("/signin", userSigninController);
router.post("/signin/verify", userSigninVerifyController);
router.post("/logout",  userLogoutController);


export default router;