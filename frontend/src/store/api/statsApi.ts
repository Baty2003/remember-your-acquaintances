import { baseApi } from "./baseApi";
import type { UserStats } from "../../types";

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<UserStats, void>({
      query: () => "/api/stats",
      providesTags: ["Stats"],
    }),
  }),
});

export const { useGetStatsQuery } = statsApi;
