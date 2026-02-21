import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from './slices/adminAuthSlice';
import dashboardReducer from './slices/dashboardSlice';
import carReducer from './slices/carSlice';
import bookingReducer from './slices/bookingSlice';

const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    dashboard: dashboardReducer,
    cars: carReducer,
    bookings: bookingReducer
  }
});

export default store;
