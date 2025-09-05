import { baseConfig, fetchWithTimeout, apiUtils } from './baseAPI';

// Simplified student API methods
export const studentAPI = {

  // Fetch posts and codings concurrently
  async fetchPostsAndCodingsData() {
    const params = {
      'sort': 'publishedAt:desc',
      'populate': '*'
    };

    try {
      const [postsResponse, researchResponse, codingsResponse] = await Promise.all([
        fetchWithTimeout(`${baseConfig.baseURL}/posts?${apiUtils.buildParams(params).toString()}`),
        fetchWithTimeout(`${baseConfig.baseURL}/researchs?${apiUtils.buildParams(params).toString()}`),
        fetchWithTimeout(`${baseConfig.baseURL}/codings?populate=*`)
      ]);
      
      const postsData = await apiUtils.handleResponse(postsResponse);
      const researchData = await apiUtils.handleResponse(researchResponse);
      const codingsData = await apiUtils.handleResponse(codingsResponse);
      
      return {
        posts: Array.isArray(postsData) ? postsData : [],
        research: Array.isArray(researchData) ? researchData : [],
        codings: Array.isArray(codingsData) ? codingsData : [],
      };
    } catch (error) {
      console.error('Error fetching posts, research, and codings data:', error);
      return { posts: [], research: [], codings: [] };
    }
  },

  // Fetch student data including posts, research, and codings
  async fetchStudentData(email) {
    // Validate student email domain
    if (apiUtils.getUserType(email) !== 'student') {
      throw new Error('Invalid student email domain');
    }

    try {
      const { posts, research, codings } = await this.fetchPostsAndCodingsData();

      return {
        email,
        userType: 'student',
        posts,
        research,
        codings,
        lastFetched: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching student data:', error);
      return {
        email,
        userType: 'student',
        posts: [],
        research: [],
        codings: [],
        error: error.message,
        lastFetched: new Date().toISOString()
      };
    }
  }
};
