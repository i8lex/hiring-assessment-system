import React, { FC } from "react";

type TimerProps = {
  text: string;
  seconds: number;
  minutes?: number;
};
export const Timer: FC<TimerProps> = ({ text, minutes = 0, seconds }) => {
  return (
    <div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-quot text-dark-80 tablet:text-parL">{text}</p>
        <div className="relative h-[40px] w-[100px] bg-orange-40 rounded border border-dark-90 shadow-sm shadow-dark-60">
          <p
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  text-dark-40 "
            style={{ fontFamily: "DS-Digital, sans-serif", fontSize: "32px" }}
          >
            00:00
          </p>
          <p
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-dark-100 "
            style={{ fontFamily: "DS-Digital, sans-serif", fontSize: "32px" }}
          >
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </p>
        </div>
      </div>
    </div>
  );
};
