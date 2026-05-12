const PROFILE_SERVICE_BASE_URL = "https://ai-cg-production.up.railway.app";
const AI_SERVICE_BASE_URL = "https://stunning-endurance-production-f7c3.up.railway.app";

export const API_ENDPOINTS = {
  GET_AI_ANALYSIS: `${AI_SERVICE_BASE_URL}/users`,
  TRIGGER_AI_ANALYSIS: `${AI_SERVICE_BASE_URL}/users`,
  REGISTER: `${PROFILE_SERVICE_BASE_URL}/users/register`,
  LOGIN: `${PROFILE_SERVICE_BASE_URL}/auth/login`,
  REFRESH_TOKENS: `${PROFILE_SERVICE_BASE_URL}/auth/refresh-tokens`,
  UPLOAD_PROFILE_PICTURE: `${PROFILE_SERVICE_BASE_URL}/users`,
  FORGOT_PASSWORD: `${PROFILE_SERVICE_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${PROFILE_SERVICE_BASE_URL}/auth/reset-password`,
  GET_USER: `${PROFILE_SERVICE_BASE_URL}/users`,
  UPDATE_PROFILE: `${PROFILE_SERVICE_BASE_URL}/users`,
  VERIFY_EMAIL: `${PROFILE_SERVICE_BASE_URL}/users/verify-email`,
  RESEND_VERIFICATION: `${PROFILE_SERVICE_BASE_URL}/users/resend-verification`, 
}; 