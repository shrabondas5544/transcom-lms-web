export type QuestionType = "MCQ" | "TrueFalse" | "FillInBlanks" | "ShortAnswer";

export interface IAnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface IQuestion {
  id: string;
  title: string;
  mediaUrl: string | null;
  type: QuestionType;
  options: IAnswerOption[]; // Used for MCQ
  correctAnswer: string; // Used for True/False ("true" or "false"), FillInBlanks, and ShortAnswer
  points: number;
}

export interface IScopeTarget {
  device: string;
  brand: string;
  models: string[]; // Selected models as multi-select chips/checkboxes
}

export interface IQuizPool {
  shufflingLogic: "ServeAll" | "ServeSubset";
  subsetSize: number; // If 'ServeSubset', how many questions to serve
}

export interface IAssessment {
  id?: string;
  title: string;
  deadline: string; // ISO DateTime string or Date representation
  hasTimeLimit: boolean;
  timeLimitMinutes: number;
  timeLimitSeconds: number;
  scope: IScopeTarget;
  questions: IQuestion[];
  pool: IQuizPool;
  createdAt?: string;
}

// Authentication related interfaces
export interface IUserSession {
  token: string;
  userId: string;
  email: string;
  role: "employee" | "assessor" | "admin";
  name: string;
}
