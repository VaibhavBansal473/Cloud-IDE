import { useEffect, useState } from "react";
import axios from "axios";

export interface ProblemSummary {
  id: string;
  name: string;
  level: string;
  visible: boolean;
  tags: string[];
}

let cachedProblems: ProblemSummary[] | null = null;
let pendingRequest: Promise<ProblemSummary[]> | null = null;

function fetchProblems(): Promise<ProblemSummary[]> {
  if (cachedProblems) {
    return Promise.resolve(cachedProblems);
  }

  if (!pendingRequest) {
    pendingRequest = new Promise<ProblemSummary[]>((resolve, reject) => {
      axios
        .get<ProblemSummary[]>(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/allProblems`,
          { withCredentials: true }
        )
        .then((response) => {
          cachedProblems = response.data;
          resolve(response.data);
        })
        .catch(reject);
    }).then(
      (data) => {
        pendingRequest = null;
        return data;
      },
      (requestError) => {
        pendingRequest = null;
        throw requestError;
      }
    );
  }

  return pendingRequest as Promise<ProblemSummary[]>;
}

export function useProblems() {
  const [problems, setProblems] = useState<ProblemSummary[]>(
    cachedProblems || []
  );
  const [isLoading, setIsLoading] = useState(!cachedProblems);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(!cachedProblems);
    fetchProblems()
      .then((data) => {
        if (isMounted) {
          setProblems(data);
          setError(null);
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError);
        }
      })
      .then(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { problems, isLoading, error };
}
