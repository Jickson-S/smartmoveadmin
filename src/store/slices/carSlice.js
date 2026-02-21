import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  cars: [],
  loading: false,
  error: null
};

export const fetchAllCars = createAsyncThunk('adminCars/fetchAllCars', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cars');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cars');
  }
});

export const addCar = createAsyncThunk('adminCars/addCar', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post('/cars', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.car;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add car');
  }
});

export const updateCar = createAsyncThunk(
  'adminCars/updateCar',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cars/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.car;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update car');
    }
  }
);

export const deleteCar = createAsyncThunk('adminCars/deleteCar', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/cars/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete car');
  }
});

const carSlice = createSlice({
  name: 'adminCars',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(fetchAllCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCar.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = [action.payload, ...state.cars];
      })
      .addCase(addCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = state.cars.map((car) =>
          car._id === action.payload._id ? action.payload : car
        );
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = state.cars.filter((car) => car._id !== action.payload);
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default carSlice.reducer;
