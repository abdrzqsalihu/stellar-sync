import { ExternalLink, Folders, LayoutGrid, Star } from "lucide-react";

// Navigiation link
export const navLinks = [
  {
    id: "./",
    title: "Home",
  },
  {
    id: "/#features",
    title: "Features",
  },
  {
    id: "/#pricing",
    title: "Pricing",
  },
];

// Navigiation link
export const sidebarLinks = [
  {
    id: 1,
    name: "Dashboard",
    icon: LayoutGrid,
    path: "/home",
  },
  {
    id: 2,
    name: "All files",
    icon: Folders,
    path: "/files",
  },
  {
    id: 3,
    name: "Shared files",
    icon: ExternalLink,
    path: "/shared",
  },
  {
    id: 4,
    name: "Stared files",
    icon: Star,
    path: "/stared",
  },
];
