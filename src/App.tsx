
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./lib/store";
import { AuthProvider } from "./contexts/AuthContext";
import { MainLayout } from "./components/layouts/MainLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Profile from "./pages/Profile";

// Employee Pages
import EmployeeList from "./pages/employees/EmployeeList";
import CreateEmployee from "./pages/employees/CreateEmployee";
import EditEmployee from "./pages/employees/EditEmployee";

// Evaluation Pages
import EvaluationList from "./pages/evaluations/EvaluationList";
import CreateEvaluation from "./pages/evaluations/CreateEvaluation";
import EditEvaluation from "./pages/evaluations/EditEvaluation";

// Evaluation Records Pages
import EvaluationRecordsList from "./pages/evaluation-records/EvaluationRecordsList";
import CreateEvaluationRecord from "./pages/evaluation-records/CreateEvaluationRecord";

const queryClient = new QueryClient();

const App = () => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
              <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
              <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
              <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
              
              {/* Employee Routes */}
              <Route path="/employees" element={<MainLayout><EmployeeList /></MainLayout>} />
              <Route path="/employees/create" element={<MainLayout><CreateEmployee /></MainLayout>} />
              <Route path="/employees/edit/:id" element={<MainLayout><EditEmployee /></MainLayout>} />
              
              {/* Evaluation Routes */}
              <Route path="/evaluations" element={<MainLayout><EvaluationList /></MainLayout>} />
              <Route path="/evaluations/create" element={<MainLayout><CreateEvaluation /></MainLayout>} />
              <Route path="/evaluations/edit/:id" element={<MainLayout><EditEvaluation /></MainLayout>} />
              
              {/* Evaluation Records Routes */}
              <Route path="/reports" element={<MainLayout><EvaluationRecordsList /></MainLayout>} />
              <Route path="/evaluation-records/create/:evaluationid" element={<MainLayout><CreateEvaluationRecord /></MainLayout>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ReduxProvider>
);

export default App;
