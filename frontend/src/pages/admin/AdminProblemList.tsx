import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Problem {
  id: string;
  name: string;
  level: string;
  visible: boolean;
}


export default function AdminProblemList() {
  const [problems , setProblems] = useState<Problem[]>([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const problemsPerPage = 10;

  const totalPages = Math.max(
    1,
    Math.ceil(problems.length / problemsPerPage)
  );

  const currentProblems = problems.slice(
    (currentPage - 1) * problemsPerPage,
    currentPage * problemsPerPage
  );

  useEffect(()=>{
    const getProblems = async()=>{
      try {
        const response = await axios.get<Problem[]>(`${import.meta.env.VITE_BACKEND_URL}/api/admin/allProblems`,{withCredentials:true});
        if(!response){
          toast.error("Could not get the problems");
          navigate("/admin/signin");
        }
        // console.log(response.data);
        setProblems(response.data);
      } catch (error) {
        toast.error("Could not get the problems");
        navigate("/admin/signin");
      }
    }
    getProblems();
  },[])

  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Problems</h1>
        <Link to="/admin/problem/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Problem
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProblems.map((problem) => (
              <TableRow key={problem.id}>
                <TableCell className="font-medium">{problem.name}</TableCell>
                <TableCell className='font-medium text-gray-500'>
                  {problem.visible ? "Visible" : "Not - visible"} 
                </TableCell>
                <TableCell className='font-medium text-gray-500'>
                  {problem.level} 
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/admin/problems/${problem.id}/modify`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

     <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage((p) => Math.max(1, p - 1));
        }}
      />
    </PaginationItem>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <PaginationItem key={page}>
        <PaginationLink
          href="#"
          isActive={currentPage === page}
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(page);
          }}
        >
          {page}
        </PaginationLink>
      </PaginationItem>
    ))}

    <PaginationItem>
      <PaginationNext
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage((p) => Math.min(totalPages, p + 1));
        }}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
    </div>
  );
}