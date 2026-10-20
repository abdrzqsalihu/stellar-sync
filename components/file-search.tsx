"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "./ui/input";

// Debounced so typing doesn't trigger a server navigation on every keystroke.
const DEBOUNCE_MS = 300;

export default function FileSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onSearchPage = pathname === "/dashboard/search";

  const [value, setValue] = useState(onSearchPage ? searchParams.get("q") ?? "" : "");
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Keep the box in sync if the URL changes from elsewhere (e.g. back/forward)
  useEffect(() => {
    if (onSearchPage) {
      setValue(searchParams.get("q") ?? "");
    }
  }, [onSearchPage, searchParams]);

  const navigate = (query: string) => {
    startTransition(() => {
      if (query.trim()) {
        router.push(`/dashboard/search?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push("/dashboard/search");
      }
    });
  };

  const handleChange = (next: string) => {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => navigate(next), DEBOUNCE_MS);
  };

  const clear = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setValue("");
    navigate("");
  };

  return (
    <div className="relative w-full max-w-sm md:max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        role="searchbox"
        aria-label="Search files"
        placeholder="Search your files..."
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            navigate(value);
          } else if (e.key === "Escape") {
            clear();
          }
        }}
        className="rounded-lg border-[#5056FD]/20 pl-9 pr-9 focus-visible:ring-[#5056FD]/20"
      />
      {isPending ? (
        // Centering transform lives on the wrapper, not the icon: combining
        // -translate-y-1/2 and animate-spin on one element makes Tailwind's
        // spin keyframe (transform: rotate(360deg)) clobber the translate,
        // so the browser interpolates between the two and the icon bobs
        // up and down instead of spinning in place.
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </span>
      ) : (
        value && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-[#5056FD]/10 hover:text-[#5056FD]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )
      )}
    </div>
  );
}
