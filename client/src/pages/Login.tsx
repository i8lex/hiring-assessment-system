import { Input } from "../components/Input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/auth/authSlice";
import { useLoginMutation } from "../redux/auth/authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { Answer } from "../types";

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

  const onSubmit = async (values: FormRequiredFields) => {
    try {
      const response: LoginResponse = await login(values);

      if ("data" in response) {
        dispatch(loginSuccess(response.data));
        setTimeout(() => {
          navigate("/tests");
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
