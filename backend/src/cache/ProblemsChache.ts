import { Problem } from "../types/types";

export let cachedProblems: Problem[] = [];

export const setCacheProblems = (problems: Problem[]) =>{
    cachedProblems = problems;
}