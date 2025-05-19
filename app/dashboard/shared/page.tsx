import DashboardLayout from "../../../components/dashboard-layout";
import FileGrid from "../../../components/file-grid";

export default function SharedPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Shared Files</h1>
          <p className="text-muted-foreground">
            Manage files you've shared with others.
          </p>
        </div>

        <FileGrid shared={true} />
      </div>
    </DashboardLayout>
  );
}
