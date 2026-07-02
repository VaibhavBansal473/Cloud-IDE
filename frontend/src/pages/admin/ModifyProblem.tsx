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
import { PageHeader } from '@/components/layout/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Save } from 'lucide-react';

const mockProblem = {
  id: '',
  name: '',
  level: '',
  problemStatement: '',
  visible: true,
  adminId: '000',
  tags: ["implementation"],
  sampleInput: "",
  sampleOutput: "",
  testCases: [
    {
      input: "",
      output: "",
      hidden: false,
    },
  ],
};

export default function AdminModifyProblem() {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const [formData, setFormData] = useState(mockProblem);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getProblem = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{
          id: string;
          visible: boolean;
          adminId: string;
          problemStatement: string;
          tags: string[];
          sampleInput: string;
          sampleOutput: string;
          testCases: {
            input: string;
            output: string;
            hidden: boolean;
          }[];
          level: string;
          name: string;
        }>(`${import.meta.env.VITE_BACKEND_URL}/api/admin/problem/${problemId}`, {
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
      } finally {
        setIsLoading(false);
      }
    };

    getProblem();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/problem/${problemId}/update`,
        {
          visible: formData.visible,
          name: formData.name,
          testCases: formData.testCases,
          expectedOutput: formData.sampleOutput,
          input: formData.sampleInput,
          level: formData.level, // Include the level field in the request
        },
        {
          withCredentials: true,
        }
      );
      toast.success('Problem updated successfully');
      navigate('/admin/problems');
    } catch (error) {
      toast.error('Could not update problem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/problem/${problemId}/delete`,
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
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        eyebrow="Admin Dashboard"
        title="Modify Problem"
        description="Update problem details, visibility, test data, or remove the challenge."
      />

      {isLoading ? (
        <Card className="space-y-5 p-6 sm:p-8">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-72 w-full" />
          <div className="grid gap-4 lg:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </Card>
      ) : (
      <Card className="p-6 sm:p-8">
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

          <div className="grid gap-6 rounded-lg border bg-muted/20 p-4 sm:grid-cols-2">
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
              <div className="flex flex-wrap gap-4">
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
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="testcases">Sample Test Cases</Label>
            <Textarea
              id="testcases"
              value={formData.testCases.map(tc => `Input: ${tc.input}\nOutput: ${tc.output}\nHidden: ${tc.hidden}`).join('\n\n')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  testCases: [
                    {
                      input: e.target.value,
                      output: formData.testCases[0]?.output || "",
                      hidden: false,
                    },
                  ],
                })
              }
              className="min-h-40 font-mono"
              placeholder="One test case per line"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="input">Input Test Cases</Label>
            <Textarea
              id="input"
              value={formData.sampleInput}
              onChange={(e) =>
                setFormData({ ...formData, sampleInput: e.target.value })
              }
              className="min-h-40 font-mono"
              placeholder="One test case per line"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedOutput">Expected Output</Label>
            <Textarea
              id="expectedOutput"
              value={formData.sampleOutput}
              onChange={(e) =>
                setFormData({ ...formData, sampleOutput: e.target.value })
              }
              className="min-h-40 font-mono"
              placeholder="One output per line"
              required
            />
          </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
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

            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
      )}
    </div>
  );
}
