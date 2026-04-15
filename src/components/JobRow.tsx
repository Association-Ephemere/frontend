import { useJob } from "@/hooks/useJob";
import type { Job, JobStatus } from "@/types/job";

const STATUS_LABEL: Record<JobStatus, string> = {
  printing: "Impression",
  requeued: "En attente",
  queued: "En file",
  error: "Erreur",
  done: "Terminé",
};

const STATUS_CLASS: Record<JobStatus, string> = {
  printing: "bg-blue-900 text-blue-100",
  requeued: "bg-orange-900 text-orange-100",
  queued: "bg-stone-900 text-stone-600",
  error: "bg-red-900 text-red-100",
  done: "bg-green-900 text-green-100",
};

interface Props {
  job: Job;
  onRelancer: (id: string) => void;
  relancerPending: boolean;
}

function PhotoPreview({ jobId }: Readonly<{ jobId: string }>) {
  const { data, isPending, isError } = useJob(jobId);

  if (isPending) {
    return (
      <div className="flex gap-2 p-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-16 h-16 rounded bg-stone-700 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError || !data?.photos || data?.photos.length === 0) {
    return (
      <p className="px-3 py-2 text-xs text-red-400">
        Impossible de charger les photos (job introuvable ou erreur serveur).
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 p-3">
      {data.photos.map((p, i) => (
        <div key={`${p.photoStorageKey}-${i}`} className="relative">
          <img
            src={p.photoStorageKey}
            alt={`photo-${i}`}
            className="max-w-25 max-h-40 rounded object-contain bg-stone-700"
          />
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md pointer-events-none">
            {p.copies}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function JobRow({
  job,
  onRelancer,
  relancerPending,
}: Readonly<Props>) {
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
    <>
      <tr className="border-b border-stone-800 ">
        <td className="px-4 py-3 font-mono text-xs text-stone-500">
          {`#${job.ticketNumber}`}
        </td>

        <td className="px-4 py-3">
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASS[job.status]}`}
          >
            {STATUS_LABEL[job.status]}
          </span>
        </td>

        <td className="px-4 py-3 text-sm text-stone-400 tabular-nums">
          {job.total}
        </td>

        <td className="px-4 py-3 text-xs text-stone-400 whitespace-nowrap">
          {date}
        </td>

        <td className="px-4 py-3">
          {job.status === "error" ? (
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
          ) : (
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-stone-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-stone-400 tabular-nums">
                {job.printed} / {job.total}
              </p>
            </div>
          )}
        </td>
      </tr>

      <tr className="border-b border-stone-800 bg-stone-900">
        <td colSpan={6}>
          <PhotoPreview jobId={job.id} />
        </td>
      </tr>
    </>
  );
}
