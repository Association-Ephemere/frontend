import type { Job, JobStatus } from "@/types/job";

const STATUS_LABEL: Record<JobStatus, string> = {
  printing: "Impression",
  requeued: "En attente",
  queued: "En file",
  error: "Erreur",
  done: "Terminé",
};

const STATUS_CLASS: Record<JobStatus, string> = {
  printing: "bg-blue-100 text-blue-800",
  requeued: "bg-orange-100 text-orange-800",
  queued: "bg-stone-100 text-stone-600",
  error: "bg-red-100 text-red-800",
  done: "bg-green-100 text-green-800",
};

interface Props {
  job: Job;
  onRelancer: (id: string) => void;
  relancerPending: boolean;
}

export default function JobRow({ job, onRelancer, relancerPending }: Props) {
  const date = new Date(job.createdAt).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const progress =
    job.total > 0 ? Math.round((job.printed / job.total) * 100) : 0;

  return (
    <tr className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-stone-500">
        {job.ticketNumber}
      </td>

      <td className="px-4 py-3">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASS[job.status]}`}
        >
          {STATUS_LABEL[job.status]}
        </span>
      </td>

      <td className="px-4 py-3 text-sm text-stone-600 tabular-nums">
        {job.total}
      </td>

      <td className="px-4 py-3 text-xs text-stone-400 whitespace-nowrap">
        {date}
      </td>

      <td className="px-4 py-3 w-40">
        {/* {job.status === "printing" && ( */}
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-stone-400 tabular-nums">
            {job.printed} / {job.total}
          </p>
        </div>
        {/* )} */}
      </td>

      <td className="px-4 py-3 text-right">
        {job.status === "error" && (
          <button
            onClick={() => onRelancer(job.id)}
            disabled={relancerPending}
            className="text-xs px-3 py-1.5 rounded-lg border border-orange-300 text-orange-600 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {relancerPending ? "…" : "Relancer"}
          </button>
        )}
      </td>
    </tr>
  );
}
