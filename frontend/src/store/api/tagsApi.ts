import { baseApi } from './baseApi';
import type { Tag } from '../../types';

interface TagsResponse {
  tags: Tag[];
}

interface CreateTagRequest {
  name: string;
}

export const tagsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<TagsResponse, void>({
      query: () => '/api/tags',
      providesTags: ['Tags'],
    }),

    createTag: builder.mutation<Tag, CreateTagRequest>({
      query: (data) => ({
        url: '/api/tags',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Tags', 'Stats'],
    }),

    deleteTag: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/tags/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tags', 'Stats'],
    }),
  }),
});

export const { useGetTagsQuery, useCreateTagMutation, useDeleteTagMutation } = tagsApi;
