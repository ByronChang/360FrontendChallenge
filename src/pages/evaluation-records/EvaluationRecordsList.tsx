
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchDepartments } from '@/store/evaluations/evaluationSlice';
import { fetchEvaluationRecordsByDepartment } from '@/store/evaluation-records/evaluationRecordSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { FileText, BarChart } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const EvaluationRecordsList = () => {
  const dispatch = useAppDispatch();  
  const { departments } = useAppSelector((state) => state.evaluations);
  const { departmentRecords, isLoading } = useAppSelector((state) => state.evaluationRecords);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  
  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);
  
  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    dispatch(fetchEvaluationRecordsByDepartment(departmentId));
  };
  
  const prepareChartData = () => {
    if (!departmentRecords.length) return [];
    
    const aggregatedData: Record<string, { competency: string, average: number }> = {};
    
    departmentRecords.forEach(record => {
      (record.results || []).forEach(result => {
        if (!aggregatedData[result.competency]) {
          aggregatedData[result.competency] = {
            competency: result.competency,
            average: 0
          };
        }
        aggregatedData[result.competency].average += result.average || 0;
      });
    });
    
    
    Object.keys(aggregatedData).forEach(key => {
      aggregatedData[key].average = aggregatedData[key].average / departmentRecords.length;
    });
    
    return Object.values(aggregatedData);
  };
  
  const chartData = prepareChartData();

  return (
    
      <div className="container mx-auto py-8 animate-fade-in">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <CardTitle>Evaluation Records</CardTitle>
            </div>            
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="w-full md:w-1/3">
                <Select
                  onValueChange={handleDepartmentChange}
                  value={selectedDepartment}
                >
                  <SelectTrigger>
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
              </div>
              
              {isLoading ? (
                <div className="flex justify-center p-4">Loading records...</div>
              ) : (
                <>
                  {selectedDepartment && departmentRecords.length > 0 ? (
                    <div className="space-y-8">
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Evaluation</TableHead>
                              <TableHead>Evaluated Employee</TableHead>
                              <TableHead>Overall Score</TableHead>
                              <TableHead>Comments</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {departmentRecords.map((record) => (
                              <TableRow key={record._id}>
                                <TableCell className="font-medium">
                                  {record.evaluation}
                                </TableCell>
                                <TableCell>
                                  {record.evaluatedUser}
                                </TableCell>
                                <TableCell>
                                  {record.overallAverage?.toFixed(2)}
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                  {record.comments}
                                </TableCell>
                                <TableCell>
                                  {record.createdAt ? format(new Date(record.createdAt), 'MMM d, yyyy') : 'N/A'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      {departmentRecords.length > 0 && chartData.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <BarChart className="h-5 w-5" />
                            <h3 className="text-lg font-medium">Department Performance by Competency</h3>
                          </div>
                          
                          <div className="h-80">
                            <ChartContainer
                              config={{
                                average: { label: "Average Score" },
                              }}
                            >
                              <RechartsBarChart data={chartData}>
                                <XAxis dataKey="competency" />
                                <YAxis domain={[0, 5]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="average" fill="#8884d8" name="Average Score" />
                              </RechartsBarChart>
                            </ChartContainer>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {selectedDepartment ? 'No evaluation records found for this department' : 'Select a department to view evaluation records'}
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

export default EvaluationRecordsList;
