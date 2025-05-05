
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Department, Evaluation, fetchDepartments, fetchEvaluations } from '@/store/evaluations/evaluationSlice';
import { Employee, fetchEmployees } from '@/store/employees/employeeSlice';
import { createEvaluationRecord, fetchEvaluationRecordsByDepartment, fetchEvaluationRecordsByEvaluationId } from '@/store/evaluation-records/evaluationRecordSlice';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, FileText, Info, X } from 'lucide-react';

interface FormData {
  evaluation: string;
  evaluatedUser: string;
  department: string;
  comments: string;
}

const CreateEvaluationRecord = () => {
  const { evaluationid } = useParams<{ evaluationid: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isManager, isAdmin, isEmployee } = useAuth();
  
  const { evaluations } = useAppSelector((state) => state.evaluations);  
  const { employees } = useAppSelector((state) => state.employees);
  const { isLoading } = useAppSelector((state) => state.evaluationRecords);
  const { departments } = useAppSelector((state) => state.evaluations);
  const { records } = useAppSelector((state) => state.evaluationRecords);

  const curEmployee = employees.length > 0 ? employees?.filter(e => e.user === user.id) : [];
  
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);
  const [currentDepartment, setCurrentDepartment] = useState<Department[]>([]);
  const [departmentEmployees, setDepartmentEmployees] = useState<Employee[]>([]);
  const [responses, setResponses] = useState<Record<string, number[]>>({});

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    dispatch(fetchEvaluations());
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if(evaluations.length > 0){
      dispatch(fetchEvaluationRecordsByEvaluationId(evaluationid))
      handleEvaluationChange(evaluationid)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluationid]);


  const handleEvaluationChange = (evaluationId: string) => {
    const selected:Evaluation = evaluations.find(e => e._id === evaluationId);
    setSelectedEvaluation(selected);
    setValue('evaluation', evaluationId);
    setValue('department', selected.department)
    const curDeptmnt=departments?.filter(d => d._id === selected?.department);
    setCurrentDepartment(curDeptmnt)
    
    const currentEmployee=curEmployee[0]

    if(currentEmployee !== undefined){
      const depEmployees = employees?.filter(e => (e.department === selected?.department) && e._id !== currentEmployee._id);
      setDepartmentEmployees(depEmployees)
    }else{
      const depEmployees = employees?.filter(e => (e.department === selected?.department) && e.user !== user.id);
      setDepartmentEmployees(depEmployees)
    }    

    const evType=selected?.evaluationType

    if(evType === "self"){
      if(currentEmployee !== undefined){
        setValue('evaluatedUser', currentEmployee?.user)
      }else{
        const curManagerId=curDeptmnt[0]?.manager._id;
        setValue('evaluatedUser', curManagerId)
      }      
    }else if(evType === "manager"){      
      const curManagerId=curDeptmnt[0]?.manager._id;
      setValue('evaluatedUser', curManagerId)
    }

    const initialResponses: Record<string, number[]> = {};
    selected?.competencies.forEach((comp: any) => {
      initialResponses[comp.competency] = comp.questions.map(() => 3);
    });
    setResponses(initialResponses);
  };

  const handleRatingChange = (competency: string, questionIndex: number, value: number) => {
    setResponses(prev => ({
      ...prev,
      [competency]: prev[competency].map((r, i) => i === questionIndex ? value : r)
    }));
  };

  const onSubmit = async (data: FormData) => {    
    if (!selectedEvaluation) return;

    const responsesArray = Object.keys(responses).map(competency => ({
      competency,
      responses: responses[competency]
    }));

    try {
      await dispatch(createEvaluationRecord({
        evaluation: data.evaluation,
        evaluatedUser: data.evaluatedUser,
        evaluator: user?.id,
        department: data.department,
        responses: responsesArray,
        comments: data.comments
      })).unwrap();
      navigate('/evaluation-records/create/'+evaluationid);
    } catch (error) {
      console.error('Failed to create evaluation record:', error);
    }
  };

  if (!isAdmin && !isManager && !isEmployee) {
    navigate('/unauthorized');
    return null;
  }

  const labelRating=(rating:number)=>{
    const RATING_LABELS={
      1: () => 'Inadecuado',
      2: () => 'Satisfactorio',
      3: () => 'Aceptable',
      4: () => 'Competente',
      5: () => 'Excepcional'
    }
    const label = RATING_LABELS[rating]()    
    return label
  }

  return (
    
      <div className="container mx-auto py-8 animate-fade-in">
        {records.some(e => e.evaluator === user?.id) ?
          <Card>
          <CardHeader className="flex flex-row items-center justify-between">
          <Info className="h-8 w-8" />
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5" />
              <CardTitle>Ya has respondido ésta evaluación.</CardTitle>
            </div>
            <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
        </Card>
         :
         <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Submit Evaluation</CardTitle>
            </div>
            <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="evaluation">Evaluation</Label>
                  <div><strong>{selectedEvaluation?.name}</strong></div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evaluatedUser">Evaluated Employee</Label>
                  {(selectedEvaluation?.evaluationType === "self" || selectedEvaluation?.evaluationType ==="manager") ? (
                    <div><strong className='capitalize'>{selectedEvaluation?.evaluationType}</strong></div>                    
                  ):(
                    <div>
                      <Select onValueChange={(value) => setValue('evaluatedUser', value)}>
                      <SelectTrigger className={errors.evaluatedUser ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentEmployees.map((employee) => (
                          <SelectItem key={employee.user} value={employee.user || ''}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                   
                     {errors.evaluatedUser && <p className="text-red-500 text-sm">{errors.evaluatedUser.message}</p>}
                    </div>
                  )
                  }
                  
                  
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <div><strong>{currentDepartment.length >0 && currentDepartment[0]?.name}</strong></div>                  
                </div>
              </div>

              {selectedEvaluation && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Evaluation Questions</h3>
                    
                    {selectedEvaluation.competencies.map((competency: any, cIndex: number) => (
                      <div key={cIndex} className="space-y-4">
                        <h4 className="font-medium text-md uppercase">{competency.competency}</h4>
                        
                        {competency.questions.map((question: string, qIndex: number) => (
                          <div key={qIndex} className="space-y-2">
                            <p className="text-sm">{question}</p>
                            <div className="flex space-x-2">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <Button
                                  key={rating}
                                  type="button"
                                  variant={
                                    responses[competency.competency] &&
                                    responses[competency.competency][qIndex] === rating
                                      ? "default"
                                      : "outline"
                                  }
                                  size="default"
                                  className="h-10"
                                  onClick={() => handleRatingChange(competency.competency, qIndex, rating)}
                                >
                                  {labelRating(rating)}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="comments">Additional Comments</Label>
                <Textarea
                  id="comments"
                  placeholder="Enter any additional comments about the employee's performance"
                  {...register('comments')}
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => navigate('/dashboard')}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !selectedEvaluation}>
                  {isLoading ? 'Submitting...' : 'Submit Evaluation'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        }
        
        
      </div>
    
  );
};

export default CreateEvaluationRecord;
