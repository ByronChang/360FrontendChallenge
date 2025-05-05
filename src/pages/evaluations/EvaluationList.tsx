
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchEvaluations, updateEvaluation } from '@/store/evaluations/evaluationSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Plus, Search, Edit, FileText, Check, X } from 'lucide-react';

const EvaluationList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAdmin, isManager } = useAuth();
  const { evaluations, isLoading } = useAppSelector((state) => state.evaluations);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchEvaluations());
  }, [dispatch]);

  const filteredEvaluations = evaluations.filter((evaluation) =>
    evaluation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePublish = async (id: string, published: boolean) => {
    try {
      await dispatch(updateEvaluation({
        id,
        data: { published: !published }
      })).unwrap();
    } catch (error) {
      console.error('Failed to update evaluation status:', error);
    }
  };

  return (
    
      <div className="container mx-auto py-8 animate-fade-in">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <CardTitle>Evaluations</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              {(isAdmin || isManager) && (
                <Button onClick={() => navigate('/evaluations/create')} className="flex items-center gap-1">
                  <Plus size={16} />
                  <span>Create Evaluation</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search evaluations..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isLoading ? (
                <div className="flex justify-center p-4">Loading evaluations...</div>
              ) : (
                <>
                  {filteredEvaluations.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No evaluations found
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[150px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEvaluations.map((evaluation) => (
                            <TableRow key={evaluation._id}>
                              <TableCell className="font-medium">{evaluation.name}</TableCell>
                              <TableCell>
                                <span className="capitalize">{evaluation.evaluationType}</span>
                              </TableCell>
                              <TableCell>
                                {format(new Date(evaluation.dueDate), 'MMM d, yyyy')}
                              </TableCell>
                              <TableCell>
                                <Badge variant={evaluation.published ? 'default' : 'outline'}>
                                  {evaluation.published ? 'Published' : 'Draft'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => navigate(`/evaluations/edit/${evaluation._id}`)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant={evaluation.published ? "destructive" : "default"}
                                    size="icon"
                                    onClick={() => handlePublish(evaluation._id || '', evaluation.published)}
                                  >
                                    {evaluation.published ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                  </Button>
                                </div>
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

export default EvaluationList;
