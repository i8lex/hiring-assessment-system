import { User } from "../../../types";
import React, { FC, useState } from "react";
import { useSendTestMutation } from "../../../redux/tests/testsApi";
import {
  useResetAnswersMutation,
  useGetUsersQuery,
  useLazyGetUsersQuery,
} from "../../../redux/users/usersApi";

import { Timer } from "../Timer";
import { handleTestsResult } from "../../../utils/handleTestsResult";

type UserCardProps = {
  testId: string;
  user: User;
};
const UserCard: FC<UserCardProps> = ({ user, testId }) => {
  const [sendTest] = useSendTestMutation();
  const [resetAnswers] = useResetAnswersMutation();
  const { refetch } = useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [trigger] = useLazyGetUsersQuery();
  const answers = user.answers.find((answer) => answer.testId === testId);
  const isHaveTest = user.tests.find((test) => test === testId);
  const totalScore = answers ? handleTestsResult(answers) : 0;
  const [isSentSuccess, setIsSentSuccess] = useState(false);
  const handleSendTest = async () => {
    const result = await sendTest({ id: user._id, body: { testId } });

    if ("error" in result) {
      console.error(result.error);
    } else {
      refetch();
      setIsSentSuccess(true);
    }
  };

  const handleResetAnswers = async () => {
    const result = await resetAnswers({ userId: user._id, testId });
    if ("error" in result) {
      console.error(result.error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 border border-stroke rounded p-2 tablet:p-3 shadow-sm shadow-dark-60">
        <div className="flex items-center justify-between  ">
          <div className="flex flex-col gap-1">
            <p className="text-parS text-dark-80">{user.email}</p>
            <p className="text-dispS3 text-dark-100">
              {user.firstname} {user.lastname}
            </p>
            <p className="text-parL text-dark-80">{user.age} years old</p>
          </div>
          {answers ? (
            <div className="hidden tablet:flex flex-col gap-2 items-center">
              <div className="flex items-center gap-4">
                <div className=" flex flex-col gap-1 items-center justify-center">
                  <Timer
                    text={"Time:"}
                    minutes={+answers.remainingTime.split(":")[0]}
                    seconds={+answers.remainingTime.split(":")[1]}
                  />
                </div>
                <div className=" tablet:flex flex-col gap-1 items-center justify-center">
                  <p className=" text-parL text-dark-80">Score:</p>
                  <p className="text-center text-dispS2 text-dark-100 font-semibold h-[40px] w-[100px] bg-orange-40 rounded border border-dark-90 shadow-sm shadow-dark-60">
                    {totalScore}
                  </p>
                </div>
              </div>
              <button
                type={"button"}
                className="text-center w-full hover:bg-orange-10 tablet:text-parS text-quot text-orange-80 font-medium py-1 px-2  border-2 border-orange-100 rounded"
                onClick={async () => {
                  trigger(undefined, false);
                  await handleResetAnswers();
                }}
              >
                Reset answers
              </button>
            </div>
          ) : null}
          {answers ? (
            <div className="flex flex-col items-end gap-1">
              <div className="text-center text-parL tablet:text-dispS2 text-orange-80 font-medium py-2 px-4  border-2 border-orange-100 rounded">
                Completed
              </div>
            </div>
          ) : !isSentSuccess ? (
            !isHaveTest ? (
              <button
                className="text-parS  px-6 py-2 text-dark-100 font-semibold h-[40px] w-[100px] bg-orange-40 rounded border border-dark-90 shadow-sm shadow-dark-60"
                type="button"
                onClick={handleSendTest}
              >
                Send
              </button>
            ) : (
              <div className="text-center text-parL tablet:text-dispS2 text-yellow-80 font-medium py-2 px-4  border-2 border-yellow-100 rounded">
                Wait for result
              </div>
            )
          ) : (
            <div className="text-parL font-medium text-green-100">
              Sent successfully
            </div>
          )}
        </div>
        {answers ? (
          <div className="flex flex-col items-center w-full gap-2 tablet:hidden">
            <div className="flex  items-end justify-between w-full">
              <div className=" flex flex-col gap-1 items-center justify-center">
                <Timer
                  text={"Time:"}
                  minutes={+answers.remainingTime.split(":")[0]}
                  seconds={+answers.remainingTime.split(":")[1]}
                />
              </div>
              <div className=" tablet:flex flex-col gap-2 items-center justify-center">
                <p className=" text-quot text-dark-80 text-center">Score:</p>
                <p className="text-center text-dispS2 text-dark-100 font-semibold h-[40px] w-[100px] bg-orange-40 rounded border border-dark-90 shadow-sm shadow-dark-60">
                  {totalScore}
                </p>
              </div>
            </div>
            <button
              type={"button"}
              className="text-center w-full hover:bg-orange-10 tablet:text-parS text-quot text-orange-80 font-medium py-1 px-2  border-2 border-orange-100 rounded"
              onClick={async () => {
                trigger(undefined, false);
                await handleResetAnswers();
              }}
            >
              Reset answers
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};
export default UserCard;
