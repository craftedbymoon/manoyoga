"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import {
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Copy,
  Archive,
  Trash2,
  X,
  AlertTriangle,
  BookOpen,
  Calendar,
  User,
  ExternalLink,
  Sparkles,
  Layout,
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: "Yoga" | "Meditation" | "Wellness" | "Nutrition" | "Lifestyle" | "Mindfulness";
  tags: string;
  author: string;
  readingTime: string;
  featured: boolean;
  publishDate: string;
  status: "Published" | "Draft" | "Scheduled" | "Archived";
  views: number;
  seoTitle: string;
  metaDesc: string;
  focusKeyword: string;
  canonicalUrl: string;
  ogImage: string;
}

export default function BlogManagementPage() {
  const shouldReduceMotion = useReducedMotion();
  const [isLoading, setIsLoading] = React.useState(true);
  const [articles, setArticles] = React.useState<Article[]>([]);
  
  // Toolbar Filters state
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [authorFilter, setAuthorFilter] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("date-desc");
  
  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Overlay state managers
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Article | null>(null);
  const [previewTarget, setPreviewTarget] = React.useState<Article | null>(null);
  const [viewTarget, setViewTarget] = React.useState<Article | null>(null);
  
  // Form dialog state managers
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Article | null>(null);

  // Load Mock Data
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const mockData: Article[] = [
        {
          id: "ART-101",
          title: "10 Simple Yoga Poses for Everyday Flexibility",
          slug: "10-simple-yoga-poses-flexibility",
          excerpt: "Unlock tight joints and improve daily mobility with these basic hatha yoga extensions.",
          content: "Yoga is a practice that can fit into any busy routine. Stretches like Child's Pose, Downward Dog, and Cobra Pose decompress tight spinal joints, improve hip mobility, and balance daily stress levels. Practice these 10 poses for 15 minutes each morning to notice a transformation in alignment, deep breathing capacity, and core engagement.",
          image: "/gallery-1.jpg",
          category: "Yoga",
          tags: "Hatha, Stretch, Health",
          author: "Nistha",
          readingTime: "5 mins",
          featured: true,
          publishDate: "2026-07-10",
          status: "Published",
          views: 342,
          seoTitle: "10 Daily Yoga Poses for Spinal Flexibility",
          metaDesc: "Start your morning with 10 simple yoga poses designed to increase daily mobility.",
          focusKeyword: "yoga poses for flexibility",
          canonicalUrl: "https://manoyoga.com/blog/10-yoga-poses",
          ogImage: "/gallery-1.jpg"
        },
        {
          id: "ART-102",
          title: "Mindfulness and Deep Diaphragmatic Breathing",
          slug: "mindfulness-diaphragmatic-breathing",
          excerpt: "How calming your neural system with pranayama enhances concentration.",
          content: "Breathing is the bridge between the mind and the physical body. By extending the duration of our inhalations and exhalations, we activate the parasympathetic nervous system, lowering heart rates and clearing mental clutter. Learn how to construct a simple 10-minute pranayama habit in this complete guide.",
          image: "/gallery-2.jpg",
          category: "Meditation",
          tags: "Pranayama, Mindfulness",
          author: "Nistha",
          readingTime: "6 mins",
          featured: true,
          publishDate: "2026-07-12",
          status: "Published",
          views: 289,
          seoTitle: "Diaphragmatic Breathing Guides - ManoYoga",
          metaDesc: "Discover the science of diaphragmatic breathing and how it calms the nervous system.",
          focusKeyword: "diaphragmatic breathing",
          canonicalUrl: "https://manoyoga.com/blog/breathing",
          ogImage: "/gallery-2.jpg"
        },
        {
          id: "ART-103",
          title: "Nutrition Guide: Whole Foods and Yoga",
          slug: "nutrition-guide-whole-foods-yoga",
          excerpt: "Aligning your gut health with daily physical flows.",
          content: "A yogic diet (Sattvic) consists of fresh, organic, whole foods that digest easily and provide clean energy. Incorporating rich seeds, seasonal fruits, green vegetables, and herbal teas helps hydrate tissue layers and support metabolic recovery after intensive hot vinyasa flows.",
          image: "/gallery-3.jpg",
          category: "Nutrition",
          tags: "Sattvic Diet, Gut Health",
          author: "Dr. Rohan Gupta",
          readingTime: "8 mins",
          featured: false,
          publishDate: "2026-07-08",
          status: "Published",
          views: 195,
          seoTitle: "Yogic Sattvic Diet & Whole Foods Guide",
          metaDesc: "Maximize your energy levels by pairing vinyasa flows with clean Sattvic eating patterns.",
          focusKeyword: "sattvic diet",
          canonicalUrl: "https://manoyoga.com/blog/nutrition",
          ogImage: "/gallery-3.jpg"
        },
        {
          id: "ART-104",
          title: "Aligning Hips and Spine: Relief from Desk Work",
          slug: "relief-from-desk-work-hip-spine",
          excerpt: "Targeted decompression strategies for corporate employees.",
          content: "Sustained sitting tightens the hip flexors and rounds the thoracic spine. Use simple stretches like Pigeon Pose and Low Lunge at least twice a day to open up joints, align posture segments, and prevent sciatic compression.",
          image: "/gallery-1.jpg",
          category: "Wellness",
          tags: "Back Pain, Corporate Stretch",
          author: "Nistha",
          readingTime: "4 mins",
          featured: false,
          publishDate: "2026-07-05",
          status: "Published",
          views: 512,
          seoTitle: "Spine & Hip Stretches for Office Workers",
          metaDesc: "Open up tight hips and release spinal compression with these quick desk-friendly yoga postures.",
          focusKeyword: "desk work stretches",
          canonicalUrl: "https://manoyoga.com/blog/desk-relief",
          ogImage: "/gallery-1.jpg"
        },
        {
          id: "ART-105",
          title: "The Art of Slowing Down in a Digital Age",
          slug: "art-of-slowing-down-digital-age",
          excerpt: "Practical tips to disconnect and recover your attention.",
          content: "Digital overload exhausts the brain's focus limits. By dedicating 20 minutes a day to silence without screen glare, you give your brain cells a window to recover attention and deepen cognitive rest.",
          image: "/gallery-2.jpg",
          category: "Lifestyle",
          tags: "Digital Detox, Mental Health",
          author: "Ananya Sen",
          readingTime: "7 mins",
          featured: false,
          publishDate: "2026-07-15",
          status: "Scheduled",
          views: 0,
          seoTitle: "Slowing Down & Digital Detox Tips",
          metaDesc: "Tips to escape digital overstimulation through daily silence and mindfulness rituals.",
          focusKeyword: "digital detox tips",
          canonicalUrl: "https://manoyoga.com/blog/slowing-down",
          ogImage: "/gallery-2.jpg"
        },
        {
          id: "ART-106",
          title: "Vinyasa Flow vs. Hatha Yoga: Which is Best?",
          slug: "vinyasa-vs-hatha-yoga",
          excerpt: "Determine the best yogic system for your current health goals.",
          content: "Vinyasa is fluid, athletic, and links breath to constant movement, making it great for cardiovascular health and weight management. Hatha is slower, focusing on deep holds and joint alignment, which is perfect for beginners and structure recovery.",
          image: "/gallery-3.jpg",
          category: "Yoga",
          tags: "Hatha, Vinyasa, Program Guide",
          author: "Nistha",
          readingTime: "5 mins",
          featured: false,
          publishDate: "2026-07-14",
          status: "Published",
          views: 180,
          seoTitle: "Hatha vs Vinyasa - Choosing Your Yoga Style",
          metaDesc: "Unpack the differences between Hatha and Vinyasa styles to pick the best workout for your goals.",
          focusKeyword: "hatha vs vinyasa",
          canonicalUrl: "https://manoyoga.com/blog/hatha-vinyasa",
          ogImage: "/gallery-3.jpg"
        },
        {
          id: "ART-107",
          title: "Developing a Calming Sunset Meditation Practice",
          slug: "sunset-meditation-practice",
          excerpt: "Decompress mental stress before transitioning to sleep.",
          content: "Evening meditation signals the body to release active stress. Using simple visualization techniques at dusk helps reset breathing patterns and support deeper sleep.",
          image: "/gallery-1.jpg",
          category: "Mindfulness",
          tags: "Meditation, Sleep Care",
          author: "Nistha",
          readingTime: "4 mins",
          featured: false,
          publishDate: "2026-07-02",
          status: "Published",
          views: 110,
          seoTitle: "Sunset Meditation Guides - ManoYoga",
          metaDesc: "How evening breathing routines clear daily anxieties and improve sleep.",
          focusKeyword: "sunset meditation",
          canonicalUrl: "https://manoyoga.com/blog/sunset-meditation",
          ogImage: "/gallery-1.jpg"
        },
        {
          id: "ART-108",
          title: "Hydration Science: Water Intake and Muscle Recovery",
          slug: "hydration-science-muscle-recovery",
          excerpt: "How molecular hydration affects fascia sliding and flexibility.",
          content: "Fascial sheets need structured hydration to slide smoothly over muscles. Drinking structured water before hot yoga helps maintain joint lubrication and prevents muscle cramping.",
          image: "/gallery-2.jpg",
          category: "Nutrition",
          tags: "Fascia, Hydration",
          author: "Dr. Rohan Gupta",
          readingTime: "6 mins",
          featured: false,
          publishDate: "2026-07-01",
          status: "Draft",
          views: 0,
          seoTitle: "Hydration and Joint Flexibility",
          metaDesc: "The science of drinking water to support fascia flexibility and quick muscle recovery.",
          focusKeyword: "hydration and muscle recovery",
          canonicalUrl: "https://manoyoga.com/blog/hydration",
          ogImage: "/gallery-2.jpg"
        }
      ];
      setArticles(mockData);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Form State Holder
  const initialFormState: Omit<Article, "id" | "views"> = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "/gallery-1.jpg",
    category: "Yoga",
    tags: "",
    author: "Nistha",
    readingTime: "5 mins",
    featured: false,
    publishDate: "",
    status: "Active" as any,
    seoTitle: "",
    metaDesc: "",
    focusKeyword: "",
    canonicalUrl: "",
    ogImage: "/gallery-1.jpg"
  };

  const [formState, setFormState] = React.useState(initialFormState);

  // Form inputs change triggers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    if (name === "title") {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormState((prev) => ({ ...prev, title: value, slug: generatedSlug }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle: Article = {
      ...formState,
      id: `ART-${Date.now().toString().slice(-3)}`,
      views: 0,
      publishDate: formState.publishDate || new Date().toISOString().split("T")[0]
    };
    setArticles((prev) => [newArticle, ...prev]);
    setIsCreateOpen(false);
    setFormState(initialFormState);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setArticles((prev) =>
      prev.map((a) =>
        a.id === editTarget.id
          ? {
              ...a,
              ...formState,
              publishDate: formState.publishDate || new Date().toISOString().split("T")[0]
            }
          : a
      )
    );
    setEditTarget(null);
    setFormState(initialFormState);
  };

  const handleDuplicate = (art: Article) => {
    const duplicated: Article = {
      ...art,
      id: `ART-${Date.now().toString().slice(-3)}`,
      title: `${art.title} (Copy)`,
      slug: `${art.slug}-copy`,
      featured: false,
      views: 0,
      publishDate: new Date().toISOString().split("T")[0]
    };
    setArticles((prev) => [duplicated, ...prev]);
  };

  const handleArchive = (art: Article) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === art.id ? { ...a, status: "Archived" } : a))
    );
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  // Filter & Sort Logic
  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === "All" || a.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    const matchesAuthor = authorFilter === "All" || a.author === authorFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesAuthor;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === "date-desc") return b.publishDate.localeCompare(a.publishDate);
    if (sortBy === "date-asc") return a.publishDate.localeCompare(b.publishDate);
    if (sortBy === "views-desc") return b.views - a.views;
    if (sortBy === "views-asc") return a.views - b.views;
    return 0;
  });

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(sortedArticles.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedArticles = sortedArticles.slice(startIndex, startIndex + rowsPerPage);

  // Statistics counters
  const totalCount = articles.length;
  const publishedCount = articles.filter((a) => a.status === "Published").length;
  const draftCount = articles.filter((a) => a.status === "Draft").length;
  const categoryCount = new Set(articles.map((a) => a.category)).size;

  const stats = [
    { label: "Total Articles", value: totalCount, change: "CMS records", icon: FileText },
    { label: "Published Articles", value: publishedCount, change: "Live on site", icon: Sparkles },
    { label: "Draft Articles", value: draftCount, change: "Under edit", icon: Clock },
    { label: "Categories", value: categoryCount, change: "Content pillars", icon: Layout }
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
            Blog Management
          </h1>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed">
            Create, edit and organize all blog articles.
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
          <span>New Article</span>
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
        <CardContent className="p-4 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-grow">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
              <input
                type="text"
                placeholder="Search articles, slugs, IDs..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md border border-border bg-background/50 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 h-8 font-sans"
                aria-label="Search articles"
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
                className="pl-3 pr-8 py-1.5 text-xs rounded-md border border-border bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent h-8 cursor-pointer font-sans appearance-none min-w-[110px]"
                aria-label="Filter by Category"
              >
                <option value="All">All Categories</option>
                <option value="Yoga">Yoga</option>
                <option value="Meditation">Meditation</option>
                <option value="Wellness">Wellness</option>
                <option value="Nutrition">Nutrition</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Mindfulness">Mindfulness</option>
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
                className="pl-3 pr-8 py-1.5 text-xs rounded-md border border-border bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent h-8 cursor-pointer font-sans appearance-none min-w-[110px]"
                aria-label="Filter by Status"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Archived">Archived</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
            </div>

            {/* Author Filter */}
            <div className="relative">
              <select
                value={authorFilter}
                onChange={(e) => {
                  setAuthorFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-3 pr-8 py-1.5 text-xs rounded-md border border-border bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent h-8 cursor-pointer font-sans appearance-none min-w-[110px]"
                aria-label="Filter by Author"
              >
                <option value="All">All Authors</option>
                <option value="Nistha">Nistha</option>
                <option value="Dr. Rohan Gupta">Dr. Rohan Gupta</option>
                <option value="Ananya Sen">Ananya Sen</option>
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
                <option value="views-desc">Views (High to Low)</option>
                <option value="views-asc">Views (Low to High)</option>
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

      {/* Main Grid Articles Container */}
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
                      <div className="h-4.5 w-48 bg-primary/5 rounded" />
                      <div className="h-3.5 w-24 bg-primary/5 rounded" />
                    </div>
                  </div>
                  <div className="h-8 w-16 bg-primary/5 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : paginatedArticles.length === 0 ? (
        // Elegant Empty State
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto text-accent shadow-sm">
            <FileText className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground font-sans">No Articles Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto font-sans leading-relaxed">
              We couldn't find any blog articles matching your filters. Try clearing your filters or search keywords.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setCategoryFilter("All");
              setStatusFilter("All");
              setAuthorFilter("All");
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
                  <th className="p-4 font-bold font-sans">Image</th>
                  <th className="p-4 font-bold font-sans">Title</th>
                  <th className="p-4 font-bold font-sans">Category</th>
                  <th className="p-4 font-bold font-sans">Author</th>
                  <th className="p-4 font-bold font-sans">Reading Time</th>
                  <th className="p-4 font-bold font-sans">Published Date</th>
                  <th className="p-4 font-bold font-sans">Views</th>
                  <th className="p-4 font-bold font-sans">Status</th>
                  <th className="p-4 font-bold font-sans text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedArticles.map((a) => (
                  <tr key={a.id} className="hover:bg-primary/5 transition-colors">
                    <td className="p-4">
                      <div className="relative h-10 w-16 overflow-hidden rounded-lg bg-muted border border-border">
                        <Image src={a.image} alt={a.title} fill className="object-cover" sizes="64px" />
                      </div>
                    </td>
                    <td className="p-4 space-y-0.5 max-w-xs">
                      <p className="font-semibold text-foreground font-sans truncate">{a.title}</p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">{a.slug}</p>
                    </td>
                    <td className="p-4 text-muted-foreground font-sans">{a.category}</td>
                    <td className="p-4 text-muted-foreground font-sans">{a.author}</td>
                    <td className="p-4 text-muted-foreground font-sans">{a.readingTime}</td>
                    <td className="p-4 text-muted-foreground font-sans">{a.publishDate}</td>
                    <td className="p-4 text-muted-foreground font-sans">{a.views}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          a.status === "Published"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : a.status === "Draft"
                            ? "bg-amber-500/10 text-amber-600"
                            : a.status === "Scheduled"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-zinc-500/10 text-zinc-500"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4 text-center relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setActiveMenuId(activeMenuId === a.id ? null : a.id)}
                        className="h-8 w-8 rounded-md border border-border/40 hover:bg-primary/5"
                        aria-label="Open actions menu"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>

                      {/* Context actions menu */}
                      <AnimatePresence>
                        {activeMenuId === a.id && (
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
                                  setViewTarget(a);
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
                                    title: a.title,
                                    slug: a.slug,
                                    excerpt: a.excerpt,
                                    content: a.content,
                                    image: a.image,
                                    category: a.category,
                                    tags: a.tags,
                                    author: a.author,
                                    readingTime: a.readingTime,
                                    featured: a.featured,
                                    publishDate: a.publishDate,
                                    status: a.status,
                                    seoTitle: a.seoTitle,
                                    metaDesc: a.metaDesc,
                                    focusKeyword: a.focusKeyword,
                                    canonicalUrl: a.canonicalUrl,
                                    ogImage: a.ogImage
                                  });
                                  setEditTarget(a);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <Edit className="h-3.5 w-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleDuplicate(a);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <Copy className="h-3.5 w-3.5" />
                                <span>Duplicate</span>
                              </button>
                              <button
                                onClick={() => {
                                  setPreviewTarget(a);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer border-t border-border/40"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>Preview</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleArchive(a);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                              >
                                <Archive className="h-3.5 w-3.5" />
                                <span>Archive</span>
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteTarget(a);
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
            {paginatedArticles.map((a) => (
              <Card key={a.id} className="border border-border bg-card/70 shadow-sm text-left">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-muted border border-border shrink-0">
                      <Image src={a.image} alt={a.title} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-sm font-bold text-foreground font-sans truncate">{a.title}</h4>
                      <p className="text-xs text-muted-foreground font-sans">{a.category} • {a.author}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-normal font-sans line-clamp-2">
                    {a.excerpt}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-sans border-t border-border/40 pt-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{a.readingTime}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-primary/5 ${a.status === "Published" ? "text-emerald-600" : "text-amber-600"}`}>
                      {a.status}
                    </span>
                  </div>

                  <div className="flex justify-end space-x-2 pt-1 border-t border-border/40">
                    <Button variant="outline" size="icon" onClick={() => setPreviewTarget(a)} className="h-7 w-7 rounded border-border/60">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setFormState({
                          title: a.title,
                          slug: a.slug,
                          excerpt: a.excerpt,
                          content: a.content,
                          image: a.image,
                          category: a.category,
                          tags: a.tags,
                          author: a.author,
                          readingTime: a.readingTime,
                          featured: a.featured,
                          publishDate: a.publishDate,
                          status: a.status,
                          seoTitle: a.seoTitle,
                          metaDesc: a.metaDesc,
                          focusKeyword: a.focusKeyword,
                          canonicalUrl: a.canonicalUrl,
                          ogImage: a.ogImage
                        });
                        setEditTarget(a);
                      }}
                      className="h-7 w-7 rounded border-border/60"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setDeleteTarget(a)} className="h-7 w-7 rounded border-border/60 text-rose-500 hover:bg-rose-500/5 hover:text-rose-600">
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
                Showing {startIndex + 1}–{Math.min(startIndex + rowsPerPage, sortedArticles.length)} of {sortedArticles.length}
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

      {/* C. Create Article Dialog */}
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
                <h3 className="text-sm sm:text-base font-bold text-foreground font-sans">Add New Article</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsCreateOpen(false)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Article Title</label>
                    <input type="text" name="title" required value={formState.title} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
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
                      <option value="Yoga">Yoga</option>
                      <option value="Meditation">Meditation</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Nutrition">Nutrition</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Mindfulness">Mindfulness</option>
                    </select>
                  </div>
                  {/* Author */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Author</label>
                    <select name="author" value={formState.author} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Nistha">Nistha</option>
                      <option value="Dr. Rohan Gupta">Dr. Rohan Gupta</option>
                      <option value="Ananya Sen">Ananya Sen</option>
                    </select>
                  </div>
                  {/* Reading Time */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Reading Time</label>
                    <input type="text" name="readingTime" placeholder="e.g. 5 mins" required value={formState.readingTime} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                  {/* Publish Date */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Publish Date</label>
                    <input type="date" name="publishDate" value={formState.publishDate} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground font-sans">Excerpt</label>
                  <textarea name="excerpt" required value={formState.excerpt} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background h-16 resize-none" />
                </div>
                {/* Content */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground font-sans">Content (Rich Text Content Placeholder)</label>
                  <textarea name="content" required placeholder="Write article content here..." value={formState.content} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background h-32 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Featured */}
                  <div className="flex items-center space-x-2 pt-4 select-none">
                    <input type="checkbox" id="featuredCreate" name="featured" checked={formState.featured} onChange={(e) => setFormState(p => ({ ...p, featured: e.target.checked }))} className="h-4 w-4 rounded border-border text-accent" />
                    <label htmlFor="featuredCreate" className="text-xs font-semibold text-muted-foreground cursor-pointer">Featured Article</label>
                  </div>
                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Status</label>
                    <select name="status" value={formState.status} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* SEO Config */}
                <div className="space-y-3 border-t border-border pt-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-sans">SEO Meta parameters</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">SEO Title</label>
                      <input type="text" name="seoTitle" value={formState.seoTitle} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Meta Description</label>
                      <input type="text" name="metaDesc" value={formState.metaDesc} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Focus Keyword</label>
                      <input type="text" name="focusKeyword" value={formState.focusKeyword} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Canonical URL</label>
                      <input type="text" name="canonicalUrl" value={formState.canonicalUrl} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3.5 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button variant="default" size="sm" type="submit">Create Article</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* D. Edit Article Dialog */}
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
                <h3 className="text-sm sm:text-base font-bold text-foreground font-sans">Edit Article</h3>
                <Button variant="ghost" size="icon" onClick={() => setEditTarget(null)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Article Title</label>
                    <input type="text" name="title" required value={formState.title} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
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
                      <option value="Yoga">Yoga</option>
                      <option value="Meditation">Meditation</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Nutrition">Nutrition</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Mindfulness">Mindfulness</option>
                    </select>
                  </div>
                  {/* Author */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Author</label>
                    <select name="author" value={formState.author} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Nistha">Nistha</option>
                      <option value="Dr. Rohan Gupta">Dr. Rohan Gupta</option>
                      <option value="Ananya Sen">Ananya Sen</option>
                    </select>
                  </div>
                  {/* Reading Time */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Reading Time</label>
                    <input type="text" name="readingTime" required value={formState.readingTime} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                  {/* Publish Date */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Publish Date</label>
                    <input type="date" name="publishDate" value={formState.publishDate} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground font-sans">Excerpt</label>
                  <textarea name="excerpt" required value={formState.excerpt} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background h-16 resize-none" />
                </div>
                {/* Content */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground font-sans">Content (Rich Text Content Placeholder)</label>
                  <textarea name="content" required value={formState.content} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background h-32 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Featured */}
                  <div className="flex items-center space-x-2 pt-4 select-none">
                    <input type="checkbox" id="featuredEdit" name="featured" checked={formState.featured} onChange={(e) => setFormState(p => ({ ...p, featured: e.target.checked }))} className="h-4 w-4 rounded border-border text-accent" />
                    <label htmlFor="featuredEdit" className="text-xs font-semibold text-muted-foreground cursor-pointer">Featured Article</label>
                  </div>
                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Status</label>
                    <select name="status" value={formState.status} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* SEO Config */}
                <div className="space-y-3 border-t border-border pt-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-sans">SEO Meta parameters</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">SEO Title</label>
                      <input type="text" name="seoTitle" value={formState.seoTitle} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Meta Description</label>
                      <input type="text" name="metaDesc" value={formState.metaDesc} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Focus Keyword</label>
                      <input type="text" name="focusKeyword" value={formState.focusKeyword} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Canonical URL</label>
                      <input type="text" name="canonicalUrl" value={formState.canonicalUrl} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
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

      {/* E. Preview Dialog */}
      <AnimatePresence>
        {previewTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setPreviewTarget(null)} className="fixed inset-0 bg-black" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-2xl w-full rounded-2xl shadow-2xl z-10 overflow-hidden text-left"
              role="dialog"
            >
              <div className="p-5 border-b border-border/80 flex justify-between items-center bg-primary/5">
                <div>
                  <h3 className="text-sm font-bold text-foreground font-sans">Public Page Preview</h3>
                  <span className="font-mono text-[9px] text-muted-foreground">{previewTarget.slug}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setPreviewTarget(null)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Public Yoga Page Mimic */}
              <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto bg-background/50 font-sans">
                
                {/* Visual Header */}
                <div className="space-y-3">
                  <span className="px-2.5 py-0.5 rounded bg-accent/15 text-accent text-[10px] font-bold tracking-wider uppercase font-sans">
                    {previewTarget.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans leading-tight">
                    {previewTarget.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-sans pt-1 border-y border-border/40 py-2.5">
                    <div className="flex items-center space-x-1">
                      <User className="h-3.5 w-3.5" />
                      <span>By {previewTarget.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{previewTarget.publishDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{previewTarget.readingTime} read</span>
                    </div>
                  </div>
                </div>

                {/* Cover Photo */}
                <div className="relative h-56 w-full overflow-hidden rounded-xl bg-muted border border-border shadow-sm">
                  <Image src={previewTarget.image} alt={previewTarget.title} fill className="object-cover" sizes="600px" />
                </div>

                {/* Excerpt Summary */}
                <p className="text-xs sm:text-sm font-semibold italic text-foreground/80 leading-relaxed font-sans border-l-2 border-accent pl-4">
                  {previewTarget.excerpt}
                </p>

                {/* Mock Content */}
                <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                  <p>{previewTarget.content}</p>
                  <p>
                    Wellness is a lifestyle, not a short goal. Regular commitment to mobility, posture holds, and daily breathing patterns allows the mind to reach clarity. Connect your practice with Nistha at ManoYoga to build structural strength.
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

      {/* F. View details overlay */}
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
                  <h3 className="text-sm font-bold text-foreground font-sans">Article Info</h3>
                  <span className="font-mono text-[9px] text-muted-foreground">{viewTarget.id}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setViewTarget(null)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto font-sans">
                <div className="relative h-44 w-full overflow-hidden rounded-xl bg-muted border border-border">
                  <Image src={viewTarget.image} alt={viewTarget.title} fill className="object-cover" sizes="400px" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Title</p>
                  <p className="text-xs font-semibold text-foreground leading-normal mt-0.5">{viewTarget.title}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Excerpt</p>
                  <p className="text-xs text-muted-foreground leading-normal mt-0.5">{viewTarget.excerpt}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-border pt-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Category</span>
                    <span className="text-xs font-semibold text-foreground">{viewTarget.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Author</span>
                    <span className="text-xs font-semibold text-foreground">{viewTarget.author}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Reading Time</span>
                    <span className="text-xs font-semibold text-foreground">{viewTarget.readingTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Total Views</span>
                    <span className="text-xs font-semibold text-foreground">{viewTarget.views}</span>
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

      {/* G. Delete Confirmation dialog */}
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
                  <h3 className="text-sm sm:text-base font-bold text-foreground font-sans">Delete Article</h3>
                  <p className="text-xs text-muted-foreground font-sans leading-normal">
                    Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget.title}</span>? This action is permanent and cannot be undone.
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
