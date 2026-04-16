import useArchiveJob from "@/hooks/useArchiveJob";
import type { Job } from "@/types/job";

export default function JobActions({
  job,
  onRelancer,
  relancerPending,
}: Readonly<{
  job: Job;
  onRelancer: (id: string) => void;
  relancerPending: boolean;
}>) {
  const { isPending: isArchiving, mutateAsync: archiveJob } = useArchiveJob(
    job.id,
  );

  return (
    <div className="flex gap-2 items-center justify-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRelancer(job.id);
        }}
        disabled={relancerPending}
        className="text-xs px-3 py-1.5 rounded-lg border border-orange-600 text-orange-600 hover:bg-orange-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {relancerPending ? "…" : "Relancer"}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          archiveJob();
        }}
        disabled={isArchiving}
        className="text-xs px-3 py-1.5 rounded-lg border bg-green-700  hover:bg-green-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {isArchiving ? "…" : "Archiver"}
      </button>
    </div>
  );
}
