import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code2, Search } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { useProblems } from "@/hooks/useProblems";
import { clearAuthSession } from "@/lib/authSession";
import { useAuthContext } from "@/context/authContext";

const difficultyClass = (level: string) =>
  level === "EASY"
    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
    : level === "MEDIUM"
    ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
    : "bg-rose-100 text-rose-700 hover:bg-rose-100";

export default function Problems() {
  const [page, setPage] = useState(1);
  const { problems, isLoading, error } = useProblems();
  const { setAuthUser } = useAuthContext();
  const problemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(problems.length / problemsPerPage));
  const navigate = useNavigate();

  const currentProblems = problems.slice(
    (page - 1) * problemsPerPage,
    page * problemsPerPage
  );

  useEffect(() => {
    if (error) {
      const status = (error as { response?: { status?: number } }).response
        ?.status;

      if (status === 401 || status === 403) {
        clearAuthSession();
        setAuthUser(null);
        toast.error("Your session has expired. Please sign in again.");
        navigate("/signin");
        return;
      }

      toast.error("Could not load problems");
      navigate("/");
    }
  }, [error, navigate, setAuthUser]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        eyebrow="Problem Set"
        title="Problems"
        description="Practice coding with a focused collection of programming challenges."
        actions={
          <div className="rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground">
            {problems.length} available
          </div>
        }
      />

      {isLoading ? (
        <TableSkeleton rows={8} columns={4} />
      ) : problems.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No problems available"
          description="There are no visible problems yet. Please check back after an admin publishes new challenges."
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border bg-card">
            <Table>
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
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                          <Code2 className="h-4 w-4" />
                        </span>
                        {problem.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={difficultyClass(problem.level)}>
                        {problem.level.charAt(0) +
                          problem.level.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/problem/${problem.id}`}>
                        <Button size="sm">Solve</Button>
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
                    setPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
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
                )
              )}

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
        </>
      )}
    </div>
  );
}
