import { baseConfig, fetchWithTimeout, apiUtils } from './baseAPI';

// Helper function to fetch data from the API and handle response
const fetchAPIData = async (url, params = {}) => {
  try {
    const response = await fetchWithTimeout(`${url}?${apiUtils.buildParams(params).toString()}`);
    if (!response.ok) {
      throw new Error(`Error fetching data from ${url}: ${response.status} ${response.statusText}`);
    }
    return await apiUtils.handleResponse(response);
  } catch (error) {
    apiUtils.handleError(error, `fetchAPIData from ${url}`);
    throw error; // Propagate the error for further handling
  }
};

// Main API methods for student-related data
export const studentAPI = {
  // Fetch posts and codings concurrently
  async fetchPostsAndCodingsData() {
    const params = {
      'sort': 'publishedAt:desc',
      'populate': '*' // Optional, to populate related fields
    };

    // Use fetchAPIData to fetch both posts and codings concurrently
    try {
      const [postsData, codingsData] = await Promise.all([
        fetchAPIData(`${baseConfig.baseURL}/posts`, params),
        fetchAPIData(`${baseConfig.baseURL}/codings`, params)
      ]);
      return {
        posts: Array.isArray(postsData) ? postsData : [],
        codings: Array.isArray(codingsData) ? codingsData : []
      };
    } catch (error) {
      // Handle errors centrally and return default empty arrays in case of failure
      console.error('Error fetching posts and codings data:', error);
      return { posts: [], codings: [] };
    }
  },

  // Fetch student data including posts and codings
  async fetchStudentData(email) {
    // Validate student email domain
    if (apiUtils.getUserType(email) !== 'student') {
      throw new Error('Invalid student email domain');
    }

    try {
      // Fetch both posts and codings data concurrently
      const { posts, codings } = await this.fetchPostsAndCodingsData();

      return {
        email,
        userType: 'student',
        posts,
        codings,
        totalPosts: posts.length,
        totalCodings: codings.length,
        recentPosts: posts.slice(0, 5),
        recentCodings: codings.slice(0, 5),
        lastFetched: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching student data:', error);
      // Return default empty values if there's an error
      return {
        email,
        userType: 'student',
        posts: [],
        codings: [],
        totalPosts: 0,
        totalCodings: 0,
        recentPosts: [],
        recentCodings: [],
        error: error.message,
        lastFetched: new Date().toISOString()
      };
    }
  }
};
