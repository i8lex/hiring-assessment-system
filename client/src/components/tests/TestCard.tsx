import { FC } from "react";
import { Link } from "react-router-dom";

type TestCardProps = {
  id: string;
  title: string;
  description: string;
  numberOfQuestions: number;
  // test: {
  //   id: string;
  //   title: string;
  //   description: string;
  //   createdBy: string;
  //   questions: {
  //     question: string;
  //     file?: Blob;
  //     answers: { answer: string; isCorrect: boolean }[];
  //   };
  // };
};

export const TestCard: FC<TestCardProps> = ({
  title,
  numberOfQuestions,
  id,
  description,
}) => {
  return (
    <Link
      to={`/test/${id}`}
      className="p-4 tablet:p-6 border border-stroke rounded-xl shadow-md shadow-gray-60 hover:scale-[1.02] transition-all"
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h6 className="text-dispS3 text-dark-100">{title}</h6>
          <p className="text-parM text-dark-80">{description}</p>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <p className="text-parL text-dark-80">Number of questions</p>
          <p className="text-dispS1 text-dark-100">{numberOfQuestions}</p>
        </div>
      </div>
    </Link>
  );
};
