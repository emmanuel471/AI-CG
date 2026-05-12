import { encryptData } from "@/lib/utils";
import { AnyAction } from "redux";
import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKENS_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, VERIFY_EMAIL_SUCCESS, REFRESH_TOKENS_FAILURE } from "./authActionTypes";
import { DecodedUser } from "@/types";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: string | null;  
}
export const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};


export const authReducer = (
  state: AuthState = initialState,
  action: AnyAction
): AuthState => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state };

    case VERIFY_EMAIL_SUCCESS:  
    case REFRESH_TOKENS_SUCCESS:
    case LOGIN_SUCCESS: {
      const user = jwtDecode<DecodedUser>(action.payload.data.idToken);

      return {
        ...state,
        accessToken: encryptData(action.payload.data.accessToken),
        refreshToken: encryptData(action.payload.data.refreshToken),
        user: encryptData(JSON.stringify(user)),
      };
    }

    case REFRESH_TOKENS_FAILURE:
    case LOGIN_FAILURE:
      return {
        ...state,
        accessToken: null,
        refreshToken: null,
        user: null,
      };

    default:
      return state;
  }
};