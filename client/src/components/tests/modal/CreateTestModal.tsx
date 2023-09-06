import { Fragment, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Dialog, Menu, Transition } from "@headlessui/react";

import { CreateTestMarkup } from "./CreateTestMarkup";
// import { ReactComponent as DropdownIcon } from "../../../assets/IconsSet/dropdown.svg";
// import DropDownUpIcon from "../../../assets/IconsSet/dropdown-up.svg";
// import X from "../../../assets/IconsSet/x-close.svg";
import type { Test } from "../../../types";
import type { FC } from "react";

export type CreateTestModalProps = {
  testId?: string;
  isModalOpen: boolean;
  toggleModal: (flag: boolean) => void;
};

export const CreateTestModal: FC<CreateTestModalProps> = ({
  isModalOpen,
  toggleModal,
  testId,
}) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const toggleMenu = () => {
    setIsOpenMenu(!isOpenMenu);
  };
  const [chooseFromMenu, setChooseFromMenu] = useState("Choose a template");

  const handleError = (errors: object) => {
    console.warn(errors);
  };
  const {
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useFormContext<Test>();

  const handleCreate = async (data: Test) => {
    try {
      console.log(data);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <>
      <Transition show={isModalOpen} as={Fragment}>
        <Dialog
          open={isModalOpen}
          onClose={() => {
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
                      <div>{testId ? "Edit test" : "Create new test"}</div>
                    </div>
                  </Dialog.Title>
                  <button
                    className="-mr-2.5 h-8 w-8 rounded-full text-darkSkyBlue-80 outline-none hover:text-darkSkyBlue-100 focus:ring-2 focus:ring-green-80"
                    onClick={() => {
                      toggleModal(false);
                      // setExerciseTypeId(0);
                      // reset();
                      // setFiles && setFiles([]);
                      // toggleExerciseId(0);
                      // cleanExercise();
                    }}
                  >
                    <img
                      src="../../../assets/IconsSet/x-close.svg"
                      alt="X"
                      className="mx-auto h-5 w-5"
                    />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit(handleCreate, handleError)}
                  noValidate
                  method="post"
                  className="relative h-full w-full pt-5 tablet:pt-6"
                >
                  <CreateTestMarkup />

                  <div className="fixed flex w-full justify-between gap-4 border-t border-stroke bg-white p-4 tablet:relative tablet:flex tablet:justify-end tablet:px-6 tablet:py-5">
                    <button
                      className="w-full tablet:w-fit px-4 py-2 bg-white border border-stroke rounded-xl hover:bg-gray-10 hover:text-dark-100"
                      onClick={() => {
                        toggleModal(false);

                        setChooseFromMenu("Choose a template");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="w-full tablet:w-fit px-4 py-2 bg-green-80 border border-stroke rounded-xl hover:bg-green-100 text-white"
                      // text={exerciseId ? 'Save' : 'Add'}
                      type="submit"
                    >
                      Add
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
