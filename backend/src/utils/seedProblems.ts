import { db } from "../db";
import { Prisma, Difficulty } from "@prisma/client";

const defaultProblems: Prisma.ProblemCreateInput[] = [
    {
        name: "Sum of Two Numbers",

        level: Difficulty.EASY,

        tags: ["Math", "Implementation"],

        visible: true,

        adminId: "seed-admin",

        problemStatement: `Given two integers A and B, print their sum.

Input
The input consists of two integers A and B.

Output
Print the sum of A and B.`,

        sampleInput: `2 3`,

        sampleOutput: `5`,

        testCases: {
            create: [
                {
                    input: "2 3",
                    output: "5",
                    hidden: false
                },
                {
                    input: "10 20",
                    output: "30"
                },
                {
                    input: "-5 15",
                    output: "10"
                },
                {
                    input: "100000 99999",
                    output: "199999"
                },
                {
                    input: "0 0",
                    output: "0"
                }
            ]
        }
    },

    {
        name: "Maximum of Three Numbers",

        level: Difficulty.EASY,

        tags: ["Math", "Implementation"],

        visible: true,

        adminId: "seed-admin",

        problemStatement: `Given three integers, print the largest among them.

Input
Three space separated integers.

Output
Print the maximum value.`,

        sampleInput: `5 8 3`,

        sampleOutput: `8`,

        testCases: {
            create: [
                {
                    input: "5 8 3",
                    output: "8",
                    hidden: false
                },
                {
                    input: "1 2 3",
                    output: "3"
                },
                {
                    input: "9 4 7",
                    output: "9"
                },
                {
                    input: "-5 -2 -9",
                    output: "-2"
                },
                {
                    input: "100 100 50",
                    output: "100"
                }
            ]
        }
    },

    {
        name: "Reverse a String",

        level: Difficulty.EASY ,

        tags: ["Strings"],

        visible: true,

        adminId: "seed-admin",

        problemStatement: `Given a string S, print the reverse of the string.

Input
A single string.

Output
Print the reversed string.`,

        sampleInput: `hello`,

        sampleOutput: `olleh`,

        testCases: {
            create: [
                {
                    input: "hello",
                    output: "olleh",
                    hidden: false
                },
                {
                    input: "OpenAI",
                    output: "IAnepO"
                },
                {
                    input: "abc",
                    output: "cba"
                },
                {
                    input: "racecar",
                    output: "racecar"
                },
                {
                    input: "Competitive",
                    output: "evititepmoC"
                }
            ]
        }
    },

    {
        name: "Prime Number Check",

        level: Difficulty.EASY,

        tags: ["Math", "Number Theory"],

        visible: true,

        adminId: "seed-admin",

        problemStatement: `Given an integer N, determine whether it is a prime number.

Output "Prime" if the number is prime, otherwise output "Not Prime".

Input
A single integer N.

Output
Print "Prime" or "Not Prime".`,

        sampleInput: `17`,

        sampleOutput: `Prime`,

        testCases: {
            create: [
                {
                    input: "17",
                    output: "Prime",
                    hidden: false
                },
                {
                    input: "2",
                    output: "Prime"
                },
                {
                    input: "15",
                    output: "Not Prime"
                },
                {
                    input: "97",
                    output: "Prime"
                },
                {
                    input: "100",
                    output: "Not Prime"
                }
            ]
        }
    },
    {
        name: "Count Vowels",

        level: Difficulty.EASY,

        tags: ["Strings"],

        visible: true,

        adminId: "seed-admin",

        problemStatement: `Given a string S, count the number of vowels (a, e, i, o, u) present in it. Both uppercase and lowercase vowels should be counted.

Input
A single string S.

Output
Print the total number of vowels.`,

        sampleInput: `OpenAI`,

        sampleOutput: `4`,

        testCases: {
            create: [
                {
                    input: "OpenAI",
                    output: "4",
                    hidden: false
                },
                {
                    input: "hello",
                    output: "2"
                },
                {
                    input: "xyz",
                    output: "0"
                },
                {
                    input: "AEIOU",
                    output: "5"
                },
                {
                    input: "CompetitiveProgramming",
                    output: "8"
                }
            ]
        }
    },

    {
        name: "Binary Search",

        level: Difficulty.MEDIUM,

        tags: ["Binary Search", "Arrays"],

        visible: true,

        adminId: "seed-admin",

        problemStatement: `Given a sorted array of N integers and a target X, print the 0-based index of X if it exists. Otherwise print -1.

Input
First line contains N.
Second line contains N sorted integers.
Third line contains X.

Output
Print the index of X or -1 if not found.`,

        sampleInput: `5
1 3 5 7 9
7`,

        sampleOutput: `3`,

        testCases: {
            create: [
                {
                    input: `5
1 3 5 7 9
7`,
                    output: "3",
                    hidden: false
                },
                {
                    input: `6
2 4 6 8 10 12
10`,
                    output: "4"
                },
                {
                    input: `4
1 2 3 4
5`,
                    output: "-1"
                },
                {
                    input: `1
100
100`,
                    output: "0"
                },
                {
                    input: `8
2 5 8 11 14 17 20 23
20`,
                    output: "6"
                }
            ]
        }
    },

    {
        name: "Character Frequency",

        level: Difficulty.MEDIUM,

        tags: ["Hash Map", "Strings"],

        visible: true,

        adminId: "seed-admin",

        problemStatement: `Given a lowercase string S and a character C, print the number of occurrences of C in S.

Input
First line contains string S.
Second line contains character C.

Output
Print the frequency of C.`,

        sampleInput: `banana
a`,

        sampleOutput: `3`,

        testCases: {
            create: [
                {
                    input: `banana
a`,
                    output: "3",
                    hidden: false
                },
                {
                    input: `mississippi
s`,
                    output: "4"
                },
                {
                    input: `apple
z`,
                    output: "0"
                },
                {
                    input: `aaaaaa
a`,
                    output: "6"
                },
                {
                    input: `competitive
t`,
                    output: "2"
                }
            ]
        }
    },
    {
        name: "Valid Parentheses",

        level: Difficulty.MEDIUM,

        tags: ["Stack", "Strings"],

        visible: true,

        adminId: "seed-admin",

        problemStatement: `Given a string consisting only of the characters '(', ')', '{', '}', '[' and ']', determine whether the parentheses are balanced.

A string is balanced if every opening bracket has a corresponding closing bracket in the correct order.

Input
A single string S.

Output
Print "YES" if the parentheses are balanced, otherwise print "NO".`,

        sampleInput: `{[()]}`,

        sampleOutput: `YES`,

        testCases: {
            create: [
                {
                    input: "{[()]}",
                    output: "YES",
                    hidden: false
                },
                {
                    input: "{[(])}",
                    output: "NO"
                },
                {
                    input: "()[]{}",
                    output: "YES"
                },
                {
                    input: "(((",
                    output: "NO"
                },
                {
                    input: "[({})]",
                    output: "YES"
                }
            ]
        }
    },

    {
        name: "Merge Two Sorted Arrays",

        level: Difficulty.MEDIUM,

        tags: ["Arrays", "Two Pointers"],

        visible: true,

        adminId: "seed-admin",

        problemStatement: `Given two sorted arrays, merge them into a single sorted array.

Input
First line contains N.
Second line contains N sorted integers.
Third line contains M.
Fourth line contains M sorted integers.

Output
Print the merged sorted array.`,

        sampleInput: `3
1 3 5
3
2 4 6`,

        sampleOutput: `1 2 3 4 5 6`,

        testCases: {
            create: [
                {
                    input: `3
1 3 5
3
2 4 6`,
                    output: "1 2 3 4 5 6",
                    hidden: false
                },
                {
                    input: `2
1 10
3
2 3 4`,
                    output: "1 2 3 4 10"
                },
                {
                    input: `1
5
1
6`,
                    output: "5 6"
                },
                {
                    input: `3
2 4 6
3
1 3 5`,
                    output: "1 2 3 4 5 6"
                },
                {
                    input: `2
100 200
2
300 400`,
                    output: "100 200 300 400"
                }
            ]
        }
    },

    {
        name: "Shortest Path in a Grid",

        level: Difficulty.HARD,

        tags: ["Graph", "BFS"],

        visible: true,

        adminId: "seed-admin",

        problemStatement: `You are given an N × M grid consisting of 0s and 1s.

0 represents an empty cell and 1 represents an obstacle.

Starting from the top-left cell (0,0), find the minimum number of moves required to reach the bottom-right cell.

You can move Up, Down, Left and Right.

If it is impossible to reach the destination, print -1.

Input
First line contains N and M.
Next N lines contain the grid.

Output
Print the minimum number of moves.`,

        sampleInput: `3 3
0 0 0
1 1 0
0 0 0`,

        sampleOutput: `4`,

        testCases: {
            create: [
                {
                    input: `3 3
0 0 0
1 1 0
0 0 0`,
                    output: "4",
                    hidden: false
                },
                {
                    input: `2 2
0 1
1 0`,
                    output: "-1"
                },
                {
                    input: `1 1
0`,
                    output: "0"
                },
                {
                    input: `3 4
0 0 1 0
0 0 0 0
1 1 0 0`,
                    output: "5"
                },
                {
                    input: `4 4
0 0 0 0
1 1 1 0
0 0 0 0
0 1 1 0`,
                    output: "6"
                }
            ]
        }
    },
];

export const seedDefaultProblems = async () => {
    try {
        const existingCount = await db.problem.count();

        if (existingCount > 0) {
            return;
        }

        for (const problem of defaultProblems) {
            await db.problem.create({
                data: problem,
            });
        }

        console.log("Seeded default problems for users.");
    } catch (error) {
        console.error("Failed to seed default problems:", error);
    }
};
