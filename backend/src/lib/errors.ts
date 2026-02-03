export type Locale = 'en' | 'ru';

export const errorMessages: Record<string, Record<Locale, string>> = {
  // Auth
  'Username already taken': { en: 'Username already taken', ru: 'Имя пользователя уже занято' },
  'Invalid username or password': {
    en: 'Invalid username or password',
    ru: 'Неверное имя пользователя или пароль',
  },
  'Registration failed': { en: 'Registration failed', ru: 'Ошибка регистрации' },
  'Login failed': { en: 'Login failed', ru: 'Ошибка входа' },
  'User not found': { en: 'User not found', ru: 'Пользователь не найден' },
  'Failed to get user': { en: 'Failed to get user', ru: 'Не удалось получить данные пользователя' },
  'Invalid locale. Use "en" or "ru"': {
    en: 'Invalid locale. Use "en" or "ru"',
    ru: 'Неверная локаль. Используйте "en" или "ru"',
  },
  'Failed to update locale': { en: 'Failed to update locale', ru: 'Не удалось обновить язык' },
  'No authorization header': {
    en: 'No authorization header',
    ru: 'Отсутствует заголовок авторизации',
  },
  'Invalid authorization format. Use: Bearer <token>': {
    en: 'Invalid authorization format. Use: Bearer <token>',
    ru: 'Неверный формат авторизации. Используйте: Bearer <token>',
  },
  'Invalid or expired token': {
    en: 'Invalid or expired token',
    ru: 'Недействительный или истёкший токен',
  },

  // Contacts
  'Contact not found': { en: 'Contact not found', ru: 'Контакт не найден' },
  'Name is required': { en: 'Name is required', ru: 'Имя обязательно' },
  'Contacts array is required': {
    en: 'Contacts array is required',
    ru: 'Массив контактов обязателен',
  },
  'Contacts array cannot be empty': {
    en: 'Contacts array cannot be empty',
    ru: 'Массив контактов не может быть пустым',
  },
  'Cannot import more than 100 contacts at once': {
    en: 'Cannot import more than 100 contacts at once',
    ru: 'Нельзя импортировать более 100 контактов за раз',
  },
  'Photo URL is required': { en: 'Photo URL is required', ru: 'URL фотографии обязателен' },

  // Notes
  'Title is required': { en: 'Title is required', ru: 'Заголовок обязателен' },
  'Title cannot be empty': { en: 'Title cannot be empty', ru: 'Заголовок не может быть пустым' },
  'Note not found': { en: 'Note not found', ru: 'Заметка не найдена' },

  // Tags
  'Tag already exists': { en: 'Tag already exists', ru: 'Тег уже существует' },
  'Tag not found': { en: 'Tag not found', ru: 'Тег не найден' },
  'Failed to create tag': { en: 'Failed to create tag', ru: 'Не удалось создать тег' },
  'Failed to update tag': { en: 'Failed to update tag', ru: 'Не удалось обновить тег' },
  'Failed to delete tag': { en: 'Failed to delete tag', ru: 'Не удалось удалить тег' },

  // Meeting places
  'Meeting place already exists': {
    en: 'Meeting place already exists',
    ru: 'Место встречи уже существует',
  },
  'Meeting place not found': { en: 'Meeting place not found', ru: 'Место встречи не найдено' },
  'Failed to create meeting place': {
    en: 'Failed to create meeting place',
    ru: 'Не удалось создать место встречи',
  },
  'Failed to update meeting place': {
    en: 'Failed to update meeting place',
    ru: 'Не удалось обновить место встречи',
  },
  'Failed to delete meeting place': {
    en: 'Failed to delete meeting place',
    ru: 'Не удалось удалить место встречи',
  },

  // Generic
  'Unknown error': { en: 'Unknown error', ru: 'Неизвестная ошибка' },
};

export function translateError(message: string, locale: Locale): string {
  const translated = errorMessages[message]?.[locale];
  if (translated) return translated;

  // Dynamic messages
  const tagUsedMatch = message.match(/^Cannot delete tag: it is used by (\d+) contact\(s\)$/);
  if (tagUsedMatch) {
    return locale === 'ru'
      ? `Нельзя удалить тег: он используется в ${tagUsedMatch[1]} контакте(ах)`
      : message;
  }

  const placeUsedMatch = message.match(
    /^Cannot delete meeting place: it is used by (\d+) contact\(s\)$/
  );
  if (placeUsedMatch) {
    return locale === 'ru'
      ? `Нельзя удалить место встречи: оно используется в ${placeUsedMatch[1]} контакте(ах)`
      : message;
  }

  return message;
}

export function getLocaleFromHeader(acceptLanguage: string | undefined): Locale {
  if (!acceptLanguage) return 'en';
  const lower = acceptLanguage.toLowerCase();
  if (lower.includes('ru')) return 'ru';
  return 'en';
}
