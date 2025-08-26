// baseAPI.js - Base API configuration and utilities

export const baseConfig = {
  baseURL: 'https://ai.mfu.ac.th/strapi/api',
  timeout: 30000,
};

// Enhanced fetch with better error handling and timeout
export const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), baseConfig.timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please check your connection');
    }
    throw error;
  }
};

// Common utility functions
export const apiUtils = {
  // User type detection
  getUserType: (email) => {
    if (!email) return 'unknown';
    if (email.endsWith('@lamduan.mfu.ac.th')) return 'student';
    if (email.endsWith('@mfu.ac.th')) return 'staff';
    return 'unknown';
  },

  // Build query parameters
  buildParams: (params = {}) => {
    return new URLSearchParams({
      'populate': '*',
      ...params
    });
  },

  // Handle API response
  handleResponse: async (response) => {
    const data = await response.json();
    return data.data || data;
  },

  // Handle API error
  handleError: (error, context) => {
    console.error(`Error in ${context}:`, error);
    return null;
  }
};