import { baseApi } from "./baseApi";
import type { MeetingPlace } from "../../types";

interface MeetingPlacesResponse {
  meetingPlaces: MeetingPlace[];
}

interface CreateMeetingPlaceRequest {
  name: string;
}

interface UpdateMeetingPlaceRequest {
  id: string;
  name: string;
}

export const meetingPlacesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeetingPlaces: builder.query<MeetingPlacesResponse, void>({
      query: () => "/api/meeting-places",
      providesTags: ["MeetingPlaces"],
    }),

    createMeetingPlace: builder.mutation<
      MeetingPlace,
      CreateMeetingPlaceRequest
    >({
      query: (data) => ({
        url: "/api/meeting-places",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MeetingPlaces", "Stats"],
    }),

    updateMeetingPlace: builder.mutation<
      MeetingPlace,
      UpdateMeetingPlaceRequest
    >({
      query: ({ id, name }) => ({
        url: `/api/meeting-places/${id}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["MeetingPlaces"],
    }),

    deleteMeetingPlace: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/meeting-places/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MeetingPlaces", "Stats"],
    }),
  }),
});

export const {
  useGetMeetingPlacesQuery,
  useCreateMeetingPlaceMutation,
  useUpdateMeetingPlaceMutation,
  useDeleteMeetingPlaceMutation,
} = meetingPlacesApi;
