import React from "react";
import { useFormContext } from "react-hook-form";
import { TestCard } from "./Test/Test";
import type { Test } from "../../../types";
import { Input } from "../../Input";

export const CreateTestMarkup = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<Test>();
  return (
    <div className="w-full tablet:h-[483px] h-full tablet:overflow-y-scroll tablet:scrollbar tablet:scrollbar-thumb-mystic-60 tablet:scrollbar-thumb-rounded-lg tablet:scrollbar-w-[3px] tablet:scrollbar-h-4 p-0 ">
      <div className="px-4 tablet:px-6">
        <Input
          isRequired={true}
          label="Test title"
          id="title"
          placeholder="Enter the title"
          inputClassName="tablet:w-[389px]"
          className="mb-4 tablet:mb-8 tablet:h-[40px]"
          errorText={errors?.title?.message?.toString()}
          {...register("title", {
            required: "Title is required",
          })}
        />
        <Input
          isRequired={true}
          label="Test description"
          id="description"
          placeholder="Enter the description"
          inputClassName="tablet:w-[389px]"
          className="mb-4 tablet:mb-8 tablet:h-[40px]"
          errorText={errors?.description?.message?.toString()}
          {...register("description", {
            required: "Description is required",
          })}
        />
      </div>

      <TestCard />
    </div>
  );
};
