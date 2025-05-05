
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { registerUser, createEmployee } from '@/store/employees/employeeSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { fetchDepartments } from '@/store/evaluations/evaluationSlice';
import { Plus, X, ArrowLeft } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  password: string;
  position: string;
  department: string;
  isRemote: boolean;
}

const CreateEmployee = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAdmin, isManager } = useAuth();
  const { departments } = useAppSelector((state) => state.evaluations);
  const { isLoading } = useAppSelector((state) => state.employees);
  const [isRemote, setIsRemote] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

  React.useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const onSubmit = async (data: FormData) => {
    try {      
      const userResponse = await dispatch(registerUser({
        email: data.email,
        password: data.password,
        role: 'employee'
      })).unwrap();
      
      await dispatch(createEmployee({
        name: data.name,
        department: data.department,
        position: data.position,
        user: userResponse._id,
        isRemote
      })).unwrap();

      navigate('/employees');
    } catch (error) {
      console.error('Failed to create employee:', error);
    }
  };

  
  if (!isAdmin && !isManager) {
    navigate('/unauthorized');
    return null;
  }

  return (
    
      <div className="container mx-auto py-8 max-w-2xl animate-fade-in">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <CardTitle>Create New Employee</CardTitle>
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select onValueChange={(value) => setValue('department', value)}>
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
                      <Checkbox id="isRemote" checked={isRemote} onCheckedChange={(checked) => setIsRemote(!!checked)} />
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
                  {isLoading ? 'Creating...' : 'Create Employee'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    
  );
};

export default CreateEmployee;
