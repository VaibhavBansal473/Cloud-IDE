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
import { PlusCircle } from 'lucide-react';

export default function AdminAddProblem() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    statement: '',
    level: "EASY",
    visible: true,
    testcases: '',
    input: '',
    expectedOutput: '',
  });

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
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

    sampleInput: formData.input,

    sampleOutput: formData.expectedOutput,

    testCases: [
      {
        input: formData.input,
        output: formData.expectedOutput,
        hidden: false,
      },
    ],
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

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        eyebrow="Admin Dashboard"
        title="Add New Problem"
        description="Create a coding challenge with statement, visibility, sample input, and expected output."
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
              placeholder="# Problem Title

Write your problem description here using Markdown.

## Examples

### Example 1:
**Input:** example input
**Output:** example output
**Explanation:** explanation here"
              required
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="testcases">Sample Test Cases</Label>
              <Textarea
                id="testcases"
                value={formData.testcases}
                onChange={(e) =>
                  setFormData({ ...formData, testcases: e.target.value })
                }
                className="min-h-40 font-mono"
                placeholder="One test case per line
Example:
[2,7,11,15]
9"
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
                className="min-h-40 font-mono"
                placeholder="One test case per line
Example:
[2,7,11,15]
9
[3,2,4]
6"
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
                className="min-h-40 font-mono"
                placeholder="One output per line
Example:
[0,1]
[1,2]"
                required
              />
            </div>
          </div>

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
