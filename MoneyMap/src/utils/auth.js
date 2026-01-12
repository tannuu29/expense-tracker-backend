/**
 * Global authentication fetch helper
 * Provides a standardized way to make authenticated API calls
 * Reads JWT token from localStorage and sends Authorization header
 * Throws errors on 401 or 403 responses
 * 
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Response>} - Fetch response promise
 * @throws {Error} - Throws error on 401 or 403 responses
 */
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token")?.trim();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Always add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401: Token expired or invalid → throw error
  if (response.status === 401) {
    throw new Error('Unauthorized');
  }

  // Handle 403: Forbidden → throw error
  if (response.status === 403) {
    throw new Error('Forbidden');
  }

  return response;
};

/**
 * Base API URL constant
 */
export const API_BASE_URL = 'http://localhost:80';
