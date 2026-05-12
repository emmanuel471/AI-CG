import { configureStore, combineReducers, createSelector } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import sessionAlertReducer from "@/auth-actions/sessionAlertSlice";
import profileReducer, { type ProfileState } from "./profileSlice";
import aiAnalysisReducer, { type AIAnalysisState } from "./aiAnalysisSlice";
import { decryptData } from "@/lib/utils";
import { DecodedUser } from "@/types";
import { authReducer, AuthState } from "./authReducer";

const persistConfig = {
  key: "root",
  storage,
  // profile is intentionally excluded — always fetched fresh per session
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  sessionAlert: sessionAlertReducer,
  profile: profileReducer,
  aiAnalysis: aiAnalysisReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectAuthState = (state: RootState): AuthState => state.auth;
export const selectProfileState = (state: RootState): ProfileState => state.profile;
export const selectAIAnalysis = (state: RootState): AIAnalysisState => state.aiAnalysis;
export const selectAIAnalysisData = (state: RootState) => state.aiAnalysis.data;
export const selectAIAnalysisLoading = (state: RootState) => state.aiAnalysis.loading;
export const selectAIAnalysisError = (state: RootState) => state.aiAnalysis.error;
export const selectAIAnalysisTriggering = (state: RootState) => state.aiAnalysis.triggering;

export const selectDecryptedTokens = createSelector([selectAuthState], (auth) => ({
  accessToken: auth.accessToken ? decryptData(auth.accessToken) : null,
  refreshToken: auth.refreshToken ? decryptData(auth.refreshToken) : null,
}));

export const selectUser = (state: RootState): DecodedUser | null => {
  if (!state.auth.user) return null;
  try {
    return JSON.parse(decryptData(state.auth.user));
  } catch (err) {
    console.error("Failed to parse user", err);
    return null;
  }
};
