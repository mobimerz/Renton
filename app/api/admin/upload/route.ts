import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { z } from "zod";
import { getSession, requireAdmin } from "@/lib/auth";
import { deleteBlobs } from "@/lib/blob";
import { IMAGE_EXTENSIONS, IMAGE_TYPES, MAX_IMAGE_BYTES, UPLOAD_FOLDERS, isBlobUrl } from "@/lib/upload-rules";

/**
 * Client uploads to Vercel Blob (the file goes browser -> Blob directly, so Vercel's 4.5 MB
 * function body limit does not apply). This route only hands out short-lived upload tokens.
 *
 * The blob URL is saved to MongoDB by the blog/homepage forms, not via onUploadCompleted
 * (that webhook can't reach localhost and isn't needed).
 */
const pathnamePattern = new RegExp(`^(${UPLOAD_FOLDERS.join("|")})/[a-z0-9-]{1,60}\\.(${IMAGE_EXTENSIONS.join("|")})$`);

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: "Image storage is not configured (BLOB_READ_WRITE_TOKEN is missing)." }, { status: 503 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Checked again here, as the token is what actually grants upload rights.
        if (!(await getSession())) throw new UploadError("Unauthorized", 401);
        if (!pathnamePattern.test(pathname)) throw new UploadError("Invalid file name or folder.", 400);
        return {
          allowedContentTypes: [...IMAGE_TYPES],
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 10 * 60 * 1000,
        };
      },
    });
    return Response.json(result);
  } catch (err) {
    if (err instanceof UploadError) return Response.json({ error: err.message }, { status: err.status });
    console.error("[upload] token generation failed:", err);
    return Response.json({ error: err instanceof Error ? err.message : "Upload failed." }, { status: 400 });
  }
}

const deleteSchema = z.object({ url: z.string().url().refine(isBlobUrl, "Not a Vercel Blob URL.") });

/**
 * DELETE { url } — removes an image that was uploaded in the editor but never saved
 * (e.g. the user picked a different file before pressing Save). Saved images are cleaned up
 * by the blog/homepage save routes instead.
 */
export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0].message }, { status: 422 });

  await deleteBlobs([parsed.data.url]);
  return Response.json({ ok: true });
}

class UploadError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
