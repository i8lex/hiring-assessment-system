import { Switch } from "@headlessui/react";
import clsx from "clsx";
import type { FC } from "react";

export type ToggleSwitchProps = {
  label: string;
  name?: string;
  isChecked: boolean;
  placeholder?: string;
  isRequired?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  popUpText: string;
  popUpClassName?: string;
  toggleSwitch: () => void;
};

export const ToggleSwitch: FC<ToggleSwitchProps> = ({
  label,
  className,
  labelClassName = "",
  popUpText,
  isChecked,
  toggleSwitch,
  popUpClassName,
}) => {
  return (
    <div className={clsx(className, "flex flex-col w-full gap-3")}>
      <div className="flex flex-row items-end w-full justify-between tablet:w-[247px]">
        <div className="flex items-start gap-2">
          <div
            className={clsx(
              labelClassName,
              "text-parS text-dark-100 flex flex-row ",
            )}
          >
            {label}
          </div>
        </div>

        <div className="flex items-end">
          <Switch
            checked={isChecked}
            onChange={toggleSwitch}
            className={clsx(
              isChecked ? "bg-orange-100" : "bg-[#E1E8EB]",
              "relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-[4px] border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
            )}
          >
            <span
              aria-hidden="true"
              className={`${
                isChecked ? "translate-x-[17px]" : "-translate-x-[3px]"
              }
            -translate-y-[2px]  pointer-events-none h-[20px] w-[20px] transform rounded-full ml-px bg-white shadow-lg ring-0 transition duration-300 ease-in-out`}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};
