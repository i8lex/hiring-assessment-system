import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
  TagDescription,
} from "@reduxjs/toolkit/query/react";
import { RootState, Test } from "../../types";

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

export const testsApi = createApi({
  reducerPath: "testsApi",
  tagTypes: ["Tests", "Test"],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://hiring-assessment-server-7206a80f9bd6.herokuapp.com/api",
    prepareHeaders,
  }),

  endpoints: (build) => ({
    getTests: build.query<Test[], void>({
      query: () => "tests",
      providesTags: (
        result: Test[] | undefined,
      ): (TagDescription<"Tests"> | TagDescription<"Test">)[] =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Test" as const, _id })),
              { type: "Tests" as const, id: "LIST" },
            ]
          : [{ type: "Tests" as const, id: "LIST" }],
    }),
    getTest: build.query({
      query: (id: string) => ({ url: `tests/${id}` }),
      providesTags: (result: Test | undefined, error, id: string) => [
        { type: "Test", id },
      ],
    }),
    addTest: build.mutation<void, Test>({
      query: (body) => ({
        url: "tests",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tests", id: "LIST" }],
    }),
    pathTest: build.mutation({
      query: ({ id, body }) => ({
        url: `tests/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Tests", id: "LIST" }],
    }),
    sendTest: build.mutation({
      query: ({ id, body }) => ({
        url: `tests/send/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Tests", id: "LIST" }],
    }),
    sendAnswers: build.mutation({
      query: ({ body }) => ({
        url: `answer`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Tests", id: "LIST" }],
    }),
    deleteTest: build.mutation({
      query: (id) => ({
        url: `tests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Tests", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTestsQuery,
  useGetTestQuery,
  useSendTestMutation,
  useSendAnswersMutation,
  useAddTestMutation,
  useDeleteTestMutation,
  usePathTestMutation,
} = testsApi;
