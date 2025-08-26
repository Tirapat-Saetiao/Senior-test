// apiService.js - Main API service that combines all APIs

import { baseConfig, fetchWithTimeout, apiUtils } from './baseAPI';
import { studentAPI } from './studentAPI';
import { staffAPI } from './staffAPI';

// Main API service
export const apiService = {
  // User utilities
  getUserType: apiUtils.getUserType,

  // Student API methods
  student: studentAPI,

  // Staff API methods  
  staff: staffAPI,

  // Common methods (shared between student and staff)
  async fetchCommonData() {
    try {
      const [articlesResponse, toolsResponse] = await Promise.allSettled([
        fetchWithTimeout(`${baseConfig.baseURL}/articles?${apiUtils.buildParams().toString()}`),
        fetchWithTimeout(`${baseConfig.baseURL}/tools?${apiUtils.buildParams({'filters[publicAccess][$eq]': 'true'}).toString()}`)
      ]);
      
      const articles = articlesResponse.status === 'fulfilled' 
        ? await apiUtils.handleResponse(articlesResponse.value) 
        : [];
      
      const tools = toolsResponse.status === 'fulfilled' 
        ? await apiUtils.handleResponse(toolsResponse.value) 
        : [];
      
      return { 
        articles: Array.isArray(articles) ? articles : [], 
        tools: Array.isArray(tools) ? tools : []
      };
    } catch (error) {
      apiUtils.handleError(error, 'fetchCommonData');
      return { articles: [], tools: [] };
    }
  },

  // Main method that routes to appropriate API based on user type
  async fetchUserData(email) {
    const userType = this.getUserType(email);
    
    try {
      switch (userType) {
        case 'student':
          return {
            type: 'student',
            data: await this.student.fetchStudentData(email)
          };
        case 'staff':
          return {
            type: 'staff',
            data: await this.staff.fetchStaffData(email)
          };
        default:
          throw new Error('Invalid email domain');
      }
    } catch (error) {
      return {
        type: userType,
        data: null,
        error: error.message
      };
    }
  },

  // Generic fetch method for custom endpoints
  async fetchData(endpoint, params = {}) {
    try {
      const queryString = apiUtils.buildParams(params).toString();
      const url = `${baseConfig.baseURL}/${endpoint}?${queryString}`;
      
      const response = await fetchWithTimeout(url);
      return await apiUtils.handleResponse(response);
    } catch (error) {
      return apiUtils.handleError(error, `fetchData from ${endpoint}`);
    }
  },

  // Authenticated requests
  async fetchAuthenticatedData(endpoint, token, params = {}) {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }

      const queryString = apiUtils.buildParams(params).toString();
      const url = `${baseConfig.baseURL}/${endpoint}?${queryString}`;
      
      const response = await fetchWithTimeout(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return await apiUtils.handleResponse(response);
    } catch (error) {
      return apiUtils.handleError(error, `fetchAuthenticatedData from ${endpoint}`);
    }
  },

  // Backward compatibility methods (legacy support)
  async fetchStudentData(email) {
    return this.student.fetchStudentData(email);
  },

  async fetchPostsData() {
    return this.student.fetchPostsData();
  },

  async fetchStaffData(email) {
    return this.staff.fetchStaffData(email);
  }
};