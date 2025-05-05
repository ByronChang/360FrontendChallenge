/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface CompetencyResponse {
  competency: string;
  responses: number[];
  average?: number;
  _id?: string;
}

export interface EvaluationRecord {
  _id?: string;
  evaluation: string;
  evaluatedUser: string;
  evaluator?: string;
  department: string;
  results?: CompetencyResponse[];
  responses?: CompetencyResponse[];
  overallAverage?: number;
  comments: string;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface EvaluationRecordState {
  records: EvaluationRecord[];
  departmentRecords: EvaluationRecord[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EvaluationRecordState = {
  records: [],
  departmentRecords: [],
  isLoading: false,
  error: null,
};

export const createEvaluationRecord = createAsyncThunk(
  'evaluationRecords/createEvaluationRecord',
  async (recordData: Omit<EvaluationRecord, '_id'>, { rejectWithValue }) => {
    try {      
      const response = await api.post('/api/evaluation-records', recordData);
      toast.success('Evaluation record created successfully');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create evaluation record');
    }
  }
);

export const fetchEvaluationRecordsByDepartment = createAsyncThunk(
  'evaluationRecords/fetchEvaluationRecordsByDepartment',
  async (departmentId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/evaluation-records/department/${departmentId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch department evaluation records'
      );
    }
  }
);

export const fetchEvaluationRecordsByEvaluationId = createAsyncThunk(
  'evaluationRecords/fetchEvaluationRecordsByEvaluationId',
  async (evaluationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/evaluation-records/evaluation/${evaluationId}`);      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch evaluation record'
      );
    }
  }
);

const evaluationRecordSlice = createSlice({
  name: 'evaluationRecords',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createEvaluationRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEvaluationRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records.push(action.payload);
      })
      .addCase(createEvaluationRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      
      .addCase(fetchEvaluationRecordsByDepartment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvaluationRecordsByDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departmentRecords = action.payload;
      })
      .addCase(fetchEvaluationRecordsByDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(fetchEvaluationRecordsByEvaluationId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvaluationRecordsByEvaluationId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(fetchEvaluationRecordsByEvaluationId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export default evaluationRecordSlice.reducer;
