"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Star, Users, Award, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { triggerBookingModal } from "@/components/booking/BookingModal";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  initialX?: number;
  initialY?: number;
  delay?: number;
}

function FloatingCard({ children, className, initialX = 0, initialY = 0, delay = 0 }: FloatingCardProps) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, y: initialY }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: shouldReduceMotion ? 0 : [0, -10, 0] 
      }}
      transition={{
        opacity: { duration: 0.6, ease: "easeOut" },
        x: { duration: 0.6, ease: "easeOut" },
        y: shouldReduceMotion 
          ? { duration: 0.6, ease: "easeOut" } 
          : { duration: 5, repeat: Infinity, ease: "easeInOut", delay }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <Section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden py-16 lg:py-24">
      <div className="absolute inset-0 -z-10 bg-background overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[35vw] h-[35vw] rounded-full bg-accent/5 blur-[80px]" />
        <div className="absolute bottom-[15%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col space-y-6 text-center lg:text-left"
          >
            <motion.div variants={fadeIn} className="inline-flex self-center lg:self-start">
              <span className="px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 rounded-full">
                Welcome to ManoYoga
              </span>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Heading level={1} size="xl" className="leading-[1.1] font-sans">
                Transform Your Mind, Body & Soul Through Yoga
              </Heading>
            </motion.div>

            <motion.p
              variants={fadeIn}
              className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              Experience personalized yoga sessions with Nistha. Improve flexibility, reduce stress,
              increase strength, and embrace a healthier lifestyle through mindful yoga practice.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2"
            >
              <Button variant="default" size="lg" className="w-full sm:w-auto" onClick={triggerBookingModal}>
                Book Free Trial
              </Button>
              <Link href="/services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Programs
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <div className="lg:col-span-6 relative flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full max-w-[500px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-border bg-muted"
            >
              <Image
                src="/hero-yoga.jpg"
                alt="Serene woman practicing yoga at ManoYoga studio"
                fill
                priority
                className="object-cover"
                sizes="(max-w-768px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
            </motion.div>

            {/* Floating Glass Cards using FloatingCard wrapper */}
            <FloatingCard
              initialX={-30}
              delay={0}
              className="absolute -left-4 top-[15%] hidden sm:block z-10"
            >
              <Card glass className="shadow-lg border-white/20 bg-white/60 dark:bg-black/60">
                <CardContent className="flex items-center space-x-3 p-4">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">5.0 Rating</p>
                    <p className="text-[10px] text-muted-foreground">Certified Yoga Practice</p>
                  </div>
                </CardContent>
              </Card>
            </FloatingCard>

            <FloatingCard
              initialX={30}
              delay={1.5}
              className="absolute -right-4 top-[35%] hidden sm:block z-10"
            >
              <Card glass className="shadow-lg border-white/20 bg-white/60 dark:bg-black/60">
                <CardContent className="flex items-center space-x-3 p-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">500+ Students</p>
                    <p className="text-[10px] text-muted-foreground">Embraced Wellness</p>
                  </div>
                </CardContent>
              </Card>
            </FloatingCard>

            <FloatingCard
              initialX={-30}
              delay={0.7}
              className="absolute -left-8 bottom-[20%] hidden sm:block z-10"
            >
              <Card glass className="shadow-lg border-white/20 bg-white/60 dark:bg-black/60">
                <CardContent className="flex items-center space-x-3 p-4">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Certified Trainer</p>
                    <p className="text-[10px] text-muted-foreground">Expert Guidance by Nistha</p>
                  </div>
                </CardContent>
              </Card>
            </FloatingCard>

            <FloatingCard
              initialY={30}
              delay={2.2}
              className="absolute bottom-4 right-4 z-10 sm:-bottom-4 sm:right-12"
            >
              <Card glass className="shadow-lg border-white/20 bg-white/60 dark:bg-black/60">
                <CardContent className="flex items-center space-x-3 p-3 sm:p-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-foreground">Online & Offline</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground">Flexible Schedules</p>
                  </div>
                </CardContent>
              </Card>
            </FloatingCard>
          </div>
        </div>
      </Container>
    </Section>
  );
}
