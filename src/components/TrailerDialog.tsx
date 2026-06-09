"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

type Props = {
  videoKey: string;
  open: boolean;
  onClose: () => void;
};

export default function TrailerDialog({ videoKey, open, onClose }: Props) {
  // Escape дарвал хаах + цаана нь scroll-г түгжих
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close trailer"
        onClick={onClose}
        className="absolute inset-0 bg-black/80"
      />

      <div className="relative z-10 aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
        >
          <X size={18} />
        </button>

        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          title="Trailer"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
