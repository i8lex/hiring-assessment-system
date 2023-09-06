import { useGetTestsQuery } from "../redux/tests/testsApi";
import { useSelector } from "react-redux";
import { RootState, Test } from "../types";
import { useNavigate } from "react-router-dom";
import { TestCard } from "../components/tests/TestCard";
import { useState } from "react";
import { CreateTestModal } from "../components/tests/modal/CreateTestModal";
import { FormProvider, useForm } from "react-hook-form";

type TestsResponse = {
  data: Test[];
};
const TestsPage = () => {
  const { data: tests = [] as TestsResponse | never[], isLoading } =
    useGetTestsQuery({});
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = (flag: boolean) => {
    setIsModalOpen(flag);
  };
  const methods = useForm<Test>({
    defaultValues: {
      title: "",
      description: "",
      timerEnabled: false,
      timer: 0,
      questions: [
        {
          question: "",
          answers: [
            { answer: "", isCorrect: true },
            { answer: "", isCorrect: false },
          ],
        },
      ],
    },
  });
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  console.log(tests);
  return (
    <>
      <div className="flex flex-col gap-4 tablet:gap-6   ">
        <button
          onClick={() => {
            toggleModal(true);
          }}
        >
          Add test
        </button>
        {tests.map((test: Test) => (
          <TestCard
            key={test._id}
            id={test._id}
            title={test.title}
            description={test.description}
            numberOfQuestions={test.questions.length}
          />
        ))}
      </div>
      <FormProvider {...methods}>
        <CreateTestModal isModalOpen={isModalOpen} toggleModal={toggleModal} />
      </FormProvider>
    </>
  );
};
export default TestsPage;
