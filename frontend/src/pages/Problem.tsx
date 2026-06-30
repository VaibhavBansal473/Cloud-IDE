import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';



const languages = {
  javascript: {
    name: 'JavaScript',
    languageId: 63,
    template: '',
  },
  python: {
    name: 'Python',
    languageId: 71,
    template: '',
  },
  cpp: {
    name: 'C++',
    languageId: 54,
    template: '',
  },
  java: {
    name: 'Java',
    languageId: 62,
    template: '',
  },
  c: {
    name: 'C',
    languageId: 50,
    template: '',
  },
  ruby: {
    name: 'Ruby',
    languageId: 72,
    template: '',
  },
  rust: {
    name: 'Rust',
    languageId: 73,
    template: '',
  },
};


interface pollType {
  status: string;
  output: {
    time: string;
    memory: number;
    stdout: string;
  }
}


interface SubmitType {
  submissionId: string;
}

interface Problem {
  id: string;
  expectedOutput: string;
  problemStatement: string;
  testCases: string;
  input: string;
  level: string;
  name: string;
}

export default function Problem() {
  const { problemId } = useParams();
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem>({
    id: "",
    expectedOutput: "",
    problemStatement: "",
    testCases: "",
    input: "",
    level: "",
    name: "",
  });

  const [submissionStatus, setSubmissionStatus] = useState('');
  const [output, setOutput] = useState<{
    time: string;
    memory: number;
    stdout: string;
  }>({

    time: '',
    memory: 0,
    stdout: '',

  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('code');


  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setCode(languages[value as keyof typeof languages].template);
  };


  useEffect(() => {
    const getProblems = async () => {
      try {
        const res = await axios.get<Problem>(`http://localhost:8000/api/user/problem/${problemId}`, { withCredentials: true });
        setProblem(res.data);
      } catch (error) {
        toast.error("Something went wrong");
        navigate("/");
      }
    }
    getProblems();
  }, [])


  const pollSubmissionStatus = async (submissionId: string) => {
    const maxDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
    const startTime = Date.now();

    const interval = setInterval(async () => {
      const elapsed = Date.now() - startTime;

      // Stop polling after 5 minutes
      if (elapsed >= maxDuration) {
        clearInterval(interval);
        setIsLoading(false);
        setSubmissionStatus('timeout');
        setActiveTab('Submission');
        toast.error('Submission timed out.');
        return;
      }

      try {
        const statusRes = await axios.get<pollType>(`http://localhost:8000/api/user/status/${submissionId}`, {
          withCredentials: true
        });

        const status = statusRes.data.status;

        if (status !== 'pending') {
          clearInterval(interval);
          setIsLoading(false);
          setSubmissionStatus(status);
          setOutput(statusRes.data.output);
          setActiveTab('Submission');
        }

      } catch (err) {
        clearInterval(interval);
        setIsLoading(false);
        setSubmissionStatus('error');
        toast.error("Error fetching submission status.");
      }
    }, 2000); // Poll every 2 seconds
  };


  const handleSubmit = async () => {
  try {
    setIsLoading(true);
    setSubmissionStatus('pending');

    const languageId = languages[language as keyof typeof languages].languageId;

    const res = await axios.post<SubmitType>(
      `http://localhost:8000/api/user/submit/${problemId}`,
      {
        sourceCode: code,
        languageId,
      },
      { withCredentials: true }
    );

    const submissionId = res.data.submissionId;
    pollSubmissionStatus(submissionId);

  } catch (error) {
    setIsLoading(false);
    setSubmissionStatus('error');
    toast.error("An error occurred");
  }

  // console.log('Submitting code:', {
  //   language,
  //   languageId: languages[language as keyof typeof languages].languageId,
  //   code,
  // });
};


  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold">{problem.name}</h1>
          <div
            className="mt-4 prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: typeof marked === 'function' ? marked(problem.problemStatement) : problem.problemStatement }}
          />
        </Card>
      </div>

      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="Submission">Submission</TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="space-y-4 relative">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languages).map(([key, { name }]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative rounded-md border">
              <Editor
                height="60vh"
                language={language === 'cpp' ? 'cpp' : language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
              {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm text-white">
                  <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p>Running your code...</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isLoading}>
                <Play className="mr-2 h-4 w-4" />
                Run Code
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="Submission">
            <Card className="p-4 space-y-2">
              {!isLoading && submissionStatus ? (
                <>
                  <p className="text-lg font-semibold">
                    Result:{' '}
                    <span className={
                      submissionStatus === 'Accepted' ? 'text-green-600' :
                        submissionStatus === 'Wrong Answer' ? 'text-yellow-600' :
                          ['Compilation Error', 'Runtime Error (NZEC)', 'Rejected'].includes(submissionStatus)
                            ? 'text-red-600' : 'text-gray-600'
                    }>
                      {submissionStatus}
                    </span>
                  </p>
                  {output && (
                    <>
                      <p className="font-medium">Input:</p>
                      <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">{problem.input}</pre>

                      <p className="font-medium mt-4">Expected Output:</p>
                      <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">{problem.expectedOutput}</pre>

                      <p className="font-medium mt-4">Output:</p>
                      <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">{output.stdout}</pre>

                      <p className="mt-2">
                        <span className="font-semibold">Time:</span> {output.time} seconds
                      </p>
                      <p>
                        <span className="font-semibold">Memory:</span> {output.memory} KB
                      </p>
                    </>
                  )}
                </>
              ) : (
                <p>Submission result will be displayed here</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}