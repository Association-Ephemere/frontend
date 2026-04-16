import { useQuery } from "@tanstack/react-query";
import { api, USE_MOCK } from "../lib/axios";
import type { JobsResponse } from "@/types/job";
import { mockFetchedJobs } from "@/mocks/mockFetchedJobs";

export function useJobs(page: number, limit: number) {
  const offset = page * limit;
  return useQuery({
    queryKey: ["jobs", page, limit],
    queryFn: async () => {
      if (USE_MOCK) {
        return mockFetchedJobs();
      }
      const { data } = await api.get<JobsResponse>("/jobs", {
        params: { sort: "status", limit, offset },
      });

      return data;
    },
    refetchInterval: 10000,
  });
}
