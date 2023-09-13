import { Input } from "../components/Input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/auth/authSlice";
import { useLoginMutation } from "../redux/auth/authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { Answer } from "../types";
import { useState } from "react";
import { PopUpModal } from "../components/modal/PopUpModal";

type FormRequiredFields = {
  username: string;
  password: string;
};

type LoginResponse =
  | {
      data: { token: string; message: string; role: string; answers: Answer[] };
    }
  | { error: FetchBaseQueryError | SerializedError };
const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormRequiredFields>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isError, setIsError] = useState(true);
  const onSubmit = async (values: FormRequiredFields) => {
    try {
      const response: LoginResponse = await login(values);
      setIsPopupOpen(true);
      if ("data" in response) {
        dispatch(loginSuccess(response.data));
        setIsError(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleError = (errors: object) => {
    console.warn(errors);
  };
  const handleRedirect = (type: "error" | "success") => {
    switch (type) {
      case "error":
        navigate("/login");
        break;
      case "success":
        navigate("/tests");
        break;
    }
  };
  return (
    <>
      <PopUpModal
        type={isError ? "error" : "success"}
        buttonAction={handleRedirect}
        showPopUpModal={isPopupOpen}
        setShowPopUpModal={setIsPopupOpen}
        titleText={isError ? "Login failed" : "Welcome back!"}
        messageText={
          !isError ? "Login successful" : "Wrong username or password"
        }
        buttonText={"OK"}
      />
      <div className="mx-auto mt-6">
        <h1 className="text-dark-100 text-dispS3 font-medium">Sign in</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit, handleError)}
        noValidate
        method="post"
        className="relative h-full w-full pt-5 tablet:pt-6 flex flex-col gap-4 tablet:gap-6"
      >
        <div className="flex flex-col gap-1">
          <p className="text-dark-100 text-parM">Login</p>
          <Input
            placeholder={"Enter your username"}
            isRequired={true}
            className="w-full tablet:w-[353px]"
            id="username"
            errorText={errors?.username?.message}
            {...register("username", {
              required: "Login is required",
            })}
          />
        </div>
        <div className="flex flex-col  gap-1">
          <p className="text-dark-100 text-parM">Password</p>
          <Input
            type="password"
            placeholder={"Enter your password"}
            isRequired={true}
            className="w-full tablet:w-[353px]"
            id="password"
            errorText={errors?.password?.message}
            {...register("password", {
              required: "Password is required",
            })}
          />
        </div>

        <button
          type="submit"
          className="font-medium text-white py-2 px-4 bg-orange-60 border border-stroke rounded-md w-full tablet:w-[150px]"
        >
          Login
        </button>
      </form>
    </>
  );
};

export default LoginPage;
