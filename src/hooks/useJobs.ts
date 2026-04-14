import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

export type JobStatus = "printing" | "requeued" | "queued" | "error" | "done";

export interface Job {
  id: string;
  status: JobStatus;
  total: number;
  printed: number;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

interface JobsResponse {
  jobs: Job[];
  total: number;
}

export function useJobs(page: number, limit: number) {
  const offset = page * limit;
  return useQuery({
    queryKey: ["jobs", page, limit],
    queryFn: async () => {
      const { data } = await api.get<JobsResponse>("/jobs", {
        params: { sort: "status", limit, offset },
      });

      return data;
    },
    refetchInterval: 10000,
  });
}
