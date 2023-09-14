import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as X } from "../../assets/IconsSet/x-close.svg";
import { useDeleteTestMutation } from "../../redux/tests/testsApi";
import { useSelector } from "react-redux";
import { RootState } from "../../types";
import { DeleteConfirmModal } from "../modal/DeleteConfirmModal";

type TestCardProps = {
  id?: string;
  title: string;
  description: string;
  numberOfQuestions?: number;
};

export const TestCard: FC<TestCardProps> = ({
  title,
  numberOfQuestions,
  id,
  description,
}) => {
  const answers = useSelector((state: RootState) => state.auth.answers);
  const isCompleted = answers.map((answer) => answer.testId).includes(id!);
  const role = useSelector((state: RootState) => state.auth.role);
  const [deleteTest] = useDeleteTestMutation();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const handleDeleteTest = () => {
    deleteTest(id);
  };
  return (
    <div className="relative p-4 flex items-center tablet:p-6 border border-stroke rounded-xl shadow-md shadow-gray-60 hover:scale-[1.02] transition-all">
      <Link
        to={`/test/${id}`}
        className=" flex flex-col w-full gap-4 tablet:gap-0 tablet:flex-row justify-between items-center"
      >
        <div className="flex flex-col items-center tablet:items-start gap-1 tablet:w-2/3 w-full">
          <h6 className="text-dispS3 text-dark-100">{title}</h6>
          <p className="text-parM text-dark-80 ">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-2 items-center justify-center">
            {isCompleted ? (
              <div className="text-center text-parL tablet:text-dispS2 text-orange-80 font-medium py-2 px-4  border-2 border-orange-100 rounded">
                Completed
              </div>
            ) : null}
            <p className="text-parL text-dark-80">Number of questions</p>
            <p className="text-dispS1 text-dark-100">{numberOfQuestions}</p>
          </div>
        </div>
      </Link>
      {role === "admin" ? (
        <div
          onClick={() => {
            setIsConfirmModalOpen(true);
          }}
          className="absolute top-2 right-2 ml-3 self-start tablet:self-center h-6 w-6 cursor-pointer p-0 text-dark-40 tablet:block"
        >
          <X className="h-6 w-6 text-dark-40" />
        </div>
      ) : null}
      <DeleteConfirmModal
        Action={handleDeleteTest}
        showDeleteConfirmModal={isConfirmModalOpen}
        setShowDeleteConfirmModal={setIsConfirmModalOpen}
        titleText={"Delete test"}
        messageText={"Are certain about delete this test?"}
        buttonText={"Delete"}
      />
    </div>
  );
};
