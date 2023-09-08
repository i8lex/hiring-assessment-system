import React, { FC } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as X } from "../../assets/IconsSet/x-close.svg";
import { useDeleteTestMutation } from "../../redux/tests/testsApi";

type TestCardProps = {
  id: string;
  title: string;
  description: string;
  numberOfQuestions: number;
};

export const TestCard: FC<TestCardProps> = ({
  title,
  numberOfQuestions,
  id,
  description,
}) => {
  const [deleteTest] = useDeleteTestMutation();
  return (
    <Link
      to={`/test/${id}`}
      className="p-4 tablet:p-6 border border-stroke rounded-xl shadow-md shadow-gray-60 hover:scale-[1.02] transition-all"
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1 tablet:w-2/3 w-1/2">
          <h6 className="text-dispS3 text-dark-100">{title}</h6>
          <p className="text-parM text-dark-80 ">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-2 items-center justify-center">
            <p className="text-parL text-dark-80">Number of questions</p>
            <p className="text-dispS1 text-dark-100">{numberOfQuestions}</p>
          </div>
          <div
            onClick={() => {
              deleteTest(id);
            }}
            className="ml-3 hidden h-6 w-6 cursor-pointer p-0 text-dark-40 tablet:block"
          >
            <X className="h-6 w-6 text-dark-40" />
          </div>
        </div>
      </div>
    </Link>
  );
};
