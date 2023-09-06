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
      <div className="sticky top-0 z-50 w-full p-0">
        <Header />
        <div className="border-b border-stroke" />
      </div>

      <div className={clsx(className, "m-6 ")}>{children}</div>
    </>
  );
};
