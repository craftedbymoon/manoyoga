"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import {
  CalendarRange,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  FileText,
  Mail,
  Phone,
  Trash2,
  Edit,
  Eye,
  Calendar,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { getBookings, deleteBooking, updateBookingStatus } from "@/lib/actions/booking";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  paymentStatus: "Paid" | "Pending" | "Refunded";
}

export default function BookingManagementPage() {
  const shouldReduceMotion = useReducedMotion();
  const [isLoading, setIsLoading] = React.useState(true);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [programFilter, setProgramFilter] = React.useState("All");
  const [dateFilter, setDateFilter] = React.useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  // Action state managers
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Booking | null>(null);
  const [viewTarget, setViewTarget] = React.useState<Booking | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getBookings();
      if (data) {
        const mapped: Booking[] = data.map((b: any) => ({
          id: b.id,
          name: b.name,
          email: b.email,
          phone: b.phone,
          program: b.service?.name || "Yoga Session",
          date: b.date,
          time: b.time,
          status: b.status as any,
          paymentStatus: b.paymentStatus as any,
          mode: b.mode,
          message: b.message || ""
        }));
        setBookings(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBookings();
  }, []);

  // Filter Actions
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const matchesProgram = programFilter === "All" || b.program === programFilter;
    const matchesDate = !dateFilter || b.date === dateFilter;

    return matchesSearch && matchesStatus && matchesProgram && matchesDate;
  });

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + rowsPerPage);

  // Statistics counters
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
  const cancelledCount = bookings.filter((b) => b.status === "Cancelled").length;

  const stats = [
    { label: "Total Bookings", value: totalCount, change: "+12.5%", trend: "up", icon: CalendarRange, desc: "Cumulative reserves" },
    { label: "Pending Approval", value: pendingCount, change: "Needs review", trend: "neutral", icon: Clock, desc: "Awaiting slot validation" },
    { label: "Confirmed Slots", value: confirmedCount, change: "+8.2%", trend: "up", icon: CheckCircle2, desc: "Active yoga session matches" },
    { label: "Cancelled Sessions", value: cancelledCount, change: "Refunded matches", trend: "down", icon: XCircle, desc: "Closed booking slots" }
  ];

  const handleDelete = async () => {
    if (deleteTarget) {
      try {
        const res = await deleteBooking(deleteTarget.id);
        if (res.success) {
          setBookings((prev) => prev.filter((b) => b.id !== deleteTarget.id));
          setDeleteTarget(null);
        } else {
          alert("Failed to delete booking.");
        }
      } catch (err) {
        alert("Delete failed due to authorization issues.");
      }
    }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="space-y-8 font-sans pb-12 select-none">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6 text-left">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Booking Management
          </h1>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed">
            Manage all yoga class bookings from one place.
          </p>
        </div>
        <Button variant="default" className="shrink-0 flex items-center justify-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Booking</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border border-border/80 bg-card shadow-sm hover:border-accent/40 transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase font-sans">
                    {stat.label}
                  </span>
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold tracking-tight text-foreground font-sans">
                    {isLoading ? "..." : stat.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-semibold flex items-center space-x-1 font-sans">
                    <span>{stat.desc}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Toolbar Filters Row */}
      <Card className="border border-border/80 bg-card/60 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-grow">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
              <input
                type="text"
                placeholder="Search name, ID, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md border border-border bg-background/50 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 h-8 font-sans"
                aria-label="Search bookings"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-3 pr-8 py-1.5 text-xs rounded-md border border-border bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent h-8 cursor-pointer font-sans appearance-none min-w-[120px]"
                aria-label="Filter by Status"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
            </div>

            {/* Program Filter */}
            <div className="relative">
              <select
                value={programFilter}
                onChange={(e) => {
                  setProgramFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-3 pr-8 py-1.5 text-xs rounded-md border border-border bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent h-8 cursor-pointer font-sans appearance-none min-w-[150px]"
                aria-label="Filter by Program"
              >
                <option value="All">All Programs</option>
                <option value="Beginner Yoga">Beginner Yoga</option>
                <option value="Meditation & Breathing">Meditation & Breathing</option>
                <option value="Private Wellness">Private Wellness</option>
                <option value="Power Yoga Core">Power Yoga Core</option>
                <option value="Corporate Mindfulness">Corporate Mindfulness</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
            </div>

            {/* Date Picker Filter */}
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-3 pr-4 py-1.5 text-xs rounded-md border border-border bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent h-8 cursor-pointer font-sans min-w-[140px]"
                aria-label="Filter by Booking Date"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Button variant="outline" size="sm" className="h-8 flex items-center space-x-1.5 text-xs font-semibold">
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table Container */}
      {isLoading ? (
        // Skeleton Loader
        <Card className="border border-border/80 bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="h-12 bg-primary/5 border-b border-border/60 animate-pulse" />
            <div className="divide-y divide-border/40">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 p-4 flex items-center justify-between animate-pulse">
                  <div className="flex space-x-4 items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/5" />
                    <div className="space-y-1.5">
                      <div className="h-4.5 w-32 bg-primary/5 rounded" />
                      <div className="h-3.5 w-24 bg-primary/5 rounded" />
                    </div>
                  </div>
                  <div className="h-8 w-20 bg-primary/5 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : paginatedBookings.length === 0 ? (
        // Elegant Empty State
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto text-accent shadow-sm">
            <CalendarRange className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground font-sans">No Bookings Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto font-sans leading-relaxed">
              We couldn't find any booking records matching your filters. Try clearing your filters or search keywords.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setProgramFilter("All");
              setDateFilter("");
            }}
          >
            Clear Filters
          </Button>
        </motion.div>
      ) : (
        // Dynamic Desktop & Mobile Views
        <div className="space-y-4">
          {/* A. Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-border/80 rounded-xl bg-card shadow-sm">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-primary/5 select-none text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 font-bold font-sans">ID</th>
                  <th className="p-4 font-bold font-sans">Student</th>
                  <th className="p-4 font-bold font-sans">Program</th>
                  <th className="p-4 font-bold font-sans">Date & Time</th>
                  <th className="p-4 font-bold font-sans">Status</th>
                  <th className="p-4 font-bold font-sans">Payment</th>
                  <th className="p-4 font-bold font-sans text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-primary/5 transition-colors">
                    <td className="p-4 font-mono font-semibold text-foreground text-xs">{b.id}</td>
                    <td className="p-4 space-y-0.5">
                      <p className="font-semibold text-foreground font-sans">{b.name}</p>
                      <p className="text-[10px] text-muted-foreground font-sans">{b.email}</p>
                    </td>
                    <td className="p-4 text-muted-foreground font-sans">{b.program}</td>
                    <td className="p-4 font-sans text-xs">
                      <p className="font-semibold text-foreground">{b.date}</p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">{b.time}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === "Confirmed"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : b.status === "Pending"
                            ? "bg-amber-500/10 text-amber-600"
                            : b.status === "Completed"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-rose-500/10 text-rose-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.paymentStatus === "Paid"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : b.paymentStatus === "Pending"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-rose-500/10 text-rose-600"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-center relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setActiveMenuId(activeMenuId === b.id ? null : b.id)}
                        className="h-8 w-8 rounded-md border border-border/40 hover:bg-primary/5"
                        aria-label="Open action menu"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      
                      {/* Context action menu dropdown */}
                      <AnimatePresence>
                        {activeMenuId === b.id && (
                          <>
                            {/* Tap click-out backdrop */}
                            <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 5 }}
                              className="absolute right-4 mt-1 w-32 rounded-lg border border-border bg-card shadow-lg py-1 z-40 text-left"
                            >
                              <button
                                onClick={() => {
                                  setViewTarget(b);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => setActiveMenuId(null)}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <Edit className="h-3.5 w-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteTarget(b);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-500/10 font-sans cursor-pointer border-t border-border/40"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete</span>
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* B. Mobile Card Layout View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {paginatedBookings.map((b) => (
              <Card key={b.id} className="border border-border bg-card/70 shadow-sm text-left">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground bg-primary/5 px-2 py-0.5 rounded border border-border/60">
                      {b.id}
                    </span>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-primary/5 ${b.status === "Confirmed" ? "text-emerald-600" : b.status === "Pending" ? "text-amber-600" : "text-rose-600"}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-foreground font-sans">{b.name}</h4>
                    <p className="text-xs text-muted-foreground font-sans">{b.program}</p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-sans border-t border-border/40 pt-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{b.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{b.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      Payment: <span className={b.paymentStatus === "Paid" ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>{b.paymentStatus}</span>
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setViewTarget(b)}
                        className="h-7 w-7 rounded border-border/60"
                        aria-label="View booking"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteTarget(b)}
                        className="h-7 w-7 rounded border-border/60 text-rose-500 hover:bg-rose-500/5 hover:text-rose-600"
                        aria-label="Delete booking"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls Footer Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/40 select-none">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground font-sans">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-border/60 bg-background rounded p-1 text-xs text-foreground cursor-pointer font-sans"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="pl-2">
                Showing {startIndex + 1}–{Math.min(startIndex + rowsPerPage, filteredBookings.length)} of {filteredBookings.length}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="text-muted-foreground font-sans">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="h-8 w-8 rounded border-border/60"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="h-8 w-8 rounded border-border/60"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog Overlay */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTarget(null)}
              className="fixed inset-0 bg-black"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-sm w-full rounded-2xl p-6 shadow-2xl z-10 text-left space-y-4"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-dialog-title"
              aria-describedby="delete-dialog-desc"
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2 bg-rose-500/10 rounded-full text-rose-500 shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 id="delete-dialog-title" className="text-sm sm:text-base font-bold text-foreground font-sans">
                    Delete Booking
                  </h3>
                  <p id="delete-dialog-desc" className="text-xs text-muted-foreground font-sans leading-normal">
                    Are you sure you want to delete the booking record for <span className="font-semibold text-foreground">{deleteTarget.name}</span>? This action is permanent.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3.5 pt-2">
                <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
                  Cancel
                </Button>
                <Button variant="default" size="sm" onClick={handleDelete} className="bg-rose-600 text-white hover:bg-rose-500">
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. View Details Modal Overlay */}
      <AnimatePresence>
        {viewTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewTarget(null)}
              className="fixed inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-md w-full rounded-2xl shadow-2xl z-10 overflow-hidden text-left"
              role="dialog"
              aria-modal="true"
              aria-labelledby="view-dialog-title"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-border/80 flex justify-between items-center bg-primary/5">
                <div>
                  <h3 id="view-dialog-title" className="text-sm sm:text-base font-bold text-foreground font-sans">
                    Booking Detail
                  </h3>
                  <span className="font-mono text-[10px] text-muted-foreground">{viewTarget.id}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setViewTarget(null)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                
                {/* Student Personal Info */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-sans">
                    Student Details
                  </span>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-foreground font-sans">{viewTarget.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground font-sans">
                      <Mail className="h-4 w-4" />
                      <span>{viewTarget.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground font-sans">
                      <Phone className="h-4 w-4" />
                      <span>{viewTarget.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Session details */}
                <div className="space-y-3 border-t border-border/45 pt-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-sans">
                    Session & Program
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-sans">Program</p>
                      <p className="text-xs font-semibold text-foreground font-sans mt-0.5">{viewTarget.program}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-sans">Booking Date</p>
                      <p className="text-xs font-semibold text-foreground font-sans mt-0.5">{viewTarget.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-sans">Slot Time</p>
                      <p className="text-xs font-semibold text-foreground font-sans mt-0.5">{viewTarget.time}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-sans">Confirmation</p>
                      <select
                        value={viewTarget.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value as any;
                          try {
                            const res = await updateBookingStatus(viewTarget.id, newStatus);
                            if (res.success) {
                              setViewTarget({ ...viewTarget, status: newStatus });
                              fetchBookings();
                            } else {
                              alert("Failed to update status.");
                            }
                          } catch (err) {
                            alert("Authorization failed for updating status.");
                          }
                        }}
                        className="text-[10px] font-bold border border-border bg-background rounded p-1 text-foreground cursor-pointer font-sans mt-0.5"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment summary */}
                <div className="space-y-3 border-t border-border/45 pt-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-sans">
                    Payment Status
                  </span>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-sans">Receipt Billing</p>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 mt-1">
                      {viewTarget.paymentStatus}
                    </span>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border/80 bg-primary/5 flex justify-end space-x-3">
                <Button variant="default" size="sm" onClick={() => setViewTarget(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
