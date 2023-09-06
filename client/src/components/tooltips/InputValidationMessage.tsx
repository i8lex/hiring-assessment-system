import clsx from 'clsx';

import type { FC } from 'react';

export type InputValidationMessageProps = {
  className?: string;
  text: string;
  markerPosition: 'top-right' | 'top-left';
};

export const InputValidationMessage: FC<InputValidationMessageProps> = ({
  className,
  text,
  markerPosition,
}) => {
  return (
    <div className={clsx('absolute z-10 text-white', className)}>
      <div
        className={clsx(
          'h-0 w-0 border-l-[6px] border-b-[6px] border-r-[6px] border-l-transparent border-b-error-100 border-r-transparent',
          markerPosition === 'top-right' ? 'mr-5 ml-auto' : '',
          markerPosition === 'top-left' ? 'ml-1' : '',
        )}
      ></div>
      <div className="rounded-sm bg-error-100 py-1.5 px-2 text-quot font-medium">
        {text}
      </div>
    </div>
  );
};
