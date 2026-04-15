import { useEffect, useRef, useState } from "react";

import { getEnv } from "../lib/axios";
import type { Job, JobSSEEvent } from "@/types/job";

export type JobOverrides = Record<string, Partial<Job>>;

export function useJobSSE(printingIds: string[]) {
  const [overrides, setOverrides] = useState<JobOverrides>({});
  const connections = useRef<Record<string, EventSource>>({});

  useEffect(() => {
    const base = getEnv("VITE_JOB_SERVICE_URL") ?? "/";
    const activeIds = new Set(printingIds);

    // Close connections no longer needed
    for (const id of Object.keys(connections.current)) {
      if (!activeIds.has(id)) {
        connections.current[id].close();
        delete connections.current[id];
      }
    }

    // Open new connections
    for (const id of printingIds) {
      if (connections.current[id]) continue;

      const es = new EventSource(`${base}/jobs/${id}/stream`);
      connections.current[id] = es;

      es.onmessage = (e) => {
        try {
          const event: JobSSEEvent = JSON.parse(e.data);
          setOverrides((prev) => ({
            ...prev,
            [id]: {
              status: event.status as Job["status"],
              printed: event.printed,
              total: event.total,
            },
          }));
          if (event.status === "done" || event.status === "error") {
            es.close();
            delete connections.current[id];
          }
        } catch (e) {
          console.error("Failed to parse SSE event", e);
        }
      };

      es.onerror = () => {
        es.close();
        delete connections.current[id];
      };
    }

    return () => {
      for (const es of Object.values(connections.current)) es.close();
      connections.current = {};
    };
  }, [printingIds.join(",")]);

  return overrides;
}
