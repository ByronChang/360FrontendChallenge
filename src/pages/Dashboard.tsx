
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, Users, CheckCircle, BarChart3, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchEmployees } from '@/store/employees/employeeSlice';
import { Evaluation, fetchDepartments, fetchEvaluations } from '@/store/evaluations/evaluationSlice';
import { fetchEvaluationRecordsByDepartment } from '@/store/evaluation-records/evaluationRecordSlice';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [evaluationsList, setEvaluationsList]=useState<Evaluation[]>([])

  const { evaluations } = useAppSelector((state) => state.evaluations);
  const { employees } = useAppSelector((state) => state.employees);
  const { departments } = useAppSelector((state) => state.evaluations);
  const { departmentRecords } = useAppSelector((state) => state.evaluationRecords);
  
  const activeEvaluationsCount = evaluations?.filter(e => e.published === true).length || 0;
  const completedEvaluationsCount = departmentRecords?.filter(e => e.completed === true).length || 0;
  const completedEvaluationsCountManager = departmentRecords?.filter(e => e.completed === true).length || 0;
  const employeesCount = employees?.length || 0;
  const curEmployee = employees?.filter(e => e.user === user.id);
  
  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchEmployees());
    dispatch(fetchEvaluations());
  }, [dispatch]);  
  
  useEffect(() => {
    const fetchDepartmentData = (departmentId:string) => {
        if (departmentId) {
            evalFilter(departmentId);
            dispatch(fetchEvaluationRecordsByDepartment(departmentId));
        }
    };

    if (user?.role === "Manager") {
        const curDeptmnt = departments?.find(d => d.manager._id === user?.id);
        fetchDepartmentData(curDeptmnt?._id);
    } else if (curEmployee.length > 0) {
        const curDeptmnt = departments?.find(d => d._id === curEmployee[0]?.department);
        fetchDepartmentData(curDeptmnt?._id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [departments]);


  const evalFilter=(departmentId:string)=>{    
    const evalsList = evaluations?.filter(e => (e.department === departmentId) && e.published === true);
    setEvaluationsList(evalsList)
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{user?.role} Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}. Here's what's happening.</p>
      </div>

    {(curEmployee.length > 0) ? 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {evaluationsList.length > 0 ? (
          evaluationsList.map((e,index) =>{
            return <Card key={"ev-"+index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/evaluation-records/create/'+e._id)}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{e.name}</CardTitle>
                <User className="h-5 w-5 text-primary-blue" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold"></div>
                <p className="capitalize text-xs text-gray-500">{e.evaluationType} Evaluation</p>
              </CardContent>
            </Card>
          })
        ):( null )
        }
      </div>
    : <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card key={"card-"+1} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">All Published Evaluations</CardTitle>
              <CalendarClock className="h-5 w-5 text-primary-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEvaluationsCount}</div>
              <p className="text-xs text-gray-500">In progress</p>
            </CardContent>
          </Card>
          <Card key={"card-"+2} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-5 w-5 text-accent-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.role==="Manager" ? completedEvaluationsCountManager : completedEvaluationsCount}</div>
              <p className="text-xs text-gray-500">Evaluations completed</p>
            </CardContent>
          </Card>
          <Card key={"card-"+3} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Employees</CardTitle>
              <Users className="h-5 w-5 text-secondary-slate" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeesCount}</div>
              <p className="text-xs text-gray-500">Total team members in Company.</p>
            </CardContent>
          </Card>
          <Card key={"card-"+4} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
              <BarChart3 className="h-5 w-5 text-primary-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedEvaluationsCount}</div>
              <p className="text-xs text-gray-500">Available reports</p>
            </CardContent>
          </Card>
        </div>
        {user?.role === "Manager" && <div className='my-4'>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{user?.role} Evaluations</h1>
          <p className="text-gray-500">List of evaluations you must complete.</p>
        </div>}
        {user?.role === "Manager" && 
          evaluationsList.length > 0 ? (
            evaluationsList.map((e,index) =>
              (<div key={`manager-eval-${index}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/evaluation-records/create/'+e._id)}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{e.name}</CardTitle>
                    <User className="h-5 w-5 text-primary-blue" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold"></div>
                    <p className="capitalize text-xs text-gray-500">{e.evaluationType} Evaluation</p>
                  </CardContent>
                </Card>
              </div>)
            )
          ):( null )          
        }
      </div>
    }
     
    </div>
  );
}
