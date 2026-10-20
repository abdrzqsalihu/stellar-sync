import Link from "next/link";
import { dbAdmin } from "../../lib/firebase-admin";
import { getEmailFromUserId } from "../../lib/getEmailFromUserId";
import FileGrid from "../file-grid";

interface SearchContentProps {
  userId: string;
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchContent({
  userId,
  searchParams,
}: SearchContentProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  if (!query) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Search</h1>
          <p className="text-muted-foreground">
            Find a file by typing its name in the search box above.
          </p>
        </div>
      </div>
    );
  }

  let files: Array<any> = [];
  let error: string | null = null;

  try {
    const email = await getEmailFromUserId(userId);
    const snap = await dbAdmin
      .collection("uploadedFiles")
      .where("userEmail", "==", email)
      .get();

    const needle = query.toLowerCase();
    snap.docs.forEach((d) => {
      const data = d.data();
      if ((data.fileName || "").toLowerCase().includes(needle)) {
        files.push({ id: d.id, ...data });
      }
    });
  } catch (err) {
    console.error("Error searching files:", err);
    error = "Something went wrong while searching. Please try again.";
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Search results for &ldquo;{query}&rdquo;
        </h1>
        <p className="text-muted-foreground">
          {error
            ? error
            : `${files.length} file${files.length !== 1 ? "s" : ""} found.`}
        </p>
      </div>

      {error ? (
        <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
          <p className="text-lg font-medium">Search failed</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      ) : files.length === 0 ? (
        <div className="col-span-full flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-center">
          <p className="text-lg font-medium">No files match your search</p>
          <p className="text-sm text-muted-foreground">
            Try a different name, or clear the search to see all files.
          </p>
          <Link
            href="/dashboard/all-files"
            className="text-sm font-medium text-[#5056FD] hover:underline"
          >
            Clear search
          </Link>
        </div>
      ) : (
        <FileGrid fileList={files} view="search" />
      )}
    </div>
  );
}
