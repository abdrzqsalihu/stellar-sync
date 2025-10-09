import { dbAdmin } from "../../lib/firebase-admin";
import { getEmailFromUserId } from "../../lib/getEmailFromUserId";
import FileGrid from "../file-grid";

interface SharedContentProps {
  userId: string;
}
export default async function SharedContent({ userId }: SharedContentProps) {
  const email = await getEmailFromUserId(userId);

  let files: Array<any> = [];
  const base = dbAdmin
    .collection("uploadedFiles")
    .where("userEmail", "==", email);

  const snap = await base.get();
  snap.docs.forEach((d) => files.push({ id: d.id, ...d.data() }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Shared Files</h1>
        <p className="text-muted-foreground">
          Manage files you've shared with others.
        </p>
      </div>

      <FileGrid fileList={files.filter((file) => file.shared)} view="shared" />
    </div>
  );
}
