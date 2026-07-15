"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarRange,
  Briefcase,
  FileText,
  Image as ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  Mail,
  Inbox,
  Users,
  Settings,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  Sun,
  Moon,
  User,
  ChevronDown,
  Flame
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Auto-close mobile drawer on route change
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileOpen(false);
  }, [pathname]);

  // Click outside handlers
  const profileRef = React.useRef<HTMLDivElement>(null);
  const notifRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Menu items list matching requested structure
  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarRange },
    { label: "Services", href: "/admin/services", icon: Briefcase },
    { label: "Blog", href: "/admin/blog", icon: FileText },
    { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
    { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { label: "Messages", href: "/admin/messages", icon: Inbox },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Website Settings", href: "/admin/settings", icon: Settings },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 }
  ];

  // Breadcrumbs generation
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = seg.charAt(0).toUpperCase() + seg.slice(1);
    return { label, href };
  });

  const handleLogout = () => {
    // Placeholder logout behavior redirecting to admin login
    router.push("/admin/login");
  };

  // Don't render layout components on login screen to keep it clean
  const isLoginPage = pathname === "/admin/login";
  if (isLoginPage) {
    return <div className="min-h-screen bg-background font-sans">{children}</div>;
  }

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <div className="min-h-screen flex bg-background/95 dark:bg-zinc-950 font-sans text-foreground">
      {/* 1. Desktop Sidebar Container */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border/80 bg-card/40 backdrop-blur-sm sticky top-0 h-screen transition-all duration-300 z-30 select-none",
          sidebarWidth
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/80 shrink-0">
          <Link href="/admin/dashboard" className="flex items-center space-x-2.5 font-bold text-foreground">
            <Flame className="h-5 w-5 text-accent animate-pulse shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-base tracking-tight font-sans"
              >
                ManoYoga Admin
              </motion.span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex h-7 w-7 rounded-md border border-border/60 hover:bg-primary/5"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "flex items-center space-x-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group",
                    isActive
                      ? "bg-accent/15 text-accent font-semibold"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-accent" : "text-muted-foreground")} />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="whitespace-nowrap font-sans"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Logout action) */}
        <div className="p-4 border-t border-border/80 shrink-0">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center space-x-3.5 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors duration-200 cursor-pointer text-left font-sans"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="font-sans">Logout</span>}
          </button>
        </div>
      </aside>

      {/* 2. Mobile Nav Overlay/Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Mobile Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-card border-r border-border z-50 md:hidden flex flex-col justify-between"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                  <div className="flex items-center space-x-2.5 font-bold text-foreground">
                    <Flame className="h-5 w-5 text-accent shrink-0" />
                    <span className="font-sans">ManoYoga Admin</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)} aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Menu Nav */}
                <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
                        <span
                          className={cn(
                            "flex items-center space-x-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer block",
                            isActive
                              ? "bg-accent/15 text-accent font-semibold"
                              : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0 inline-block mr-2" />
                          <span className="font-sans">{item.label}</span>
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Logout */}
              <div className="p-4 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3.5 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors duration-200 cursor-pointer text-left"
                >
                  <LogOut className="h-5 w-5 shrink-0 mr-2" />
                  <span className="font-sans">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. Main content area wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border/80 bg-card/30 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6 shrink-0">
          {/* Mobile Menu Trigger & Breadcrumbs */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden h-9 w-9 rounded-md border border-border/60 hover:bg-primary/5"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground select-none" aria-label="Breadcrumb">
              <Link href="/admin/dashboard" className="hover:text-foreground transition-colors font-sans">
                Admin
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.href}>
                  <span className="text-muted-foreground/60">/</span>
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="text-foreground font-semibold font-sans">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-foreground transition-colors font-sans">
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Search bar & Controls */}
          <div className="flex items-center space-x-4">
            {/* Search Input Box */}
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
              <input
                type="text"
                placeholder="Search settings, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md border border-border bg-background/50 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 h-8"
                aria-label="Search admin panel"
              />
            </div>

            {/* Light/Dark mode toggler */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-8 w-8 rounded-md border border-border/60 hover:bg-primary/5"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </Button>
            )}

            {/* Notifications Button */}
            <div className="relative" ref={notifRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="h-8 w-8 rounded-md border border-border/60 hover:bg-primary/5"
                aria-label="View notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
              </Button>
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card shadow-lg p-4 text-left z-50 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-xs font-bold text-foreground font-sans">Notifications</span>
                      <span className="text-[10px] text-accent font-semibold cursor-pointer hover:underline">Mark all as read</span>
                    </div>
                    <div className="space-y-2.5 max-h-60 overflow-y-auto">
                      <div className="p-2.5 rounded-lg bg-primary/5 border border-border/40 space-y-1">
                        <p className="text-xs font-semibold text-foreground font-sans">New Class Booking</p>
                        <p className="text-[11px] text-muted-foreground leading-normal font-sans">A new student booked Beginner Yoga for Thursday.</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-background border border-border/40 space-y-1">
                        <p className="text-xs font-semibold text-foreground font-sans">Newsletter Subscriber</p>
                        <p className="text-[11px] text-muted-foreground leading-normal font-sans">shubh@gmail.com subscribed to the weekly newsletter.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border border-border/60 hover:bg-primary/5 transition-colors cursor-pointer select-none"
                aria-label="User menu"
              >
                <div className="h-6.5 w-6.5 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-foreground font-sans">Nistha</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card shadow-lg py-1.5 text-left z-50"
                  >
                    <div className="px-3.5 py-2 border-b border-border">
                      <p className="text-xs font-bold text-foreground font-sans">Nistha</p>
                      <p className="text-[10px] text-muted-foreground truncate font-sans">nistha@manoyoga.com</p>
                    </div>
                    <Link href="/admin/settings" onClick={() => setIsProfileOpen(false)} className="block px-3.5 py-2 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground transition-colors font-sans">
                      Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3.5 py-2 text-xs text-rose-500 hover:bg-rose-500/10 transition-colors font-sans cursor-pointer"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-zinc-50/50 dark:bg-zinc-950/20">
          {children}
        </main>
      </div>
    </div>
  );
}
