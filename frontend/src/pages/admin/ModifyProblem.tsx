import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';

const mockProblem = {
  id: '',
  name: '',
  level: '',
  problemStatement: '',
  visible: true,
  adminId: '000',
  testCases: '',
  input: '',
  expectedOutput: '',
};

export default function AdminModifyProblem() {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const [formData, setFormData] = useState(mockProblem);

  useEffect(() => {
    const getProblem = async () => {
      try {
        const response = await axios.get<{
          id: string;
          visible: boolean;
          adminId: string;
          expectedOutput: string;
          problemStatement: string;
          testCases: string;
          input: string;
          level: string;
          name: string;
        }>(`http://localhost:8000/api/admin/problem/${problemId}`, {
          withCredentials: true,
        });

        const problem = response.data;

        if (!problem) {
          toast.error('Something went wrong while fetching the problem');
          navigate('/admin/problems');
        }

        setFormData(problem);
      } catch (error) {
        toast.error('Something went wrong');
        navigate('/admin/problems');
      }
    };

    getProblem();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.patch(
      `http://localhost:8000/api/admin/problem/${problemId}/update`,
      {
        visible: formData.visible,
        name: formData.name,
        testCases: formData.testCases,
        expectedOutput: formData.expectedOutput,
        input: formData.input,
        level: formData.level, // Include the level field in the request
      },
      {
        withCredentials: true,
      }
    );
    toast.success('Problem updated successfully');
    navigate('/admin/problems');
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/admin/problem/${problemId}/delete`,
        { withCredentials: true }
      );
      toast.success('Problem deleted successfully');
      navigate('/admin/problems');
    } catch (error) {
      toast.error('Could not delete the problem');
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <Card className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Modify Problem</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="statement">Problem Statement (Markdown)</Label>
            <Textarea
              id="statement"
              value={formData.problemStatement}
              onChange={(e) =>
                setFormData({ ...formData, problemStatement: e.target.value })
              }
              className="min-h-[300px] font-mono"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="visible"
              checked={formData.visible}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, visible: checked })
              }
            />
            <Label htmlFor="visible">Visible to users</Label>
          </div>

          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <div className="flex space-x-4">
              {['easy', 'medium', 'hard'].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`level-${level}`}
                    name="level"
                    value={level}
                    checked={formData.level === level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor={`level-${level}`} className="cursor-pointer">
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testcases">Sample Test Cases</Label>
            <Textarea
              id="testcases"
              value={formData.testCases}
              onChange={(e) =>
                setFormData({ ...formData, testCases: e.target.value })
              }
              className="font-mono"
              placeholder="One test case per line"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="input">Input Test Cases</Label>
            <Textarea
              id="input"
              value={formData.input}
              onChange={(e) =>
                setFormData({ ...formData, input: e.target.value })
              }
              className="font-mono"
              placeholder="One test case per line"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedOutput">Expected Output</Label>
            <Textarea
              id="expectedOutput"
              value={formData.expectedOutput}
              onChange={(e) =>
                setFormData({ ...formData, expectedOutput: e.target.value })
              }
              className="font-mono"
              placeholder="One output per line"
              required
            />
          </div>

          <div className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Problem</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    problem and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
