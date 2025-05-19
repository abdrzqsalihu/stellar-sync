import DashboardLayout from "../../../components/dashboard-layout";
import FileGrid from "../../../components/file-grid";

export default function FavoritesPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
          <p className="text-muted-foreground">
            Quick access to your bookmarked files.
          </p>
        </div>

        <FileGrid favorites={true} />
      </div>
    </DashboardLayout>
  );
}
