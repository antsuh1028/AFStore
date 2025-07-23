const isDevelopment = import.meta.env.MODE === 'development';

class Logger {
  static info(message, data = null) {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data);
    }
  }

  static error(message, error = null) {
    console.error(`[ERROR] ${message}`, error);
  }

  static warn(message, data = null) {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data);
    }
  }

  static debug(message, data = null) {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }
}

export default Logger;