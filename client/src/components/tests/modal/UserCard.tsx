import { User } from "../../../types";
import React, { FC, useState } from "react";
import { useSendTestMutation } from "../../../redux/tests/testsApi";

type UserCardProps = {
  testId: string;
  user: User;
};
const UserCard: FC<UserCardProps> = ({ user, testId }) => {
  const [sendTest] = useSendTestMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSendTest = async () => {
    const result = await sendTest({ id: user._id, body: { testId } });

    if ("error" in result) {
      console.error(result.error);
    } else {
      setIsSuccess(true);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between border border-stroke rounded p-2 tablet:p-3 shadow-sm shadow-dark-60 ">
        <div className="flex flex-col gap-1">
          <p className="text-parS text-dark-80">{user.email}</p>
          <p className="text-dispS3 text-dark-100">
            {user.firstname} {user.lastname}
          </p>
          <p className="text-parL text-dark-80">{user.age} years old</p>
        </div>
        {!isSuccess ? (
          <button
            className="text-parS  px-6 py-2 bg-orange-80 border border-stroke rounded-xl hover:bg-orange-100 text-white"
            type="button"
            onClick={handleSendTest}
          >
            Send
          </button>
        ) : (
          <div className="text-parL font-medium text-green-100">
            Sent successfully
          </div>
        )}
      </div>
    </>
  );
};
export default UserCard;
