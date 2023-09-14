import clsx from "clsx";

import type { FC, ReactNode } from "react";
import { Header } from "../Header";

export type GeneralLayoutProps = {
  children: ReactNode;
  className?: string;
};

export const GeneralLayout: FC<GeneralLayoutProps> = ({
  children,
  className,
}) => {
  return (
    <>
      <div className="mx-auto sticky top-0 z-50 w-full p-0 ">
        <Header />
        <div className="border-b border-stroke" />
      </div>

      <div
        className={clsx(
          className,
          "mx-auto my-6  max-w-[1920px] p-4 tablet:p-6 ",
        )}
      >
        {children}
      </div>
    </>
  );
};
