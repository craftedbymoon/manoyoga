"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView, useReducedMotion, Variants } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, MessageSquare, ShieldCheck, Flame } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = React.useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const featuredList = [
    {
      name: "Ananya Patel",
      role: "Software Engineer",
      avatar: "AP",
      rating: 5,
      text: "Joining ManoYoga completely changed my daily routine. I feel healthier, calmer and much more confident. Nistha's guidance has been truly inspiring and she tailors every posture perfectly to my strength.",
    },
    {
      name: "Vikram Malhotra",
      role: "Corporate Executive",
      avatar: "VM",
      rating: 5,
      text: "As an executive, stress is part of my life. Nistha's wellness and breathing drills have helped me stay focused, reduce office fatigue, and significantly lowered my day-to-day work anxiety.",
    },
    {
      name: "Meera Sen",
      role: "Graphic Designer",
      avatar: "MS",
      rating: 5,
      text: "I was looking for a yoga practice that also focused on mental wellness. ManoYoga is exactly that. The meditation and breathing sessions have given me true inner peace and emotional balance.",
    },
  ];

  const reviewCards = [
    {
      name: "Aditya Roy",
      avatar: "AR",
      rating: 5,
      text: "Nistha is incredibly skilled. Her beginner friendly corrections helped me build confidence easily.",
    },
    {
      name: "Kriti Verma",
      avatar: "KV",
      rating: 5,
      text: "The studio environment is so calming. I highly recommend ManoYoga for active stress relief.",
    },
    {
      name: "Siddharth Rao",
      avatar: "SR",
      rating: 5,
      text: "Outstanding online yoga classes. Interactive, clear instructions, and very easy to follow.",
    },
    {
      name: "Neha Joshi",
      avatar: "NJ",
      rating: 5,
      text: "ManoYoga classes have completely resolved my back posture stiffness. Worth every session!",
    },
    {
      name: "Kabir Mehta",
      avatar: "KM",
      rating: 5,
      text: "Flexible weekend slot timings and highly customized practice. NISHA is an exceptional guide.",
    },
    {
      name: "Diya Roy",
      avatar: "DR",
      rating: 5,
      text: "The combination of dynamic poses and breathing exercises leaves me energized every morning.",
    },
  ];

  // Carousel State
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? featuredList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === featuredList.length - 1 ? 0 : prev + 1));
  };

  // Autoplay Logic
  React.useEffect(() => {
    if (isHovered || shouldReduceMotion) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, shouldReduceMotion]);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <Section className="relative overflow-hidden py-20 lg:py-28 bg-card/10 border-t border-b border-border">
      {/* Background decoration */}
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
                TESTIMONIALS
              </span>
            </div>
            <Heading level={2} size="lg" className="font-sans leading-tight">
              What Our Students Say
            </Heading>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
              Real stories from students who transformed their health, confidence and lifestyle with ManoYoga.
            </p>
          </motion.div>

          {/* Featured Testimonial Carousel */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Nav Arrows */}
            <div className="absolute -left-4 sm:-left-16 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="bg-background/80 backdrop-blur-sm"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute -right-4 sm:-right-16 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="bg-background/80 backdrop-blur-sm"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Carousel Item Container */}
            <div className="overflow-hidden min-h-[300px] sm:min-h-[220px] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -30 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card glass className="bg-card/70 border border-border/80 shadow-lg">
                    <CardContent className="p-8 sm:p-12 flex flex-col md:flex-row md:items-center gap-6 text-left">
                      {/* Avatar */}
                      <div className="h-16 w-16 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-xl select-none shrink-0">
                        {featuredList[activeIdx].avatar}
                      </div>

                      {/* Content */}
                      <div className="space-y-4 flex-grow">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h4 className="text-base font-bold text-foreground">{featuredList[activeIdx].name}</h4>
                            <p className="text-xs text-muted-foreground">{featuredList[activeIdx].role}</p>
                          </div>
                          <div className="flex items-center space-x-0.5" aria-label="5 Star Rating">
                            {[...Array(featuredList[activeIdx].rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed italic font-sans">
                          "{featuredList[activeIdx].text}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center space-x-2 pt-6">
              {featuredList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIdx === i ? "w-6 bg-primary" : "w-2.5 bg-muted-foreground/30"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Google Trust Rating Banner */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-primary/5 border border-primary/10 rounded-2xl p-6 max-w-xl mx-auto"
          >
            <div className="flex items-center space-x-1" aria-label="5 Stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-foreground">5.0 Average Rating</p>
              <p className="text-xs text-muted-foreground">Based on 500+ Happy Students</p>
            </div>
          </motion.div>

          {/* Smaller Review Cards below */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pt-8"
          >
            {reviewCards.map((review, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full hover:-translate-y-1 transition-transform duration-300 bg-card/40 border-border/80">
                  <CardContent className="p-6 flex flex-col justify-between h-full space-y-4 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-xs select-none">
                        {review.avatar}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{review.name}</h4>
                        <div className="flex items-center space-x-0.5 mt-0.5" aria-label="5 Stars">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-2.5 w-2.5 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed font-sans">
                      "{review.text}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
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
                  Become Our Next Success Story
                </Heading>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto font-sans">
                  Book your first yoga session today and begin your transformation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Link href="/contact">
                    <Button variant="default" className="w-full sm:w-auto">
                      Book Free Trial
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </div>
    </Section>
  );
}
