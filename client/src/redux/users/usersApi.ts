import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
  TagDescription,
} from "@reduxjs/toolkit/query/react";
import { RootState, User } from "../../types";
import { URL } from "../../constants";
const prepareHeaders = (
  headers: Headers,
  {
    getState,
  }: Pick<BaseQueryApi, "getState" | "extra" | "endpoint" | "type" | "forced">,
) => {
  const token = (getState() as RootState).auth.token;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export const usersApi = createApi({
  reducerPath: "usersApi",
  tagTypes: ["Users", "User"],
  baseQuery: fetchBaseQuery({
    baseUrl: URL,
    prepareHeaders,
  }),

  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: (
        result: User[] | undefined,
      ): (TagDescription<"Users"> | TagDescription<"User">)[] =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "User" as const, _id })),
              { type: "Users" as const, id: "LIST" },
            ]
          : [{ type: "Users" as const, id: "LIST" }],
    }),
    getUser: build.query({
      query: (id: string) => ({ url: `users/${id}` }),
      providesTags: (result: User | undefined, error, id: string) => [
        { type: "User", id },
      ],
    }),
    resetAnswers: build.mutation({
      query: ({ userId, testId }) => ({
        url: `users/${userId}/reset/${testId}`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserQuery,
  useResetAnswersMutation,
} = usersApi;
