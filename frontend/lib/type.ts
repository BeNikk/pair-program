export interface Question {
  title: string;
  description: string;
  difficulty: string;
  exampleInputFirst: string;
  exampleOutputFirst: string;
  exampleInputSecond: string;
  exampleOutputSecond: string;
  constraints: string[];
}