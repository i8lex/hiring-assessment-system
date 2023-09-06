export type RootState = {
  auth: {
    isAuthenticated: boolean;
    token: string;
  };
};

export type Test = {
  _id: string;
  title: string;
  description: string;
  createdBy: string;
  timerEnabled: boolean;
  timer: number;
  questions: {
    question: string;
    file?: Blob;
    answers: { answer: string; isCorrect: boolean }[];
  }[];
};
