import React, { Fragment, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Controller, useFormContext } from "react-hook-form";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Input } from "../../../Input";
import { ReactComponent as DotsIcon } from "../../../../assets/IconsSet/dots-vertical.svg";
import { ReactComponent as MoveIcon } from "../../../../assets/IconsSet/move.svg";
import { ReactComponent as X } from "../../../../assets/IconsSet/x-close.svg";
import { handleDnDUtil } from "../../../../utils/handleDnDUtil";
import type { Test } from "../../../../types";
import type { FC } from "react";

type TestCardProps = {
  answerType: string;
  questionIndex: number;
  index: number;
  removeAnswer: (value: number) => void;
};
export const AnswerCard: FC<TestCardProps> = ({
  answerType = `Single`,
  questionIndex,
  index,
  removeAnswer,
}) => {
  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<Test>();
  const [isCanMove, setIsCanMove] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "answer",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index],
  );
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: "answer",
      drop: ({ index: draggedIndex }: { index: number }) => {
        if (draggedIndex !== index) {
          const updatedAnswers = handleDnDUtil(
            draggedIndex,
            index,
            getValues(`questions.${questionIndex}.answers`),
          ) as Test["questions"][number]["answers"];
          setValue(`questions.${questionIndex}.answers`, updatedAnswers);

          setIsCanMove(false);
        }
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      }),
    }),
    [handleDnDUtil, index],
  );

  return (
    <div
      className={clsx(
        "w-full p-0",
        isDragging ? "opacity-0.5 text-green-100" : "opacity-1",
        isOver && canDrop ? "rounded-md bg-mystic-40" : "bg-transparent",
        isCanMove ? "cursor-move" : "",
      )}
      ref={drop}
    >
      <div
        className="flex w-full items-center justify-center py-1 tablet:py-2"
        ref={drag}
      >
        <div className="flex w-full items-center gap-2 rounded-md">
          <div className="hidden h-5 w-5 tablet:block">
            <MoveIcon
              className={clsx(
                "hidden h-5 w-5 cursor-move text-stroke tablet:block",
                isDragging ? "text-green-80" : "",
              )}
            />
          </div>

          <div className="flex flex-col justify-center">
            <Controller
              name={`questions.${questionIndex}.answers.${index}.isCorrect`}
              disabled={
                getValues(`questions.${questionIndex}.answerType`) === "Simple"
              }
              control={control}
              render={({ field }) => {
                return (
                  // @ts-ignore
                  <input
                    type="checkbox"
                    {...field}
                    checked={field.value}
                    onChange={() => {
                      field.onChange(!field.value);
                      if (
                        answerType === "Single" &&
                        getValues(
                          `questions.${questionIndex}.answers.${index}.isCorrect`,
                        )
                      ) {
                        getValues(`questions.${questionIndex}.answers`).map(
                          (_, currentIndex) => {
                            if (currentIndex !== index) {
                              setValue(
                                `questions.${questionIndex}.answers.${currentIndex}.isCorrect`,
                                false,
                              );
                            }
                          },
                        );
                      }
                    }}
                    className="cursor-pointer rounded border-stroke text-orange-100 shadow-sm focus:border-green-100 focus:ring focus:ring-orange-100 focus:ring-opacity-50 focus:ring-offset-0"
                  />
                );
              }}
            />
          </div>
          <div className="relative w-full">
            <Input
              isRequired={true}
              id={`questions.${questionIndex}.answers.${index}.text`}
              placeholder={
                getValues(
                  `questions.${questionIndex}.answers.${index}.isCorrect`,
                )
                  ? "Correct answer"
                  : "Answer"
              }
              className="w-full tablet:w-full"
              inputClassName={clsx(
                "w-full min-w-[125px]",
                isCanMove || isDragging
                  ? "border-green-80 ring-green-80 outline-none cursor-move"
                  : "",
              )}
              onFocus={() => {
                setIsCanMove(false);
              }}
              errorText={
                errors?.questions?.[questionIndex]?.answers?.[index]?.answer
                  ?.message
              }
              {...register(
                `questions.${questionIndex}.answers.${index}.answer`,
                {
                  required: "Answer is required",
                },
              )}
            />
          </div>
        </div>
        {getValues(`questions.${questionIndex}.answers`).length > 2 ? (
          <div
            onClick={() => {
              removeAnswer(index);
            }}
            className="ml-3 hidden h-6 w-6 cursor-pointer p-0 text-dark-40 tablet:block"
          >
            <X className="h-6 w-6 text-dark-40" />
          </div>
        ) : null}
        {getValues(`questions.${questionIndex}.answers`).length > 1 ? (
          isCanMove ? (
            <div className="ml-2 block h-6 w-6 tablet:hidden">
              <MoveIcon
                className={clsx(
                  " h-6 w-6 cursor-move text-dark-40",
                  isDragging ? "text-green-80" : "",
                )}
              />
            </div>
          ) : (
            <Menu>
              <div className="relative ml-2 tablet:hidden ">
                <Menu.Button
                  onClick={toggleMenu}
                  className={
                    "flex h-[38px] cursor-pointer items-center justify-between rounded-md  text-parS font-normal text-dark-80 hover:bg-gray-20"
                  }
                >
                  <DotsIcon className="h-6 w-6 text-stroke" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute top-9 right-0 z-30 w-[164px] origin-top-right rounded-md border border-dark-10 bg-white shadow-lg">
                    {getValues(`questions.${questionIndex}.answers`).length >
                    1 ? (
                      <div className="border-b border-b-[#E7EDEF]">
                        <Menu.Item>
                          <div
                            onClick={() => {
                              setIsCanMove(!isCanMove);
                            }}
                            className="flex cursor-pointer items-center gap-3 py-2 px-4 text-parS font-normal text-dark-80 hover:bg-gray-20 "
                          >
                            <MoveIcon className="h-[14px] w-[14px] text-dark-80 " />
                            <p className="text-quot font-medium">Move</p>
                          </div>
                        </Menu.Item>
                      </div>
                    ) : null}
                    <div className="border-b border-b-[#E7EDEF]">
                      <Menu.Item>
                        <div
                          onClick={() => {
                            removeAnswer(index);
                          }}
                          className="flex cursor-pointer items-center gap-3 py-2 px-4 text-parS font-normal text-dark-80 hover:bg-gray-20 "
                        >
                          <X className="h-[14px] w-[14px] text-dark-80" />
                          <p className="text-quot font-medium">Delete</p>
                        </div>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </div>
            </Menu>
          )
        ) : null}
      </div>
    </div>
  );
};
