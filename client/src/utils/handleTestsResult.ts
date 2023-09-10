import { Answer } from "../types";

export const handleTestsResult = (answers: Answer) => {
  const result = answers.testState.reduce((accumulator: number, answer) => {
    const userAnswer = answer.userAnswer || "";
    if (answer.isCorrect) {
      return accumulator + 1;
    } else if (
      userAnswer &&
      userAnswer.toLowerCase() === answer.answer.toLowerCase()
    ) {
      return accumulator + 2;
    } else {
      return accumulator;
    }
  }, 0);
  return result;
};
