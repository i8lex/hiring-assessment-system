export type RootState = {
  auth: {
    role: string;
    isAuthenticated: boolean;
    token: string;
    userId: string;
    answers: Answer[];
  };
};

export type Test = {
  _id?: string;
  title: string;
  description: string;
  createdBy: string;
  timerEnabled: boolean;
  timer: number;
  answeredUsers: string[];
  questions: {
    _id?: string;
    question: string;
    file: string;
    fileData: { _id?: string; file: string; mimeType: string };
    answerType: string;
    answers: { answer: string; isCorrect: boolean }[];
  }[];
};

export type Answer = {
  testId: string;
  remainingTime: string;
  testState: {
    question: string;
    answer: string;
    isCorrect: boolean;
    userAnswer: string;
  }[];
};
export type User = {
  _id: string;
  firstname: string;
  lastname: string;
  age: number;
  email: string;
  password: string;
  role: string;
  answers: Answer[];
  tests: string[];
};
