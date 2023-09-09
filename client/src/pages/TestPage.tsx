import React, { useEffect, useState } from "react";
import {
  useGetTestQuery,
  useSendAnswersMutation,
} from "../redux/tests/testsApi";
import { useNavigate, useParams } from "react-router-dom";
import { QuestionCard } from "../components/tests/QuestionCard";
import { useSelector } from "react-redux";
import { RootState, Test } from "../types";
import { Timer } from "../components/tests/Timer";
import { SendTestModal } from "../components/tests/modal/SendTestModal";
import clsx from "clsx";
import { addAnswer } from "../redux/auth/authSlice";
import { CreateTestModal } from "../components/tests/modal/CreateTestModal";
import { FormProvider, useForm } from "react-hook-form";
const TestPage = () => {
  const methods = useForm<Test>({
    defaultValues: {
      title: "",
      description: "",
      timerEnabled: false,
      timer: 0,
      questions: [
        {
          question: "",
          file: "",
          fileData: {
            file: "",
            mimeType: "",
          },
          answers: [
            { answer: "", isCorrect: true },
            { answer: "", isCorrect: false },
          ],
        },
      ],
    },
  });
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) {
    navigate("/tests");
  }
  const getTest = useGetTestQuery(id!);
  const { data: test, isSuccess, refetch } = getTest;
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestEnded, setIsTestEnded] = useState(false);
  const role = useSelector((state: RootState) => state.auth.role);
  const [minutes, setMinutes] = useState(test?.timer);
  const [seconds, setSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const allAnswers = useSelector((state: RootState) => state.auth.answers);
  const [sendAnswer] = useSendAnswersMutation();
  const [answers, setAnswers] = useState({
    testId: id!,
    remainingTime: "",
    testState: Array.from({ length: test?.questions.length! }, (_) => ({
      question: "",
      answer: "",
      isCorrect: false,
    })),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isCompleted = test?.answeredUsers.includes(userId);
  useEffect(() => {
    if (isSuccess) {
      setMinutes(test?.timer);
      const currentAnswer = allAnswers.find(
        (answer) => answer.testId === test?._id,
      );
      if (currentAnswer) {
        setAnswers(currentAnswer);
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (minutes && isTestStarted) {
      const interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleStartTest(false);
            clearInterval(interval);
            return;
          }
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isTestStarted, minutes, seconds]);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleStartTest = (flag: boolean) => {
    setIsTestStarted(flag);
    if (flag) {
      const intervalId = setInterval(() => {
        setRemainingSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  };

  const handleSendTest = async () => {
    answers.remainingTime = `${
      remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes
    }:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
    await sendAnswer({ body: answers });
    await addAnswer(answers.testId);
    await refetch();
  };
  const totalScore = answers.testState.reduce((accumulator, answer) => {
    if (answer.isCorrect) {
      return accumulator + 1;
    }
    return accumulator;
  }, 0);
  return (
    <>
      <div className=" flex flex-col gap-4">
        {role === "admin" ? (
          <button
            className="self-end text-dark-100 font-semibold h-12 bg-orange-40 rounded border border-dark-90 shadow-sm shadow-dark-60 py-2 w-[130px]"
            onClick={() => {
              setIsEditModalOpen(true);
            }}
          >
            {"Edit test"}
          </button>
        ) : null}

        <div className="text-dark-100 text-dispS2">{test?.title}</div>
        <div className="text-dark-80 text-parM">{test?.description}</div>
        <div className="flex flex-col gap-2 tablet:gap-0 tablet:flex-row justify-between items-center p-4 tablet:p-6 border border-stroke rounded-md">
          {role === "user" ? (
            <button
              disabled={isTestEnded || isCompleted}
              className={clsx(
                " border border-stroke rounded-md font-medium text-white py-2 w-[150px]",
                isTestEnded || isCompleted
                  ? "pointer-none bg-gray-100"
                  : "pointer-events-auto bg-orange-60 hover:bg-orange-80",
              )}
              onClick={async () => {
                handleStartTest(!isTestStarted);
                if (isTestStarted) {
                  setIsTestEnded(true);
                  await handleSendTest();
                }
              }}
            >
              {isTestStarted ? "Stop and send" : "Start test"}
            </button>
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <button
                className="text-dark-100 font-semibold h-12 bg-orange-40 rounded border border-dark-90 shadow-sm shadow-dark-60 py-2 w-[130px]"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                {" Scores or Sent"}
              </button>
            </div>
          )}
          <div className="w-[150px]">
            <Timer
              text={isTestStarted ? "Remaining time" : "Times left "}
              minutes={minutes}
              seconds={seconds}
            />
          </div>

          <div className="flex flex-col gap-0 tablet:gap-2 items-center justify-center w-[180px]">
            <p className="tablet:text-parL text-parS text-dark-80">
              Number of questions
            </p>
            <p className="tablet:text-dispS1 text-parL text-dark-100 ">
              {test?.questions.length}
            </p>
          </div>
        </div>
        {isTestEnded || isCompleted ? (
          <div className="flex items-center justify-between gap-8 w-full">
            <div className="flex flex-col gap-2 w-full tablet:gap-0 tablet:flex-row justify-between items-center p-4 tablet:p-6 border border-stroke rounded-md">
              <div className="w-[150px]">
                <Timer
                  text={"Your time:"}
                  minutes={+answers.remainingTime.split(":")[0]}
                  seconds={+answers.remainingTime.split(":")[1]}
                />
              </div>

              <div className="flex flex-col gap-0 tablet:gap-2 items-center justify-center w-[150px]">
                <p className="tablet:text-dispS2 text-parS text-dark-80">
                  Your score:
                </p>
                <p className="tablet:text-dispS1 text-parL text-dark-100 font-semibold">
                  {totalScore}
                </p>
              </div>
              <div className="w-[180px] text-center text-parL tablet:text-dispS2 text-orange-80 font-medium py-2 px-4 border border-orange-100 rounded">
                Completed
              </div>
            </div>
          </div>
        ) : null}
        {role === "admin" || isTestStarted ? (
          <div className="flex flex-col gap-6">
            {test?.questions.map((question, index) => {
              return (
                <QuestionCard
                  isSuccess={isSuccess}
                  role={role}
                  setAnswers={setAnswers}
                  answers={answers}
                  key={question._id}
                  question={question}
                  index={index}
                />
              );
            })}
          </div>
        ) : null}
        <FormProvider {...methods}>
          <CreateTestModal
            refetch={refetch}
            isModalOpen={isEditModalOpen}
            toggleModal={setIsEditModalOpen}
            test={test}
          />
        </FormProvider>
        <SendTestModal
          isModalOpen={isModalOpen}
          toggleModal={setIsModalOpen}
          testId={id}
        />
      </div>
    </>
  );
};

export default TestPage;
