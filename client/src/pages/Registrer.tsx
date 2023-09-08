import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../redux/auth/authApi";
import { Input } from "../components/Input";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import clsx from "clsx";
import { ReactComponent as ChevronUp } from "../assets/IconsSet/dropdown-up.svg";
import { ReactComponent as ChevronDown } from "../assets/IconsSet/dropdown.svg";

type FormRequiredFields = {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  age: number;
  role: string;
};

type RegisterResponse =
  | { data: { message: string } }
  | { error: FetchBaseQueryError | SerializedError };
const RegisterPage = () => {
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm<FormRequiredFields>();
  const navigate = useNavigate();
  const [register] = useRegisterMutation();

  const onSubmit = async (values: FormRequiredFields) => {
    try {
      const response: RegisterResponse = await register(values);

      if ("data" in response) {
        setTimeout(() => {
          navigate("/login");
          // handleClose();
        }, 2000);
      } else {
        console.log(response.error);
      }

      // if (data.token) {
      //   dispatch(loginSuccess(data.token));
      //   setTimeout(() => {
      //     navigate("/tests");
      //     // handleClose();
      //   }, 3000);
      // }
      // if (error) {
      //   setMessage(error.data.error);
      //   const { confirmed } = error.data;
      //   setConfirmed(confirmed);
      //   if (!confirmed && confirmed !== undefined) {
      //     setEmail(values.email);
      //     return setOpenModal(true);
      //   } else {
      //     setOpenModal(true);
      //     setTimeout(() => handleClose(), 3000);
      //   }
      // } else {
      //   const { message, confirmed } = data;
      //   setMessage(message);
      //   setConfirmed(confirmed);
      //   setOpenModal(true);
      //
      //   if (data.token && confirmed === true) {
      //     dispatch(loginSuccess(data.token));
      //     setTimeout(() => {
      //       navigate("/tests");
      //       // handleClose();
      //     }, 3000);
      //   }
      // }
    } catch (err) {
      console.log(err);
      // setMessage(err.message);
      // setOpenModal(true);
    }
  };
  const handleError = (errors: object) => {
    console.warn(errors);
  };
  return (
    <>
      <div className="flex items-center gap-24 mt-6">
        <h1 className="text-dark-100 text-dispS3 font-medium">Sign up</h1>
        <Controller
          name={`role`}
          control={control}
          render={({ field }) => {
            return (
              <Listbox
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                }}
              >
                {({ open }) => (
                  <>
                    <div className="relative right-0 justify-self-end  desktop:-mt-0.5">
                      <Listbox.Button
                        className={
                          "flex h-[40px] w-full justify-between rounded-md border border-stroke  align-middle font-medium tablet:h-[30px] tablet:w-[187px]"
                        }
                      >
                        <div className="flex justify-center py-[9px] px-[16px] text-parS text-[#374151]  tablet:py-[5px]  tablet:text-quot">
                          {getValues("role") === "admin"
                            ? "Employer"
                            : "Applicant"}
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
                            value="admin"
                          >
                            <span className="text-quot font-normal text-dark-80">
                              Employer
                            </span>
                          </Listbox.Option>
                          <Listbox.Option
                            className={({ active }) =>
                              clsx(
                                active ? "bg-[#F3F4F6]" : "bg-white",
                                "flex h-[38px] cursor-pointer flex-row px-4 py-2",
                              )
                            }
                            value="user"
                          >
                            <span className="text-quot font-normal text-dark-80">
                              Applicant
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
      <form
        onSubmit={handleSubmit(onSubmit, handleError)}
        noValidate
        method="post"
        className="relative h-full w-full pt-5 tablet:pt-6 flex flex-col gap-4 tablet:gap-6"
      >
        <div className="flex flex-col gap-1">
          <p className="text-dark-100 text-parM">Username</p>
          <Input
            placeholder={"Enter your username"}
            isRequired={true}
            className="w-full tablet:w-[353px]"
            id="username"
            errorText={errors?.username?.message}
            {...registerForm("username", {
              required: "Login is required",
              minLength: {
                value: 3,
                message: "Username must contain at least 3 characters.",
              },
              maxLength: {
                value: 20,
                message: "Username must contain 20 characters at max.",
              },
            })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-dark-100 text-parM">Email</p>
          <Input
            placeholder={"Enter your email"}
            isRequired={true}
            type="email"
            className="w-full tablet:w-[353px]"
            id="email"
            errorText={errors?.email?.message}
            {...registerForm("email", {
              required: "Email is required",
              minLength: {
                value: 5,
                message: "Email must contain at least 5 characters.",
              },
              maxLength: {
                value: 20,
                message: "Email must contain 30 characters at max.",
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,30}$/,
                message: "Invalid email format",
              },
            })}
          />
        </div>
        <div className="flex flex-col  gap-1">
          <p className="text-dark-100 text-parM">Password</p>
          <Input
            placeholder={"Enter your password"}
            isRequired={true}
            type="password"
            className="w-full tablet:w-[353px]"
            id="password"
            errorText={errors?.password?.message}
            {...registerForm("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, one digit and contain min 8 characters.",
              },
            })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-dark-100 text-parM">Name</p>
          <Input
            placeholder={"Enter your name"}
            isRequired={false}
            className="w-full tablet:w-[353px]"
            id="firstname"
            errorText={errors?.firstname?.message}
            {...registerForm("firstname")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-dark-100 text-parM">Sure name</p>
          <Input
            placeholder={"Enter your sure name"}
            isRequired={false}
            className="w-full tablet:w-[353px]"
            id="lastname"
            errorText={errors?.lastname?.message}
            {...registerForm("lastname")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-dark-100 text-parM">Age</p>
          <Input
            placeholder={"Enter your age"}
            isRequired={false}
            className="w-full tablet:w-[353px]"
            id="lastname"
            errorText={errors?.age?.message}
            {...registerForm("age", {
              pattern: {
                value: /^[0-9]{2}$/,
                message: "Name can contain exactly two digits.",
              },
            })}
          />
        </div>
        <button
          type="submit"
          className="font-medium text-white py-2 px-4 bg-orange-60 border border-stroke rounded-md w-full tablet:w-[150px]"
        >
          Sign-up
        </button>
      </form>
    </>
  );
};
export default RegisterPage;
