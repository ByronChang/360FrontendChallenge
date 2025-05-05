
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchEmployeeById, updateEmployee } from '@/store/employees/employeeSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { fetchDepartments } from '@/store/evaluations/evaluationSlice';
import { Edit, X, ArrowLeft } from 'lucide-react';

interface FormData {
  name: string;
  position: string;
  department: string;
  isRemote: boolean;
}

const EditEmployee = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAdmin, isManager } = useAuth();
  const { employee, isLoading } = useAppSelector((state) => state.employees);
  const { departments } = useAppSelector((state) => state.evaluations);
  const [isRemote, setIsRemote] = useState(false);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeById(id));
      dispatch(fetchDepartments());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name,
        position: employee.position,
        department: employee.department,
      });
      setIsRemote(employee.isRemote || false);
    }
  }, [employee, reset]);

  const onSubmit = async (data: FormData) => {
    if (id) {
      try {
        await dispatch(updateEmployee({
          id,
          data: {
            ...data,
            isRemote
          }
        })).unwrap();
        navigate('/employees');
      } catch (error) {
        console.error('Failed to update employee:', error);
      }
    }
  };

  
  if (!isAdmin && !isManager) {
    navigate('/unauthorized');
    return null;
  }

  if (isLoading) {
    return (      
        <div className="container mx-auto py-8 max-w-2xl">
          <Card>
            <CardContent className="flex justify-center p-6">
              Loading employee data...
            </CardContent>
          </Card>
        </div>      
    );
  }

  return (
    
      <div className="container mx-auto py-8 max-w-2xl animate-fade-in">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5" />
              <CardTitle>Edit Employee</CardTitle>
            </div>
            <Button variant="outline" size="icon" onClick={() => navigate('/employees')}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      {...register('name', { required: 'Full name is required' })}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      placeholder="Job Position"
                      {...register('position', { required: 'Position is required' })}
                      className={errors.position ? 'border-red-500' : ''}
                    />
                    {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      defaultValue={employee?.department}
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
                  <div className="space-y-2 flex items-end">
                    <div className="flex items-center space-x-2 h-10">
                      <Checkbox 
                        id="isRemote" 
                        checked={isRemote} 
                        onCheckedChange={(checked) => setIsRemote(!!checked)} 
                      />
                      <Label htmlFor="isRemote">Remote Employee</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => navigate('/employees')}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Employee'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    
  );
};

export default EditEmployee;
