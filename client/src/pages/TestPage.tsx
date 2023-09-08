import React, { useState } from "react";
import { useGetTestQuery } from "../redux/tests/testsApi";
import { useNavigate, useParams } from "react-router-dom";
import { QuestionCard } from "../components/tests/QuestionCard";
const TestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) {
    navigate("/tests");
  }
  // @ts-ignore
  const getTest = useGetTestQuery(id);
  const { data: test } = getTest;

  console.log(getTest);
  return (
    <>
      <div className=" flex flex-col gap-4">
        <div className="text-dark-100 text-dispS2">{test?.title}</div>
        <div className="text-dark-80 text-parM">{test?.description}</div>
        <div className="flex flex-col gap-6">
          {test?.questions.map((question, index) => {
            return (
              <QuestionCard
                key={question._id}
                question={question}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TestPage;
