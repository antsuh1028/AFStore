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