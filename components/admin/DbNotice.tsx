/** Shown on admin pages when MONGODB_URI is missing or the database can't be reached. */
export default function DbNotice({ error }: { error?: boolean }) {
  return (
    <div role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
      <p className="font-semibold">{error ? "Could not connect to the database." : "The database is not configured yet."}</p>
      <p className="mt-1">
        {error
          ? "Check that MONGODB_URI is correct and that MongoDB Atlas allows connections from this server (Network Access → 0.0.0.0/0 for Vercel)."
          : "Add MONGODB_URI to the environment variables (Vercel → Settings → Environment Variables, or .env.local) and redeploy."}
      </p>
    </div>
  );
}
