import { type FC, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { ReactComponent as DeleteIcon } from "../../assets/IconsSet/exclamation.svg";

type DeleteConfirmModalProps = {
  showDeleteConfirmModal: boolean | undefined;
  setShowDeleteConfirmModal: (arg0: boolean) => void;
  Action: () => void;
  titleText: string;
  messageText: string;
  buttonText: string;
};

export const DeleteConfirmModal: FC<DeleteConfirmModalProps> = ({
  showDeleteConfirmModal,
  setShowDeleteConfirmModal,
  Action,
  titleText,
  messageText,
  buttonText,
}) => {
  return (
    <>
      <Transition show={showDeleteConfirmModal} as={Fragment}>
        <Dialog
          open={showDeleteConfirmModal}
          onClose={() => setShowDeleteConfirmModal(false)}
          className="relative z-[60] bg-green-100"
        >
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
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
              className="fixed inset-0 bg-[#6B7280BF] bg-opacity-75"
              aria-hidden="true"
            />
          </Transition.Child>

          {/* Full-screen container to center the panel */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 flex items-center justify-center">
              {/* The actual dialog panel  */}
              <Dialog.Panel className="mx-auto h-screen tablet:h-fit flex items-center w-full gap-4 rounded-lg bg-white p-6 tablet:max-w-[512px] ">
                <div className=" h-12 w-12 text-error-100">
                  <DeleteIcon />
                </div>

                <div className="flex w-full flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Dialog.Title className="text-parL font-medium text-darkSkyBlue-100">
                      {titleText}
                    </Dialog.Title>
                    <p className=" text-parS font-normal text-darkSkyBlue-80">
                      {messageText}
                    </p>
                  </div>

                  <div className="flex w-full justify-end gap-2 tablet:gap-4">
                    <button
                      type="button"
                      className="font-medium text-dark-100 py-2 px-4 bg-white hover:border-gray-80 border border-gray-60 rounded-md w-full tablet:w-[150px]"
                      onClick={() => setShowDeleteConfirmModal(false)}
                    >
                      {"Cancel"}
                    </button>
                    <button
                      type="button"
                      className="font-medium text-errorText py-2 px-4 bg-white border border-error-40 hover:border-error-100 rounded-md w-full tablet:w-[150px]"
                      onClick={Action}
                    >
                      {buttonText}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};
