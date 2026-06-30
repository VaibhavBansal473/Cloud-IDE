import { Request, Response } from "express";
import { submitProblemZodSchema } from "../zod/problemsSchema";
import axios from "axios";
import { db } from "../db";
import { CALLBACK_URL, SUBMISSION_URL } from "../utils/envVars";


const submitProblem = async (req: Request, res: Response) => {
    try {
        const data = submitProblemZodSchema.safeParse(req.body);
        if (!data.success) {
            res.status(400).json({ message: "invalid inputs" });
            return;
        }
        const { sourceCode, languageId } = data.data;
        const problemId = Array.isArray(req.params.problemId) ? req.params.problemId[0] : req.params.problemId;
        if (!req.User) {
            res.status(400).json({ message: "Not logged in" });
            return
        }
        const userId = req.User.id

        const api_key = process.env.RAPID_API_KEY;


        const problem = await db.problem.findUnique({
            where: {
                id: problemId
            }
        })

        if (!problem || !problem.visible) {
            res.status(400).json({ message: "Not a valid problem" })
            return;
        }


        const options = {
            method: 'POST',
            url: SUBMISSION_URL,
            params: {
                base64_encoded: 'false',
                wait: 'false',
                fields: '*'
            },
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                language_id: languageId,
                source_code :sourceCode,
                stdin: problem.input,
                expected_output : problem.expectedOutput,
                callback_url : CALLBACK_URL

                // source_code: Buffer.from(sourceCode).toString('base64'),
                // stdin: Buffer.from(problem.input).toString('base64'),
                // expected_output : Buffer.from(problem.expectedOutput).toString('base64'),
                // callback_url : Buffer.from(CALLBACK_URL).toString('base64')
            }
        };

        console.log(options);
        const response : any = await axios.request(options);

        const token: string = response.data.token;

        const submission = await db.submission.create({
            data: {
                state: "pending",
                judge0TrackingId: token,
                problemId,
                userId
            }
        });

        res.status(200).json({
            submissionId: submission.id
        })
    } catch (error: any) {
        console.log("error in the submit problem controller", error?.response?.data || error?.message || error);
        res.status(502).json({ 
            message: "Code execution service rejected the request",
            details: error?.response?.data || error?.message || "Unknown error"
        });
    }
}

export default submitProblem
