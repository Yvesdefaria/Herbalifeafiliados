"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex w-full flex-col items-center justify-center py-16 text-center">
      <h2 className="text-xl font-semibold text-zinc-900">Algo salió mal</h2>
      <p className="mt-2 text-sm text-zinc-600">
        Ha ocurrido un error inesperado en el panel. Inténtalo de nuevo.
      </p>
      <button
        onClick={() => unstable_retry()}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800"
      >
        Reintentar
      </button>
    </div>
  );
}
