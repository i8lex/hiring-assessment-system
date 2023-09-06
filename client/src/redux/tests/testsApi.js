import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const prepareHeaders = (headers, { getState }) => {
  const token = getState().auth.token;
  console.log(token);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};

export const testsApi = createApi({
  reducerPath: "testsApi",
  tagTypes: ["Tests"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api/",
    prepareHeaders,
  }),

  endpoints: (build) => ({
    getTests: build.query({
      query: () => "tests",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tests", id })),
              { type: "Tests", id: "LIST" },
            ]
          : [{ type: "Tests", id: "LIST" }],
    }),
    addTask: build.mutation({
      query: (body) => ({
        url: "tests",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tests", id: "LIST" }],
    }),
    pathTask: build.mutation({
      query: ({ id, body }) => ({
        url: `tests/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Tests", id: "LIST" }],
    }),
    deleteTask: build.mutation({
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
  useAddTestMutation,
  useDeleteTestMutation,
  usePathTestMutation,
} = testsApi;
