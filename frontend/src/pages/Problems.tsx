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
}


export default function Problems() {
  const [page, setPage] = useState(1);
  const [problems , setproblems] = useState<Problem[]>([]);
  const problemsPerPage = 10;
  const totalPages = Math.ceil(problems.length / problemsPerPage);
  const navigate = useNavigate();

  const currentProblems = problems.slice(
    (page - 1) * problemsPerPage,
    page * problemsPerPage
  );

  useEffect(()=>{
    const getProblems = async()=>{
      try {
        const response = await axios.get<Problem[]>("http://localhost:8000/api/user/allProblems",{withCredentials:true});
        setproblems(response.data);
      } catch (error) {
        toast.error("Something went wrong");
        navigate("/");
      }
    }
    getProblems();
  },[])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Problems</h1>
        <p className="text-muted-foreground">
          Practice coding with our collection of programming challenges
        </p>
      </div>

      <div className="w-full">
        <div className='rounded-md border max-w-6xl mx-auto'>
        <Table >
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className='text-right'>Action</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProblems.map((problem) => (
              <TableRow key={problem.id}>
                <TableCell className='font-medium'>
                    {problem.name}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      problem.level === 'easy'
                        ? 'outline'
                        : problem.level === 'medium'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {problem.level}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/problem/${problem.id}`}>
                    <Button variant="outline" size="sm">
                      Solve
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
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              // disabled={page === 1}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={() => setPage(pageNum)}
                isActive={page === pageNum}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              // disabled= {page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}