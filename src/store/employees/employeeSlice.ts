/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

export interface Employee {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  position: string;
  department: string;
  isRemote?: boolean;
  role?: string;
  user?: string;
}

interface EmployeeState {
  employees: Employee[];
  employee: Employee | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  employee: null,
  isLoading: false,
  error: null,
};

export interface RegisterUserData {
  email: string;
  password: string;
  role: string;
}

export interface CreateEmployeeData {
  name: string;
  department: string;
  position: string;
  user: string;
  isRemote?: boolean;
}


export const registerUser = createAsyncThunk(
  'employees/registerUser',
  async (userData: RegisterUserData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to register user');
    }
  }
);


export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData: CreateEmployeeData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/employees', employeeData);
      toast.success('Employee created successfully');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create employee');
    }
  }
);


export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, data }: { id: string; data: Partial<Employee> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/employees/${id}`, data);
      toast.success('Employee updated successfully');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
    }
  }
);


export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/employees');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
    }
  }
);


export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchEmployeeById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/employees/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
        toast.error(action.payload as string);
      })      
      
      .addCase(createEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
            
      .addCase(updateEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.employees.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.employee?._id === action.payload._id) {
          state.employee = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
            
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
            
      .addCase(fetchEmployeeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export default employeeSlice.reducer;
