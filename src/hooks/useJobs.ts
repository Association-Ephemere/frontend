import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import type { JobsResponse } from "@/types/job";

export function useJobs(page: number, limit: number) {
  const offset = page * limit;
  return useQuery({
    queryKey: ["jobs", page, limit],
    queryFn: async () => {
      // const { data } = await api.get<JobsResponse>("/jobs", {
      //   params: { sort: "status", limit, offset },
      // });

      // return data;

      const re: JobsResponse = {
        jobs: [
          {
            id: "ss",
            status: "printing",
            total: 2,
            printed: 1,
            retryCount: 0,
            createdAt: "2025",
            updatedAt: "2025",
            ticketNumber: 2,
          },
          {
            id: "ssszdfze",
            status: "printing",
            total: 2,
            printed: 1,
            retryCount: 0,
            createdAt: "2025",
            updatedAt: "2025",
            ticketNumber: 2,
          },
          {
            id: "ssfzevzg",
            status: "requeued",
            total: 2,
            printed: 1,
            retryCount: 0,
            createdAt: "2025",
            updatedAt: "2025",
            ticketNumber: 2,
          },
          {
            id: "sezfzs",
            status: "error",
            total: 2,
            printed: 1,
            retryCount: 0,
            createdAt: "2025",
            updatedAt: "2025",
            ticketNumber: 2,
          },
          {
            id: "sfzgzefrvs",
            status: "done",
            total: 2,
            printed: 1,
            retryCount: 0,
            createdAt: "2025",
            updatedAt: "2025",
            ticketNumber: 2,
          },
        ],
        total: 1,
      };

      return re;
    },
    refetchInterval: 10000,
  });
}
