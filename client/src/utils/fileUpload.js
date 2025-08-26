import { API_CONFIG } from '../constants';

/**
 * Upload a file to S3 for user document
 * @param {File} file - The file to upload
 * @param {string} documentType - Type of document (e.g., 'business-license', 'government-id', etc.)
 * @param {string} userEmail - User's email address
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadUserDocument = async (file, documentType, userEmail) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('userEmail', userEmail);

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/s3/upload/document`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        url: data.url,
        key: data.key,
      };
    } else {
      // Provide detailed error information for debugging
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        message: data.error || data.message || 'Upload failed',
        code: data.code,
        name: data.name
      };
      
      return {
        success: false,
        error: errorDetails.message,
        errorDetails,
        isS3Error: true,
      };
    }
  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: 'Network error during upload',
      errorDetails: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      isNetworkError: true,
    };
  }
};

/**
 * Upload multiple files for user documents
 * @param {Array<{file: File, documentType: string}>} files - Array of files with their types
 * @param {string} userEmail - User's email address
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<{success: boolean, results: Array, errors: Array}>}
 */
export const uploadMultipleUserDocuments = async (files, userEmail, onProgress) => {
  const results = [];
  const errors = [];
  
  for (let i = 0; i < files.length; i++) {
    const { file, documentType } = files[i];
    
    // Call progress callback
    if (onProgress) {
      onProgress(i + 1, files.length, documentType);
    }
    
    try {
      const result = await uploadUserDocument(file, documentType, userEmail);
      
      if (result.success) {
        results.push({
          documentType,
          fileName: file.name,
          url: result.url,
          key: result.key,
        });
      } else {
        errors.push({
          documentType,
          fileName: file.name,
          error: result.error,
          errorDetails: result.errorDetails,
          isS3Error: result.isS3Error,
          isNetworkError: result.isNetworkError,
        });
      }
    } catch (error) {
      errors.push({
        documentType,
        fileName: file.name,
        error: error.message,
        errorDetails: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        isNetworkError: true,
      });
    }
  }
  
  return {
    success: errors.length === 0,
    results,
    errors,
  };
};


/**
 * Upload multiple files during signup process
 * This function first creates the signup request, then uploads documents
 * @param {Array<{file: File, documentType: string}>} files - Array of files with their types
 * @param {Object} userData - User registration data
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<{success: boolean, results: Array, errors: Array, signupRequestId?: number}>}
 */
export const uploadMultipleSignupDocuments = async (files, userData, onProgress) => {
  try {
    // First, create the signup request
    const signupResponse = await fetch(`${API_CONFIG.BASE_URL}/api/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const signupData = await signupResponse.json();
    if (!signupResponse.ok) {
      return {
        success: false,
        results: [],
        errors: [{ error: signupData.message || 'Signup failed' }],
      };
    }

    const signupRequestId = signupData.signupRequestId || signupData.request?.id;
    if (!signupRequestId) { 
      return {
        success: false,
        results: [],
        errors: [{ error: 'Failed to get signup request ID' }],
      };
    }

    // If no files to upload, return success
    if (!files || files.length === 0) {
      return {
        success: true,
        results: [],
        errors: [],
        signupRequestId,
      };
    }

    // Upload the documents using the user's email
    const uploadResult = await uploadMultipleUserDocuments(files, userData.email, onProgress);
    
    return {
      ...uploadResult,
      signupRequestId,
    };
    
  } catch (error) {
    console.error('Signup with documents error:', error);
    return {
      success: false,
      results: [],
      errors: [{ error: error.message || 'Network error during signup' }],
    };
  }
}; 