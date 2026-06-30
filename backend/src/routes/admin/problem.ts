import { Router } from "express";
import adminValidation from "../../middlewares/adminValidation";
import { getProblemById, getProblems } from "../../controllers/getProblemsAdmin";
import updateProblem from "../../controllers/updateProblem";
import addProblem from "../../controllers/addProblem";
import deleteProblem from "../../controllers/deleteProblem";

const router = Router();
// "/admin"

router.get("/allProblems", adminValidation, getProblems);
router.get("/problem/:problemId", adminValidation, getProblemById);

router.post("/addProblem", adminValidation , addProblem);
router.patch("/problem/:problemId/update", adminValidation , updateProblem);
router.delete("/problem/:problemId/delete", adminValidation , deleteProblem)
export default router
