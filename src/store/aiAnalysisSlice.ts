import { createSlice, type UnknownAction } from "@reduxjs/toolkit";
import type { AIAnalysisResponse } from "@/types/AIAnalysisResponse";
import {
  GET_AI_ANALYSIS_REQUEST,
  GET_AI_ANALYSIS_SUCCESS,
  GET_AI_ANALYSIS_FAILURE,
  TRIGGER_AI_ANALYSIS_REQUEST,
  TRIGGER_AI_ANALYSIS_SUCCESS,
  TRIGGER_AI_ANALYSIS_FAILURE,
  LOGOUT,
} from "./authActionTypes";

export interface AIAnalysisState {
  data: AIAnalysisResponse | null;
  loading: boolean;
  error: string | null;
  triggering: boolean;
}

const initialState: AIAnalysisState = {
  data: null,
  loading: false,
  error: null,
  triggering: false,
};

const aiAnalysisSlice = createSlice({
  name: "aiAnalysis",
  initialState,
  reducers: {
    clearAnalysis: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(GET_AI_ANALYSIS_REQUEST, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GET_AI_ANALYSIS_SUCCESS, (state, action: UnknownAction) => {
        state.loading = false;
        state.data = (action.payload as any)?.data ?? null;
      })
      .addCase(GET_AI_ANALYSIS_FAILURE, (state, action: UnknownAction) => {
        state.loading = false;
        state.error = (action.payload as any)?.message ?? "Failed to load analysis";
      })
      .addCase(TRIGGER_AI_ANALYSIS_REQUEST, (state) => {
        state.triggering = true;
      })
      .addCase(TRIGGER_AI_ANALYSIS_SUCCESS, (state) => {
        state.triggering = false;
      })
      .addCase(TRIGGER_AI_ANALYSIS_FAILURE, (state) => {
        state.triggering = false;
      })
      .addCase(LOGOUT, () => initialState);
  },
});

export const { clearAnalysis } = aiAnalysisSlice.actions;

export default aiAnalysisSlice.reducer;
