"use client";

import { useId, useRef, useState } from "react";
import { toast } from "sonner";
import { discardUpload, uploadImage } from "@/lib/upload-client";
import { IMAGE_EXTENSIONS, MAX_IMAGE_BYTES, formatBytes, isBlobUrl, type StoredImage, type UploadFolder } from "@/lib/upload-rules";

type Props = {
  /** Current image (null = none). */
  value: StoredImage | null;
  onChange: (value: StoredImage | null) => void;
  /** Blob folder: "blog", "blog-content" or "homepage". */
  folder: UploadFolder;
  label?: string;
  hint?: string;
  /** Preview box shape, e.g. "16 / 9" or "1 / 1". */
  aspect?: string;
  disabled?: boolean;
  /** Lets the parent block Save while an upload runs. */
  onBusyChange?: (busy: boolean) => void;
};

/**
 * The one image picker used across the admin: drag-and-drop or click, preview, progress,
 * replace and remove. Uploads go straight to Vercel Blob.
 *
 * Images that were uploaded here but replaced/removed before saving are deleted right away.
 * The image that was already saved is only deleted by the server when the form is saved.
 */
export default function ImageUpload({ value, onChange, folder, label, hint, aspect = "16 / 9", disabled, onBusyChange }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [savedUrl] = useState(value?.url ?? null); // what MongoDB has right now
  const [progress, setProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const busy = progress !== null;

  function setBusy(b: boolean) {
    setProgress(b ? 0 : null);
    onBusyChange?.(b);
  }

  /** Drop an unsaved upload from Blob when it is replaced or removed. */
  function release(url: string | undefined) {
    if (url && url !== savedUrl && isBlobUrl(url)) discardUpload(url);
  }

  async function handleFile(file: File | undefined) {
    if (!file || busy || disabled) return;
    setError("");
    setBusy(true);
    try {
      const uploaded = await uploadImage(file, folder, { onProgress: setProgress });
      release(value?.url);
      onChange(uploaded);
      toast.success("Image uploaded");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove() {
    release(value?.url);
    onChange(null);
    setError("");
  }

  const accept = IMAGE_EXTENSIONS.map((e) => `.${e}`).join(",");
  const help = hint ?? `JPG, PNG, WebP, GIF or SVG, up to ${formatBytes(MAX_IMAGE_BYTES)}.`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy && !disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFile(e.dataTransfer.files[0]);
        }}
        className={`relative overflow-hidden rounded-lg border-2 border-dashed transition-colors ${
          dragging ? "border-blue-600 bg-blue-50" : error ? "border-red-300 bg-red-50/40" : "border-slate-300 bg-slate-50"
        }`}
        style={{ aspectRatio: aspect }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary uploaded URL
          <img src={value.url} alt="" className="absolute inset-0 size-full object-contain" />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy || disabled}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4 text-center text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed"
          >
            <span className="text-2xl" aria-hidden="true">
              ⬆
            </span>
            <span>
              <span className="font-medium text-blue-700">Click to upload</span> or drag and drop
            </span>
            <span className="text-xs text-slate-500">{help}</span>
          </button>
        )}

        {busy && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/85 px-6" role="status" aria-live="polite">
            <span className="text-sm font-medium text-slate-700">Uploading… {progress}%</span>
            <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-blue-600 transition-[width]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={busy || disabled}
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {value && !busy && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Replace
          </button>
          <button type="button" onClick={remove} disabled={disabled} className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
            Remove
          </button>
          {value.width > 0 && (
            <span className="text-xs text-slate-500">
              {value.width} × {value.height}px
            </span>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
