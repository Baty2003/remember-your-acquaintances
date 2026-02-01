export type AgeType = 'exact' | 'approximate';
export type HeightType = 'exact' | 'approximate';
export type Gender = 'male' | 'female';
export type ContactLinkType = 'phone' | 'telegram' | 'instagram' | 'vk' | 'other';

export interface ContactLink {
  id: string;
  type: ContactLinkType;
  label?: string | null;
  value: string;
}

export interface ContactLinkInput {
  type: ContactLinkType;
  label?: string;
  value: string;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface MeetingPlace {
  id: string;
  name: string;
  createdAt: string;
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
  gender?: Gender;
  age?: number;
  ageType?: AgeType;
  height?: number;
  heightType?: HeightType;
  occupation?: string;
  occupationDetails?: string;
  whereMet?: string;
  howMet?: string;
  details?: string;
  metAt?: string;
  photo?: string;
  tags: Tag[];
  meetingPlace?: MeetingPlace | null;
  meetingPlaceId?: string | null;
  links?: ContactLink[];
  notes?: Note[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactRequest {
  name: string;
  gender?: Gender;
  age?: number;
  ageType?: AgeType;
  height?: number;
  heightType?: HeightType;
  occupation?: string;
  occupationDetails?: string;
  whereMet?: string;
  howMet?: string;
  details?: string;
  metAt?: string;
  tagIds?: string[];
  meetingPlaceId?: string | null;
  links?: ContactLinkInput[];
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

// Import types
export interface ContactImportItem {
  name: string;
  gender?: Gender;
  age?: number;
  ageType?: AgeType;
  height?: number;
  heightType?: HeightType;
  occupation?: string;
  occupationDetails?: string;
  whereMet?: string;
  howMet?: string;
  details?: string;
  metAt?: string;
  tags?: string[]; // Tag names - will be matched or created
  meetingPlace?: string; // Meeting place name - will be matched or created
  links?: Omit<ContactLinkInput, 'type'> & { type: string }[];
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
  created: Contact[];
}
