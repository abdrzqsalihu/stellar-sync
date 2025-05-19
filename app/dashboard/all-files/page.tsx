import DashboardLayout from "../../../components/dashboard-layout";
import FileGrid from "../../../components/file-grid";
import UploadButton from "../../../components/upload-button";
import { Button } from "../../../components/ui/button";
import { FolderPlus } from "lucide-react";

export default function AllFilesPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">All Files</h1>
          <p className="text-muted-foreground">
            View and manage all your files in one place.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <UploadButton />
            <Button
              variant="outline"
              size="sm"
              className="group h-10 gap-2 rounded-md border-dashed hover:border-primary hover:bg-primary/5"
            >
              <FolderPlus className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-primary" />
              <span className="group-hover:text-primary">New Folder</span>
            </Button>
          </div>
        </div>

        <FileGrid />
      </div>
    </DashboardLayout>
  );
}
