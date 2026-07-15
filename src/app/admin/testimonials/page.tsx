"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import {
  MessageSquare,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  ThumbsUp,
  Trash2,
  X,
  AlertTriangle,
  Clock,
  User,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  program: "Beginner Yoga" | "Power Yoga" | "Meditation" | "Corporate Yoga" | "Online Yoga";
  rating: number;
  reviewText: string;
  status: "Published" | "Pending" | "Rejected";
  featured: boolean;
  createdDate: string;
}

export default function TestimonialsManagementPage() {
  const shouldReduceMotion = useReducedMotion();
  const [isLoading, setIsLoading] = React.useState(true);
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [search, setSearch] = React.useState("");
  const [ratingFilter, setRatingFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("date-desc");

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Overlay state managers
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Testimonial | null>(null);
  const [previewTarget, setPreviewTarget] = React.useState<Testimonial | null>(null);
  const [viewTarget, setViewTarget] = React.useState<Testimonial | null>(null);
  
  // Form dialog state managers
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Testimonial | null>(null);

  // Load Mock Data
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const mockData: Testimonial[] = [
        {
          id: "TEST-101",
          name: "Ananya Kapoor",
          avatar: "/about-nistha.jpg",
          program: "Beginner Yoga",
          rating: 5,
          reviewText: "Nistha's beginner sessions completely resolved my chronic shoulder stiffness. Her slow holds and patient guidance made me feel extremely welcome.",
          status: "Published",
          featured: true,
          createdDate: "2026-07-10"
        },
        {
          id: "TEST-102",
          name: "Aarav Gupta",
          avatar: "/why-choose-yoga.jpg",
          program: "Meditation",
          rating: 5,
          reviewText: "Pranayama deep breathing breaks reset my workplace stress. I feel a lot clearer and my sleep has significantly improved.",
          status: "Published",
          featured: true,
          createdDate: "2026-07-12"
        },
        {
          id: "TEST-103",
          name: "Diya Patel",
          avatar: "/gallery-1.jpg",
          program: "Online Yoga",
          rating: 4,
          reviewText: "Wonderful interactive live flows from home. I love how she checks my posture through the camera and suggests custom variations.",
          status: "Published",
          featured: false,
          createdDate: "2026-07-08"
        },
        {
          id: "TEST-104",
          name: "Kabir Mehta",
          avatar: "/gallery-2.jpg",
          program: "Power Yoga",
          rating: 5,
          reviewText: "The core vinyasa workout is athletic and sweat-inducing. It is highly challenging and perfect for building endurance.",
          status: "Published",
          featured: true,
          createdDate: "2026-07-05"
        },
        {
          id: "TEST-105",
          name: "Meera Nair",
          avatar: "/gallery-3.jpg",
          program: "Corporate Yoga",
          rating: 5,
          reviewText: "Our tech team loves Nistha's desk stretch breaks. It has boosted our team spirit and released screen-time fatigue.",
          status: "Published",
          featured: false,
          createdDate: "2026-07-13"
        },
        {
          id: "TEST-106",
          name: "Rohan Sen",
          avatar: "/gallery-1.jpg",
          program: "Beginner Yoga",
          rating: 3,
          reviewText: "Classes are great but sometimes the studio gets a bit crowded. Looking forward to private one-on-one sessions next.",
          status: "Pending",
          featured: false,
          createdDate: "2026-07-14"
        },
        {
          id: "TEST-107",
          name: "Kirti Verma",
          avatar: "/gallery-2.jpg",
          program: "Meditation",
          rating: 5,
          reviewText: "Absolutely peaceful sunset breathing routines. Decompresses daily anxieties instantly.",
          status: "Published",
          featured: false,
          createdDate: "2026-07-09"
        },
        {
          id: "TEST-108",
          name: "Devansh Gill",
          avatar: "/gallery-3.jpg",
          program: "Power Yoga",
          rating: 4,
          reviewText: "Strong transitions and excellent music tracks. Nistha brings positive vibes to the studio.",
          status: "Published",
          featured: false,
          createdDate: "2026-07-07"
        },
        {
          id: "TEST-109",
          name: "Sneha Reddy",
          avatar: "/gallery-1.jpg",
          program: "Online Yoga",
          rating: 5,
          reviewText: "I never thought I could learn alignment online. She catches tiny errors easily and supports safety adjustments.",
          status: "Pending",
          featured: false,
          createdDate: "2026-07-15"
        },
        {
          id: "TEST-110",
          name: "Varun Malhotra",
          avatar: "/gallery-2.jpg",
          program: "Corporate Yoga",
          rating: 5,
          reviewText: "Outstanding chair mobility classes. A must-try for corporate desk employees.",
          status: "Published",
          featured: false,
          createdDate: "2026-07-06"
        }
      ];

      // Pad mock data to 15 items
      const paddedData = [...mockData];
      for (let i = 0; i < 5; i++) {
        const template = mockData[i % mockData.length];
        paddedData.push({
          ...template,
          id: `TEST-${111 + i}`,
          name: `${template.name} II`,
          rating: i % 2 === 0 ? 5 : 4,
          status: i % 3 === 0 ? "Pending" : "Published",
          featured: false,
          createdDate: `2026-07-0${i + 1}`
        });
      }
      setTestimonials(paddedData);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const initialFormState: Omit<Testimonial, "id" | "createdDate"> = {
    name: "",
    avatar: "/gallery-1.jpg",
    program: "Beginner Yoga",
    rating: 5,
    reviewText: "",
    status: "Pending",
    featured: false
  };

  const [formState, setFormState] = React.useState(initialFormState);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormState((prev) => ({ ...prev, [name]: val }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTestimonial: Testimonial = {
      ...formState,
      id: `TEST-${Date.now().toString().slice(-3)}`,
      rating: Number(formState.rating),
      createdDate: new Date().toISOString().split("T")[0]
    };
    setTestimonials((prev) => [newTestimonial, ...prev]);
    setIsAddOpen(false);
    setFormState(initialFormState);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === editTarget.id
          ? {
              ...t,
              ...formState,
              rating: Number(formState.rating)
            }
          : t
      )
    );
    setEditTarget(null);
    setFormState(initialFormState);
  };

  const handleApprove = (test: Testimonial) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === test.id ? { ...t, status: "Published" } : t))
    );
  };

  const handleReject = (test: Testimonial) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === test.id ? { ...t, status: "Rejected" } : t))
    );
  };

  const handleToggleFeature = (test: Testimonial) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === test.id ? { ...t, featured: !t.featured } : t))
    );
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  // Filter & Sort Logic
  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.reviewText.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());

    const matchesRating = ratingFilter === "All" || t.rating === Number(ratingFilter);
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;

    return matchesSearch && matchesRating && matchesStatus;
  });

  const sortedTestimonials = [...filteredTestimonials].sort((a, b) => {
    if (sortBy === "date-desc") return b.createdDate.localeCompare(a.createdDate);
    if (sortBy === "date-asc") return a.createdDate.localeCompare(b.createdDate);
    if (sortBy === "rating-desc") return b.rating - a.rating;
    return 0;
  });

  // Pagination Bounds
  const totalPages = Math.max(1, Math.ceil(sortedTestimonials.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedTestimonials = sortedTestimonials.slice(startIndex, startIndex + rowsPerPage);

  // Statistics counters
  const totalCount = testimonials.length;
  const publishedCount = testimonials.filter((t) => t.status === "Published").length;
  const pendingCount = testimonials.filter((t) => t.status === "Pending").length;
  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / testimonials.length).toFixed(1)
      : "0";

  const stats = [
    { label: "Total Testimonials", value: totalCount, change: "Submitted reviews", icon: MessageSquare },
    { label: "Published Reviews", value: publishedCount, change: "Active on site", icon: CheckCircle2 },
    { label: "Pending Review", value: pendingCount, change: "Awaiting check", icon: Clock },
    { label: "Average Rating", value: `${avgRating} ★`, change: "Student feedback score", icon: Star }
  ];

  return (
    <div className="space-y-8 font-sans pb-12 select-none">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6 text-left">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Testimonials Management
          </h1>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed">
            Manage student reviews and success stories displayed on the website.
          </p>
        </div>
        <Button
          variant="default"
          onClick={() => {
            setFormState(initialFormState);
            setIsAddOpen(true);
          }}
          className="shrink-0 flex items-center justify-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
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
                    <span>{stat.change}</span>
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
                placeholder="Search reviewer, text, ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md border border-border bg-background/50 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 h-8 font-sans"
                aria-label="Search reviews"
              />
            </div>

            {/* Rating Filter */}
            <div className="relative">
              <select
                value={ratingFilter}
                onChange={(e) => {
                  setRatingFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-3 pr-8 py-1.5 text-xs rounded-md border border-border bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent h-8 cursor-pointer font-sans appearance-none min-w-[120px]"
                aria-label="Filter by Rating"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
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
                <option value="Published">Published</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-3 pr-8 py-1.5 text-xs rounded-md border border-border bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent h-8 cursor-pointer font-sans appearance-none min-w-[130px]"
                aria-label="Sort options"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="rating-desc">Rating (High to Low)</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
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

      {/* Main Table Content Container */}
      {isLoading ? (
        // Skeleton Loaders
        <Card className="border border-border/80 bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="h-12 bg-primary/5 border-b border-border/60 animate-pulse" />
            <div className="divide-y divide-border/40">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 p-4 flex items-center justify-between animate-pulse">
                  <div className="flex space-x-4 items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/5" />
                    <div className="space-y-1.5">
                      <div className="h-4.5 w-36 bg-primary/5 rounded" />
                      <div className="h-3.5 w-48 bg-primary/5 rounded" />
                    </div>
                  </div>
                  <div className="h-8 w-16 bg-primary/5 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : paginatedTestimonials.length === 0 ? (
        // Empty State
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto text-accent shadow-sm">
            <MessageSquare className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground font-sans">No Testimonials Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto font-sans leading-relaxed">
              We couldn&apos;t find any student reviews matching your filters. Try clearing your filters or search keywords.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setRatingFilter("All");
              setStatusFilter("All");
              setSortBy("date-desc");
            }}
          >
            Clear Filters
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* A. Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-border/80 rounded-xl bg-card shadow-sm">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-primary/5 select-none text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 font-bold font-sans">Avatar</th>
                  <th className="p-4 font-bold font-sans">Student Name</th>
                  <th className="p-4 font-bold font-sans">Program</th>
                  <th className="p-4 font-bold font-sans">Rating</th>
                  <th className="p-4 font-bold font-sans">Review Preview</th>
                  <th className="p-4 font-bold font-sans">Status</th>
                  <th className="p-4 font-bold font-sans">Featured</th>
                  <th className="p-4 font-bold font-sans text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedTestimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-primary/5 transition-colors">
                    <td className="p-4">
                      <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border bg-muted">
                        <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="36px" />
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-foreground font-sans">{t.name}</td>
                    <td className="p-4 text-muted-foreground font-sans">{t.program}</td>
                    <td className="p-4">
                      <div className="flex items-center text-amber-500 space-x-0.5">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current shrink-0" />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="text-muted-foreground truncate font-sans">{t.reviewText}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === "Published"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : t.status === "Pending"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-rose-500/10 text-rose-600"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 font-sans text-xs">
                      <span className={t.featured ? "text-accent font-bold" : "text-muted-foreground"}>
                        {t.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-4 text-center relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setActiveMenuId(activeMenuId === t.id ? null : t.id)}
                        className="h-8 w-8 rounded-md border border-border/40 hover:bg-primary/5"
                        aria-label="Open actions menu"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>

                      {/* Dropdown options */}
                      <AnimatePresence>
                        {activeMenuId === t.id && (
                          <>
                            <div className="fixed inset-0 z-35" onClick={() => setActiveMenuId(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 5 }}
                              className="absolute right-4 mt-1 w-36 rounded-lg border border-border bg-card shadow-lg py-1 z-40 text-left"
                            >
                              <button
                                onClick={() => {
                                  setViewTarget(t);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>View Details</span>
                              </button>
                              <button
                                onClick={() => {
                                  setFormState({
                                    name: t.name,
                                    avatar: t.avatar,
                                    program: t.program,
                                    rating: t.rating,
                                    reviewText: t.reviewText,
                                    status: t.status,
                                    featured: t.featured
                                  });
                                  setEditTarget(t);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setPreviewTarget(t);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer border-t border-border/40"
                              >
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Preview Card</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleToggleFeature(t);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <ThumbsUp className="h-3.5 w-3.5" />
                                <span>{t.featured ? "Unfeature" : "Feature"}</span>
                              </button>
                              {t.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => {
                                      handleApprove(t);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50/10 font-sans cursor-pointer border-t border-border/40"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleReject(t);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50/10 font-sans cursor-pointer"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  setDeleteTarget(t);
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

          {/* B. Mobile Cards View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {paginatedTestimonials.map((t) => (
              <Card key={t.id} className="border border-border bg-card/70 shadow-sm text-left">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border bg-muted shrink-0">
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-foreground font-sans">{t.name}</h4>
                        {t.featured && <span className="text-[9px] font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">Featured</span>}
                      </div>
                      <p className="text-xs text-muted-foreground font-sans">{t.program}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-500 space-x-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current shrink-0" />
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground leading-normal font-sans italic">
                    &quot;{t.reviewText}&quot;
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-sans border-t border-border/40 pt-3">
                    <span>{t.createdDate}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-primary/5 ${t.status === "Published" ? "text-emerald-600" : "text-amber-600"}`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="flex justify-end space-x-2 pt-1 border-t border-border/40">
                    <Button variant="outline" size="icon" onClick={() => setPreviewTarget(t)} className="h-7 w-7 rounded border-border/60">
                      <Sparkles className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setFormState({
                          name: t.name,
                          avatar: t.avatar,
                          program: t.program,
                          rating: t.rating,
                          reviewText: t.reviewText,
                          status: t.status,
                          featured: t.featured
                        });
                        setEditTarget(t);
                      }}
                      className="h-7 w-7 rounded border-border/60"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setDeleteTarget(t)} className="h-7 w-7 rounded border-border/60 text-rose-500 hover:bg-rose-500/5 hover:text-rose-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Footer */}
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
                Showing {startIndex + 1}–{Math.min(startIndex + rowsPerPage, sortedTestimonials.length)} of {sortedTestimonials.length}
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

      {/* C. Add Testimonial Dialog */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setIsAddOpen(false)} className="fixed inset-0 bg-black" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-lg w-full rounded-2xl shadow-2xl z-10 overflow-hidden text-left"
              role="dialog"
            >
              <div className="p-5 border-b border-border/80 flex justify-between items-center bg-primary/5">
                <h3 className="text-sm sm:text-base font-bold text-foreground font-sans">Add Testimonial</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsAddOpen(false)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto font-sans">
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Student Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Student Name</label>
                    <input type="text" name="name" required value={formState.name} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                  {/* Program */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Program</label>
                    <select name="program" value={formState.program} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Beginner Yoga">Beginner Yoga</option>
                      <option value="Power Yoga">Power Yoga</option>
                      <option value="Meditation">Meditation</option>
                      <option value="Corporate Yoga">Corporate Yoga</option>
                      <option value="Online Yoga">Online Yoga</option>
                    </select>
                  </div>
                  {/* Rating */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Rating (Stars)</label>
                    <select name="rating" value={formState.rating} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                    </select>
                  </div>
                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Status</label>
                    <select name="status" value={formState.status} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Published">Published</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground font-sans">Review Content</label>
                  <textarea name="reviewText" required value={formState.reviewText} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background h-24 resize-none" />
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center space-x-2 pt-2">
                  <input type="checkbox" id="featuredAdd" name="featured" checked={formState.featured} onChange={(e) => setFormState(p => ({ ...p, featured: e.target.checked }))} className="h-4 w-4 rounded border-border text-accent" />
                  <label htmlFor="featuredAdd" className="text-xs font-semibold text-muted-foreground cursor-pointer">Promote / Feature Testimonial</label>
                </div>

                <div className="flex justify-end space-x-3.5 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button variant="default" size="sm" type="submit">Create</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* D. Edit Dialog */}
      <AnimatePresence>
        {editTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setEditTarget(null)} className="fixed inset-0 bg-black" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-lg w-full rounded-2xl shadow-2xl z-10 overflow-hidden text-left"
              role="dialog"
            >
              <div className="p-5 border-b border-border/80 flex justify-between items-center bg-primary/5">
                <h3 className="text-sm sm:text-base font-bold text-foreground font-sans">Edit Testimonial</h3>
                <Button variant="ghost" size="icon" onClick={() => setEditTarget(null)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto font-sans">
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Student Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Student Name</label>
                    <input type="text" name="name" required value={formState.name} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                  {/* Program */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Program</label>
                    <select name="program" value={formState.program} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Beginner Yoga">Beginner Yoga</option>
                      <option value="Power Yoga">Power Yoga</option>
                      <option value="Meditation">Meditation</option>
                      <option value="Corporate Yoga">Corporate Yoga</option>
                      <option value="Online Yoga">Online Yoga</option>
                    </select>
                  </div>
                  {/* Rating */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Rating (Stars)</label>
                    <select name="rating" value={formState.rating} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                    </select>
                  </div>
                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Status</label>
                    <select name="status" value={formState.status} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Published">Published</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground font-sans">Review Content</label>
                  <textarea name="reviewText" required value={formState.reviewText} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background h-24 resize-none" />
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center space-x-2 pt-2">
                  <input type="checkbox" id="featuredEdit" name="featured" checked={formState.featured} onChange={(e) => setFormState(p => ({ ...p, featured: e.target.checked }))} className="h-4 w-4 rounded border-border text-accent" />
                  <label htmlFor="featuredEdit" className="text-xs font-semibold text-muted-foreground cursor-pointer">Promote / Feature Testimonial</label>
                </div>

                <div className="flex justify-end space-x-3.5 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" type="button" onClick={() => setEditTarget(null)}>Cancel</Button>
                  <Button variant="default" size="sm" type="submit">Save Changes</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* E. Preview Modal */}
      <AnimatePresence>
        {previewTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setPreviewTarget(null)} className="fixed inset-0 bg-black" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-sm w-full rounded-2xl shadow-2xl z-10 overflow-hidden text-left"
              role="dialog"
            >
              <div className="p-5 border-b border-border/80 flex justify-between items-center bg-primary/5">
                <h3 className="text-sm font-bold text-foreground font-sans">Public Testimonial Card Preview</h3>
                <Button variant="ghost" size="icon" onClick={() => setPreviewTarget(null)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Public testimonial card representation */}
              <div className="p-8 bg-background/40 flex items-center justify-center">
                <div className="max-w-md w-full bg-card border border-border p-6 rounded-2xl shadow-lg space-y-4 text-left relative overflow-hidden">
                  
                  {/* Decorative quotes */}
                  <span className="absolute top-2 right-4 text-primary/10 text-6xl font-serif select-none pointer-events-none font-bold">“</span>

                  {/* Header info */}
                  <div className="flex items-center space-x-3.5">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full border border-border bg-muted">
                      <Image src={previewTarget.avatar} alt={previewTarget.name} fill className="object-cover" sizes="44px" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground font-sans">{previewTarget.name}</h4>
                      <p className="text-[11px] text-muted-foreground font-sans">{previewTarget.program} Student</p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center text-amber-500 space-x-0.5">
                    {[...Array(previewTarget.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current shrink-0" />
                    ))}
                  </div>

                  {/* Main text */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic font-sans font-medium">
                    &quot;{previewTarget.reviewText}&quot;
                  </p>

                </div>
              </div>

              <div className="p-4 border-t border-border bg-primary/5 flex justify-end">
                <Button variant="default" size="sm" onClick={() => setPreviewTarget(null)}>Close Preview</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* F. View Details Dialog */}
      <AnimatePresence>
        {viewTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setViewTarget(null)} className="fixed inset-0 bg-black" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-md w-full rounded-2xl shadow-2xl z-10 overflow-hidden text-left"
              role="dialog"
            >
              <div className="p-5 border-b border-border/80 flex justify-between items-center bg-primary/5">
                <div>
                  <h3 className="text-sm font-bold text-foreground font-sans">Testimonial info</h3>
                  <span className="font-mono text-[9px] text-muted-foreground">{viewTarget.id}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setViewTarget(null)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto font-sans">
                <div className="flex items-center space-x-3.5 pb-4 border-b border-border">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border bg-muted">
                    <Image src={viewTarget.avatar} alt={viewTarget.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{viewTarget.name}</h4>
                    <p className="text-xs text-muted-foreground">{viewTarget.program}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Review Content</p>
                  <p className="text-xs text-foreground leading-normal mt-0.5">&quot;{viewTarget.reviewText}&quot;</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs font-sans">
                  <div>
                    <span className="text-zinc-500 block">Rating score</span>
                    <span className="text-xs font-semibold text-foreground">{viewTarget.rating} / 5 Stars</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Publication Status</span>
                    <span className="text-xs font-semibold text-foreground">{viewTarget.status}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Created Date</span>
                    <span className="text-xs font-semibold text-foreground">{viewTarget.createdDate}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Featured Slider</span>
                    <span className="text-xs font-semibold text-foreground">{viewTarget.featured ? "Promoted" : "Standard"}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-primary/5 flex justify-end">
                <Button variant="default" size="sm" onClick={() => setViewTarget(null)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* G. Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setDeleteTarget(null)} className="fixed inset-0 bg-black" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-sm w-full rounded-2xl p-6 shadow-2xl z-10 text-left space-y-4"
              role="alertdialog"
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2 bg-rose-500/10 rounded-full text-rose-500 shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-foreground font-sans">Delete Testimonial</h3>
                  <p className="text-xs text-muted-foreground font-sans leading-normal">
                    Are you sure you want to delete the testimonial for <span className="font-semibold text-foreground">{deleteTarget.name}</span>? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3.5 pt-2">
                <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                <Button variant="default" size="sm" onClick={handleDelete} className="bg-rose-600 text-white hover:bg-rose-500">Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
