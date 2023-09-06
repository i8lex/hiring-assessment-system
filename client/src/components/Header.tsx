import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/auth/authSlice";
import { RootState } from "../types";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/login");
  };

  return (
    <header className="bg-green-10 flex items-center justify-end tablet:gap-6 gap-4 p-4 tablet:p-6 ">
      {isAuthenticated ? (
        <>
          <Link
            className="text-dark-100 text-dispS3 pb-0.5 hover:border-b border-dark-100"
            to="/tests"
          >
            Tests
          </Link>
          <button
            className="bg-white text-dark-100 text-dispS3 px-4 py-2 border border-stroke rounded-md hover:bg-gray-10 hover:text-dark-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            className="text-dark-100 text-dispS3 px-4 py-2 border border-stroke rounded-md hover:bg-gray-10 hover:text-dark-100"
            to="/registration"
          >
            Registration
          </Link>
          <Link
            className="text-dark-100 text-dispS3 px-4 py-2 border border-stroke rounded-md hover:bg-gray-10 hover:text-dark-100"
            to="/login"
          >
            Login
          </Link>
        </>
      )}
    </header>
  );
};
