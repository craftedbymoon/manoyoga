"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion, Variants } from "framer-motion";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function LatestBlogs() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = React.useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const articles = [
    {
      id: 1,
      category: "Yoga",
      title: "10 Simple Yoga Poses Every Beginner Should Know",
      readingTime: "5 min read",
      date: "July 12, 2026",
      excerpt: "Kickstart your wellness journey with these easy-to-follow, foundational yoga postures designed to build flexibility and confidence.",
      src: "/gallery-1.jpg",
    },
    {
      id: 2,
      category: "Meditation",
      title: "How Daily Meditation Can Improve Your Mental Health",
      readingTime: "4 min read",
      date: "July 10, 2026",
      excerpt: "Discover the scientific benefits of daily mindfulness and simple breathing techniques that reduce anxiety and enhance cognitive focus.",
      src: "/gallery-2.jpg",
    },
    {
      id: 3,
      category: "Wellness",
      title: "Building Healthy Habits Through Consistent Yoga Practice",
      readingTime: "6 min read",
      date: "July 08, 2026",
      excerpt: "Learn how incorporating short, daily yoga sessions into your routine can lead to sustainable improvements in your physical strength and sleep cycle.",
      src: "/gallery-3.jpg",
    },
  ];

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
    <Section className="relative overflow-hidden py-20 lg:py-28">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div ref={sectionRef}>
        <Container className="space-y-16">
          {/* Header Row (Flex-between on desktop) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial="hidden"
              animate={isSectionInView ? "visible" : "hidden"}
              variants={fadeInUp}
              className="text-left max-w-2xl space-y-4"
            >
              <div className="inline-flex">
                <span className="px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 rounded-full">
                  LATEST ARTICLES
                </span>
              </div>
              <Heading level={2} size="lg" className="font-sans leading-tight">
                Learn, Grow & Stay Inspired
              </Heading>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-sans">
                Explore expert insights, yoga tips, mindfulness practices and healthy lifestyle articles from ManoYoga.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={isSectionInView ? "visible" : "hidden"}
              variants={fadeInUp}
              className="shrink-0 flex justify-start"
            >
              <Link href="/blog">
                <Button variant="outline" className="w-full sm:w-auto">
                  View All Articles
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Blog Cards Grid */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {articles.map((post) => (
              <motion.div key={post.id} variants={fadeInUp}>
                <Card className="h-full border border-border/80 hover:-translate-y-1.5 transition-transform duration-300 relative group overflow-hidden bg-card/60 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Featured Image */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-lg bg-muted">
                      <Image
                        src={post.src}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 33vw"
                      />
                      {/* Category Badge overlay */}
                      <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-background/90 text-primary backdrop-blur-sm border border-border/40 select-none shadow-sm">
                        {post.category}
                      </span>
                    </div>

                    {/* Blog Content */}
                    <CardContent className="px-6 pt-2 pb-0 space-y-3 text-left">
                      {/* Meta Date + Time */}
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground font-sans">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{post.readingTime}</span>
                        </div>
                      </div>
                      
                      <h4 className="text-base sm:text-lg font-bold text-foreground font-sans tracking-tight leading-snug group-hover:text-accent transition-colors duration-300">
                        {post.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans line-clamp-3">
                        {post.excerpt}
                      </p>
                    </CardContent>
                  </div>

                  {/* Read More button at bottom */}
                  <CardContent className="px-6 pb-6 pt-4 text-left">
                    <Link href={`/blog`} className="inline-flex items-center text-xs font-bold text-accent hover:text-accent/80 transition-colors space-x-1 group/btn">
                      <span>Read More</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Newsletter/CTA block */}
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
                  Want More Wellness Tips?
                </Heading>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto font-sans">
                  Subscribe to receive the latest yoga tips, wellness advice and mindfulness articles directly in your inbox.
                </p>
                <div className="pt-2">
                  <Link href="/blog">
                    <Button variant="default" className="w-full sm:w-auto">
                      Explore Blog
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
