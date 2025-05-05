/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchEvaluationById, updateEvaluation, fetchDepartments } from '@/store/evaluations/evaluationSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Edit, X, ArrowLeft, Plus } from 'lucide-react';

interface FormData {
  name: string;
  department: string;
  evaluationType: 'self' | 'peer' | 'manager';
  dueDate: string;
  published: boolean;
}

const competencyTypes = [
  { id: 'COMMUNICATION', label: 'Communication' },
  { id: 'TEAMWORK', label: 'Teamwork' },
  { id: 'LEADERSHIP', label: 'Leadership' },
  { id: 'TECHNICAL_SKILL', label: 'Technical Skill' },
  { id: 'ADAPTABILITY', label: 'Adaptability' },
];

const EditEvaluation = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAdmin, isManager } = useAuth();
  const { evaluation, departments, isLoading } = useAppSelector((state) => state.evaluations);
  
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedCompetencyIndex, setSelectedCompetencyIndex] = useState<number | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>();
  const published = watch('published', false);

  useEffect(() => {
    if (id) {
      dispatch(fetchEvaluationById(id));
      dispatch(fetchDepartments());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (evaluation) {
      setValue('name', evaluation.name);
      setValue('department', evaluation.department);
      setValue('evaluationType', evaluation.evaluationType);
      setValue('published', evaluation.published);
      
      // Format the date to YYYY-MM-DD for input[type=date]
      const dueDate = new Date(evaluation.dueDate);
      setValue('dueDate', format(dueDate, 'yyyy-MM-dd'));
      
      setCompetencies(evaluation.competencies || []);
    }
  }, [evaluation, setValue]);

  const handleAddQuestion = (competencyIndex: number) => {
    if (newQuestion.trim()) {
      const updatedCompetencies = [...competencies];
      updatedCompetencies[competencyIndex].questions.push(newQuestion);
      setCompetencies(updatedCompetencies);
      setNewQuestion('');
    }
  };

  const handleRemoveQuestion = (competencyIndex: number, questionIndex: number) => {
    const updatedCompetencies = [...competencies];
    updatedCompetencies[competencyIndex].questions.splice(questionIndex, 1);
    setCompetencies(updatedCompetencies);
  };

  const handleAddCompetency = () => {
    setCompetencies([
      ...competencies,
      { competency: 'COMMUNICATION', questions: [] }
    ]);
  };

  const handleRemoveCompetency = (index: number) => {
    const updatedCompetencies = [...competencies];
    updatedCompetencies.splice(index, 1);
    setCompetencies(updatedCompetencies);
  };

  const handleCompetencyTypeChange = (index: number, value: string) => {
    const updatedCompetencies = [...competencies];
    updatedCompetencies[index].competency = value;
    setCompetencies(updatedCompetencies);
  };

  const onSubmit = async (data: FormData) => {
    if (id) {
      try {
        await dispatch(updateEvaluation({
          id,
          data: {
            ...data,
            competencies
          }
        })).unwrap();
        navigate('/evaluations');
      } catch (error) {
        console.error('Failed to update evaluation:', error);
      }
    }
  };

  if (!isAdmin && !isManager) {
    navigate('/unauthorized');
    return null;
  }

  if (isLoading || !evaluation) {
    return (
      
        <div className="container mx-auto py-8">
          <Card>
            <CardContent className="flex justify-center p-6">
              Loading evaluation data...
            </CardContent>
          </Card>
        </div>      
    );
  }

  return (
    
      <div className="container mx-auto py-8 animate-fade-in">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5" />
              <CardTitle>Edit Evaluation</CardTitle>
            </div>
            <Button variant="outline" size="icon" onClick={() => navigate('/evaluations')}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Evaluation Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter evaluation name"
                    {...register('name', { required: 'Evaluation name is required' })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    defaultValue={evaluation.department}
                    onValueChange={(value) => setValue('department', value)}
                  >
                    <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department._id} value={department._id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evaluationType">Evaluation Type</Label>
                  <Select 
                    defaultValue={evaluation.evaluationType}
                    onValueChange={(value: 'self' | 'peer' | 'manager') => setValue('evaluationType', value)}
                  >
                    <SelectTrigger className={errors.evaluationType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select evaluation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Self-Evaluation</SelectItem>
                      <SelectItem value="peer">Peer Evaluation</SelectItem>
                      <SelectItem value="manager">Manager Evaluation</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.evaluationType && <p className="text-red-500 text-sm">{errors.evaluationType.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    {...register('dueDate', { required: 'Due date is required' })}
                    className={errors.dueDate ? 'border-red-500' : ''}
                  />
                  {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={(checked) => setValue('published', checked)}
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Competencies and Questions</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCompetency}
                    className="flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Competency
                  </Button>
                </div>

                {competencies.map((competency, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <Label htmlFor={`competency-${index}`}>Competency Type</Label>
                        <Select 
                          defaultValue={competency.competency}
                          onValueChange={(value) => handleCompetencyTypeChange(index, value)}
                        >
                          <SelectTrigger id={`competency-${index}`}>
                            <SelectValue placeholder="Select competency" />
                          </SelectTrigger>
                          <SelectContent>
                            {competencyTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {competencies.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveCompetency(index)}
                          className="ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Questions</Label>
                      <div className="space-y-2">
                        {competency.questions.map((question: string, qIndex: number) => (
                          <div key={qIndex} className="flex items-center gap-2">
                            <div className="flex-1 p-2 bg-gray-50 rounded border">
                              {question}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveQuestion(index, qIndex)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`new-question-${index}`}>Add Question</Label>
                        <Textarea
                          id={`new-question-${index}`}
                          placeholder="Enter new question"
                          value={selectedCompetencyIndex === index ? newQuestion : ''}
                          onChange={(e) => {
                            setSelectedCompetencyIndex(index);
                            setNewQuestion(e.target.value);
                          }}
                          rows={2}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleAddQuestion(index)}
                        disabled={!newQuestion.trim() || selectedCompetencyIndex !== index}
                      >
                        <Plus size={16} /> Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => navigate('/evaluations')}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Evaluation'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    
  );
};

export default EditEvaluation;
