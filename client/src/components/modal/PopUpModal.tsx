import { type FC, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { ReactComponent as InfoIcon } from "../../assets/IconsSet/information-circle.svg";
import { ReactComponent as AlertIcon } from "../../assets/IconsSet/exclamation.svg";
import clsx from "clsx";
type PopUpModalProps = {
  type: "error" | "success";
  showPopUpModal: boolean;
  setShowPopUpModal: (arg0: boolean) => void;
  titleText: string;
  messageText?: string;
  buttonText: string;
  buttonAction?: (type: "error" | "success") => void;
};

export const PopUpModal: FC<PopUpModalProps> = ({
  showPopUpModal,
  setShowPopUpModal,
  titleText,
  messageText,
  buttonText,
  type,
  buttonAction,
}) => {
  return (
    <>
      <Transition show={showPopUpModal} as={Fragment}>
        <Dialog
          open={showPopUpModal}
          onClose={() => setShowPopUpModal(false)}
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
            <div className="fixed inset-0 flex tablet:items-center items-end justify-center py-6 px-4">
              {/* The actual dialog panel  */}
              <Dialog.Panel className="max-w-[288px] tablet:max-w-[384px] tablet:p-6 py-5 px-4 w-full mx-auto rounded-lg bg-white flex justify-center flex-col">
                {type === "success" ? (
                  <div className="flex mx-auto flex-col items-center justify-center rounded-full bg-green-10 h-12 w-12 mb-5 text-green-100">
                    <InfoIcon />
                  </div>
                ) : (
                  <div className="flex mx-auto flex-col items-center justify-center rounded-full bg-error-20 h-12 w-12 mb-5 text-errorText">
                    <AlertIcon />
                  </div>
                )}

                <div className=" text-center">
                  <Dialog.Title
                    className={clsx(
                      type === "success" ? "text-green-100" : "text-errorText",
                      "mb-2 text-parL font-medium ",
                    )}
                  >
                    {titleText}
                  </Dialog.Title>
                  <p
                    className={clsx(
                      type === "success" ? "text-green-60" : "text-error-100 ",
                      "text-parS  mb-5 tablet:mb-6",
                    )}
                  >
                    {messageText}
                  </p>
                  <div className="w-full flex items-center justify-center tablet:gap-4">
                    <button
                      type="button"
                      className={clsx(
                        type === "success"
                          ? "text-green-100 border-green-80 hover:border-green-100"
                          : "text-errorText border-error-80 hover:border-error-100",
                        "font-medium  py-2 px-4 bg-white border  rounded-md w-full",
                      )}
                      onClick={() => {
                        buttonAction && buttonAction(type);
                        setShowPopUpModal(false);
                      }}
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
