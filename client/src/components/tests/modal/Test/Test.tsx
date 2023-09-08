import React, { Fragment } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import { ReactComponent as ChevronUp } from "../../../../assets/IconsSet/dropdown-up.svg";
import { ReactComponent as ChevronDown } from "../../../../assets/IconsSet/dropdown.svg";
import { QuestionCard } from "./QuestionCard";
import type { Test } from "../../../../types";
import { ToggleSwitch } from "../ToggleSwitch";

export const TestCard = () => {
  const { getValues, setValue, control, watch } = useFormContext<Test>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <>
      <div className=" mb-2 flex flex-col px-4 tablet:mb-3 tablet:flex-row tablet:px-6 desktop:mb-3 h-[30px]">
        <Controller
          name={`timerEnabled`}
          control={control}
          render={({ field }) => {
            return (
              <ToggleSwitch
                label={"Timer"}
                className="mb-4 tablet:mb-0"
                isChecked={field.value}
                popUpClassName=" tablet:whitespace-nowrap max-w-[247px]"
                popUpText={
                  "The timer allows you to set the time limit to complete this test."
                }
                toggleSwitch={() => {
                  setValue("timerEnabled", !field.value);
                }}
              />
            );
          }}
        />

        {watch("timerEnabled") ? (
          <Controller
            name={`timer`}
            control={control}
            render={({ field }) => {
              return (
                <Listbox
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  {({ open }) => (
                    <>
                      <div className="relative right-0 justify-self-end  desktop:-mt-0.5">
                        <Listbox.Button
                          className={
                            "flex h-[40px] w-full justify-between rounded-md border border-stroke  align-middle font-medium tablet:h-[30px] tablet:w-[187px]"
                          }
                        >
                          <div className="flex justify-center py-[9px] px-[16px] text-parS text-[#374151]  tablet:py-[5px]  tablet:text-quot">
                            {`${getValues("timer")} min`}
                          </div>
                          {open ? (
                            <ChevronDown className="my-auto ml-2 mr-3.5 h-5 w-5 text-dark-40" />
                          ) : (
                            <ChevronUp className="my-auto ml-2 mr-3.5 h-5 w-5 text-dark-40" />
                          )}
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute  z-40 mt-0.5 max-h-[152px] w-full overflow-y-auto rounded-md border border-[#E9EBEE] bg-white scrollbar scrollbar-thumb-gray-60 scrollbar-thumb-rounded-lg scrollbar-w-[3px] tablet:w-[187px]">
                            {Array.from(
                              { length: 10 },
                              (_, index) => index + 1,
                            ).map((item) => {
                              return (
                                <Listbox.Option
                                  key={item}
                                  className={({ active }) =>
                                    clsx(
                                      active ? "bg-[#F3F4F6]" : "bg-white",
                                      "flex h-[38px] cursor-pointer flex-row px-4 py-2",
                                    )
                                  }
                                  value={item}
                                >
                                  <span className="text-quot font-normal text-dark-80">
                                    {`${item} min`}
                                  </span>
                                </Listbox.Option>
                              );
                            })}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              );
            }}
          />
        ) : null}
      </div>
      <div className="px-4 tablet:px-6">
        <p className="mb-4 text-parS text-dark-100 tablet:hidden">Question</p>
      </div>

      <DndProvider backend={HTML5Backend}>
        {fields.map((question, index: number) => {
          return (
            <QuestionCard
              key={question.id}
              removeQuestion={remove}
              index={index}
            />
          );
        })}
      </DndProvider>
      <div className="flex w-full flex-col items-end px-4  pt-2 pb-4 tablet:px-6 tablet:pb-6">
        <button
          type="button"
          className="w-full text-parS tablet:w-[389px] px-4 py-2 bg-orange-80 border border-stroke rounded-md hover:bg-orange-100 text-white"
          onClick={() => {
            append({
              question: "",
              file: "",
              answers: [
                { answer: "", isCorrect: false },
                { answer: "", isCorrect: true },
              ],
            });
          }}
        >
          Add a question
        </button>
      </div>
    </>
  );
};
