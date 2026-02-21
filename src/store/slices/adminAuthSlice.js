import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

const getStoredAdmin = () => {
  try {
    const raw = localStorage.getItem('adminUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialState = {
  admin: getStoredAdmin(),
  token: localStorage.getItem('adminToken') || null,
  loading: false,
  error: null
};

export const loginAdmin = createAsyncThunk(
  'adminAuth/loginAdmin',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', payload);
      const { token, user } = response.data;

      if (user.role !== 'admin') {
        return rejectWithValue('Access denied: admin role required');
      }

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));

      return { token, admin: user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Admin login failed');
    }
  }
);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    },
    clearAdminError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.admin = action.payload.admin;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logoutAdmin, clearAdminError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
