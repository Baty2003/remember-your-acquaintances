import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { baseApi } from './api';
import { errorMiddleware } from './middleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, errorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export auth actions
export { logout, clearError, setUser, setCredentials, setError } from './authSlice';

// Re-export RTK Query hooks
export {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetContactsQuery,
  useGetContactQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useDeleteAllContactsMutation,
  useImportContactsMutation,
  useGetStatsQuery,
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useGetMeetingPlacesQuery,
  useCreateMeetingPlaceMutation,
  useUpdateMeetingPlaceMutation,
  useDeleteMeetingPlaceMutation,
} from './api';
