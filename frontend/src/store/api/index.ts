export { baseApi } from "./baseApi";

export {
  authApi,
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateLocaleMutation,
} from "./authApi";

export {
  contactsApi,
  useGetContactsQuery,
  useGetContactQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useDeleteAllContactsMutation,
  useImportContactsMutation,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "./contactsApi";

export { statsApi, useGetStatsQuery } from "./statsApi";

export {
  tagsApi,
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from "./tagsApi";

export {
  meetingPlacesApi,
  useGetMeetingPlacesQuery,
  useCreateMeetingPlaceMutation,
  useUpdateMeetingPlaceMutation,
  useDeleteMeetingPlaceMutation,
} from "./meetingPlacesApi";
