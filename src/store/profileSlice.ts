import { createSlice, type UnknownAction } from "@reduxjs/toolkit";
import type { UserResponse, ProfileResponse } from "@/types";
import {
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  UPLOAD_PROFILE_PICTURE_REQUEST,
  UPLOAD_PROFILE_PICTURE_SUCCESS,
  UPLOAD_PROFILE_PICTURE_FAILURE,
  LOGOUT,
} from "./authActionTypes";

export interface ProfileState {
  userProfile: UserResponse | null;
  profile: ProfileResponse | null;
  loading: boolean;
  saving: boolean;
  uploading: boolean;
}

const initialState: ProfileState = {
  userProfile: null,
  profile: null,
  loading: false,
  saving: false,
  uploading: false,
};

function toObj(val: unknown): Record<string, unknown> {
  return val !== null && typeof val === "object" ? (val as Record<string, unknown>) : {};
}

// Handles both { data: ProfileResponse } wrapper and direct ProfileResponse
function extractProfile(payload: unknown): ProfileResponse | null {
  const outer = toObj(payload);
  const p = toObj("data" in outer ? outer.data : payload);
  return "skills" in p ? (p as unknown as ProfileResponse) : null;
}

// Handles both { data: UserProfileResponse } wrapper and direct UserProfileResponse
function extractUserProfile(
  payload: unknown,
): { user: UserResponse; profile: ProfileResponse } | null {
  const outer = toObj(payload);
  const p = toObj("data" in outer ? outer.data : payload);
  return "user" in p ? (p as unknown as { user: UserResponse; profile: ProfileResponse }) : null;
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── getUserById ──────────────────────────────────────────────────────
      .addCase(USER_PROFILE_REQUEST, (state) => {
        state.loading = true;
      })
      .addCase(USER_PROFILE_SUCCESS, (state, action: UnknownAction) => {
        state.loading = false;
        const upr = extractUserProfile(action.payload);
        state.userProfile = upr?.user ?? null;
        state.profile = upr?.profile ?? null;
      })
      .addCase(USER_PROFILE_FAILURE, (state) => {
        state.loading = false;
      })

      // ── updateProfile ────────────────────────────────────────────────────
      .addCase(UPDATE_PROFILE_REQUEST, (state) => {
        state.saving = true;
      })
      .addCase(UPDATE_PROFILE_SUCCESS, (state, action: UnknownAction) => {
        state.saving = false;
        const pr = extractProfile(action.payload);
        if (pr) state.profile = pr;
      })
      .addCase(UPDATE_PROFILE_FAILURE, (state) => {
        state.saving = false;
      })

      // ── uploadProfilePicture ─────────────────────────────────────────────
      .addCase(UPLOAD_PROFILE_PICTURE_REQUEST, (state) => {
        state.uploading = true;
      })
      .addCase(UPLOAD_PROFILE_PICTURE_SUCCESS, (state, action: UnknownAction) => {
        state.uploading = false;
        const pr = extractProfile(action.payload);
        if (pr) state.profile = pr;
      })
      .addCase(UPLOAD_PROFILE_PICTURE_FAILURE, (state) => {
        state.uploading = false;
      })

      // ── logout clears profile ────────────────────────────────────────────
      .addCase(LOGOUT, () => initialState);
  },
});

export default profileSlice.reducer;
