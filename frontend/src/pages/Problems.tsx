import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Problem {
  id: string;
  name: string;
  level: string;
  visible: boolean;
  tags: string[];
}


export default function Problems() {
  const [page, setPage] = useState(1);
  const [problems , setproblems] = useState<Problem[]>([]);
  const problemsPerPage = 10;
  const totalPages = Math.max(1,Math.ceil(problems.length / problemsPerPage));
  const navigate = useNavigate();

  const currentProblems = problems.slice(
    (page - 1) * problemsPerPage,
    page * problemsPerPage
  );

  useEffect(()=>{
    const getProblems = async()=>{
      try {
        const response = await axios.get<Problem[]>(`${import.meta.env.VITE_BACKEND_URL}/api/user/allProblems`,{withCredentials:true});
        setproblems(response.data);
      } catch (error) {
        toast.error("Something went wrong");
        navigate("/");
      }
    }
    getProblems();
  },[])
console.log("Page:", page);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Problems</h1>
        <p className="text-muted-foreground">
          Practice coding with our collection of programming challenges
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {problems.length} Problems Available
        </p>
      </div>

      <div className="w-full">
        <div className='rounded-md border max-w-6xl mx-auto'>
        <Table >
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Action</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProblems.map((problem) => (
              <TableRow key={problem.id}>
              <TableCell className="font-medium">
                {problem.name}
              </TableCell>

              <TableCell>
                <Badge
                  className={
                    problem.level === "EASY"
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : problem.level === "MEDIUM"
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                      : "bg-red-100 text-red-700 hover:bg-red-100"
                  }
                >
                  {problem.level.charAt(0) + problem.level.slice(1).toLowerCase()}
                </Badge>
              </TableCell>

              {/* NEW CELL */}
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {problem.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>

              <TableCell className="text-right">
                <Link to={`/problem/${problem.id}`}>
                  <Button size="sm">
                    Solve →
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>

     <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setPage((p) => Math.max(1, p - 1));
        }}
      />
    </PaginationItem>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
      <PaginationItem key={pageNum}>
        <PaginationLink
          href="#"
          isActive={page === pageNum}
          onClick={(e) => {
            e.preventDefault();
            setPage(pageNum);
          }}
        >
          {pageNum}
        </PaginationLink>
      </PaginationItem>
    ))}

    <PaginationItem>
      <PaginationNext
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setPage((p) => Math.min(totalPages, p + 1));
        }}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
    </div>
  );
}