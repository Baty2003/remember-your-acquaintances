import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import contactsReducer from './contactsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contacts: contactsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export auth actions
export { login, register, logout, fetchCurrentUser, clearError, setUser } from './authSlice';

// Re-export contacts actions
export {
  fetchContacts,
  fetchContactById,
  createContact,
  updateContact,
  deleteContact,
  clearCurrentContact,
  clearError as clearContactsError,
} from './contactsSlice';
