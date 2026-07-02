import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, PlusCircle, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

interface Problem {
  id: string;
  name: string;
  level: string;
  visible: boolean;
}

const difficultyClass = (level: string) =>
  level === "EASY"
    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
    : level === "MEDIUM"
    ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
    : "bg-rose-100 text-rose-700 hover:bg-rose-100";

export default function AdminProblemList() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(problems.length / problemsPerPage));

  const currentProblems = problems.slice(
    (currentPage - 1) * problemsPerPage,
    currentPage * problemsPerPage
  );

  useEffect(() => {
    const getProblems = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Problem[]>(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/allProblems`,
          { withCredentials: true }
        );
        if (!response) {
          toast.error("Could not load admin problems");
          navigate("/admin/signin");
        }
        setProblems(response.data);
      } catch (error) {
        toast.error("Could not load admin problems");
        navigate("/admin/signin");
      } finally {
        setIsLoading(false);
      }
    };
    getProblems();
  }, [navigate]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        eyebrow="Admin Dashboard"
        title="Manage Problems"
        description="Review, edit, and publish coding challenges from one workspace."
        actions={
          <Link to="/admin/problem/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Problem
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <TableSkeleton rows={8} columns={4} />
      ) : problems.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No problems created"
          description="Create the first coding challenge to start building the platform problem set."
          action={
            <Link to="/admin/problem/add">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Problem
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border bg-card">
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
                    <TableCell>
                      <Badge variant={problem.visible ? "default" : "secondary"}>
                        {problem.visible ? (
                          <Eye className="mr-1 h-3 w-3" />
                        ) : (
                          <EyeOff className="mr-1 h-3 w-3" />
                        )}
                        {problem.visible ? "Visible" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={difficultyClass(problem.level)}>
                        {problem.level}
                      </Badge>
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}

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
        </>
      )}
    </div>
  );
}
