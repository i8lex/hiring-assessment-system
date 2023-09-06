import { forwardRef } from "react";
import clsx from "clsx";

import { InputValidationMessage } from "./tooltips/InputValidationMessage";

import type { FC } from "react";

export type InputProps = {
  label?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  isRequired: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorText?: string;
  onFocus?: () => void;
};

export const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      isRequired,
      label,
      id = "title",
      name = "title",
      placeholder = "",
      className,
      inputClassName = "",
      labelClassName = "",
      errorText,
      onFocus,
      ...restInputProps
    },
    ref,
  ) => {
    return (
      <div
        className={clsx(
          "relative flex tablet:flex-row flex-col gap-2 tablet:gap-0 tablet:justify-between tablet:items-center w-full p-0",
          className,
        )}
      >
        {label ? (
          <label
            htmlFor={id}
            className={clsx(
              labelClassName,
              "text-parS font-medium text-darkSkyBlue-100",
            )}
          >
            {label}
            {isRequired ? "*" : ""}
          </label>
        ) : null}
        <input
          type="text"
          id={id}
          required={isRequired}
          placeholder={placeholder}
          name={name}
          className={clsx(
            inputClassName,
            "h-[38px] w-full rounded-md text-parS placeholder:text-parS placeholder:font-normal focus:border-green-80 focus:ring-green-80 focus:ring-1 focus:outline-none  px-3 autofill:text-pars box-border",
            errorText
              ? "border-error-80 text-error-100"
              : "border-stroke text-darkSkyBlue-100",
          )}
          onFocus={onFocus}
          {...restInputProps}
          ref={ref}
        />
        {errorText ? (
          <div className="absolute -bottom-0.5 right-0 flex justify-end w-[150px]">
            <InputValidationMessage
              markerPosition="top-right"
              className=""
              text={errorText}
            />
          </div>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
