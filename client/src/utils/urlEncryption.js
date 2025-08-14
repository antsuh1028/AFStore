export const encodeUserId = (userId) => {
  const salt = 12; // Use a consistent salt
  const combined = `${userId}-${salt}`;
  return btoa(combined).replace(/[+/=]/g, (char) => {
    switch (char) {
      case '+': return '-';
      case '/': return '_';
      case '=': return '';
      default: return char;
    }
  });
};

export const decodeUserId = (encodedId) => {
  try {
    const salt = 12; // Same salt as above
    // Restore base64 padding and special chars
    let base64 = encodedId.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const decoded = atob(base64);
    const userId = decoded.split('-')[0]; 
    return parseInt(userId);
  } catch (error) {
    console.error('Failed to decode user ID:', error);
    return null;
  }
};
