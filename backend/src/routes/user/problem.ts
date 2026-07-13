import { Router } from "express";
import uservalidation from "../../middlewares/userValidation";
import { getProblemById, getProblems } from "../../controllers/getProblemsUser";
import submitProblem from "../../controllers/submitProblem";
import getStatus from "../../controllers/getStatus";
import streamStatus from "../../controllers/streamStatus";

const router = Router();

//api/user/

router.get("/allProblems", uservalidation, getProblems);
router.get("/problem/:problemId", uservalidation, getProblemById)

router.get("/status/:submissionId", uservalidation, getStatus)
router.get("/status/:submissionId/stream", uservalidation, streamStatus)
router.post("/submit/:problemId", uservalidation ,submitProblem);

export default router;

// 5fc3cf98-a850-45c4-b8a4-deb415aa1d55
