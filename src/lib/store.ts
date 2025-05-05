
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/auth/authSlice';
import evaluationReducer from '../store/evaluations/evaluationSlice';
import employeeReducer from '../store/employees/employeeSlice';
import evaluationRecordReducer from '../store/evaluation-records/evaluationRecordSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    evaluations: evaluationReducer,
    employees: employeeReducer,
    evaluationRecords: evaluationRecordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
