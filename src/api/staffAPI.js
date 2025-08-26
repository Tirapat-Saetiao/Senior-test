// staffAPI.js - Staff-specific API methods

import { baseConfig, fetchWithTimeout, apiUtils } from './baseAPI';

export const staffAPI = {
  // Fetch staff profile information
  async fetchStaffProfile(email) {
    try {
      // Validate staff email
      if (apiUtils.getUserType(email) !== 'staff') {
        throw new Error('Invalid staff email domain');
      }

      const params = apiUtils.buildParams({
        'filters[email][$eq]': email
      });
      
      const response = await fetchWithTimeout(
        `${baseConfig.baseURL}/staff?${params.toString()}`
      );
      
      const data = await apiUtils.handleResponse(response);
      return Array.isArray(data) ? data[0] || null : data;
    } catch (error) {
      apiUtils.handleError(error, 'fetchStaffProfile');
      return null;
    }
  },

  // Fetch posts data for staff (may have different permissions)
  async fetchPostsData() {
    try {
      const params = apiUtils.buildParams({
        'sort': 'publishedAt:desc'
      });
      
      const response = await fetchWithTimeout(
        `${baseConfig.baseURL}/posts?${params.toString()}`
      );
      
      const data = await apiUtils.handleResponse(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      apiUtils.handleError(error, 'fetchStaffPostsData');
      return [];
    }
  },

  // Fetch staff-specific data
  async fetchStaffData(email) {
    try {
      const [profile, posts, workflows] = await Promise.allSettled([
        this.fetchStaffProfile(email),
        this.fetchPostsData(),
        this.fetchStaffWorkflows()
      ]);
      
      const profileData = profile.status === 'fulfilled' ? profile.value : null;
      const postsData = posts.status === 'fulfilled' ? posts.value : [];
      const workflowsData = workflows.status === 'fulfilled' ? workflows.value : [];
      
      return {
        email,
        userType: 'staff',
        profile: profileData,
        posts: postsData,
        workflows: workflowsData,
        totalPosts: postsData.length,
        lastFetched: new Date().toISOString()
      };
    } catch (error) {
      apiUtils.handleError(error, 'fetchStaffData');
      return {
        email,
        userType: 'staff',
        profile: null,
        posts: [],
        workflows: [],
        totalPosts: 0,
        error: error.message,
        lastFetched: new Date().toISOString()
      };
    }
  },

  // Fetch staff workflows and administrative tools
  async fetchStaffWorkflows() {
    try {
      const params = apiUtils.buildParams({
        'filters[staffOnly][$eq]': 'true',
        'sort': 'priority:desc'
      });
      
      const response = await fetchWithTimeout(
        `${baseConfig.baseURL}/workflows?${params.toString()}`
      );
      
      const data = await apiUtils.handleResponse(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      apiUtils.handleError(error, 'fetchStaffWorkflows');
      return [];
    }
  },

  // Fetch staff management resources
  async fetchStaffResources() {
    try {
      const [toolsResponse, workflowsResponse, reportsResponse] = await Promise.allSettled([
        fetchWithTimeout(`${baseConfig.baseURL}/tools?${apiUtils.buildParams({'filters[staffAccess][$eq]': 'true'}).toString()}`),
        fetchWithTimeout(`${baseConfig.baseURL}/workflows?${apiUtils.buildParams().toString()}`),
        fetchWithTimeout(`${baseConfig.baseURL}/reports?${apiUtils.buildParams().toString()}`)
      ]);
      
      const tools = toolsResponse.status === 'fulfilled' 
        ? await apiUtils.handleResponse(toolsResponse.value) 
        : [];
      
      const workflows = workflowsResponse.status === 'fulfilled' 
        ? await apiUtils.handleResponse(workflowsResponse.value) 
        : [];
      
      const reports = reportsResponse.status === 'fulfilled' 
        ? await apiUtils.handleResponse(reportsResponse.value) 
        : [];
      
      return {
        tools: Array.isArray(tools) ? tools : [],
        workflows: Array.isArray(workflows) ? workflows : [],
        reports: Array.isArray(reports) ? reports : []
      };
    } catch (error) {
      apiUtils.handleError(error, 'fetchStaffResources');
      return { tools: [], workflows: [], reports: [] };
    }
  },

  // Fetch student management data (for staff to manage students)
  async fetchStudentManagement() {
    try {
      const params = apiUtils.buildParams({
        'sort': 'createdAt:desc'
      });
      
      const response = await fetchWithTimeout(
        `${baseConfig.baseURL}/students?${params.toString()}`
      );
      
      const data = await apiUtils.handleResponse(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      apiUtils.handleError(error, 'fetchStudentManagement');
      return [];
    }
  },

  // Fetch analytics and reports for staff
  async fetchStaffAnalytics() {
    try {
      const params = apiUtils.buildParams({
        'sort': 'createdAt:desc'
      });
      
      const response = await fetchWithTimeout(
        `${baseConfig.baseURL}/analytics?${params.toString()}`
      );
      
      const data = await apiUtils.handleResponse(response);
      return data || null;
    } catch (error) {
      apiUtils.handleError(error, 'fetchStaffAnalytics');
      return null;
    }
  }
};