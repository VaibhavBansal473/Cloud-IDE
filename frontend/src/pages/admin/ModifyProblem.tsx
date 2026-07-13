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
import { PlusCircle, Save, Trash2 } from 'lucide-react';

type TestCaseForm = {
  id?: string;
  input: string;
  output: string;
  hidden: boolean;
};

type ProblemForm = {
  id: string;
  name: string;
  level: string;
  problemStatement: string;
  visible: boolean;
  tags: string[];
  sampleInput: string;
  sampleOutput: string;
  testCases: TestCaseForm[];
};

const emptyTestCase = (hidden: boolean): TestCaseForm => ({
  input: '',
  output: '',
  hidden,
});

const mockProblem: ProblemForm = {
  id: '',
  name: '',
  level: 'EASY',
  problemStatement: '',
  visible: true,
  tags: ["implementation"],
  sampleInput: "",
  sampleOutput: "",
  testCases: [emptyTestCase(false)],
};

export default function AdminModifyProblem() {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const [formData, setFormData] = useState<ProblemForm>(mockProblem);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getProblem = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ProblemForm>(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/problem/${problemId}`,
          {
            withCredentials: true,
          }
        );

        const problem = response.data;

        if (!problem) {
          toast.error('Something went wrong while fetching the problem');
          navigate('/admin/problems');
          return;
        }

        setFormData({
          ...problem,
          level: problem.level.toUpperCase(),
          testCases: problem.testCases.length ? problem.testCases : [emptyTestCase(false)],
        });
      } catch (error) {
        toast.error('Something went wrong');
        navigate('/admin/problems');
      } finally {
        setIsLoading(false);
      }
    };

    getProblem();
  }, [navigate, problemId]);

  const updateTestCase = (
    index: number,
    field: keyof TestCaseForm,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      testCases: current.testCases.map((testCase, testCaseIndex) =>
        testCaseIndex === index ? { ...testCase, [field]: value } : testCase
      ),
    }));
  };

  const addTestCase = (hidden: boolean) => {
    const limit = hidden ? 5 : 3;
    const count = formData.testCases.filter((testCase) => testCase.hidden === hidden).length;

    if (count >= limit) {
      toast.error(hidden ? "You can add up to 5 hidden test cases." : "You can add up to 3 sample test cases.");
      return;
    }

    setFormData((current) => ({
      ...current,
      testCases: [...current.testCases, emptyTestCase(hidden)],
    }));
  };

  const removeTestCase = (index: number) => {
    setFormData((current) => {
      const testCase = current.testCases[index];
      const sameTypeCount = current.testCases.filter((item) => item.hidden === testCase.hidden).length;

      if (!testCase.hidden && sameTypeCount === 1) {
        toast.error("At least one sample test case is required.");
        return current;
      }

      return {
        ...current,
        testCases: current.testCases.filter((_, testCaseIndex) => testCaseIndex !== index),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sampleTestCases = formData.testCases.filter((testCase) => !testCase.hidden);

    try {
      setIsSubmitting(true);
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/problem/${problemId}/update`,
        {
          visible: formData.visible,
          name: formData.name,
          level: formData.level.toUpperCase(),
          tags: formData.tags,
          problemStatement: formData.problemStatement,
          sampleInput: sampleTestCases[0]?.input ?? "",
          sampleOutput: sampleTestCases[0]?.output ?? "",
          testCases: formData.testCases.map(({ input, output, hidden }) => ({
            input,
            output,
            hidden,
          })),
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

  const renderTestCases = (hidden: boolean) => {
    const title = hidden ? "Hidden Test Cases" : "Sample Test Cases";
    const testCases = formData.testCases
      .map((testCase, index) => ({ ...testCase, index }))
      .filter((testCase) => testCase.hidden === hidden);

    return (
      <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <Label>{title}</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => addTestCase(hidden)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>

        {testCases.map((testCase, visibleIndex) => (
          <div key={testCase.id ?? testCase.index} className="grid gap-4 border-t pt-4 md:grid-cols-[1fr_1fr_auto]">
            <div className="space-y-2">
              <Label htmlFor={`${hidden ? "hidden" : "sample"}-input-${visibleIndex}`}>
                Input {visibleIndex + 1}
              </Label>
              <Textarea
                id={`${hidden ? "hidden" : "sample"}-input-${visibleIndex}`}
                value={testCase.input}
                onChange={(e) => updateTestCase(testCase.index, "input", e.target.value)}
                className="min-h-32 font-mono"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${hidden ? "hidden" : "sample"}-output-${visibleIndex}`}>
                Output {visibleIndex + 1}
              </Label>
              <Textarea
                id={`${hidden ? "hidden" : "sample"}-output-${visibleIndex}`}
                value={testCase.output}
                onChange={(e) => updateTestCase(testCase.index, "output", e.target.value)}
                className="min-h-32 font-mono"
                required
              />
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeTestCase(testCase.index)}
                aria-label="Remove test case"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        eyebrow="Admin Dashboard"
        title="Modify Problem"
        description="Update problem details, visibility, sample data, hidden data, or remove the challenge."
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
                {['EASY', 'MEDIUM', 'HARD'].map((level) => (
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
                      {level.charAt(0) + level.slice(1).toLowerCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {renderTestCases(false)}
          {renderTestCases(true)}

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
