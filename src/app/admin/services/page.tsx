"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import {
  Briefcase,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Archive,
  Trash2,
  Edit2,
  Copy,
  Eye,
  X,
  AlertTriangle,
  Upload,
  Clock,
  TrendingUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

interface Service {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  category: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  price: number;
  featured: boolean;
  status: "Active" | "Draft" | "Archived";
  image: string;
  seoTitle: string;
  seoDesc: string;
  lastUpdated: string;
}

export default function ServicesManagementPage() {
  const shouldReduceMotion = useReducedMotion();
  const [isLoading, setIsLoading] = React.useState(true);
  const [services, setServices] = React.useState<Service[]>([]);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("name-asc");
  
  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Dialog State Managers
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Service | null>(null);
  const [viewTarget, setViewTarget] = React.useState<Service | null>(null);
  
  // Form dialog state managers
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Service | null>(null);

  // Load Mock Data
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const mockServices: Service[] = [
        {
          id: "SRV-101",
          name: "Beginner Yoga",
          slug: "beginner-yoga",
          shortDesc: "Foundational postures for flexibility and alignment.",
          fullDesc: "Learn the basics of Hatha yoga. This class is designed to build body awareness, breathing techniques, and basic alignment rules for beginners.",
          category: "Hatha",
          duration: "60 mins",
          level: "Beginner",
          price: 15,
          featured: true,
          status: "Active",
          image: "/gallery-1.jpg",
          seoTitle: "Best Beginner Yoga Classes Online & Offline",
          seoDesc: "Start your wellness journey with certified instructor Nistha.",
          lastUpdated: "2026-07-10"
        },
        {
          id: "SRV-102",
          name: "Power Yoga Core",
          slug: "power-yoga",
          shortDesc: "High-intensity athletic flow targeting core strength.",
          fullDesc: "An energetic fitness vinyasa class focused on muscle toning, metabolic boosting, and active core activation.",
          category: "Vinyasa",
          duration: "75 mins",
          level: "Intermediate",
          price: 20,
          featured: true,
          status: "Active",
          image: "/gallery-2.jpg",
          seoTitle: "Power Yoga Core Workouts - ManoYoga",
          seoDesc: "Tackle core strength with athletic yoga flow.",
          lastUpdated: "2026-07-12"
        },
        {
          id: "SRV-103",
          name: "Deep Meditation & Breathing",
          slug: "deep-meditation",
          shortDesc: "Mindfulness and pranayama for mental clarity.",
          fullDesc: "A peaceful session focusing on diaphragmatic breath control, anxiety reduction, and guided self-reflection.",
          category: "Meditation",
          duration: "45 mins",
          level: "All Levels",
          price: 12,
          featured: false,
          status: "Active",
          image: "/gallery-3.jpg",
          seoTitle: "Mindfulness and Breathing Techniques",
          seoDesc: "De-stress with Nistha's guided mindfulness sessions.",
          lastUpdated: "2026-07-08"
        },
        {
          id: "SRV-104",
          name: "Prenatal Yoga Harmony",
          slug: "prenatal-yoga",
          shortDesc: "Gentle modifications designed for expecting mothers.",
          fullDesc: "Nurturing stretch postures that optimize alignment, manage pregnancy fatigue, and safely prepare the pelvic muscles.",
          category: "Therapy",
          duration: "60 mins",
          level: "Beginner",
          price: 25,
          featured: false,
          status: "Active",
          image: "/gallery-1.jpg",
          seoTitle: "Safe Prenatal Yoga Exercises",
          seoDesc: "Safe prenatal alignment under expert guidance.",
          lastUpdated: "2026-07-05"
        },
        {
          id: "SRV-105",
          name: "Corporate Yoga & Recharge",
          slug: "corporate-yoga",
          shortDesc: "Stress relief sessions adapted for team wellness.",
          fullDesc: "Short, desk-friendly mobility sequences and breathwork breaks to release shoulder tension and improve workspace focus.",
          category: "Corporate",
          duration: "45 mins",
          level: "All Levels",
          price: 150,
          featured: true,
          status: "Active",
          image: "/gallery-2.jpg",
          seoTitle: "Corporate Yoga Programs for Workplace Wellness",
          seoDesc: "Team mobility programs to reduce screen fatigue.",
          lastUpdated: "2026-07-13"
        },
        {
          id: "SRV-106",
          name: "Online Live Yoga Flow",
          slug: "online-yoga",
          shortDesc: "Live interactive sessions from the comfort of home.",
          fullDesc: "Bring the studio home with live posture reviews, group chats, and modifications adapted to home props.",
          category: "Vinyasa",
          duration: "60 mins",
          level: "All Levels",
          price: 10,
          featured: false,
          status: "Active",
          image: "/gallery-3.jpg",
          seoTitle: "Interactive Live Online Yoga Sessions",
          seoDesc: "Join interactive online batches from anywhere.",
          lastUpdated: "2026-07-14"
        },
        {
          id: "SRV-107",
          name: "Kids Playful Yoga",
          slug: "kids-yoga",
          shortDesc: "Story-driven, game-based poses for children.",
          fullDesc: "A fun-filled sequence built around animal stories, balance games, and coordination to build childhood flexibility.",
          category: "Kids",
          duration: "45 mins",
          level: "Beginner",
          price: 12,
          featured: false,
          status: "Draft",
          image: "/gallery-1.jpg",
          seoTitle: "Fun Kids Yoga Classes",
          seoDesc: "Active games and coordination exercises for children.",
          lastUpdated: "2026-07-01"
        },
        {
          id: "SRV-108",
          name: "Seniors Mobility Care",
          slug: "senior-yoga",
          shortDesc: "Gentle chair postures and joint stability exercises.",
          fullDesc: "Low-impact static stretches designed to preserve joint range of motion, ease arthritis, and support safety balance.",
          category: "Therapy",
          duration: "50 mins",
          level: "Beginner",
          price: 15,
          featured: false,
          status: "Active",
          image: "/gallery-2.jpg",
          seoTitle: "Gentle Mobility Yoga for Seniors",
          seoDesc: "Joint care and chair postures for older adults.",
          lastUpdated: "2026-07-09"
        },
        {
          id: "SRV-109",
          name: "Weight Loss Detox Flow",
          slug: "weight-loss-yoga",
          shortDesc: "Sweat-inducing flow targeting endurance.",
          fullDesc: "A cardio-centric vinyasa sequencing designed to elevate heart rates, detoxify tissues, and boost calorie burn.",
          category: "Vinyasa",
          duration: "75 mins",
          level: "Advanced",
          price: 22,
          featured: false,
          status: "Draft",
          image: "/gallery-3.jpg",
          seoTitle: "Detox and Weight Loss Flows",
          seoDesc: "Cardio-centric flows to boost endurance.",
          lastUpdated: "2026-07-11"
        },
        {
          id: "SRV-110",
          name: "Therapy Yoga for Back Pain",
          slug: "therapy-yoga",
          shortDesc: "Targeted decompression of spinal tissues.",
          fullDesc: "Physician-referred spinal decompression and gentle core stabilizing positions to safely manage chronic lower back aches.",
          category: "Therapy",
          duration: "60 mins",
          level: "Beginner",
          price: 30,
          featured: true,
          status: "Active",
          image: "/gallery-1.jpg",
          seoTitle: "Spinal Decompression & Back Pain Yoga",
          seoDesc: "Decompress spinal segments with structural stretches.",
          lastUpdated: "2026-07-04"
        },
        {
          id: "SRV-111",
          name: "Classic Hatha Flow",
          slug: "classic-hatha",
          shortDesc: "Traditional static hold poses with deep breathing.",
          fullDesc: "Align bone structures, clear energy nadis, and enjoy classical slow-paced static holds to calm neural activities.",
          category: "Hatha",
          duration: "90 mins",
          level: "Intermediate",
          price: 18,
          featured: false,
          status: "Active",
          image: "/gallery-2.jpg",
          seoTitle: "Traditional Hatha Yoga Holds",
          seoDesc: "Traditional slow holds for alignment and focus.",
          lastUpdated: "2026-07-03"
        },
        {
          id: "SRV-112",
          name: "Vinyasa Sunset Flow",
          slug: "vinyasa-sunset",
          shortDesc: "Fluid evening transitions synchronized with breath.",
          fullDesc: "A smooth, relaxing evening flow to release workday stress, open hip joints, and transition toward a rest state.",
          category: "Vinyasa",
          duration: "60 mins",
          level: "All Levels",
          price: 16,
          featured: false,
          status: "Archived",
          image: "/gallery-3.jpg",
          seoTitle: "Relaxing Vinyasa Sunset Flows",
          seoDesc: "Evening flows to transition into rest.",
          lastUpdated: "2026-06-30"
        }
      ];
      setServices(mockServices);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Form State holder (shared between Create and Edit Dialogs)
  const initialFormState: Omit<Service, "id" | "lastUpdated"> = {
    name: "",
    slug: "",
    shortDesc: "",
    fullDesc: "",
    category: "Hatha",
    duration: "60 mins",
    level: "Beginner",
    price: 15,
    featured: false,
    status: "Active",
    image: "/gallery-1.jpg",
    seoTitle: "",
    seoDesc: ""
  };

  const [formState, setFormState] = React.useState(initialFormState);

  // Form handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    // Automatically generate slug from name if modifying name field
    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormState((prev) => ({ ...prev, name: value, slug: generatedSlug }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newService: Service = {
      ...formState,
      id: `SRV-${Date.now().toString().slice(-3)}`,
      price: Number(formState.price),
      lastUpdated: new Date().toISOString().split("T")[0]
    };
    setServices((prev) => [newService, ...prev]);
    setIsCreateOpen(false);
    setFormState(initialFormState);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setServices((prev) =>
      prev.map((s) =>
        s.id === editTarget.id
          ? {
              ...s,
              ...formState,
              price: Number(formState.price),
              lastUpdated: new Date().toISOString().split("T")[0]
            }
          : s
      )
    );
    setEditTarget(null);
    setFormState(initialFormState);
  };

  const handleDuplicate = (service: Service) => {
    const duplicated: Service = {
      ...service,
      // eslint-disable-next-line react-hooks/purity
      id: `SRV-${Date.now().toString().slice(-3)}`,
      name: `${service.name} (Copy)`,
      slug: `${service.slug}-copy`,
      featured: false,
      lastUpdated: new Date().toISOString().split("T")[0]
    };
    setServices((prev) => [duplicated, ...prev]);
  };

  const handleArchive = (service: Service) => {
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, status: "Archived" } : s))
    );
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  // Filter & Sort Logic
  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === "All" || s.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  // Pagination Bounds
  const totalPages = Math.max(1, Math.ceil(sortedServices.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedServices = sortedServices.slice(startIndex, startIndex + rowsPerPage);

  // Statistics counters
  const totalCount = services.length;
  const activeCount = services.filter((s) => s.status === "Active").length;
  const draftCount = services.filter((s) => s.status === "Draft").length;
  const featuredCount = services.filter((s) => s.featured).length;

  const stats = [
    { label: "Total Services", value: totalCount, change: "Active programs", icon: Briefcase },
    { label: "Active Services", value: activeCount, change: "Public catalogs", icon: Sparkles },
    { label: "Draft Services", value: draftCount, change: "Unreleased drafts", icon: Clock },
    { label: "Featured Services", value: featuredCount, change: "Promoted features", icon: TrendingUp }
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
            Services Management
          </h1>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed">
            Create, update and organize all yoga programs.
          </p>
        </div>
        <Button
          variant="default"
          onClick={() => {
            setFormState(initialFormState);
            setIsCreateOpen(true);
          }}
          className="shrink-0 flex items-center justify-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Service</span>
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
                placeholder="Search name, description, ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md border border-border bg-background/50 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 h-8 font-sans"
                aria-label="Search services"
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
                className="pl-3 pr-8 py-1.5 text-xs rounded-md border border-border bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent h-8 cursor-pointer font-sans appearance-none min-w-[120px]"
                aria-label="Filter by Category"
              >
                <option value="All">All Categories</option>
                <option value="Hatha">Hatha</option>
                <option value="Vinyasa">Vinyasa</option>
                <option value="Meditation">Meditation</option>
                <option value="Therapy">Therapy</option>
                <option value="Corporate">Corporate</option>
                <option value="Kids">Kids</option>
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
                <option value="Active">Active</option>
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
                className="pl-3 pr-8 py-1.5 text-xs rounded-md border border-border bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent h-8 cursor-pointer font-sans appearance-none min-w-[140px]"
                aria-label="Sort options"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
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

      {/* Services Main Container */}
      {isLoading ? (
        // Skeleton Loaders
        <Card className="border border-border/80 bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="h-12 bg-primary/5 border-b border-border/60 animate-pulse" />
            <div className="divide-y divide-border/40">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 p-4 flex items-center justify-between animate-pulse">
                  <div className="flex space-x-4 items-center">
                    <div className="h-12 w-16 bg-primary/5 rounded-lg" />
                    <div className="space-y-1.5">
                      <div className="h-4.5 w-36 bg-primary/5 rounded" />
                      <div className="h-3.5 w-24 bg-primary/5 rounded" />
                    </div>
                  </div>
                  <div className="h-8 w-16 bg-primary/5 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : paginatedServices.length === 0 ? (
        // Elegant Empty State
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto text-accent shadow-sm">
            <Briefcase className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground font-sans">No Services Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto font-sans leading-relaxed">
              We couldn&apos;t find any yoga programs matching your filters. Try clearing your filters or search keywords.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setCategoryFilter("All");
              setStatusFilter("All");
              setSortBy("name-asc");
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
                  <th className="p-4 font-bold font-sans">Image</th>
                  <th className="p-4 font-bold font-sans">Service Name</th>
                  <th className="p-4 font-bold font-sans">Category</th>
                  <th className="p-4 font-bold font-sans">Duration</th>
                  <th className="p-4 font-bold font-sans">Level</th>
                  <th className="p-4 font-bold font-sans">Price</th>
                  <th className="p-4 font-bold font-sans">Status</th>
                  <th className="p-4 font-bold font-sans">Featured</th>
                  <th className="p-4 font-bold font-sans text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedServices.map((s) => (
                  <tr key={s.id} className="hover:bg-primary/5 transition-colors">
                    <td className="p-4">
                      <div className="relative h-10 w-16 overflow-hidden rounded-lg bg-muted border border-border">
                        <Image src={s.image} alt={s.name} fill className="object-cover" sizes="64px" />
                      </div>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <p className="font-semibold text-foreground font-sans">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-xs font-sans">{s.shortDesc}</p>
                    </td>
                    <td className="p-4 text-muted-foreground font-sans">{s.category}</td>
                    <td className="p-4 text-muted-foreground font-sans">{s.duration}</td>
                    <td className="p-4 text-muted-foreground font-sans">{s.level}</td>
                    <td className="p-4 font-semibold text-foreground font-sans">${s.price}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : s.status === "Draft"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-zinc-500/10 text-zinc-500"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[11px] font-semibold ${s.featured ? "text-accent font-bold" : "text-muted-foreground"}`}>
                        {s.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-4 text-center relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setActiveMenuId(activeMenuId === s.id ? null : s.id)}
                        className="h-8 w-8 rounded-md border border-border/40 hover:bg-primary/5"
                        aria-label="Open actions menu"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>

                      {/* Action Dropdown Menu */}
                      <AnimatePresence>
                        {activeMenuId === s.id && (
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
                                  setViewTarget(s);
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
                                    name: s.name,
                                    slug: s.slug,
                                    shortDesc: s.shortDesc,
                                    fullDesc: s.fullDesc,
                                    category: s.category,
                                    duration: s.duration,
                                    level: s.level,
                                    price: s.price,
                                    featured: s.featured,
                                    status: s.status,
                                    image: s.image,
                                    seoTitle: s.seoTitle,
                                    seoDesc: s.seoDesc
                                  });
                                  setEditTarget(s);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleDuplicate(s);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <Copy className="h-3.5 w-3.5" />
                                <span>Duplicate</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleArchive(s);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <Archive className="h-3.5 w-3.5" />
                                <span>Archive</span>
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteTarget(s);
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
            {paginatedServices.map((s) => (
              <Card key={s.id} className="border border-border bg-card/70 shadow-sm text-left">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-muted border border-border shrink-0">
                      <Image src={s.image} alt={s.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-foreground font-sans">{s.name}</h4>
                        {s.featured && <span className="text-[9px] font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">Featured</span>}
                      </div>
                      <p className="text-xs text-muted-foreground font-sans">{s.category} • {s.duration}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-normal font-sans line-clamp-2">
                    {s.shortDesc}
                  </p>

                  <div className="flex justify-between items-center text-xs font-sans border-t border-border/40 pt-3">
                    <span className="font-semibold text-foreground">${s.price}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-primary/5 ${s.status === "Active" ? "text-emerald-600" : "text-amber-600"}`}>
                      {s.status}
                    </span>
                  </div>

                  <div className="flex justify-end space-x-2 pt-1 border-t border-border/40">
                    <Button variant="outline" size="icon" onClick={() => setViewTarget(s)} className="h-7 w-7 rounded border-border/60">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setFormState({
                          name: s.name,
                          slug: s.slug,
                          shortDesc: s.shortDesc,
                          fullDesc: s.fullDesc,
                          category: s.category,
                          duration: s.duration,
                          level: s.level,
                          price: s.price,
                          featured: s.featured,
                          status: s.status,
                          image: s.image,
                          seoTitle: s.seoTitle,
                          seoDesc: s.seoDesc
                        });
                        setEditTarget(s);
                      }}
                      className="h-7 w-7 rounded border-border/60"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setDeleteTarget(s)} className="h-7 w-7 rounded border-border/60 text-rose-500 hover:bg-rose-500/5 hover:text-rose-600">
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
                Showing {startIndex + 1}–{Math.min(startIndex + rowsPerPage, sortedServices.length)} of {sortedServices.length}
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

      {/* C. Create Service Dialog */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setIsCreateOpen(false)} className="fixed inset-0 bg-black" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-2xl w-full rounded-2xl shadow-2xl z-10 overflow-hidden text-left"
              role="dialog"
            >
              <div className="p-5 border-b border-border/80 flex justify-between items-center bg-primary/5">
                <h3 className="text-sm sm:text-base font-bold text-foreground font-sans">Add New Service</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsCreateOpen(false)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Service Name</label>
                    <input type="text" name="name" required value={formState.name} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                  {/* Slug */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Slug</label>
                    <input type="text" name="slug" required value={formState.slug} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Category</label>
                    <select name="category" value={formState.category} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Hatha">Hatha</option>
                      <option value="Vinyasa">Vinyasa</option>
                      <option value="Meditation">Meditation</option>
                      <option value="Therapy">Therapy</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                  {/* Difficulty level */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Difficulty Level</label>
                    <select name="level" value={formState.level} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>
                  {/* Duration */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Duration</label>
                    <input type="text" name="duration" placeholder="e.g. 60 mins" required value={formState.duration} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Price ($)</label>
                    <input type="number" name="price" required value={formState.price} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                </div>

                {/* Short Desc */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground font-sans">Short Description</label>
                  <textarea name="shortDesc" required value={formState.shortDesc} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background h-16 resize-none" />
                </div>
                {/* Full Desc */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground font-sans">Full Description</label>
                  <textarea name="fullDesc" required value={formState.fullDesc} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background h-24 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Featured */}
                  <div className="flex items-center space-x-2 pt-4 select-none">
                    <input type="checkbox" id="featured" name="featured" checked={formState.featured} onChange={(e) => setFormState(p => ({ ...p, featured: e.target.checked }))} className="h-4 w-4 rounded border-border text-accent" />
                    <label htmlFor="featured" className="text-xs font-semibold text-muted-foreground cursor-pointer">Featured Program</label>
                  </div>
                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Status</label>
                    <select name="status" value={formState.status} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* SEO Config */}
                <div className="space-y-3 border-t border-border pt-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">SEO Optimization</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">SEO Title</label>
                      <input type="text" name="seoTitle" value={formState.seoTitle} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">SEO Description</label>
                      <input type="text" name="seoDesc" value={formState.seoDesc} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3.5 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button variant="default" size="sm" type="submit">Create Service</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* D. Edit Service Dialog */}
      <AnimatePresence>
        {editTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setEditTarget(null)} className="fixed inset-0 bg-black" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-2xl w-full rounded-2xl shadow-2xl z-10 overflow-hidden text-left"
              role="dialog"
            >
              <div className="p-5 border-b border-border/80 flex justify-between items-center bg-primary/5">
                <h3 className="text-sm sm:text-base font-bold text-foreground font-sans">Edit Service</h3>
                <Button variant="ghost" size="icon" onClick={() => setEditTarget(null)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Service Name</label>
                    <input type="text" name="name" required value={formState.name} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                  {/* Slug */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Slug</label>
                    <input type="text" name="slug" required value={formState.slug} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Category</label>
                    <select name="category" value={formState.category} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Hatha">Hatha</option>
                      <option value="Vinyasa">Vinyasa</option>
                      <option value="Meditation">Meditation</option>
                      <option value="Therapy">Therapy</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                  {/* Difficulty level */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Difficulty Level</label>
                    <select name="level" value={formState.level} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>
                  {/* Duration */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Duration</label>
                    <input type="text" name="duration" required value={formState.duration} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Price ($)</label>
                    <input type="number" name="price" required value={formState.price} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                </div>

                {/* Short Desc */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground font-sans">Short Description</label>
                  <textarea name="shortDesc" required value={formState.shortDesc} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background h-16 resize-none" />
                </div>
                {/* Full Desc */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground font-sans">Full Description</label>
                  <textarea name="fullDesc" required value={formState.fullDesc} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background h-24 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Featured */}
                  <div className="flex items-center space-x-2 pt-4 select-none">
                    <input type="checkbox" id="featuredEdit" name="featured" checked={formState.featured} onChange={(e) => setFormState(p => ({ ...p, featured: e.target.checked }))} className="h-4 w-4 rounded border-border text-accent" />
                    <label htmlFor="featuredEdit" className="text-xs font-semibold text-muted-foreground cursor-pointer">Featured Program</label>
                  </div>
                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Status</label>
                    <select name="status" value={formState.status} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* SEO Config */}
                <div className="space-y-3 border-t border-border pt-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-sans">SEO Optimization</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">SEO Title</label>
                      <input type="text" name="seoTitle" value={formState.seoTitle} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">SEO Description</label>
                      <input type="text" name="seoDesc" value={formState.seoDesc} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                    </div>
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

      {/* E. View Details Modal */}
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
                  <h3 className="text-sm sm:text-base font-bold text-foreground font-sans">{viewTarget.name} Details</h3>
                  <span className="font-mono text-[10px] text-muted-foreground">{viewTarget.id}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setViewTarget(null)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="relative h-44 w-full overflow-hidden rounded-xl bg-muted border border-border">
                  <Image src={viewTarget.image} alt={viewTarget.name} fill className="object-cover" sizes="400px" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-sans">Full Description</span>
                  <p className="text-xs text-foreground leading-relaxed font-sans">{viewTarget.fullDesc}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border pt-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-sans">Category</span>
                    <span className="text-xs font-semibold text-foreground font-sans">{viewTarget.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-sans">Duration</span>
                    <span className="text-xs font-semibold text-foreground font-sans">{viewTarget.duration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-sans">Price</span>
                    <span className="text-xs font-semibold text-foreground font-sans">${viewTarget.price}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-sans">Level</span>
                    <span className="text-xs font-semibold text-foreground font-sans">{viewTarget.level}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-sans">SEO Meta parameters</span>
                  <p className="text-xs font-sans text-muted-foreground"><span className="font-bold text-foreground">SEO Title:</span> {viewTarget.seoTitle || "N/A"}</p>
                  <p className="text-xs font-sans text-muted-foreground"><span className="font-bold text-foreground">SEO Description:</span> {viewTarget.seoDesc || "N/A"}</p>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-primary/5 flex justify-end">
                <Button variant="default" size="sm" onClick={() => setViewTarget(null)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* F. Delete Confirmation Modal */}
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
                  <h3 className="text-sm sm:text-base font-bold text-foreground font-sans">Delete Service</h3>
                  <p className="text-xs text-muted-foreground font-sans leading-normal">
                    Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget.name}</span>? This action cannot be undone.
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
