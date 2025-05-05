
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, BriefcaseBusiness, Shield } from 'lucide-react';
import { useAppSelector } from '@/lib/hooks';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Profile() {
  const { user } = useAuth();
  const { employees } = useAppSelector((state) => state.employees);  
  
  const employeeData = user && employees ? employees.find(e => e.user === user.id) : null;
  const getUserInitial = () => {
    if (user?.name && typeof user.name === 'string' && user.name.length > 0) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email && typeof user.email === 'string' && user.email.length > 0) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };
  
  const getRoleColor = () => {
    if (user?.role === 'Admin') return 'bg-red-100';
    if (user?.role === 'Manager') return 'bg-blue-100';
    return 'bg-green-100';
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 gap-6">    
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary-blue to-accent-teal" />
          <div className="relative px-6">
            <div className="absolute -top-16 flex items-center justify-center">
              <Avatar className="h-32 w-32 border-4 border-white">
                <AvatarFallback className="text-4xl bg-primary-blue text-white">
                  {getUserInitial()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="pt-20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'User'}</h2>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-600">{user?.email}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium mt-3 sm:mt-0 ${getRoleColor()}`}>
                  {user?.role}
                </div>
              </div>
            </div>
          </div>
          <CardContent className="pb-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Shield className="h-8 w-8 text-primary-blue mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">{user?.role}</p>
                </div>
              </div>
              
              {employeeData && (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <BriefcaseBusiness className="h-8 w-8 text-accent-teal mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-medium">{employeeData.position || 'Not specified'}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {employeeData && (
          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
              <CardDescription>Additional details about your position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Department</p>
                    <p className="mt-1">{employeeData.department || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Work Location</p>
                    <p className="mt-1">{employeeData.isRemote ? 'Remote' : 'On-site'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
