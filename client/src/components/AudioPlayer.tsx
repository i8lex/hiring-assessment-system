import { Fragment, useEffect, useRef, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import Wavesurfer from "wavesurfer.js";
import { ReactComponent as PauseIcon } from "../assets/IconsSet/pause-circle.svg";
import { ReactComponent as PlayIcon } from "../assets/IconsSet/play.svg";
import { ReactComponent as SkipBackIcon } from "../assets/IconsSet/skip-back.svg";
import { ReactComponent as SkipForwardIcon } from "../assets/IconsSet/skip-forward.svg";
import { ReactComponent as VolumeIcon } from "../assets/IconsSet/volume-max.svg";
import type { FC } from "react";

type AudioPlayerProps = {
  audioPath: string;
  index: string;
  audioFiles?: Blob[];
  isInModal?: boolean;
};
export const AudioPlayer: FC<AudioPlayerProps> = ({
  audioPath,
  index,
  audioFiles,
  isInModal,
}) => {
  const waveform = useRef<Wavesurfer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    if (!waveform.current) {
      waveform.current = Wavesurfer.create({
        container: isInModal
          ? `#waveformInModal_${index}`
          : `#waveform_${index}`,
        waveColor: "#88a88c",
        barGap: 0,
        height: 30,
        barWidth: 0.1,
        barRadius: 2,
        cursorWidth: 0,
        cursorColor: "#018a21",
      });
      waveform.current?.load(audioPath);
    }
    waveform.current.on("ready", () => {
      setDuration(waveform.current!.getDuration());
    });

    waveform.current.on("audioprocess", () => {
      setCurrentTime(waveform.current!.getCurrentTime());
    });
    waveform.current?.setVolume(volume);
  }, []);

  useEffect(() => {
    waveform.current?.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (audioPath === "") {
      playAudio();
      waveform.current?.pause();
      setIsPlaying(false);
    }
  }, [audioPath]);
  useEffect(() => {
    if (currentTime === duration) {
      setIsPlaying(false);
    }
  }, [currentTime]);
  useEffect(() => {
    waveform.current?.stop();
  }, [audioFiles?.length]);
  const playAudio = () => {
    if (waveform.current?.isPlaying()) {
      waveform.current?.pause();
      setIsPlaying(false);
    } else {
      waveform.current?.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(1, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleLabelClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const newPlayed =
      event.nativeEvent.offsetX / event.currentTarget.offsetWidth;
    setVolume(newPlayed);
    // playerRef?.current?.seekTo(newPlayed);
  };
  const handleLabelMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const div = event.target as HTMLDivElement;
    const divRect = div.getBoundingClientRect();

    const handleMouseMove = (e: { clientX: number }) => {
      const newOffsetX = e.clientX - divRect.left;
      const newPlayed = Math.min(Math.max(newOffsetX / divRect.width, 0), 1);

      setVolume(newPlayed);
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
  return (
    <div className="flex w-full items-center justify-between gap-1 p-0 tablet:gap-[17.5px] ">
      <div
        className={clsx(
          isInModal ? "" : "desktop:w-[800px]",
          "flex w-full items-center justify-between gap-3 rounded-md bg-orange-10 px-4 py-1 tablet:gap-[23px] tablet:px-6 tablet:w-[550px] ",
        )}
      >
        <div className="flex items-center p-0 tablet:gap-4">
          {isInModal ? (
            <button
              className="hidden tablet:block"
              onClick={() => {
                waveform.current?.skip(-15);
              }}
            >
              <SkipBackIcon className="h-6 w-6  text-dark-100" />
            </button>
          ) : null}
          <div className="flex items-center gap-3 p-0 tablet:gap-5">
            <button type="button" onClick={playAudio}>
              {isPlaying ? (
                <div className="h-5 w-5 tablet:h-6 tablet:w-6">
                  <PauseIcon className="h-5 w-5  text-dark-100 tablet:h-6 tablet:w-6" />
                </div>
              ) : (
                <div className="h-5 w-5 tablet:h-6 tablet:w-6">
                  <PlayIcon className="h-5 w-5  text-dark-100 tablet:h-6  tablet:w-6" />
                </div>
              )}
            </button>
            {isInModal ? null : (
              <Popover className="relative hidden tablet:block">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={`
                ${open ? "" : "text-opacity-90"}
                flex h-6 w-6 items-center justify-center p-0`}
                    >
                      <VolumeIcon
                      // className="h-6 w-6  text-dark-100"
                      />
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute top-8 -left-8 z-30 w-fit origin-center rounded-md  border border-stroke  bg-white p-2 shadow-lg">
                        <div className="absolute -top-1 left-5 z-50 ml-4 h-2 w-2 rotate-45 rounded-sm border-l border-t border-l-stroke border-t-stroke bg-white" />
                        <div className="absolute top-0 right-5 z-50 ml-4 h-0.5 w-4 bg-white" />
                        <div
                          className="h-[3px] w-[62px] cursor-pointer justify-self-end rounded-full bg-dark-40 "
                          onClick={(event) => handleLabelClick(event)}
                          onMouseDown={(event) => handleLabelMouseDown(event)}
                        >
                          <div
                            className={`relative h-full rounded-l-full bg-dark-80 `}
                            style={{ width: `${volume * 100}%` }}
                          >
                            <div className="absolute top-1/2 right-0 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-white text-[6.667px] shadow-md " />
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            )}
          </div>

          {isInModal ? (
            <button
              className="hidden tablet:block"
              onClick={() => {
                waveform.current?.skip(15);
              }}
            >
              <SkipForwardIcon className="h-6 w-6 text-dark-100" />
            </button>
          ) : null}
        </div>
        <div
          className={clsx(
            isInModal ? " tablet:gap-3" : " tablet:gap-4",
            "flex items-center gap-[10px] justify-self-center p-0",
          )}
        >
          <p className=" text-quot text-dark-100 tablet:text-parS">
            {formatTime(currentTime)}
          </p>
          {isInModal ? (
            <div className="grid h-[30px] w-[105px] tablet:w-[304px]">
              <div id={`waveformInModal_${index}`} />
            </div>
          ) : (
            <div className="grid h-[30px] w-[117px] tablet:w-[287.5px] desktop:w-[513px]">
              <div id={`waveform_${index}`} />
            </div>
          )}

          <p className="text-quot text-dark-100 tablet:text-parS">
            {formatTime(duration)}
          </p>
        </div>
      </div>
    </div>
  );
};
