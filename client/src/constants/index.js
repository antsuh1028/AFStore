// Check if we're in a Vite environment
const isViteEnv = typeof import.meta !== 'undefined' && import.meta.env;

export const API_CONFIG = {
  BASE_URL: isViteEnv && import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_URL 
    : isViteEnv 
      ? import.meta.env.VITE_API_URL_DEV 
      : 'http://localhost:3000', // fallback for non-Vite environments
  TIMEOUT: 30000,
  
  VITE_EMAIL_JS_SERVICE_ID: isViteEnv ? import.meta.env.VITE_EMAIL_JS_SERVICE_ID : '',
  VITE_EMAIL_JS_TEMPLATE_CONTACT: isViteEnv ? import.meta.env.VITE_EMAIL_JS_TEMPLATE_CONTACT : '',
  VITE_EMAIL_JS_TEMPLATE_ORDER_CONFIRMATION: isViteEnv ? import.meta.env.VITE_EMAIL_JS_TEMPLATE_ORDER_CONFIRMATION : '',
  VITE_EMAIL_JS_TEMPLATE_RESPONSE: isViteEnv ? import.meta.env.VITE_EMAIL_JS_TEMPLATE_RESPONSE : '',
  VITE_EMAIL_JS_TEMPLATE_RESET_PASSWORD: isViteEnv ? import.meta.env.VITE_EMAIL_JS_TEMPLATE_RESET_PASSWORD : '',
  VITE_EMAIL_JS_TEMPLATE_SIGNUP: isViteEnv ? import.meta.env.VITE_EMAIL_JS_TEMPLATE_SIGNUP : '',
  VITE_EMAIL_JS_PUBLIC_KEY: isViteEnv ? import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY : '',
};

export const COLORS = {
  PRIMARY: '#494949',
  ACCENT: '#CA3836',
  SECONDARY: '#6AAFDB',
  GRAY_LIGHT: '#f9f9f9',
  GRAY_MEDIUM: '#ECECEC',
};