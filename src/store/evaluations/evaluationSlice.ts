/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

export interface Competency {
  competency: string;
  questions: string[];
  _id?: string;
}

export interface Evaluation {
  _id?: string;
  id?: string;
  name: string;
  department: string;
  evaluationType: 'self' | 'peer' | 'manager';
  competencies: Competency[];
  dueDate: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  _id: string;
  name: string;
  manager: {
    _id: string;
    email: string;
    role: string;
  };
  isActive: boolean;
}

export interface Feedback {
  id: string;
  evaluationId: string;
  fromEmployeeId: string;
  toEmployeeId: string;
  responses: {
    questionId: string;
    value: string | number;
  }[];
  submittedAt: string;
}

interface EvaluationState {
  evaluations: Evaluation[];
  evaluation: Evaluation | null;
  departments: Department[];
  employeeEvaluations: Evaluation[];
  feedbacks: Feedback[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EvaluationState = {
  evaluations: [],
  evaluation: null,
  departments: [],
  employeeEvaluations: [],
  feedbacks: [],
  isLoading: false,
  error: null,
};


export const fetchDepartments = createAsyncThunk(
  'evaluations/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/departments');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);


export const createEvaluation = createAsyncThunk(
  'evaluations/createEvaluation',
  async (evaluationData: Omit<Evaluation, 'id' | '_id'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/evaluations', evaluationData);
      toast.success('Evaluation created successfully');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create evaluation');
    }
  }
);


export const fetchEvaluations = createAsyncThunk(
  'evaluations/fetchEvaluations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/evaluations');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch evaluations');
    }
  }
);


export const fetchEvaluationById = createAsyncThunk(
  'evaluations/fetchEvaluationById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/evaluations/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch evaluation');
    }
  }
);


export const fetchEvaluationsByDepartment = createAsyncThunk(
  'evaluations/fetchEvaluationsByDepartment',
  async (departmentId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/evaluations/department/${departmentId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch department evaluations');
    }
  }
);


export const updateEvaluation = createAsyncThunk(
  'evaluations/updateEvaluation',
  async ({ id, data }: { id: string; data: Partial<Evaluation> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/evaluations/${id}`, data);
      toast.success('Evaluation updated successfully');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update evaluation');
    }
  }
);


export const submitFeedback = createAsyncThunk(
  'evaluations/submitFeedback',
  async (feedbackData: Omit<Feedback, 'id' | 'submittedAt'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/feedback', feedbackData);
      toast.success('Feedback submitted successfully');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit feedback');
    }
  }
);

const evaluationSlice = createSlice({
  name: 'evaluations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchDepartments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      
      
      .addCase(createEvaluation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEvaluation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.evaluations.push(action.payload);
      })
      .addCase(createEvaluation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      
      
      .addCase(fetchEvaluations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.evaluations = action.payload;
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      
      
      .addCase(fetchEvaluationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvaluationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.evaluation = action.payload;
      })
      .addCase(fetchEvaluationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      
      
      .addCase(fetchEvaluationsByDepartment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvaluationsByDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employeeEvaluations = action.payload;
      })
      .addCase(fetchEvaluationsByDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      
      
      .addCase(updateEvaluation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEvaluation.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.evaluations.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) {
          state.evaluations[index] = action.payload;
        }
        if (state.evaluation?._id === action.payload._id) {
          state.evaluation = action.payload;
        }
      })
      .addCase(updateEvaluation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      
      
      .addCase(submitFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks.push(action.payload);
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export default evaluationSlice.reducer;
