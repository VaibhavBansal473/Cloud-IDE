import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { PageHeader } from '@/components/layout/PageHeader';
import { PlusCircle, Trash2 } from 'lucide-react';

type TestCaseForm = {
  input: string;
  output: string;
  hidden: boolean;
};

const emptyTestCase = (hidden: boolean): TestCaseForm => ({
  input: '',
  output: '',
  hidden,
});

export default function AdminAddProblem() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    statement: '',
    level: "EASY",
    visible: true,
    testCases: [emptyTestCase(false), emptyTestCase(true)],
  });

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

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    const sampleTestCases = formData.testCases.filter((testCase) => !testCase.hidden);

    try {
      setIsSubmitting(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/addProblem`,
        {
          visible: formData.visible,
          name: formData.title,
          level: formData.level.toUpperCase(),
          tags: ["implementation"],
          problemStatement: formData.statement,
          sampleInput: sampleTestCases[0]?.input ?? "",
          sampleOutput: sampleTestCases[0]?.output ?? "",
          testCases: formData.testCases,
        },
        {
          withCredentials: true,
        }
      );

      toast.success('Problem created successfully');
      navigate('/admin/problems');
    } catch (error) {
      toast.error("Could not create problem")
    } finally {
      setIsSubmitting(false);
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
          <div key={testCase.index} className="grid gap-4 border-t pt-4 md:grid-cols-[1fr_1fr_auto]">
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
        title="Add New Problem"
        description="Create a coding challenge with statement, visibility, samples, and hidden judge data."
      />

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Two Sum"
                required
              />
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
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
              <p className="mt-2 text-xs text-muted-foreground">
                Turn off to save this problem as an internal draft.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="statement">Problem Statement (Markdown)</Label>
            <Textarea
              id="statement"
              value={formData.statement}
              onChange={(e) =>
                setFormData({ ...formData, statement: e.target.value })
              }
              className="min-h-[300px] font-mono"
              required
            />
          </div>

          {renderTestCases(false)}
          {renderTestCases(true)}

          <div className="flex justify-end border-t pt-6">
            <Button type="submit" disabled={isSubmitting}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Problem"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
