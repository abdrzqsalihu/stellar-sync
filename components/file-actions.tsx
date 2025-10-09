"use client";

import { useState } from "react";
import { Star, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface FileActionsClientProps {
  fileId: string;
  initialStarred: boolean;
}

export default function FileActionsClient({
  fileId,
  initialStarred,
}: FileActionsClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleStar = async (id: string, stared: boolean) => {
    setIsLoading(true);
    try {
      await fetch(`/api/files/${id}`, {
        method: "POST",
        body: JSON.stringify({ stared: !stared }),
      });
      toast.success(
        stared ? "File removed from favorites" : "File added to favorites"
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to update favorite status");
      console.error("Error updating favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (id: string) => {
    setIsLoading(true);
    try {
      await fetch(`/api/files/${id}`, { method: "DELETE" });
      toast.success("File deleted successfully!");
      router.push("/dashboard/all-files");
    } catch (error) {
      toast.error("Failed to delete file");
      console.error("Error deleting file:", error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden rounded-2xl border shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">File Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => toggleStar(fileId, initialStarred)}
              disabled={isLoading}
              className={`rounded-xl ${
                initialStarred
                  ? "border-yellow-400 bg-yellow-50 text-yellow-600 hover:text-yellow-600 hover:bg-yellow-100"
                  : "border-[#5056FD]/20 hover:bg-[#5056FD]/5 hover:text-[#5056FD]"
              } disabled:opacity-50`}
            >
              <Star
                className={`mr-2 h-4 w-4 ${
                  initialStarred ? "fill-yellow-400 text-yellow-400" : ""
                }`}
              />
              {initialStarred ? "Favorited" : "Favorite"}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isLoading}
                  className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the file from your storage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteFile(fileId)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
