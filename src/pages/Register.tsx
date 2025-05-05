
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { registerUser } from '@/store/auth/authSlice';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

type FormData = {
  name: string;
  email: string;
  password: string;
  role: string;
  position: string;
  department: string;
};

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

  const { departments } = useAppSelector((state) => state.evaluations);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await dispatch(registerUser(data)).unwrap();
      navigate('/employees');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
      <div className="w-full max-w-2xl mx-auto py-8 animate-fade-in">
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Register New User</CardTitle>
            <CardDescription>Create a new user account for an employee</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select onValueChange={(value) => setValue('role', value)}>
                    <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)} 
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary-blue hover:bg-primary-dark" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    
  );
}
