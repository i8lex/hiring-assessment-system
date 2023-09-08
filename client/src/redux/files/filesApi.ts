import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "../../types";

type FileType = {
  _id: string;
  filename: string;
  mimetype: string;
  size: number;
  buffer: ArrayBuffer;
};

type UploadResponse = {
  file: FileType;
  message: string;
};

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

export const filesApi = createApi({
  reducerPath: "filesApi",
  tagTypes: ["Files", "File"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api/",
    prepareHeaders,
  }),

  endpoints: (build) => ({
    getFile: build.query({
      query: (id: string) => ({ url: `file/get/${id}` }),
      providesTags: (result: FileType | undefined, error, id: string) => [
        { type: "File", id },
      ],
    }),

    addFile: build.mutation<UploadResponse, FormData>({
      query: (body) => ({
        url: "file/upload",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "File", id: "LIST" }],
    }),

    deleteFile: build.mutation({
      query: (id) => ({
        url: `file/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "File", id: "LIST" }],
    }),
  }),
});

export const { useGetFileQuery, useAddFileMutation, useDeleteFileMutation } =
  filesApi;
