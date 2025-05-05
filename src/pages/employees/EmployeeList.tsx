
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchEmployees } from '@/store/employees/employeeSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search, Edit, Users } from 'lucide-react';

const EmployeeList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAdmin, isManager } = useAuth();
  const { employees, isLoading } = useAppSelector((state) => state.employees);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    
      <div className="container mx-auto py-8 animate-fade-in">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <CardTitle>Employees</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              {(isAdmin || isManager) && (
                <Button onClick={() => navigate('/employees/create')} className="flex items-center gap-1">
                  <Plus size={16} />
                  <span>Add Employee</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isLoading ? (
                <div className="flex justify-center p-4">Loading employees...</div>
              ) : (
                <>
                  {filteredEmployees.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No employees found
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Remote</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEmployees.map((employee) => (
                            <TableRow key={employee._id}>
                              <TableCell className="font-medium">{employee.name}</TableCell>
                              <TableCell>{employee.position}</TableCell>
                              <TableCell>{employee.department}</TableCell>
                              <TableCell>{employee.isRemote ? 'Yes' : 'No'}</TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => navigate(`/employees/edit/${employee._id}`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    
  );
};

export default EmployeeList;
