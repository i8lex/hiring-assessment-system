import React, { Fragment, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Listbox, Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Input } from "../../../Input";
import { AnswerCard } from "./AnswerCard";
import { ReactComponent as DotsIcon } from "../../../../assets/IconsSet/dots-vertical.svg";
import { ReactComponent as MoveIcon } from "../../../../assets/IconsSet/move.svg";
import { ReactComponent as X } from "../../../../assets/IconsSet/x-close.svg";
import { handleDnDUtil } from "../../../../utils/handleDnDUtil";
import type { Test } from "../../../../types";
import type { FC } from "react";
import { AudioPlayer } from "../../../AudioPlayer";
import { ReactComponent as ChevronUp } from "../../../../assets/IconsSet/dropdown-up.svg";
import { ReactComponent as ChevronDown } from "../../../../assets/IconsSet/dropdown.svg";
type QuestionCardProps = {
  isSuccess: boolean;
  index: number;
  removeQuestion: (value: number) => void;
};

export const QuestionCard: FC<QuestionCardProps> = ({
  isSuccess,
  index,
  removeQuestion,
}) => {
  const {
    register,
    getValues,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useFormContext<Test>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${index}.answers`,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCanMove, setIsCanMove] = useState(false);
  const [filePath, setFilePath] = useState({ path: "", mimeType: "" });
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "questions",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index],
  );
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: "questions",
      drop: ({ index: draggedIndex }: { index: number }) => {
        if (draggedIndex !== index) {
          const updatedQuestions = handleDnDUtil(
            draggedIndex,
            index,
            getValues(`questions`),
          ) as Test["questions"];
          setValue(`questions`, updatedQuestions);
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
  useEffect(() => {
    if (isSuccess) {
      setFilePath({
        path: getValues(`questions.${index}.fileData.file`),
        mimeType: getValues(`questions.${index}.fileData.mimeType`),
      });
    }
  }, [getValues, getValues(`questions.${index}.answerType`), index, isSuccess]);

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      const file = e.target.files[0];
      reader.addEventListener("load", () => {
        setValue(`questions.${index}.fileData`, {
          file: reader.result?.toString() || "",
          mimeType: file.type,
        });
        setFilePath({
          path: reader.result?.toString() || "",
          mimeType: file.type,
        });
      });
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteFile = () => {
    setFilePath({ path: "", mimeType: "" });
    setValue(`questions.${index}.file`, "");
    setValue(`questions.${index}.fileData.file`, "");
    setValue(`questions.${index}.fileData.mimeType`, "");
  };
  useEffect(() => {
    if (getValues(`questions.${index}.answerType`) === "Simple") {
      getValues(`questions.${index}.answers`).map((_, index) => {
        if (index !== 0) {
          return remove(index);
        }
        return;
      });
    }
  }, [getValues, index, remove]);
  return (
    <>
      <div
        className={clsx(
          "mb-2 flex w-full flex-col items-end px-4 tablet:mb-4 tablet:px-6",
          isDragging ? "opacity-0.5" : "opacity-1",
          isOver && canDrop ? "rounded-md bg-mystic-40" : "bg-transparent",
          isCanMove ? "cursor-move" : "",
        )}
        ref={drop}
      >
        <div
          className="mb-4 flex w-full items-center justify-center pt-2 desktop:mb-3"
          ref={drag}
        >
          <div className="flex w-full items-center justify-between gap-2 rounded-md">
            <div className="flex items-center gap-2">
              {getValues(`questions`).length > 1 ? (
                <div className="hidden h-5 w-5 tablet:block">
                  <MoveIcon
                    className={clsx(
                      "h-5 w-5 cursor-move text-dark-40",
                      isDragging ? "text-green-80" : "",
                      isOver && canDrop
                        ? "rounded-md bg-gray-40"
                        : "bg-transparent",
                    )}
                  />
                </div>
              ) : null}

              <div className="hidden items-center gap-2 tablet:flex">
                <p className="text-parS text-dark-100">Question</p>
              </div>
            </div>

            <Input
              isRequired={true}
              id={`question.${index}.question`}
              placeholder={"Question"}
              className="tablet:w-fit"
              inputClassName={clsx(
                "w-full min-w-[125px]",
                getValues(`questions`).length > 1
                  ? "tablet:w-[353px]"
                  : "tablet:w-[389px]",
                isCanMove || isDragging
                  ? "border-green-80 ring-green-80 outline-none cursor-move"
                  : "",
              )}
              onFocus={() => {
                setIsCanMove(false);
              }}
              errorText={
                errors.questions && errors.questions[index]?.question?.message
              }
              {...register(`questions.${index}.question`, {
                required: "Question is required",
              })}
            />
          </div>

          {getValues(`questions`).length > 1 ? (
            <div
              onClick={() => {
                removeQuestion(index);
              }}
              className="ml-3 hidden h-6 w-6 cursor-pointer p-0 text-dark-40 tablet:block"
            >
              <X className="h-6 w-6 text-dark-40" />
            </div>
          ) : null}
          {getValues(`questions`).length > 1 ? (
            !isCanMove ? (
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
                      {getValues(`questions`).length > 1 ? (
                        <div className="border-b border-b-[#E7EDEF]">
                          <Menu.Item>
                            <div
                              onClick={() => {
                                setIsCanMove(!isCanMove);
                              }}
                              className="flex cursor-pointer items-center gap-3 py-2 px-4 text-parS font-normal text-dark-80 hover:bg-gray-20 "
                            >
                              <MoveIcon className="h-[14px] w-[14px] text-stroke " />
                              <p className="text-quot font-medium">Move</p>
                            </div>
                          </Menu.Item>
                        </div>
                      ) : null}
                      <div className="border-b border-b-[#E7EDEF]">
                        <Menu.Item>
                          <div
                            onClick={() => {
                              removeQuestion(index);
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
            ) : (
              <div className="ml-2 block h-6 w-6 tablet:hidden">
                <MoveIcon
                  className={clsx(
                    " h-6 w-6 cursor-move text-dark-40",
                    isDragging ? "text-green-80" : "",
                  )}
                />
              </div>
            )
          ) : null}
        </div>
        <div className="relative">
          {filePath.path ? (
            filePath.mimeType.startsWith("image/") ? (
              <>
                <img
                  alt="Question file"
                  src={filePath.path}
                  className="w-full tablet:w-[389px] rounded-xl"
                />
                <button
                  onClick={handleDeleteFile}
                  className="absolute top-4 right-4 hover:border hover:border-white rounded-full p-1"
                >
                  <X className="h-5 w-5 text-white fill-white" />
                </button>
              </>
            ) : (
              <div className=" flex items-center gap-2 mb-2">
                <AudioPlayer
                  isInModal={true}
                  index={index.toString()}
                  audioPath={watch(`questions.${index}.fileData.file`)}
                />
                <button onClick={handleDeleteFile} className=" p-1">
                  <X className="h-5 w-5 text-white fill-white" />
                </button>
              </div>
            )
          ) : (
            <>
              <label
                className="relative mb-[5px] flex h-[38px] w-[389px] transform cursor-pointer flex-col items-center justify-center gap-[8px] rounded-md border  border-stroke py-[8px] px-[17px] text-parS font-medium  text-orange-100   outline-none  ring-green-90 ring-offset-2 focus-visible:ring-2 active:translate-y-[1px] disabled:pointer-events-none disabled:bg-dark-10 disabled:text-dark-60 disabled:active:translate-y-0 tablet:mb-2  [&>svg]:h-5 [&>svg]:w-5 [&>svg]:flex-shrink-0"
                htmlFor="fileInput"
              >
                <p>Upload file</p>
              </label>
              <input
                type="file"
                id="fileInput"
                accept={"image/*, audio/*"}
                className="fileInput"
                hidden
                multiple={false}
                onChange={onSelectFile}
              />
            </>
          )}
        </div>
        <div className="flex items-center justify-between w-full">
          <p className=" text-parS text-dark-100 tablet:mb-3">
            Choose answer type
          </p>
          <Controller
            name={`questions.${index}.answerType`}
            control={control}
            render={({ field }) => {
              return (
                <Listbox
                  {...field}
                  value="Single"
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  {({ open }) => (
                    <>
                      <div className="relative right-0 justify-self-end my-2 desktop:-mt-0.5">
                        <Listbox.Button
                          className={
                            "flex h-[40px] w-full justify-between rounded-md border border-stroke  align-middle font-medium tablet:h-[30px] tablet:w-[230px]"
                          }
                        >
                          <div className="flex justify-center py-[9px] px-[16px] text-parS text-[#374151]  tablet:py-[5px]  tablet:text-quot">
                            {getValues(`questions.${index}.answerType`)}
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
                            <Listbox.Option
                              className={({ active }) =>
                                clsx(
                                  active ? "bg-[#F3F4F6]" : "bg-white",
                                  "flex h-[38px] cursor-pointer flex-row px-4 py-2",
                                )
                              }
                              value="Single"
                            >
                              <span className="text-quot font-normal text-dark-80">
                                Single
                              </span>
                            </Listbox.Option>

                            <Listbox.Option
                              className={({ active }) =>
                                clsx(
                                  active ? "bg-[#F3F4F6]" : "bg-white",
                                  "flex h-[38px] cursor-pointer flex-row px-4 py-2",
                                )
                              }
                              value="Simple"
                            >
                              <span className="text-quot font-normal text-dark-80">
                                Simple
                              </span>
                            </Listbox.Option>
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              );
            }}
          />
        </div>

        <div className="flex w-full items-center justify-start">
          <div className="flex w-full flex-col p-0">
            {fields.map((answer, currentIndex) => {
              return (
                <AnswerCard
                  answerType={getValues(`questions.${index}.answerType`)}
                  key={answer.id}
                  removeAnswer={remove}
                  questionIndex={index}
                  index={currentIndex}
                />
              );
            })}
          </div>
        </div>
        <button
          type="button"
          disabled={watch(`questions.${index}.answerType`) === "Simple"}
          className={clsx(
            watch(`questions.${index}.answerType`) === "Simple"
              ? " bg-dark-20 text-dark-40"
              : "bg-orange-10 hover:bg-orange-20 text-orange-100",
            "text-parS  mt-2 mb-4 py-2 rounded-md  w-full   tablet:mt-3 tablet:mb-6 tablet:w-[389px] tablet:px-2",
          )}
          onClick={() => {
            append({ answer: "", isCorrect: false });
          }}
        >
          Add an answer
        </button>
        <div className="w-full border-t border-stroke" />
      </div>
    </>
  );
};
