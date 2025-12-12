import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  email: string | null;
  name: string | null;
  image: string | null;
  token: string | null; // ✅ store Google/Cognito token
  isAuthenticated: boolean;
  role?: "admin" | "customer" | null;
}

const initialState: AuthState = {
  email: null,
  name: null,
  image: null,
  token: null,
  isAuthenticated: false,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ called after login (Google or Cognito)
    login: (
      state,
      action: PayloadAction<{
        email: string;
        name: string;
        role: string;
        image?: string;
        token?: string;
      }>
    ) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.image = action.payload.image || null;
      state.token = action.payload.token || null;
      state.isAuthenticated = true;
      state.role = action.payload.role as "admin" | "customer";
    },

    // ✅ clear everything on logout
    logout: (state) => {
      state.email = null;
      state.name = null;
      state.image = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
