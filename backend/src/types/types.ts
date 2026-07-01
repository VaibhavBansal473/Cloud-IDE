export type user = {
  id: string;
};

export type Problem = {
  id: string;
  name: string;
  level: string;
  tags: string[];
  problemStatement: string;
  sampleInput: string;
  sampleOutput: string;
};