import { useState, useCallback } from 'react';
import type { ContactImportItem } from '../../../types';

interface ParseResult {
  contacts: ContactImportItem[];
  error: string | null;
}

interface UseJsonParserReturn {
  parsedContacts: ContactImportItem[];
  parseError: string | null;
  parseJson: (text: string) => void;
  parseFile: (file: File) => false;
  reset: () => void;
}

const validateContacts = (data: unknown): ParseResult => {
  // Handle both array and object with contacts property
  const contacts: ContactImportItem[] = Array.isArray(data)
    ? data
    : (data as { contacts?: ContactImportItem[] }).contacts ?? [];

  if (!Array.isArray(contacts)) {
    return {
      contacts: [],
      error: 'JSON must be an array of contacts or an object with "contacts" array',
    };
  }

  // Validate each contact has at least a name
  const invalidContacts = contacts.filter(
    (c) => !c.name || typeof c.name !== 'string' || c.name.trim() === ''
  );

  if (invalidContacts.length > 0) {
    return {
      contacts: [],
      error: `${invalidContacts.length} contact(s) are missing the required "name" field`,
    };
  }

  if (contacts.length > 100) {
    return {
      contacts: [],
      error: 'Cannot import more than 100 contacts at once',
    };
  }

  return { contacts, error: null };
};

export const useJsonParser = (): UseJsonParserReturn => {
  const [parsedContacts, setParsedContacts] = useState<ContactImportItem[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setParsedContacts([]);
    setParseError(null);
  }, []);

  const parseJson = useCallback((text: string) => {
    try {
      if (!text.trim()) {
        setParseError('Please enter JSON text');
        setParsedContacts([]);
        return;
      }

      const parsed = JSON.parse(text);
      const result = validateContacts(parsed);

      if (result.error) {
        setParseError(result.error);
        setParsedContacts([]);
      } else {
        setParsedContacts(result.contacts);
        setParseError(null);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse JSON';
      setParseError(errorMessage);
      setParsedContacts([]);
    }
  }, []);

  const parseFile = useCallback((file: File): false => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      parseJson(content);
    };

    reader.onerror = () => {
      setParseError('Failed to read file');
      setParsedContacts([]);
    };

    reader.readAsText(file);
    return false; // Prevent default upload behavior
  }, [parseJson]);

  return {
    parsedContacts,
    parseError,
    parseJson,
    parseFile,
    reset,
  };
};
