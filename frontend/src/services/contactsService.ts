import { apiClient } from './apiClient';
import type {
  Contact,
  ContactsResponse,
  CreateContactRequest,
  UpdateContactRequest,
  ContactFilters,
} from '../types';

export const contactsService = {
  getAll: async (filters?: ContactFilters): Promise<ContactsResponse> => {
    const params = new URLSearchParams();

    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.tagIds?.length) {
      filters.tagIds.forEach((id) => params.append('tagIds', id));
    }
    if (filters?.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    if (filters?.sortOrder) {
      params.append('sortOrder', filters.sortOrder);
    }

    const query = params.toString();
    const url = query ? `/api/contacts?${query}` : '/api/contacts';
    const response = await apiClient.get<ContactsResponse>(url);
    return response.data;
  },

  getById: async (id: string): Promise<Contact> => {
    const response = await apiClient.get<Contact>(`/api/contacts/${id}`);
    return response.data;
  },

  create: async (data: CreateContactRequest): Promise<Contact> => {
    const response = await apiClient.post<Contact>('/api/contacts', data);
    return response.data;
  },

  update: async (id: string, data: UpdateContactRequest): Promise<Contact> => {
    const response = await apiClient.put<Contact>(`/api/contacts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/contacts/${id}`);
  },
};
