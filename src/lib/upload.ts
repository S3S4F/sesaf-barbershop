import { put, del } from "@vercel/blob";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export type UploadedImage = { url: string; pathname: string };

export async function uploadImage(
  file: File,
  folder: string
): Promise<UploadedImage> {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Format non supporté (JPG, PNG, WEBP ou GIF uniquement)");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image trop lourde (max 5 Mo)");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const pathname = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });
  return { url: blob.url, pathname: blob.pathname };
}

export async function deleteBlob(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    // Silent fail — on ne bloque pas la suppression DB si le blob est déjà absent
  }
}
