import React, { Fragment, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { ReactComponent as X } from "../../../assets/IconsSet/x-close.svg";
import { CreateTestMarkup } from "./CreateTestMarkup";
import {
  useAddTestMutation,
  usePathTestMutation,
} from "../../../redux/tests/testsApi";
import type { Test } from "../../../types";
import type { FC } from "react";

export type CreateTestModalProps = {
  refetch?: () => void;
  test?: Test;
  isModalOpen: boolean;
  toggleModal: (flag: boolean) => void;
};

export const CreateTestModal: FC<CreateTestModalProps> = ({
  refetch,
  isModalOpen,
  toggleModal,
  test,
}) => {
  const [addTest] = useAddTestMutation();
  const [pathTest] = usePathTestMutation();

  const handleError = (errors: object) => {
    console.warn(errors);
  };
  const { handleSubmit, reset, setValue } = useFormContext<Test>();

  const handleCreate = async (values: Test) => {
    try {
      if (!test) {
        await addTest(values);
      }
      if (test && refetch) {
        await pathTest({ id: test._id, body: values });
        await refetch();
      }
      await reset();
      toggleModal(false);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (test) {
      setValue("title", test.title);
      setValue("description", test.description);
      setValue("timerEnabled", test.timerEnabled);
      setValue("timer", test.timer);
      setValue("questions", test.questions);
    }
  }, [test, isModalOpen, setValue]);
  return (
    <>
      <Transition show={isModalOpen} as={Fragment}>
        <Dialog
          open={isModalOpen}
          onClose={() => {
            reset();
            toggleModal(false);
          }}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 tablet:bg-[#6B7280BF] tablet:bg-opacity-75"
              aria-hidden="true"
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 flex max-h-screen items-start justify-center overflow-y-auto pt-[44px] tablet:items-center tablet:p-4">
              <Dialog.Panel className="h-full w-screen overflow-hidden overflow-y-auto bg-white text-parL font-medium text-darkSkyBlue-100 tablet:m-auto tablet:h-auto tablet:w-[642px] tablet:rounded-3xl">
                <div className="flex items-center justify-between border-y border-y-stroke bg-[#F9FAFB] px-4 py-3.5 tablet:border-t-0 tablet:px-6 tablet:py-4">
                  <Dialog.Title>
                    <div className="flex items-center gap-1">
                      <div>{test ? "Edit test" : "Create new test"}</div>
                    </div>
                  </Dialog.Title>
                  <button
                    className="-mr-2.5 h-8 w-8 rounded-full text-darkSkyBlue-80 outline-none hover:text-darkSkyBlue-100 "
                    onClick={() => {
                      toggleModal(false);
                      reset();
                    }}
                  >
                    <X className="h-6 w-6 text-dark-40" />
                  </button>
                </div>

                <form
                  encType="multipart/form-data"
                  onSubmit={handleSubmit(handleCreate, handleError)}
                  noValidate
                  method="post"
                  className="relative h-full w-full pt-5 tablet:pt-6"
                >
                  <CreateTestMarkup />

                  <div className="fixed flex w-full justify-between gap-4 border-t border-stroke bg-white p-4 tablet:relative tablet:flex tablet:justify-end tablet:px-6 tablet:py-5">
                    <button
                      className="text-parS w-full tablet:w-fit px-4 py-2 bg-white border border-stroke rounded-xl hover:bg-gray-10 hover:text-dark-100"
                      onClick={() => {
                        reset();
                        toggleModal(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="text-parS w-full tablet:w-fit px-4 py-2 bg-orange-80 border border-stroke rounded-xl hover:bg-orange-100 text-white"
                      type="submit"
                    >
                      {test ? "Save" : "Add"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};
