import type { Metadata } from "next";
import DbNotice from "@/components/admin/DbNotice";
import HomepageForm from "@/components/admin/HomepageForm";
import { PageHeader } from "@/components/admin/ui";
import { defaultHomepageContent, getHomepageContent } from "@/lib/homepage/content";

export const metadata: Metadata = { title: "Homepage" };

export default async function HomepageAdminPage() {
  const configured = Boolean(process.env.MONGODB_URI);
  let loaded: Awaited<ReturnType<typeof getHomepageContent>> | null = null;
  let dbError = false;
  if (configured) {
    try {
      loaded = await getHomepageContent();
    } catch (err) {
      console.error("[admin/homepage] page load failed:", err);
      dbError = true;
    }
  }

  return (
    <>
      <PageHeader
        title="Homepage"
        description="Edit the text and images of the homepage sections. The layout and design stay the same."
        actions={
          <a href="/" target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-700 hover:underline">
            View homepage ↗
          </a>
        }
      />
      {(!configured || dbError) && (
        <div className="mb-5">
          <DbNotice error={dbError} />
        </div>
      )}
      {configured && !dbError && loaded && <HomepageForm initial={loaded.content} fromDb={loaded.fromDb} />}
      {!configured && (
        <p className="text-sm text-slate-500">
          Preview of the current content is available once the database is connected. ({defaultHomepageContent().whyChoose.boxes.length} service boxes,{" "}
          {defaultHomepageContent().homeFaq.columns.flat().length} FAQs ready to import.)
        </p>
      )}
    </>
  );
}
