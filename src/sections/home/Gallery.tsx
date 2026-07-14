"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView, useReducedMotion, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Gallery() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = React.useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);

  const galleryItems = [
    {
      id: 0,
      src: "/gallery-1.jpg",
      category: "Yoga Practice",
      alt: "Yoga pose demonstration showing flexibility and balance",
      aspect: "aspect-[3/4]",
    },
    {
      id: 1,
      src: "/gallery-2.jpg",
      category: "Meditation",
      alt: "Group session focusing on breathing and mindfulness",
      aspect: "aspect-[1/1]",
    },
    {
      id: 2,
      src: "/gallery-3.jpg",
      category: "Outdoor Yoga",
      alt: "Sunset yoga group on natural green grass",
      aspect: "aspect-[4/3]",
    },
    {
      id: 3,
      src: "/gallery-1.jpg",
      category: "Corporate Yoga",
      alt: "Corporate wellness workshop for business productivity",
      aspect: "aspect-[4/5]",
    },
    {
      id: 4,
      src: "/gallery-2.jpg",
      category: "Group Sessions",
      alt: "Interactive group class with hands-on posture adjustments",
      aspect: "aspect-[3/4]",
    },
    {
      id: 5,
      src: "/gallery-3.jpg",
      category: "Online Classes",
      alt: "Yoga student practicing at home with live online trainer",
      aspect: "aspect-[1/1]",
    },
    {
      id: 6,
      src: "/gallery-1.jpg",
      category: "Wellness Events",
      alt: "ManoYoga wellness meetup workshop retreat",
      aspect: "aspect-[4/3]",
    },
    {
      id: 7,
      src: "/gallery-2.jpg",
      category: "Personal Training",
      alt: "Nistha guiding a private student individually",
      aspect: "aspect-[3/4]",
    },
  ];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((prev) => (prev === 0 ? galleryItems.length - 1 : prev! - 1));
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((prev) => (prev === galleryItems.length - 1 ? 0 : prev! + 1));
    }
  };

  const handleClose = () => setActiveIdx(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx]);

  // Focus trap management inside modal
  React.useEffect(() => {
    if (activeIdx !== null) {
      closeBtnRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeIdx]);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <Section id="gallery" className="relative overflow-hidden py-20 lg:py-28">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[30%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div ref={sectionRef}>
        <Container className="space-y-16">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <div className="inline-flex">
              <span className="px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 rounded-full">
                OUR GALLERY
              </span>
            </div>
            <Heading level={2} size="lg" className="font-sans leading-tight">
              Moments of Growth, Balance & Transformation
            </Heading>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
              Take a glimpse into the peaceful environment, guided yoga sessions, wellness workshops and inspiring transformations at ManoYoga.
            </p>
          </motion.div>

          {/* Masonry-Style Responsive Grid */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6 [column-fill:_balance] box-border"
          >
            {galleryItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setActiveIdx(idx)}
                className="break-inside-avoid relative rounded-2xl overflow-hidden cursor-zoom-in border border-border/80 group shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`relative w-full ${item.aspect} bg-muted`}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 25vw"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-accent mb-1">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-tight flex items-center justify-between">
                      <span>{item.category}</span>
                      <ZoomIn className="h-4 w-4 text-white/80" />
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Bottom CTA block */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto pt-8"
          >
            <Card className="bg-gradient-to-br from-secondary/30 via-background to-card/50 border border-border/80 shadow-xl rounded-[2rem] p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-accent/5 blur-[50px] -z-10" />
              
              <CardContent className="p-0 space-y-6">
                <Heading level={3} size="base" className="font-sans leading-tight">
                  Experience Yoga Beyond the Mat
                </Heading>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto font-sans">
                  Join ManoYoga and become part of a growing wellness community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Link href="/services">
                    <Button variant="default" className="w-full sm:w-auto">
                      View All Programs
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Book a Free Trial
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </div>

      {/* Modern Lightbox Modal */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Image Lightbox Gallery View"
            ref={modalRef}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-card border border-white/10 flex items-center justify-center"
            >
              <Image
                src={galleryItems[activeIdx].src}
                alt={galleryItems[activeIdx].alt}
                fill
                priority
                className="object-contain p-4"
              />

              {/* Top controls: Category Label & Close Button */}
              <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10">
                <span className="text-xs font-semibold uppercase tracking-widest text-accent bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                  {galleryItems[activeIdx].category}
                </span>
                <button
                  ref={closeBtnRef}
                  onClick={handleClose}
                  className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer"
                  aria-label="Close Lightbox"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Left / Right Navigators */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer z-10"
                aria-label="Previous Image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer z-10"
                aria-label="Next Image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
