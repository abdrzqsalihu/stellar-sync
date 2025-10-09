"use client";
import {
  Calendar,
  Clock,
  FileText,
  FolderOpen,
  Home,
  LogOut,
  Settings,
  Share2,
  Star,
  User,
  Crown,
  Files,
  BadgeHelp,
  Check,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

interface DashboardLayoutProps {
  children: ReactNode;
  userData?: any;
}

export default function DashboardLayout({
  children,
  userData,
}: DashboardLayoutProps) {
  const isPro = userData?.plan === "pro" || userData?.isPro || false;
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const ProStatusSection = () => (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="rounded-lg bg-[#5056FD]/10 p-4 borde">
          <div className="flex items-center gap-2 px-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">Pro Plan Active</h4>
                <div className="inline-flex items-center rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-500">
                  <Crown className="mr-1 h-2.5 w-2.5" />
                  Pro
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Premium features unlocked
              </p>
            </div>
          </div>
          {/* <Button
            variant="outline"
            className="mt-3 w-full border-[#5056FD]/30 hover:bg-[#5056FD]/10 text-xs h-8 text-white hover:text-white"
            onClick={() => {
              toast.success("Thank you for being a Pro user!");
            }}
          >
            Manage Plan
          </Button> */}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  const UpgradeSection = () => (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="rounded-lg bg-[#5056FD]/10 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5056FD]">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Upgrade to Pro</h4>
              <p className="text-xs text-gray-400">Get more storage</p>
            </div>
          </div>
          <Button
            onClick={async () => {
              if (!user) return toast.error("User not found");

              const res = await fetch("/api/payment/subscribe", {
                method: "POST",
                body: JSON.stringify({
                  userId: user.id,
                  email: user.primaryEmailAddress?.emailAddress,
                  name: user?.fullName,
                  amount: 5,
                  plan: "pro",
                }),
              });

              const data = await res.json();
              if (data.link) {
                window.location.href = data.link;
              } else {
                toast.error("Failed to initiate payment");
              }
            }}
            className="mt-3 w-full bg-[#5056FD] hover:bg-[#4045e0] text-xs h-8"
          >
            Upgrade
          </Button>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <Sidebar className="bg-[#111827] text-white border-0">
          <SidebarHeader className="p-4 text-white bg-[#111827]">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white p-0.5">
                <Image
                  src="/favicon.png"
                  width={100}
                  height={100}
                  style={{ width: "auto", height: "auto" }}
                  quality={100}
                  placeholder="empty"
                  alt="Logo"
                />
              </div>
              <span className="font-bold text-lg">StellarSync</span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="bg-[#111827] text-white border-0">
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-400 text-xs font-medium">
                MAIN
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard"}
                      className="hover:bg-[#1c2536] hover:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#5056FD]/20 data-[active=true]:to-transparent data-[active=true]:text-white"
                    >
                      <Link href="/dashboard">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            pathname === "/dashboard"
                              ? "bg-[#5056FD]"
                              : "bg-[#1c2536]"
                          }`}
                        >
                          <Home className="h-4 w-4" />
                        </div>
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/all-files"}
                      className="hover:bg-[#1c2536] hover:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#5056FD]/20 data-[active=true]:to-transparent data-[active=true]:text-white"
                    >
                      <Link href="/dashboard/all-files">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            pathname === "/dashboard/all-files"
                              ? "bg-[#5056FD]"
                              : "bg-[#1c2536]"
                          }`}
                        >
                          <Files className="h-4 w-4" />
                        </div>
                        <span>All Files</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/favorites"}
                      className="hover:bg-[#1c2536] hover:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#5056FD]/20 data-[active=true]:to-transparent data-[active=true]:text-white"
                    >
                      <Link href="/dashboard/favorites">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            pathname === "/dashboard/favorites"
                              ? "bg-[#5056FD]"
                              : "bg-[#1c2536]"
                          }`}
                        >
                          <Star className="h-4 w-4" />
                        </div>
                        <span>Favorites</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/shared"}
                      className="hover:bg-[#1c2536] hover:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#5056FD]/20 
                      data-[active=true]:to-transparent data-[active=true]:text-white"
                    >
                      <Link href="/dashboard/shared">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            pathname === "/dashboard/shared"
                              ? "bg-[#5056FD]"
                              : "bg-[#1c2536]"
                          }`}
                        >
                          <Share2 className="h-4 w-4" />
                        </div>
                        <span>Shared</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-400 text-xs font-medium">
                CATEGORIES
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={
                          pathname === "/dashboard/all-files" &&
                          searchParams.get("category") === "document"
                        }
                        className="hover:bg-[#1c2536] hover:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#5056FD]/20 data-[active=true]:to-transparent data-[active=true]:text-white"
                      >
                        <Link href="/dashboard/all-files?category=document">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              pathname === "/dashboard/all-files" &&
                              searchParams.get("category") === "document"
                                ? "bg-[#5056FD]"
                                : "bg-[#1c2536]"
                            }`}
                          >
                            <FileText className="h-4 w-4" />
                          </div>
                          <span>Documents</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === "/dashboard/all-files" &&
                        searchParams.get("category") === "image"
                      }
                      className="hover:bg-[#1c2536] hover:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#5056FD]/20 data-[active=true]:to-transparent data-[active=true]:text-white"
                    >
                      <Link href="/dashboard/all-files?category=image">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            pathname === "/dashboard/all-files" &&
                            searchParams.get("category") === "image"
                              ? "bg-[#5056FD]"
                              : "bg-[#1c2536]"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                        </div>
                        <span>Images</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === "/dashboard/all-files" &&
                        searchParams.get("category") === "design"
                      }
                      className="hover:bg-[#1c2536] hover:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#5056FD]/20 data-[active=true]:to-transparent data-[active=true]:text-white"
                    >
                      <Link href="/dashboard/all-files?category=design">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            pathname === "/dashboard/all-files" &&
                            searchParams.get("category") === "design"
                              ? "bg-[#5056FD]"
                              : "bg-[#1c2536]"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="m14 2 6 6-10 10L2 10l6-6" />
                            <path d="m14 2 6 6-10 10L2 10l6-6" />
                            <path d="M9 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                            <path d="m9 12 5-5" />
                            <path d="M22 22H2" />
                          </svg>
                        </div>
                        <span>Design Files</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === "/dashboard/all-files" &&
                        searchParams.get("category") === "audio"
                      }
                      className="hover:bg-[#1c2536] hover:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#5056FD]/20 data-[active=true]:to-transparent data-[active=true]:text-white"
                    >
                      <Link href="/dashboard/all-files?category=audio">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            pathname === "/dashboard/all-files" &&
                            searchParams.get("category") === "audio"
                              ? "bg-[#5056FD]"
                              : "bg-[#1c2536]"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="m4 8 2-2m0 0 2-2M6 6 4 4m2 2 2 2" />
                            <rect width="6" height="12" x="14" y="6" rx="2" />
                            <path d="M4 16a6 6 0 0 1 6-6" />
                            <path d="M4 20a10 10 0 0 1 10-10" />
                          </svg>
                        </div>
                        <span>Audio</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === "/dashboard/all-files" &&
                        searchParams.get("category") === "video"
                      }
                      className="hover:bg-[#1c2536] hover:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#5056FD]/20 data-[active=true]:to-transparent data-[active=true]:text-white"
                    >
                      <Link href="/dashboard/all-files?category=video">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            pathname === "/dashboard/all-files" &&
                            searchParams.get("category") === "video"
                              ? "bg-[#5056FD]"
                              : "bg-[#1c2536]"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="m10 7 5 3-5 3Z" />
                            <rect width="20" height="14" x="2" y="3" rx="2" />
                            <path d="M12 17v4" />
                            <path d="M8 21h8" />
                          </svg>
                        </div>
                        <span>Videos</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* <SidebarGroup>
              <SidebarGroupLabel className="text-gray-400 text-xs font-medium">
                TOOLS
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-[#1c2536] hover:text-white"
                    >
                      <Link href="#">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c2536]">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <span>Recent Files</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-[#1c2536] hover:text-white"
                    >
                      <Link href="#">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c2536]">
                          <Clock className="h-4 w-4" />
                        </div>
                        <span>File History</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-[#1c2536] hover:text-white"
                    >
                      <Link href="#">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c2536]">
                          <FolderOpen className="h-4 w-4" />
                        </div>
                        <span>Trash</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup> */}

            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-400 text-xs font-medium">
                ACCOUNT
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/subscription"}
                      className="hover:bg-[#1c2536] hover:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#5056FD]/20 data-[active=true]:to-transparent data-[active=true]:text-white"
                    >
                      <Link href="/dashboard/subscription">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            pathname === "/dashboard/subscription"
                              ? "bg-[#5056FD]"
                              : "bg-[#1c2536]"
                          }`}
                        >
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <span>Subscription</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/user-profile"}
                      className="hover:bg-[#1c2536] hover:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#5056FD]/20 data-[active=true]:to-transparent data-[active=true]:text-white"
                    >
                      <Link href="/dashboard/user-profile">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            pathname === "/dashboard/user-profile"
                              ? "bg-[#5056FD]"
                              : "bg-[#1c2536]"
                          }`}
                        >
                          <Settings className="h-4 w-4" />
                        </div>
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-[#1c2536] hover:text-white"
                    >
                      <div
                        onClick={() => signOut(() => router.push("/"))}
                        className="cursor-pointer"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c2536]">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <span>Logout</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="bg-[#111827] text-white border-0">
            {/* Upgrade section in sidebar */}
            {isPro ? <ProStatusSection /> : <UpgradeSection />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 hover:bg-[#1c2536] text-white mt-2"
                >
                  <UserButton />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {user?.fullName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {user?.primaryEmailAddress.emailAddress}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/dashboard/user-profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut(() => router.push("/"))}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-md">
            <SidebarTrigger />

            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <div className="ml-auto flex items-center gap-4 md:gap-6">
                <ThemeToggle />

                <a
                  href="https://wa.me/+2348085458632"
                  target="_blank"
                  aria-label="WhatsApp Profile"
                  // className="mr-8 hidden md:block"
                >
                  <BadgeHelp
                    size={22}
                    strokeWidth={1.3}
                    // className="mr-8 hidden md:block"
                    color="#5056FD"
                  />
                </a>

                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
