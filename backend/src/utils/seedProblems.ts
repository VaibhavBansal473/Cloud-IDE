import { db } from "../db";

const defaultProblems = [
  {
    name: "Sum of Two Numbers",
    level: "Easy",
    visible: true,
    adminId: "seed-admin",
    problemStatement: "Write a program that reads two integers and prints their sum.",
    testCases: "2 3\n5\n4 6\n10",
    expectedOutput: "5\n10",
    input: "2\n3",
  },
  {
    name: "Find the Maximum",
    level: "Easy",
    visible: true,
    adminId: "seed-admin",
    problemStatement: "Given two integers, print the larger one.",
    testCases: "4 7\n7\n10 3\n10",
    expectedOutput: "7\n10",
    input: "4\n7",
  },
  {
    name: "Reverse a String",
    level: "Medium",
    visible: true,
    adminId: "seed-admin",
    problemStatement: "Write a program that prints the reverse of the given string.",
    testCases: "hello\nolleh\nabc\ncba",
    expectedOutput: "olleh\ncba",
    input: "hello",
  },
];

export const seedDefaultProblems = async () => {
  try {
    const existingCount = await db.problem.count();

    if (existingCount > 0) {
      return;
    }

    await db.problem.createMany({
      data: defaultProblems,
    });

    console.log("Seeded default problems for users.");
  } catch (error) {
    console.error("Failed to seed default problems:", error);
  }
};
