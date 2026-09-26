"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 5 * 1024 * 1024;

// Uploads straight to the "avatars" Supabase Storage bucket from the
// browser (RLS scopes writes to the caller's own auth.uid() folder —
// see migration 0014), then feeds the resulting public URL into a
// hidden form field so the enclosing <form>'s normal submit picks it
// up like any other input. No crop/resize — just a square preview via
// object-fit: cover.
export function AvatarUpload({ userId, initialUrl }: { userId: string; initialUrl?: string | null }) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [uploadedUrl, setUploadedUrl] = useState<string>(initialUrl ?? "");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setError("Choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setStatus("error");
      setError("Keep it under 5MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setStatus("uploading");

    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (uploadError) {
      setStatus("error");
      setError("Upload failed — try again.");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setUploadedUrl(data.publicUrl);
    setStatus("idle");
  }

  return (
    <div className="flex items-center gap-4">
      <input type="hidden" name="avatar_url" value={uploadedUrl} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-[1.5px] border-field-line bg-frost transition hover:border-voyage-blue"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- user-supplied storage URL, not a static asset Next can optimize
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-slate">
            <Camera className="h-6 w-6" aria-hidden />
          </span>
        )}
        {status === "uploading" && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink-navy/50">
            <Loader2 className="h-5 w-5 animate-spin text-white" aria-hidden />
          </span>
        )}
      </button>
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-sm font-extrabold text-voyage-blue hover:underline"
        >
          {preview ? "Change photo" : "Add a profile photo"}
        </button>
        <p className="mt-0.5 text-sm text-slate">Optional. JPG or PNG, up to 5MB.</p>
        {error && <p className="mt-0.5 text-sm font-bold text-error">{error}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
