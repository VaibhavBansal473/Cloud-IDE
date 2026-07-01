import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge} from "@/components/ui/badge";
import axios from 'axios';
import { toast } from 'sonner';
import { Play } from 'lucide-react';



const languages = {
  javascript: {
    name: "JavaScript",
    languageId: 63,
    template: "",
  },
  python: {
    name: "Python",
    languageId: 71,
    template: "",
  },
  cpp: {
    name: "C++",
    languageId: 54,
    template: "",
  },
  java: {
    name: "Java",
    languageId: 62,
    template: "",
  },
  c: {
    name: "C",
    languageId: 50,
    template: "",
  },
  ruby: {
    name: "Ruby",
    languageId: 72,
    template: "",
  },
  rust: {
    name: "Rust",
    languageId: 73,
    template: "",
  },
};

interface PollType {
  status: string;
  output: {
    time: string;
    memory: number;
    stdout: string;
  };
};

interface SubmitType {
  submissionId: string;
}

interface Problem {
  id: string;
  name: string;
  level: string;
  tags: string[];
  problemStatement: string;
  sampleInput: string;
  sampleOutput: string;
}



export default function Problem() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");

  const [problem, setProblem] = useState<Problem | null>(null);

  const [submissionStatus, setSubmissionStatus] = useState("");

  const [output, setOutput] = useState({
    time: "",
    memory: 0,
    stdout: "",
  });
  const [isLoading, setIsLoading] = useState(false);
const [activeTab, setActiveTab] = useState("code");

const handleLanguageChange = (value: string) => {
  setLanguage(value);
  setCode(languages[value as keyof typeof languages].template);
};

useEffect(() => {
  const getProblem = async () => {
    try {
      const res = await axios.get<Problem>(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/problem/${problemId}`,
        {
          withCredentials: true,
        }
      );

      setProblem(res.data);
    } catch (error) {
      toast.error("Failed to load problem.");
      navigate("/");
    }
  };

  if (problemId) {
    getProblem();
  }
}, [problemId, navigate]);

const pollSubmissionStatus = async (submissionId: string) => {
  const maxDuration = 5 * 60 * 1000;
  const startTime = Date.now();

  const interval = setInterval(async () => {
    if (Date.now() - startTime >= maxDuration) {
      clearInterval(interval);
      setIsLoading(false);
      setSubmissionStatus("timeout");
      setActiveTab("Submission");
      toast.error("Submission timed out.");
      return;
    }

    try {
      const statusRes = await axios.get<PollType>(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/status/${submissionId}`,
        {
          withCredentials: true,
        }
      );

      const status = statusRes.data.status;

      if (status !== "pending") {
        clearInterval(interval);

        setSubmissionStatus(status);
        setOutput(statusRes.data.output);
        setIsLoading(false);
        setActiveTab("Submission");
      }
    } catch (error) {
      clearInterval(interval);

      setIsLoading(false);
      setSubmissionStatus("error");

      toast.error("Failed to fetch submission status.");
    }
  }, 2000);
};

const handleSubmit = async () => {
  if (isLoading) return;

  if (!code.trim()) {
    toast.error("Please write some code before submitting.");
    return;
  }

  try {
    setIsLoading(true);
    setSubmissionStatus("pending");

    const languageId =
      languages[language as keyof typeof languages].languageId;

    const res = await axios.post<SubmitType>(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/submit/${problemId}`,
      {
        sourceCode: code,
        languageId,
      },
      {
        withCredentials: true,
      }
    );

    pollSubmissionStatus(res.data.submissionId);
  } catch (error) {
    setSubmissionStatus("error");
    setIsLoading(false);

    toast.error("Failed to submit code.");
  }
};

if (!problem) {
  return (
    <div className="flex items-center justify-center h-[70vh]">
      Loading problem...
    </div>
  );
}
return (
    
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="space-y-4">
      <Card className="p-6 space-y-5">
        <div>
          <h1 className="text-3xl font-bold">{problem?.name}</h1>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge
              className={
                problem?.level === "EASY"
                  ? "bg-green-100 text-green-700"
                  : problem?.level === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }
            >
              {problem?.level.charAt(0) +
                problem?.level.slice(1).toLowerCase()}
            </Badge>

            {problem?.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: marked.parse(problem?.problemStatement || "") as string,
          }}
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
          language={language === "cpp" ? "cpp" : language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />

        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white">
            <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-3"></div>

            <p className="font-medium">
              Running against hidden test cases...
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isLoading}>
          <Play className="mr-2 h-4 w-4" />
          {isLoading ? "Running..." : "Run Code"}
        </Button>
      </div>
    </TabsContent>

    <TabsContent value="Submission">
      <Card className="p-6 space-y-5">
        {!isLoading && submissionStatus ? (
          <>
            <div>
              <p className="text-xl font-semibold">
                Result:
              </p>

              <p
                className={`mt-2 text-lg font-bold ${
                  submissionStatus === "Accepted"
                    ? "text-green-600"
                    : submissionStatus === "Wrong Answer"
                    ? "text-yellow-600"
                    : submissionStatus === "Compilation Error" ||
                      submissionStatus === "Runtime Error (NZEC)" ||
                      submissionStatus === "Rejected"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {submissionStatus}
              </p>
            </div>

            <div>
              <p className="font-semibold mb-2">
                Sample Input
              </p>

              <pre className="bg-gray-100 dark:bg-zinc-900 p-3 rounded text-sm whitespace-pre-wrap">
                {problem.sampleInput}
              </pre>
            </div>

            <div>
              <p className="font-semibold mb-2">
                Expected Output
              </p>

              <pre className="bg-gray-100 dark:bg-zinc-900 p-3 rounded text-sm whitespace-pre-wrap">
                {problem.sampleOutput}
              </pre>
            </div>

            <div>
              <p className="font-semibold mb-2">
                Your Output
              </p>

              <pre className="bg-gray-100 dark:bg-zinc-900 p-3 rounded text-sm whitespace-pre-wrap min-h-[80px]">
                {output.stdout || "No Output"}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">
                  Execution Time
                </p>

                <p className="text-lg font-semibold">
                  {output.time || "0"} sec
                </p>
              </Card>

              <Card className="p-4">
                <p className="text-sm text-muted-foreground">
                  Memory Used
                </p>

                <p className="text-lg font-semibold">
                  {output.memory} KB
                </p>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Submit your code to see the execution result.
          </div>    
        )}
      </Card>
    </TabsContent>
    </Tabs>
  </div>
</div>
  );
}
