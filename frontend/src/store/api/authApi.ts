import { baseApi } from "./baseApi";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../../types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("token", data.token);
        } catch {
          // Error handled by component
        }
      },
    }),

    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: "/api/auth/register",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("token", data.token);
        } catch {
          // Error handled by component
        }
      },
    }),

    getMe: builder.query<{ user: User }, void>({
      query: () => "/api/auth/me",
      providesTags: ["User"],
    }),

    updateLocale: builder.mutation<{ locale: string }, "en" | "ru">({
      query: (locale) => ({
        url: "/api/auth/locale",
        method: "PUT",
        body: { locale },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateLocaleMutation,
} = authApi;
