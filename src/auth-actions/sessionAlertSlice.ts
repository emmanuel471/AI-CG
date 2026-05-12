import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SessionAlertState {
  visible: boolean;
  message: string;
}

const initialState: SessionAlertState = {
  visible: false,
  message: "",
};

const sessionAlertSlice = createSlice({
  name: "sessionAlert",
  initialState,
  reducers: {
    showSessionAlert(state, action: PayloadAction<string>) {
      state.visible = true;
      state.message = action.payload;
    },
    hideSessionAlert(state) {
      state.visible = false;
      state.message = "";
    },
  },
});

export const { showSessionAlert, hideSessionAlert } = sessionAlertSlice.actions;
export default sessionAlertSlice.reducer;