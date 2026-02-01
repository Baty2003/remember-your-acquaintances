export const AUTH_FORM_CONSTANTS = {
  TITLE: 'Remember Your Acquaintances',
  LOGIN_FORM_NAME: 'login',
  REGISTER_FORM_NAME: 'register',
  LOGIN_BUTTON_TEXT: 'Log in',
  REGISTER_BUTTON_TEXT: 'Sign up',
  USERNAME_PLACEHOLDER: 'Username',
  PASSWORD_PLACEHOLDER: 'Password',
  CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm password',
  LOGO_SIZE: 64,
  USERNAME_MIN_LENGTH: 3,
  PASSWORD_MIN_LENGTH: 6,
  SWITCH_TO_REGISTER: "Don't have an account? Sign up",
  SWITCH_TO_LOGIN: 'Already have an account? Log in',
} as const;

// Backwards compatibility
export const LOGIN_FORM_CONSTANTS = AUTH_FORM_CONSTANTS;

export const USERNAME_RULES = [
  { required: true, message: 'Please enter your username' },
  { min: AUTH_FORM_CONSTANTS.USERNAME_MIN_LENGTH, message: 'Username must be at least 3 characters' },
];

export const PASSWORD_RULES = [
  { required: true, message: 'Please enter your password' },
  { min: AUTH_FORM_CONSTANTS.PASSWORD_MIN_LENGTH, message: 'Password must be at least 6 characters' },
];

export const CONFIRM_PASSWORD_RULES = [
  { required: true, message: 'Please confirm your password' },
];
