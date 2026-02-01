export { baseApi } from './baseApi';

export { authApi, useLoginMutation, useRegisterMutation, useGetMeQuery } from './authApi';

export {
  contactsApi,
  useGetContactsQuery,
  useGetContactQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} from './contactsApi';

export { statsApi, useGetStatsQuery } from './statsApi';

export { tagsApi, useGetTagsQuery, useCreateTagMutation, useDeleteTagMutation } from './tagsApi';
