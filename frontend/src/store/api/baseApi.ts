import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    const locale = localStorage.getItem("app-locale") || "en";
    headers.set("Accept-Language", locale);
    return headers;
  },
});

// Wrapper to handle 401 errors
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Check if this is not an auth endpoint
    const url = typeof args === "string" ? args : args.url;
    if (!url.includes("/api/auth/")) {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Contact", "Contacts", "Tags", "MeetingPlaces", "Stats", "User"],
  endpoints: () => ({}),
});
