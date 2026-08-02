export default function Loading() {
  return (
    <div className="space-y-4 py-8" role="status" aria-live="polite">
      <span className="sr-only">Cargando...</span>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="animate-pulse rounded-2xl border border-zinc-200 p-4">
            <div className="h-4 w-1/2 rounded bg-zinc-100" />
            <div className="mt-3 h-8 w-3/4 rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
