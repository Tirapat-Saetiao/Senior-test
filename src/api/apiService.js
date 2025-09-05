// apiService.js - Simplified main API service

import { apiUtils } from './baseAPI';
import { studentAPI } from './studentAPI';
import { staffAPI } from './staffAPI';

// Main API service
export const apiService = {
  // User utilities
  getUserType: apiUtils.getUserType,

  // Student API methods
  student: studentAPI,

  // Staff API methods  
  staff: staffAPI
};