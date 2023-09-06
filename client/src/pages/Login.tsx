import { Input } from "../components/Input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/auth/authSlice";
import { useLoginMutation } from "../redux/auth/authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

type FormRequiredFields = {
  username: string;
  password: string;
};

type LoginResponse =
  | { data: { token: string; message: string } }
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
        dispatch(loginSuccess(response.data.token));
        setTimeout(() => {
          navigate("/tests");
          // handleClose();
        }, 3000);
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
  return (
    <>
      <div className="mx-auto mt-6">
        <h1 className="text-dark-100 text-dispS3">Sign in</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        method="post"
        className="relative h-full w-full pt-5 tablet:pt-6"
      >
        <Input
          isRequired={true}
          className="w-64"
          id="username"
          {...register("username")}
        />
        <Input
          isRequired={true}
          className="w-64"
          id="password"
          {...register("password")}
        />
        <button type="submit" className="btn-primary w-64">
          Login
        </button>
      </form>
    </>
  );
};

export default LoginPage;
