/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Employee';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', credentials);      
      
      const { access_token, user } = response.data.data;
      const decoded = jwtDecode(access_token);      
      const userId = decoded?.sub;      
      
      const processedUser: User = {
        id: userId || '',
        email: user.email,
        name: user.name || user.email,
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() as User['role']
      };
      
      localStorage.setItem('token', access_token);
      return { token: access_token, user: processedUser };
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      toast.success(`User ${userData.name} registered successfully`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
