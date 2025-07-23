export const API_CONFIG = {
  BASE_URL: import.meta.env.MODE === 'production' 
    ? import.meta.env.VITE_API_URL 
    : import.meta.env.VITE_API_URL_DEV,
  TIMEOUT: 30000,
};

export const COLORS = {
  PRIMARY: '#494949',
  ACCENT: '#CA3836',
  SECONDARY: '#6AAFDB',
  GRAY_LIGHT: '#f9f9f9',
  GRAY_MEDIUM: '#ECECEC',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CONTACT: '/contact',
  WHOLESALE: {
    MARINATED: '/wholesale/marinated',
    PROCESSED: '/wholesale/processed',
    UNPROCESSED: '/wholesale/unprocessed',
    PRODUCT: (id) => `/wholesale/product/${id}`,
  },
};

export const CACHE_KEYS = {
  USER_INFO: 'userInfo',
  TOKEN: 'token',
  CART: 'cart',
  COOKIE_AGREEMENT: 'cookieAgreement',
};

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  LICENSE_REGEX: /^[A-Z]{2}-?\d{6,7}$/i,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};