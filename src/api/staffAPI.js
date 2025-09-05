// staffAPI.js - Simplified staff-specific API methods

import { apiUtils } from './baseAPI';

export const staffAPI = {
  // Fetch basic staff data (simplified)
  async fetchStaffData(email) {
    try {
      // Validate staff email
      if (apiUtils.getUserType(email) !== 'staff') {
        throw new Error('Invalid staff email domain');
      }

      return {
        email,
        userType: 'staff',
        lastFetched: new Date().toISOString()
      };
    } catch (error) {
      apiUtils.handleError(error, 'fetchStaffData');
      return {
        email,
        userType: 'staff',
        error: error.message,
        lastFetched: new Date().toISOString()
      };
    }
  }
};