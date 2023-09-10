import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ReactComponent as X } from "../../../assets/IconsSet/x-close.svg";

import { useGetUsersQuery } from "../../../redux/users/usersApi";

import type { FC } from "react";
import UserCard from "./UserCard";
import { User } from "../../../types";

export type SendTestModalProps = {
  testId?: string;
  isModalOpen: boolean;
  toggleModal: (flag: boolean) => void;
};

export const SendTestModal: FC<SendTestModalProps> = ({
  isModalOpen,
  toggleModal,
  testId,
}) => {
  const { data: users } = useGetUsersQuery();
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
            <div className="fixed inset-0 flex max-h-screen  items-start justify-center overflow-y-auto tablet:items-center tablet:p-4">
              <Dialog.Panel className="h-full tablet:h-[600px] w-screen overflow-hidden overflow-y-auto bg-white text-parL font-medium text-darkSkyBlue-100 tablet:m-auto tablet:w-[642px] tablet:rounded-3xl">
                <div className="flex items-center justify-between border-y border-y-stroke bg-[#F9FAFB] px-4 py-3.5 tablet:border-t-0 tablet:px-6 tablet:py-4">
                  <Dialog.Title>
                    <div className="flex items-center gap-1">
                      <div>Send test</div>
                    </div>
                  </Dialog.Title>
                  <button
                    className="-mr-2.5 h-8 w-8 rounded-full text-darkSkyBlue-80 outline-none hover:text-darkSkyBlue-100"
                    onClick={() => {
                      toggleModal(false);
                    }}
                  >
                    <X className="h-6 w-6 text-dark-40" />
                  </button>
                </div>
                <div className="p-2 tablet:p-3 flex flex-col gap-2 mb-6">
                  {users?.map((user: User) => (
                    <UserCard key={user._id} user={user} testId={testId!} />
                  ))}
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};
