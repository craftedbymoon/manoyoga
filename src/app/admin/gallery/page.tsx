"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import {
  Image as ImageIcon,
  Search,
  Filter,
  Grid,
  List,
  Upload,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Edit,
  Download,
  Trash2,
  AlertTriangle,
  FolderOpen,
  Calendar,
  Layers,
  Sparkles,
  Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { uploadImageAction } from "@/lib/actions/uploads";
import { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from "@/lib/actions/gallery";

interface GalleryItem {
  id: string;
  title: string;
  altText: string;
  category: "Yoga Classes" | "Meditation" | "Events" | "Corporate Yoga" | "Online Sessions" | "Workshops" | "Studio" | "Team";
  description: string;
  featured: boolean;
  status: "Active" | "Draft" | "Archived";
  url: string;
  fileSize: string;
  uploadDate: string;
  seoTitle: string;
  seoAlt: string;
  seoCaption: string;
}

export default function GalleryManagementPage() {
  const shouldReduceMotion = useReducedMotion();
  const [isLoading, setIsLoading] = React.useState(true);
  const [items, setItems] = React.useState<GalleryItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("All");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = React.useState("date-desc");

  // Action / Dialog state managers
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<GalleryItem | null>(null);
  const [lightboxTargetIdx, setLightboxTargetIdx] = React.useState<number | null>(null);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<GalleryItem | null>(null);

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await getGalleryItems();
      if (data) {
        setItems(data.map((item: any) => ({
          id: item.id,
          title: item.title,
          altText: item.altText,
          category: item.category as any,
          description: item.description || "",
          featured: item.featured,
          status: item.status as any,
          url: item.url,
          fileSize: item.fileSize,
          uploadDate: new Date(item.createdAt).toISOString().split("T")[0],
          seoTitle: item.seoTitle || "",
          seoAlt: item.seoAlt || "",
          seoCaption: item.seoCaption || ""
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchItems();
  }, []);

  const initialFormState: Omit<GalleryItem, "id" | "fileSize" | "uploadDate"> = {
    title: "",
    altText: "",
    category: "Yoga Classes",
    description: "",
    featured: false,
    status: "Active",
    url: "/gallery-1.jpg",
    seoTitle: "",
    seoAlt: "",
    seoCaption: ""
  };

  const [formState, setFormState] = React.useState(initialFormState);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormState((prev) => ({ ...prev, [name]: val }));
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await uploadImageAction(formData);
      if (!res.success) {
        setUploadError(res.error || "Failed to upload to Cloudinary.");
        setIsUploading(false);
        return;
      }

      const sizeStr = `${(selectedFile.size / 1024).toFixed(0)} KB`;
      const saveRes = await createGalleryItem({
        title: formState.title,
        altText: formState.altText,
        category: formState.category,
        description: formState.description,
        url: res.url || "/gallery-1.jpg",
        fileSize: sizeStr,
        seoTitle: formState.seoTitle,
        seoAlt: formState.seoAlt,
        seoCaption: formState.seoCaption,
        featured: formState.featured,
        status: formState.status
      });

      if (saveRes.success) {
        setIsUploadOpen(false);
        setSelectedFile(null);
        setFormState(initialFormState);
        fetchItems();
      } else {
        setUploadError(saveRes.error || "Failed to save record.");
      }
    } catch (err: any) {
      setUploadError(err.message || "An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;

    try {
      const res = await updateGalleryItem(editTarget.id, {
        title: formState.title,
        altText: formState.altText,
        category: formState.category,
        description: formState.description,
        featured: formState.featured,
        status: formState.status,
        seoTitle: formState.seoTitle,
        seoAlt: formState.seoAlt,
        seoCaption: formState.seoCaption
      });

      if (res.success) {
        setEditTarget(null);
        setFormState(initialFormState);
        fetchItems();
      } else {
        alert(res.error || "Failed to update item.");
      }
    } catch (err: any) {
      alert(err.message || "Edit failed.");
    }
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      try {
        const res = await deleteGalleryItem(deleteTarget.id);
        if (res.success) {
          setItems((prev) => prev.filter((it) => it.id !== deleteTarget.id));
          setDeleteTarget(null);
        } else {
          alert(res.error || "Failed to delete item.");
        }
      } catch (err: any) {
        alert(err.message || "Delete failed.");
      }
    }
  };

  // Filter & Sort Logic
  const filteredItems = items.filter((it) => {
    const matchesSearch =
      it.title.toLowerCase().includes(search.toLowerCase()) ||
      it.altText.toLowerCase().includes(search.toLowerCase()) ||
      it.id.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === "All" || it.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "date-desc") return b.uploadDate.localeCompare(a.uploadDate);
    if (sortBy === "date-asc") return a.uploadDate.localeCompare(b.uploadDate);
    if (sortBy === "size-desc") return b.fileSize.localeCompare(a.fileSize);
    return 0;
  });

  // Lightbox handlers
  const handlePrev = () => {
    if (lightboxTargetIdx === null) return;
    setLightboxTargetIdx((prev) => (prev === 0 ? sortedItems.length - 1 : prev! - 1));
  };

  const handleNext = () => {
    if (lightboxTargetIdx === null) return;
    setLightboxTargetIdx((prev) => (prev === sortedItems.length - 1 ? 0 : prev! + 1));
  };

  // Statistics counters
  const totalCount = items.length;
  const categoriesCount = new Set(items.map((it) => it.category)).size;
  const storageMock = "18.4 MB";
  const featuredCount = items.filter((it) => it.featured).length;

  const stats = [
    { label: "Total Images", value: totalCount, change: "Hosted files", icon: ImageIcon },
    { label: "Categories", value: categoriesCount, change: "Pillars mapped", icon: Layers },
    { label: "Storage Used", value: storageMock, change: "Cloudinary mock", icon: FolderOpen },
    { label: "Featured Images", value: featuredCount, change: "Home slider sets", icon: Sparkles }
  ];

  const lightboxItem = lightboxTargetIdx !== null ? sortedItems[lightboxTargetIdx] : null;

  return (
    <div className="space-y-8 font-sans pb-12 select-none">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6 text-left">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Gallery Management
          </h1>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed">
            Upload, organize and manage all website images.
          </p>
        </div>
        <Button
          variant="default"
          onClick={() => {
            setFormState(initialFormState);
            setIsUploadOpen(true);
          }}
          className="shrink-0 flex items-center justify-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Images</span>
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
                placeholder="Search images, ID, alt..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md border border-border bg-background/50 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 h-8 font-sans"
                aria-label="Search media files"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-3 pr-8 py-1.5 text-xs rounded-md border border-border bg-background/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent h-8 cursor-pointer font-sans appearance-none min-w-[140px]"
                aria-label="Filter by Category"
              >
                <option value="All">All Categories</option>
                <option value="Yoga Classes">Yoga Classes</option>
                <option value="Meditation">Meditation</option>
                <option value="Events">Events</option>
                <option value="Corporate Yoga">Corporate Yoga</option>
                <option value="Online Sessions">Online Sessions</option>
                <option value="Workshops">Workshops</option>
                <option value="Studio">Studio</option>
                <option value="Team">Team</option>
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
                <option value="size-desc">File Size (Max)</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
            </div>

          </div>

          {/* View Mode Toggle Button */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 rounded border-border/60"
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 rounded border-border/60"
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid/List Container */}
      {isLoading ? (
        // Loading state
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="border border-border/80 bg-card overflow-hidden animate-pulse">
              <div className="h-40 bg-primary/5" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 w-28 bg-primary/5 rounded" />
                <div className="h-3 w-16 bg-primary/5 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedItems.length === 0 ? (
        // Empty state
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto text-accent shadow-sm">
            <ImageIcon className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground font-sans">No Media Items Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto font-sans leading-relaxed">
              We couldn't find any images matching your filters. Try clearing your search keywords.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setCategoryFilter("All");
              setSortBy("date-desc");
            }}
          >
            Clear Filters
          </Button>
        </motion.div>
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedItems.map((it, idx) => (
            <motion.div
              key={it.id}
              whileHover={shouldReduceMotion ? {} : { y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border border-border bg-card/60 overflow-hidden shadow-sm hover:border-accent/40 group relative h-full flex flex-col justify-between text-left">
                
                {/* Visual Header */}
                <div className="relative h-40 w-full bg-muted overflow-hidden">
                  <Image
                    src={it.url}
                    alt={it.altText}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-102"
                    sizes="250px"
                  />
                  {/* Badges block */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                      {it.category}
                    </span>
                    {it.featured && (
                      <span className="px-2 py-0.5 rounded bg-accent text-[9px] font-bold text-accent-foreground flex items-center">
                        <Sparkles className="h-2.5 w-2.5 mr-0.5 shrink-0" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Actions Dropdown triggers */}
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveMenuId(activeMenuId === it.id ? null : it.id)}
                      className="h-7 w-7 rounded-md bg-black/40 hover:bg-black/60 text-white border-0"
                      aria-label="Open options menu"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>

                    {/* Actions dropdown */}
                    <AnimatePresence>
                      {activeMenuId === it.id && (
                        <>
                          <div className="fixed inset-0 z-35" onClick={() => setActiveMenuId(null)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 5 }}
                            className="absolute right-0 mt-1 w-32 rounded-lg border border-border bg-card shadow-lg py-1 z-40 text-left"
                          >
                            <button
                              onClick={() => {
                                setLightboxTargetIdx(idx);
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
                                  title: it.title,
                                  altText: it.altText,
                                  category: it.category,
                                  description: it.description,
                                  featured: it.featured,
                                  status: it.status,
                                  url: it.url,
                                  seoTitle: it.seoTitle,
                                  seoAlt: it.seoAlt,
                                  seoCaption: it.seoCaption
                                });
                                setEditTarget(it);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => setActiveMenuId(null)}
                              className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground font-sans cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>Download</span>
                            </button>
                            <button
                              onClick={() => {
                                setDeleteTarget(it);
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
                  </div>
                </div>

                <CardContent className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-foreground truncate font-sans">
                      {it.title}
                    </h4>
                    <p className="text-[10px] text-muted-foreground truncate font-sans">
                      {it.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-muted-foreground/60 font-mono border-t border-border/40 pt-2.5">
                    <span>{it.fileSize}</span>
                    <span>{it.uploadDate}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        // List View Table
        <div className="overflow-x-auto border border-border/80 rounded-xl bg-card shadow-sm">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-primary/5 select-none text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="p-4 font-bold font-sans">Preview</th>
                <th className="p-4 font-bold font-sans">Title</th>
                <th className="p-4 font-bold font-sans">Category</th>
                <th className="p-4 font-bold font-sans">Size</th>
                <th className="p-4 font-bold font-sans">Uploaded</th>
                <th className="p-4 font-bold font-sans">Featured</th>
                <th className="p-4 font-bold font-sans text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {sortedItems.map((it, idx) => (
                <tr key={it.id} className="hover:bg-primary/5 transition-colors">
                  <td className="p-4">
                    <div className="relative h-10 w-16 overflow-hidden rounded-lg bg-muted border border-border">
                      <Image src={it.url} alt={it.title} fill className="object-cover" sizes="64px" />
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-foreground font-sans">{it.title}</td>
                  <td className="p-4 text-muted-foreground font-sans">{it.category}</td>
                  <td className="p-4 text-muted-foreground font-mono text-xs">{it.fileSize}</td>
                  <td className="p-4 text-muted-foreground font-sans">{it.uploadDate}</td>
                  <td className="p-4">
                    <span className={it.featured ? "text-accent font-bold" : "text-muted-foreground"}>
                      {it.featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button variant="outline" size="icon" onClick={() => setLightboxTargetIdx(idx)} className="h-7 w-7 rounded border-border/60">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => setDeleteTarget(it)} className="h-7 w-7 rounded border-border/60 text-rose-500 hover:bg-rose-500/5">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* C. Upload Media Dialog */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setIsUploadOpen(false)} className="fixed inset-0 bg-black" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border max-w-2xl w-full rounded-2xl shadow-2xl z-10 overflow-hidden text-left"
              role="dialog"
            >
              <div className="p-5 border-b border-border/80 flex justify-between items-center bg-primary/5">
                <h3 className="text-sm sm:text-base font-bold text-foreground font-sans">Upload Images</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsUploadOpen(false)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                
                {uploadError && (
                  <div className="p-3 bg-rose-500/10 text-rose-600 rounded-lg flex items-start space-x-2 text-xs font-semibold">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Upload Placeholder Section */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center space-y-2 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors relative"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp"
                  />
                  <Upload className="h-8 w-8 text-muted-foreground/80 mx-auto" />
                  <p className="text-xs font-bold text-foreground">
                    {selectedFile ? selectedFile.name : "Drag and drop images here, or click to browse"}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    {selectedFile
                      ? `${(selectedFile.size / 1024).toFixed(0)} KB - click to change`
                      : "Supports PNG, JPG, WebP up to 5MB"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Image Title</label>
                    <input type="text" name="title" required value={formState.title} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Category</label>
                    <select name="category" value={formState.category} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Yoga Classes">Yoga Classes</option>
                      <option value="Meditation">Meditation</option>
                      <option value="Events">Events</option>
                      <option value="Corporate Yoga">Corporate Yoga</option>
                      <option value="Online Sessions">Online Sessions</option>
                      <option value="Workshops">Workshops</option>
                      <option value="Studio">Studio</option>
                      <option value="Team">Team</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground font-sans">Description</label>
                  <textarea name="description" value={formState.description} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background h-16 resize-none" />
                </div>

                {/* SEO Fields */}
                <div className="space-y-3 border-t border-border pt-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-sans">SEO Meta parameters</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Alt Text</label>
                      <input type="text" name="altText" required placeholder="e.g. Yoga class extension holds" value={formState.altText} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">SEO Title</label>
                      <input type="text" name="seoTitle" value={formState.seoTitle} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3.5 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsUploadOpen(false)} disabled={isUploading}>Cancel</Button>
                  <Button variant="default" size="sm" type="submit" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Submit Image"}
                  </Button>
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
              className="bg-card border border-border max-w-2xl w-full rounded-2xl shadow-2xl z-10 overflow-hidden text-left"
              role="dialog"
            >
              <div className="p-5 border-b border-border/80 flex justify-between items-center bg-primary/5">
                <h3 className="text-sm sm:text-base font-bold text-foreground font-sans">Edit Image Info</h3>
                <Button variant="ghost" size="icon" onClick={() => setEditTarget(null)} className="h-7 w-7 rounded">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Image Title</label>
                    <input type="text" name="title" required value={formState.title} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                  </div>
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Category</label>
                    <select name="category" value={formState.category} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background">
                      <option value="Yoga Classes">Yoga Classes</option>
                      <option value="Meditation">Meditation</option>
                      <option value="Events">Events</option>
                      <option value="Corporate Yoga">Corporate Yoga</option>
                      <option value="Online Sessions">Online Sessions</option>
                      <option value="Workshops">Workshops</option>
                      <option value="Studio">Studio</option>
                      <option value="Team">Team</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground font-sans">Description</label>
                  <textarea name="description" value={formState.description} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background h-16 resize-none" />
                </div>

                {/* SEO Fields */}
                <div className="space-y-3 border-t border-border pt-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-sans">SEO Meta parameters</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Alt Text</label>
                      <input type="text" name="altText" required value={formState.altText} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">SEO Title</label>
                      <input type="text" name="seoTitle" value={formState.seoTitle} onChange={handleFormChange} className="w-full p-2 text-xs rounded border border-border bg-background" />
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

      {/* E. Image Preview Lightbox / Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} exit={{ opacity: 0 }} onClick={() => setLightboxTargetIdx(null)} className="fixed inset-0 bg-black/90" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full aspect-video md:aspect-[16/10] bg-zinc-950 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 text-left border border-zinc-800"
            >
              
              {/* Left Side: Photo Canvas */}
              <div className="relative flex-grow bg-black flex items-center justify-center">
                <Image
                  src={lightboxItem.url}
                  alt={lightboxItem.altText}
                  fill
                  className="object-contain"
                  sizes="600px"
                />
                
                {/* Arrow navigators */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Right Side: Metadata Panel */}
              <div className="w-full md:w-80 bg-zinc-900 text-zinc-100 p-6 flex flex-col justify-between shrink-0 space-y-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-[8px] font-bold text-zinc-300 uppercase tracking-widest block w-max">
                        {lightboxItem.category}
                      </span>
                      <h3 className="text-sm font-bold mt-1 text-white leading-normal font-sans">
                        {lightboxItem.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setLightboxTargetIdx(null)}
                      className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {lightboxItem.description}
                  </p>

                  <div className="space-y-3.5 border-t border-zinc-800 pt-4 text-xs font-sans">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">File ID</span>
                      <span className="font-mono text-[10px] text-zinc-300">{lightboxItem.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">File Size</span>
                      <span className="text-zinc-300">{lightboxItem.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Uploaded</span>
                      <span className="text-zinc-300">{lightboxItem.uploadDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Alt Text</span>
                      <span className="text-zinc-300 truncate max-w-[150px]">{lightboxItem.altText}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex space-x-3.5">
                  <Button
                    variant="outline"
                    className="flex-grow text-xs h-9 bg-transparent border-zinc-700 hover:bg-zinc-800 text-white"
                  >
                    Download
                  </Button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* F. Delete Confirmation Dialog */}
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
                  <h3 className="text-sm sm:text-base font-bold text-foreground font-sans">Delete Media</h3>
                  <p className="text-xs text-muted-foreground font-sans leading-normal">
                    Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget.title}</span>? This file will be permanently deleted from the library.
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
