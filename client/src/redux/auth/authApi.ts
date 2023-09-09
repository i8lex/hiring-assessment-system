import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Authentications", "Error"],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://hiring-assessment-server-7206a80f9bd6.herokuapp.com/api",
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
