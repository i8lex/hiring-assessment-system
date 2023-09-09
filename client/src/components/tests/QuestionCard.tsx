import React, { FC, useEffect, useState } from "react";
import { ReactComponent as CheckBoxIcon } from "../../assets/IconsSet/checkbox.svg";
import { ReactComponent as CheckBoxFalse } from "../../assets/IconsSet/checkbox-false.svg";
import { useGetFileQuery } from "../../redux/files/filesApi";
import clsx from "clsx";
import { AudioPlayer } from "../AudioPlayer";
import { Answer } from "../../types";

type QuestionCardProps = {
  setAnswers: React.Dispatch<React.SetStateAction<Answer>>;
  role: string;
  answers: Answer;
  question: {
    question: string;
    file: string;
    answers: { answer: string; isCorrect: boolean }[];
  };
  isPreview?: boolean;
  index: number;
};
export const QuestionCard: FC<QuestionCardProps> = ({
  role,
  question,
  isPreview,
  index,
  answers,
  setAnswers,
}) => {
  const [checked, setChecked] = useState<boolean[]>(
    Array(question.answers.length).fill(false),
  );

  const { data: file, isSuccess } = useGetFileQuery(question.file);
  useEffect(() => {
    setAnswers((prevAnswers) => {
      const newAnswers = { ...prevAnswers };
      const newTestState = [...newAnswers.testState];
      newTestState[index] = {
        ...newTestState[index],
        question: question.question,
      };
      newAnswers.testState = newTestState;
      return newAnswers;
    });
  }, [isSuccess]);
  return (
    <div className="flex flex-col gap-4">
      <p className="text-parS font-medium text-dark-100">{`${index + 1}. ${
        question.question
      }`}</p>
      {isSuccess &&
        (file.mimetype.startsWith("image/") ? (
          <img
            className="w-[200px] h-[200px] object-cover rounded-2xl border border-stroke overflow-hidden"
            src={`data:${file?.mimetype};base64,${file?.buffer.toString()}`}
            // src={filePath.path}
            alt="question pictures"
          />
        ) : (
          <AudioPlayer
            audioPath={`data:${file?.mimetype};base64,${file?.buffer.toString()}`}
            // audioPath={filePath.path}
            index={`${file._id}${file._id}`}
          />
        ))}
      <div className="flex flex-col gap-2">
        {question.answers.map((answer, answerIndex) => {
          return (
            <div key={answerIndex} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  onClick={() => {
                    if (answers.testState[index].answer && role === "user") {
                      return null;
                    } else {
                      setAnswers((prevAnswers) => {
                        const newAnswers = { ...prevAnswers };
                        const newTestState = [...newAnswers.testState];
                        newTestState[index] = {
                          ...newTestState[index],
                          answer: answer.answer,
                          isCorrect: answer.isCorrect,
                        };
                        newAnswers.testState = newTestState;
                        return newAnswers;
                      });
                      setChecked((prev) => {
                        return prev.map((item, i) => {
                          return answerIndex === i;
                        });
                      });
                    }
                  }}
                  className={clsx(
                    isPreview ? "" : "cursor-pointer",
                    "flex h-4 w-4  items-center justify-center rounded border border-stroke p-0 text-orange-100 shadow-sm focus:border-orange-100 focus:ring focus:ring-orange-100 focus:ring-opacity-50 focus:ring-offset-0",
                  )}
                >
                  {checked[answerIndex] &&
                  checked[answerIndex] === answer.isCorrect ? (
                    <CheckBoxIcon className="h-4 w-4 p-0 text-white" />
                  ) : null}
                  {checked[answerIndex] &&
                  checked[answerIndex] !== answer.isCorrect ? (
                    <CheckBoxFalse className="h-4 w-4 p-0 text-white" />
                  ) : null}
                </div>

                <p className="text-parS font-medium text-dark-100">
                  {answer.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-stroke w-full" />
    </div>
  );
};
