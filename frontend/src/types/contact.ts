export type AgeType = 'exact' | 'approximate';

export interface Tag {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  contactId: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  age?: number;
  ageType?: AgeType;
  height?: string;
  occupation?: string;
  occupationDetails?: string;
  whereMet?: string;
  howMet?: string;
  photo?: string;
  tags: Tag[];
  notes?: Note[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactRequest {
  name: string;
  age?: number;
  ageType?: AgeType;
  height?: string;
  occupation?: string;
  occupationDetails?: string;
  whereMet?: string;
  howMet?: string;
  tagIds?: string[];
}

export type UpdateContactRequest = Partial<CreateContactRequest>;

export interface ContactsResponse {
  contacts: Contact[];
  total: number;
}

export interface ContactFilters {
  search?: string;
  tagIds?: string[];
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ContactsState {
  contacts: Contact[];
  currentContact: Contact | null;
  isLoading: boolean;
  error: string | null;
  total: number;
}
