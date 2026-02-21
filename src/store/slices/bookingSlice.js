import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  bookings: [],
  loading: false,
  error: null
};

export const fetchAllBookings = createAsyncThunk(
  'adminBookings/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/bookings');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const updateStatus = createAsyncThunk(
  'adminBookings/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/bookings/${id}/status`, { status });
      return response.data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking status');
    }
  }
);

const bookingSlice = createSlice({
  name: 'adminBookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload._id ? action.payload : booking
        );
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default bookingSlice.reducer;
