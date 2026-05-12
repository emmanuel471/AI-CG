import { store } from "@/store/store";
import { showSessionAlert } from "./sessionAlertSlice";
import { LoginRequest, ProfileRequest, RegisterRequest } from "@/types";
import { REGISTER_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, VERIFY_EMAIL_REQUEST, VERIFY_EMAIL_SUCCESS, VERIFY_EMAIL_FAILURE, RESEND_FAILURE, RESEND_REQUEST, RESEND_SUCCESS, USER_PROFILE_SUCCESS, USER_PROFILE_FAILURE, USER_PROFILE_REQUEST, REFRESH_TOKENS_SUCCESS, REFRESH_TOKENS_REQUEST, REFRESH_TOKENS_FAILURE, UPDATE_PROFILE_FAILURE, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, UPLOAD_PROFILE_PICTURE_FAILURE, UPLOAD_PROFILE_PICTURE_REQUEST, UPLOAD_PROFILE_PICTURE_SUCCESS, GET_AI_ANALYSIS_FAILURE, GET_AI_ANALYSIS_REQUEST, GET_AI_ANALYSIS_SUCCESS, TRIGGER_AI_ANALYSIS_SUCCESS, TRIGGER_AI_ANALYSIS_FAILURE, TRIGGER_AI_ANALYSIS_REQUEST } from "@/store/authActionTypes";
import { API_ENDPOINTS } from "@/config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function handle401(response: Response, skip401Handler: boolean = false) {
  if (response.status === 401 && !skip401Handler) {
    store.dispatch(
      showSessionAlert(
        "Your session is about to expire. Continue your session to stay signed in."
      )
    );
  }
}

// responds with void
export const triggerAIAnalysis = (userId: string, accessToken: string) => {
  return makeApiCall(
    `${API_ENDPOINTS.TRIGGER_AI_ANALYSIS}/${userId}/analysis/trigger`,
    "POST",
    null,
    TRIGGER_AI_ANALYSIS_SUCCESS,
    TRIGGER_AI_ANALYSIS_FAILURE,
    false,
    TRIGGER_AI_ANALYSIS_REQUEST,
    accessToken,
    false
  );
};

// responds with AIAnalysisResponse
export const getAIAnalysis = (userId: string, accessToken: string) => {
  return makeApiCall(
    `${API_ENDPOINTS.GET_AI_ANALYSIS}/${userId}/analysis`,
    "GET",
    null,
    GET_AI_ANALYSIS_SUCCESS,
    GET_AI_ANALYSIS_FAILURE,
    false,
    GET_AI_ANALYSIS_REQUEST,
    accessToken,
    false
  );
};

// responds with ProfileResponse
export const uploadProfilePicture = (userId: string,file: File,accessToken: string) => {
  const formData = new FormData();
  formData.append("file", file);

  return makeApiCall(
    `${API_ENDPOINTS.UPLOAD_PROFILE_PICTURE}/${userId}/profile-picture`,
    "POST",
    formData,
    UPLOAD_PROFILE_PICTURE_SUCCESS,
    UPLOAD_PROFILE_PICTURE_FAILURE,
    true, 
    UPLOAD_PROFILE_PICTURE_REQUEST,
    accessToken,
    false
  );
}

//responds with ProfileResponse
export const updateProfile = (userId: string,payload: ProfileRequest,accessToken: string) => {
  return makeApiCall(
    `${API_ENDPOINTS.UPDATE_PROFILE}/${userId}/profile`,
    "PUT",
    payload,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE,
    false,
    UPDATE_PROFILE_REQUEST,
    accessToken,
    false
  );
};

// responds with UserProfileResponse
export const getUserById = (id: string, accessToken: string) => {
  return makeApiCall(
    `${API_ENDPOINTS.GET_USER}/${id}`,
    "GET",
    null,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAILURE,
    false,
    USER_PROFILE_REQUEST,
    accessToken,
    false
  );
};

export const resendVerification = (email: string) => {
  return makeApiCall(
    `${API_ENDPOINTS.RESEND_VERIFICATION}?email=${encodeURIComponent(email)}`,
    "POST",
    null,
    RESEND_SUCCESS,
    RESEND_FAILURE,
    false,
    RESEND_REQUEST,
    undefined,
    true
  );
};

export const verifyEmail = (email: string, code: string) => {
  return makeApiCall(
    `${API_ENDPOINTS.VERIFY_EMAIL}?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
    "POST",
    null,
    VERIFY_EMAIL_SUCCESS,
    VERIFY_EMAIL_FAILURE,
    false,
    VERIFY_EMAIL_REQUEST,
    undefined,
    true
  );
};

export const refreshTokens = (refreshToken: string) => {
  return makeApiCall(
    `${API_ENDPOINTS.REFRESH_TOKENS}?refreshToken=${encodeURIComponent(refreshToken)}`,
    "POST",
    null,
    REFRESH_TOKENS_SUCCESS,
    REFRESH_TOKENS_FAILURE,
    false,
    REFRESH_TOKENS_REQUEST,
    undefined,
    true
  );
};

export const login = (payload: LoginRequest) => {
  return makeApiCall(
    `${API_ENDPOINTS.LOGIN}`,
    "POST",
    payload,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    false,
    LOGIN_REQUEST,
    undefined,
    true  
  );
};

export const register = (payload: RegisterRequest) => {
  return makeApiCall(
    `${API_ENDPOINTS.REGISTER}`,
    "POST",
    payload,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    false,
    REGISTER_REQUEST,
    undefined,
    true
  );
};


export const makeApiCall = (
  endpoint: string,
  method: HttpMethod,
  data: any,
  successType: string,
  failureType: string,
  isAttachment: boolean = false,
  requestType: string | null = null,
  Token?: string,
  skip401Handler: boolean = false
) => {
  let headers: Record<string, string> = {};
  
    headers = {
      Authorization: Token ? `Bearer ${Token}` : "",
    };

    if (!isAttachment) {
    headers["Content-Type"] = "application/json";
    }
  return async (dispatch:any) => {
    try {
      if (requestType) dispatch({ type: requestType });

      const response = await fetch(endpoint, {
        method: method,
        headers: headers,
        body:
          method === "GET" ? null : isAttachment ? data : JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        dispatch(requestSuccess(successType, responseData));
        return responseData;
      } else {
        if (response.status === 401) handle401(response, skip401Handler);;
        const errorData = (await response.json()) || {
          message: "No JSON response body available",
        };
        dispatch(requestFailure(failureType, errorData));
        throw errorData;
      }
    } catch (error) {
      dispatch(requestFailure(failureType, error));
      throw error;
    }
  };
};

export const requestSuccess = (type: string, payload: any) => {
  return {
    type,
    payload,
  };
};

export const requestFailure = (type: string, error : any) => {
  return {
    type: type,
    payload: error,
  };
};
