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

export default function AdminAddProblem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    statement: '',
    level: "easy",
    visible: true,
    testcases: '',
    input: '',
    expectedOutput: '',
  });

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await axios.post("http://localhost:8000/api/admin/addProblem",{
        visible: formData.visible,
        name: formData.title,
        level: formData.level,
        problemStatement: formData.statement,
        testCases: formData.testcases,
        expectedOutput: formData.expectedOutput,
        input: formData.input 
      },{
        withCredentials: true
      })
      
      toast.success('Problem created successfully');
      navigate('/admin/problems');
    } catch (error) {
      toast.error("something went wrong")
    }
    
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <Card className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Add New Problem</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex items-center space-x-2">
            <Switch
              id="visible"
              checked={formData.visible}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, visible: checked })
              }
            />
            <Label htmlFor="visible">Make problem visible to users</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testcases">Sample Test Cases</Label>
            <Textarea
              id="testcases"
              value={formData.testcases}
              onChange={(e) =>
                setFormData({ ...formData, testcases: e.target.value })
              }
              className="font-mono"
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
              className="font-mono"
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
              className="font-mono"
              placeholder="One output per line
Example:
[0,1]
[1,2]"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Create Problem</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}