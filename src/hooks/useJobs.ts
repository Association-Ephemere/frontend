import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import type { JobsResponse } from "@/types/job";

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
