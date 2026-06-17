import { createClient } from "@/lib/supabase/server";

export const STORAGE_BUCKETS = {
  logos: "logos",
  referenceImages: "reference-images",
  deliverables: "deliverables",
} as const;

export type StorageBucket =
  (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

/** Returns a time-limited signed URL for a private object. */
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresInSeconds = 3600,
): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);
  if (error) return null;
  return data.signedUrl;
}
