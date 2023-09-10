import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as dotenv from "dotenv";

dotenv.config();

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Authentications", "Error"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.PROD_URL,
  }),
  endpoints: (build) => ({
    register: build.mutation({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
    login: build.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
  }),
});
// @ts-ignore
export const { useRegisterMutation, useLoginMutation } = authApi;
