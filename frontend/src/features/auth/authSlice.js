// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  role: localStorage.getItem("role") || null,
  token: localStorage.getItem("token") || null,
  email: localStorage.getItem("email") || null,
  customerCode: localStorage.getItem("customerCode") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, role, token, email, customerCode } = action.payload;
      state.user = user;
      state.role = role;
      state.token = token;
      state.email = email;
      state.customerCode = customerCode;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      localStorage.setItem("customerCode", customerCode);
    },
    setEmail: (state, action) => {
      state.email = action.payload;
      localStorage.setItem("email", action.payload);
    },
    setCustomerCode: (state, action) => {
      state.customerCode = action.payload;
      localStorage.setItem("customerCode", action.payload);
    },
    logout: state => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.email = null;
      state.customerCode = null;
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("customerCode");
    },
  },
});

export const { login, logout, setEmail, setCustomerCode } = authSlice.actions;

export default authSlice.reducer;
