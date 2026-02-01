import { baseApi } from './baseApi';
import type {
  Contact,
  ContactsResponse,
  CreateContactRequest,
  UpdateContactRequest,
  ContactFilters,
} from '../../types';

export const contactsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<ContactsResponse, ContactFilters | void>({
      query: (filters) => {
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
        return query ? `/api/contacts?${query}` : '/api/contacts';
      },
      providesTags: (result) =>
        result
          ? [
              ...result.contacts.map(({ id }) => ({ type: 'Contact' as const, id })),
              { type: 'Contacts', id: 'LIST' },
            ]
          : [{ type: 'Contacts', id: 'LIST' }],
    }),

    getContact: builder.query<Contact, string>({
      query: (id) => `/api/contacts/${id}`,
      providesTags: (_, __, id) => [{ type: 'Contact', id }],
    }),

    createContact: builder.mutation<Contact, CreateContactRequest>({
      query: (data) => ({
        url: '/api/contacts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Contacts', id: 'LIST' }, 'Stats'],
    }),

    updateContact: builder.mutation<Contact, { id: string; data: UpdateContactRequest }>({
      query: ({ id, data }) => ({
        url: `/api/contacts/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Contact', id },
        { type: 'Contacts', id: 'LIST' },
      ],
    }),

    deleteContact: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/contacts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Contact', id },
        { type: 'Contacts', id: 'LIST' },
        'Stats',
      ],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useGetContactQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactsApi;
