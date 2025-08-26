// Utility functions for API calls and JSON parsing

/**
 * Safely parse JSON response, handling empty responses and non-JSON content
 */
export const safeJsonParse = async (response) => {
  // Check if response has content before parsing as JSON
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Server returned non-JSON response");
  }

  const responseText = await response.text();
  if (!responseText.trim()) {
    throw new Error("Server returned empty response");
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    throw new Error("Invalid JSON response from server");
  }
};

/**
 * Handle API response with proper error handling
 */
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    // Try to get error message from response if it has content
    let errorMessage = "API request failed";
    try {
      const errorText = await response.text();
      if (errorText) {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      }
    } catch (parseError) {
      // If we can't parse error response, use status text
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return safeJsonParse(response);
};

/**
 * Make a safe fetch request with automatic JSON parsing and error handling
 */
export const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
}; 