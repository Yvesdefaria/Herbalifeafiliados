import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "product-images";

async function ensureBucket() {
  const supabase = createAdminClient();
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  });
  if (error && !String(error.message).includes("already exists")) {
    throw error;
  }
}

export async function uploadImage(
  file: File,
  folder: "products" | "blog",
): Promise<string> {
  await ensureBucket();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || `image/${ext}`,
    upsert: false,
  });
  if (error) {
    throw error;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
