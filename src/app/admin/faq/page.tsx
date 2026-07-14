"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import {
  HelpCircle,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Copy,
  Archive,
  Trash2,
  X,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Classes" | "Bookings" | "Payments" | "Membership" | "Online Classes";
  displayOrder: number;
  status: "Published" | "Draft" | "Archived";
  lastUpdated: string;
}

export default function FAQManagementPage() {
  const shouldReduceMotion = useReducedMotion();
  const [isLoading, setIsLoading] = React.useState(true);
  const [faqs, setFaqs] = React.useState<FAQ[]>([]);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("order-asc");

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Overlay state managers
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<FAQ | null>(null);
  const [viewTarget, setViewTarget] = React.useState<FAQ | null>(null);

  // Form dialog state managers
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<FAQ | null>(null);

  // Load Mock Data
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const mockData: FAQ[] = [
        {
          id: "FAQ-101",
          question: "What should I bring to my first yoga class?",
          answer: "We recommend bringing a water bottle, comfortable athletic wear, and an open mind. Yoga mats, blocks, and straps are fully provided in our studio, but you are welcome to bring your personal mat if you prefer.",
          category: "General",
          displayOrder: 1,
          status: "Published",
          lastUpdated: "2026-07-10"
        },
        {
          id: "FAQ-102",
          question: "Do I need to be flexible to start yoga?",
          answer: "Not at all! Flexibility is a result of consistent yoga practice, not a prerequisite. Our Beginner Yoga sessions are explicitly designed to meet you where you are and safely build range of motion.",
          category: "Classes",
          displayOrder: 2,
          status: "Published",
          lastUpdated: "2026-07-12"
        },
        {
          id: "FAQ-103",
          question: "How do I cancel or reschedule my class booking?",
          answer: "You can cancel or reschedule any booking through your student dashboard or by emailing us at least 12 hours before the class starts. Cancellations made within 12 hours may be subject to a late cancel fee.",
          category: "Bookings",
          displayOrder: 3,
          status: "Published",
          lastUpdated: "2026-07-08"
        },
        {
          id: "FAQ-104",
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, UPI, net banking, and secure online wallets through our Stripe payment gateway integration.",
          category: "Payments",
          displayOrder: 4,
          status: "Published",
          lastUpdated: "2026-07-05"
        },
        {
          id: "FAQ-105",
          question: "Is there a monthly unlimited membership available?",
          answer: "Yes, we offer Unlimited Monthly and Annual memberships that grant access to all studio and online group classes, along with discount vouchers for special workshops.",
          category: "Membership",
          displayOrder: 5,
          status: "Published",
          lastUpdated: "2026-07-13"
        },
        {
          id: "FAQ-106",
          question: "How do I join the online live stream classes?",
          answer: "Once you reserve an online class slot, a Google Meet or Zoom link will be sent to your email 15 minutes before the start time. You can also join directly from your account page.",
          category: "Online Classes",
          displayOrder: 6,
          status: "Published",
          lastUpdated: "2026-07-09"
        },
        {
          id: "FAQ-107",
          question: "Are prenatal classes safe for all trimesters?",
          answer: "Yes, prenatal classes use gentle modifications and props designed for pregnancy safety. However, we require a physician approval form before your first session.",
          category: "Classes",
          displayOrder: 7,
          status: "Draft",
          lastUpdated: "2026-07-14"
        },
        {
          id: "FAQ-108",
          question: "Can I book a private one-on-one session with Nistha?",
          answer: "Absolutely. Private sessions are open to students who want custom alignment programs or spinal care guidance. Please fill out our query form or contact support to check slots.",
          category: "Bookings",
          displayOrder: 8,
          status: "Published",
          lastUpdated: "2026-07-11"
        }
      ];

      // Pad mock data to reach 20 items to satisfy requirement
      const paddedData: FAQ[] = [...mockData];
      for (let i = 0; i < 12; i++) {
        const template = mockData[i % mockData.length];
        paddedData.push({
          ...template,
          id: `FAQ-${109 + i}`,
          question: `${template.question} (Level ${i + 2})`,
          displayOrder: 9 + i,
          status: i % 4 === 0 ? "Draft" : i % 5 === 0 ? "Archived" : "Published",
          lastUpdated: `2026-07-0${(i % 9) + 1}`
        });
      }
      setFaqs(paddedData);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const initialFormState: Omit<FAQ, "id" | "lastUpdated"> = {
    question: "",
    answer: "",
    category: "General",
    displayOrder: 1,
    status: "Published"
  };

  const [formState, setFormState] = React.useState(initialFormState);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFAQ: FAQ = {
      ...formState,
      id: `FAQ-${Date.now().toString().slice(-3)}`,
      displayOrder: Number(formState.displayOrder),
      lastUpdated: new Date().toISOString().split("T")[0]
    };
    setFaqs((prev) => [newFAQ, ...prev]);
    setIsAddOpen(false);
    setFormState(initialFormState);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setFaqs((prev) =>
      prev.map((f) =>
        f.id === editTarget.id
          ? {
              ...f,
              ...formState,
              displayOrder: Number(formState.displayOrder),
              lastUpdated: new Date().toISOString().split("T")[0]
            }
          : f
      )
    );
    setEditTarget(null);
    setFormState(initialFormState);
  };

  const handleDuplicate = (faq: FAQ) => {
    const duplicated: FAQ = {
      ...faq,
      id: `FAQ-${Date.now().toString().slice(-3)}`,
      question: `${faq.question} (Copy)`,
      displayOrder: faq.displayOrder + 1,
      lastUpdated: new Date().toISOString().split("T")[0]
    };
    setFaqs((prev) => [duplicated, ...prev]);
  };

  const handleArchive = (faq: FAQ) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === faq.id ? { ...f, status: "Archived" } : f))
    );
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setFaqs((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  // Filter & Sort Logic
  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === "All" || f.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || f.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedFaqs = [...filteredFaqs].sort((a, b) => {
    if (sortBy === "order-asc") return a.displayOrder - b.displayOrder;
    if (sortBy === "order-desc") return b.displayOrder - a.displayOrder;
    if (sortBy === "date-desc") return b.lastUpdated.localeCompare(a.lastUpdated);
    return 0;
  });

  // Pagination Bounds
  const totalPages = Math.max(1, Math.ceil(sortedFaqs.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedFaqs = sortedFaqs.slice(startIndex, startIndex + rowsPerPage);

  // Statistics counters
  const totalCount = faqs.length;
  const publishedCount = faqs.filter((f) => f.status === "Published").length;
  const draftCount = faqs.filter((f) => f.status === "Draft").length;
  const categoryCount = new Set(faqs.map((f) => f.category)).size;

  const stats = [
    { label: "Total FAQs", value: totalCount, change: "Mapped questions", icon: HelpCircle },
    { label: "Published FAQs", value: publishedCount, change: "Active on site", icon: CheckCircle2 },
    { label: "Draft FAQs", value: draftCount, change: "Work in progress", icon: Clock },
    { label: "FAQ Categories", value: categoryCount, change: "Pillars grouped", icon: Layers }
  ];

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
            FAQ Management
          </h1>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed">
            Manage frequently asked questions displayed across the website.
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
          <span>Add FAQ</span>
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
                placeholder="Search question, answer, ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md border border-border bg-background/50 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 h-8 font-sans"
                aria-label="Search FAQs"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-3 pr-8 py-1.5 text-xs rounded-md border border-border bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent h-8 cursor-pointer font-sans appearance-none min-w-[130px]"
                aria-label="Filter by Category"
              >
                <option value="All">All Categories</option>
                <option value="General">General</option>
                <option value="Classes">Classes</option>
                <option value="Bookings">Bookings</option>
                <option value="Payments">Payments</option>
                <option value="Membership">Membership</option>
                <option value="Online Classes">Online Classes</option>
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
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
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
                <option value="order-asc">Display Order (Asc)</option>
                <option value="order-desc">Display Order (Desc)</option>
                <option value="date-desc">Newest Updated First</option>
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
                <div key={i} className="h-16 p-4 flex items-center justify-between animate-pulse">
                  <div className="space-y-1.5">
                    <div className="h-4.5 w-60 bg-primary/5 rounded" />
                    <div className="h-3.5 w-32 bg-primary/5 rounded" />
                  </div>
                  <div className="h-8 w-16 bg-primary/5 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : paginatedFaqs.length === 0 ? (
        // Empty State
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto text-accent shadow-sm">
            <HelpCircle className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground font-sans">No FAQs Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto font-sans leading-relaxed">
              We couldn't find any FAQs matching your filters. Try clearing your filters or search keywords.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setCategoryFilter("All");
              setStatusFilter("All");
              setSortBy("order-asc");
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
                  <th className="p-4 font-bold font-sans">Question</th>
                  <th className="p-4 font-bold font-sans">Category</th>
                  <th className="p-4 font-bold font-sans">Display Order</th>
                  <th className="p-4 font-bold font-sans">Status</th>
                  <th className="p-4 font-bold font-sans">Last Updated</th>
                  <th className="p-4 font-bold font-sans text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedFaqs.map((f) => (
                  <tr key={f.id} className="hover:bg-primary/5 transition-colors">
                    <td className="p-4 font-semibold text-foreground font-sans max-w-xs truncate">{f.question}</td>
                    <td className="p-4 text-muted-foreground font-sans">{f.category}</td>
                    <td className="p-4 text-muted-foreground font-mono text-xs">{f.displayOrder}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          f.status === "Published"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : f.status === "Draft"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-zinc-500/10 text-zinc-500"
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground font-sans">{f.lastUpdated}</td>
                    <td className="p-4 text-center relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setActiveMenuId(activeMenuId === f.id ? null : f.id)}
                        className="h-8 w-8 rounded-md border border-border/40 hover:bg-primary/5"
                        aria-label="Open actions menu"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>

                      {/* Dropdown Options */}
                      <AnimatePresence>
                        {activeMenuId === f.id && (
                          <>
                            <div className="fixed inset-0 z-35" onClick={() => setActiveMenuId(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 5 }}
                              className="absolute right-4 mt-1 w-32 rounded-lg border border-border bg-card shadow-lg py-1 z-40 text-left"
                            >
                              <button
                                onClick={() => {
                                  setViewTarget(f);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => {
                                  setFormState({
                                    question: f.question,
                                    answer: f.answer,
                                    category: f.category,
                                    displayOrder: f.displayOrder,
                                    status: f.status
                                  });
                                  setEditTarget(f);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleDuplicate(f);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <Copy className="h-3.5 w-3.5" />
                                <span>Duplicate</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleArchive(f);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <Archive className="h-3.5 w-3.5" />
                                <span>Archive</span>
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteTarget(f);
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
            {paginatedFaqs.map((f) => (
              <Card key={f.id} className="border border-border bg-card/70 shadow-sm text-left">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground bg-primary/5 px-2 py-0.5 rounded border border-border/60 font-sans">
                      Order: {f.displayOrder}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-primary/5 ${f.status === "Published" ? "text-emerald-600" : "text-amber-600"}`}>
                      {f.status}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-foreground font-sans leading-normal">{f.question}</h4>
                    <p className="text-xs text-muted-foreground font-sans leading-relaxed line-clamp-2">"{f.answer}"</p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-sans border-t border-border/40 pt-3">
                    <span>{f.category}</span>
                    <span>Updated: {f.lastUpdated}</span>
                  </div>

                  <div className="flex justify-end space-x-2 pt-1 border-t border-border/40">
                    <Button variant="outline" size="icon" onClick={() => setViewTarget(f)} className="h-7 w-7 rounded border-border/60">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setFormState({
                          question: f.question,
                          answer: f.answer,
                          category: f.category,
                          displayOrder: f.displayOrder,
                          status: f.status
                        });
                        setEditTarget(f);
                      }}
                      className="h-7 w-7 rounded border-border/60"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setDeleteTarget(f)} className="h-7 w-7 rounded border-border/60 text-rose-500 hover:bg-rose-500/5 hover:text-rose-600">
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
                Showing {startIndex + 1}–{Math.min(startIndex + rowsPerPage, sortedFaqs.length)} of {sortedFaqs.length}
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

      {/* C. Add FAQ Dialog */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setIsAddOpen(false)} className="fixed inset-0 bg-black" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-lg w-full rounded-2xl shadow-2xl z-10 overflow-hidden text-left font-sans"
              role="dialog"
            >
              <div className="p-5 border-b border-border/80 flex justify-between items-center bg-primary/5">
                <h3 className="text-sm sm:text-base font-bold text-foreground">Add FAQ</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsAddOpen(false)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Question */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Question</label>
                  <input type="text" name="question" required value={formState.question} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                </div>
                {/* Answer */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Answer</label>
                  <textarea name="answer" required value={formState.answer} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background h-28 resize-none" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Category</label>
                    <select name="category" value={formState.category} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="General">General</option>
                      <option value="Classes">Classes</option>
                      <option value="Bookings">Bookings</option>
                      <option value="Payments">Payments</option>
                      <option value="Membership">Membership</option>
                      <option value="Online Classes">Online Classes</option>
                    </select>
                  </div>
                  {/* Display Order */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Display Order</label>
                    <input type="number" name="displayOrder" required value={formState.displayOrder} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Status</label>
                    <select name="status" value={formState.status} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3.5 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button variant="default" size="sm" type="submit">Create FAQ</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* D. Edit FAQ Dialog */}
      <AnimatePresence>
        {editTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setEditTarget(null)} className="fixed inset-0 bg-black" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-lg w-full rounded-2xl shadow-2xl z-10 overflow-hidden text-left font-sans"
              role="dialog"
            >
              <div className="p-5 border-b border-border/80 flex justify-between items-center bg-primary/5">
                <h3 className="text-sm sm:text-base font-bold text-foreground">Edit FAQ</h3>
                <Button variant="ghost" size="icon" onClick={() => setEditTarget(null)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Question */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Question</label>
                  <input type="text" name="question" required value={formState.question} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                </div>
                {/* Answer */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Answer</label>
                  <textarea name="answer" required value={formState.answer} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background h-28 resize-none" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Category</label>
                    <select name="category" value={formState.category} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="General">General</option>
                      <option value="Classes">Classes</option>
                      <option value="Bookings">Bookings</option>
                      <option value="Payments">Payments</option>
                      <option value="Membership">Membership</option>
                      <option value="Online Classes">Online Classes</option>
                    </select>
                  </div>
                  {/* Display Order */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Display Order</label>
                    <input type="number" name="displayOrder" required value={formState.displayOrder} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Status</label>
                    <select name="status" value={formState.status} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
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

      {/* E. View details popover */}
      <AnimatePresence>
        {viewTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setViewTarget(null)} className="fixed inset-0 bg-black" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-md w-full rounded-2xl shadow-2xl z-10 overflow-hidden text-left font-sans"
              role="dialog"
            >
              <div className="p-5 border-b border-border/80 flex justify-between items-center bg-primary/5">
                <div>
                  <h3 className="text-sm font-bold text-foreground">FAQ Details</h3>
                  <span className="font-mono text-[9px] text-muted-foreground">{viewTarget.id}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setViewTarget(null)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Question</p>
                  <p className="text-xs font-semibold text-foreground leading-normal mt-0.5">{viewTarget.question}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Answer Content</p>
                  <p className="text-xs text-muted-foreground leading-normal mt-0.5">{viewTarget.answer}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs">
                  <div>
                    <span className="text-zinc-500 block">Category Mapped</span>
                    <span className="text-xs font-semibold text-foreground">{viewTarget.category}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Display Order Weight</span>
                    <span className="text-xs font-semibold text-foreground">Index {viewTarget.displayOrder}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Publication Status</span>
                    <span className="text-xs font-semibold text-foreground">{viewTarget.status}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Last Modified</span>
                    <span className="text-xs font-semibold text-foreground">{viewTarget.lastUpdated}</span>
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

      {/* F. Delete Confirmation dialog */}
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
                  <h3 className="text-sm sm:text-base font-bold text-foreground">Delete FAQ</h3>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Are you sure you want to delete the FAQ: <span className="font-semibold text-foreground">{deleteTarget.question}</span>? This action is permanent and cannot be undone.
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
