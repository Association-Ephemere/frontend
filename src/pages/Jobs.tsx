import { useState, useMemo } from "react";
import { useJobs } from "../hooks/useJobs";
import { useJobSSE } from "../hooks/useJobSSE";
import { useRelancer } from "../hooks/useRelancer";
import JobRow from "../components/JobRow";
import type { Job } from "@/types/job";

const LIMIT_OPTIONS = [10, 25, 50];

export default function Jobs() {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const { data, status, refetch } = useJobs(page, limit);

  // Local job overrides — lets us splice in relanced jobs without waiting for refetch
  const [localOverrides, setLocalOverrides] = useState<Record<string, Job>>({});

  const jobs: Job[] = useMemo(() => {
    if (!data?.jobs) return [];
    return data.jobs.map((j) =>
      localOverrides[j.id] ? { ...j, ...localOverrides[j.id] } : j,
    );
  }, [data, localOverrides]);

  // SSE: only open on currently visible printing jobs
  const printingIds = useMemo(
    () => jobs.filter((j) => j.status === "printing").map((j) => j.id),
    [jobs],
  );

  // Extra SSE ids opened after relancer (may not be on current page yet)
  const [extraSSEIds, setExtraSSEIds] = useState<string[]>([]);
  const allSSEIds = useMemo(
    () => [...new Set([...printingIds, ...extraSSEIds])],
    [printingIds, extraSSEIds],
  );

  const sseOverrides = useJobSSE(allSSEIds);

  // Merge SSE overrides into jobs display
  const mergedJobs: Job[] = useMemo(() => {
    return jobs.map((j) =>
      sseOverrides[j.id] ? { ...j, ...sseOverrides[j.id] } : j,
    );
  }, [jobs, sseOverrides]);

  function handleNewJob(oldId: string, newJob: Job) {
    setLocalOverrides((prev) => {
      const next = { ...prev };
      delete next[oldId];
      return { ...next, [newJob.id]: newJob };
    });
    refetch();
  }

  const { relancer, pending: relancerPending } = useRelancer(
    handleNewJob,
    (id) => setExtraSSEIds((prev) => [...prev, id]),
  );

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const buttonClass = (isActive: boolean) =>
    `${isActive ? "text-muted-background" : "border border-foreground text-foreground"} px-3 py-1.5 rounded-lg  hover:bg-muted-background disabled:opacity-40 disabled:cursor-not-allowed transition-colors`;

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Impressions</h1>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Par page :</span>
          {LIMIT_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => {
                setLimit(n);
                setPage(0);
              }}
              className={`w-9 h-8 rounded-lg text-sm transition-colors ${
                limit === n
                  ? " text-stone-800 bg-stone-100"
                  : " text-stone-500 hover:bg-stone-50"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {status === "pending" && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="text-red-400 text-sm">
          Erreur lors du chargement des jobs.
        </p>
      )}

      {status === "success" && (
        <>
          {mergedJobs.length === 0 ? (
            <p className="text-muted-foreground text-sm mt-12 text-center">
              Aucun job pour l'instant.
            </p>
          ) : (
            <div className="border border-muted-background rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="text-xs text-muted-foreground uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3 font-medium">Ticket</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 font-medium">Copies</th>
                    <th className="px-4 py-3 font-medium">Créé le</th>
                    <th className="px-4 py-3 font-medium">Progression</th>
                  </tr>
                </thead>
                <tbody>
                  {mergedJobs.map((job) => (
                    <JobRow
                      key={job.id}
                      job={job}
                      onRelancer={relancer}
                      relancerPending={relancerPending.has(job.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-stone-500">
              <span>
                Page {page + 1} sur {totalPages} — {data?.total} jobs
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                  className={buttonClass(page === 0)}
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                  className={buttonClass(page >= totalPages - 1)}
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
