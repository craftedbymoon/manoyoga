"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion, Variants, animate } from "framer-motion";
import { Check, Compass, Award, Calendar, Heart, Users, Smile, Star, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { triggerBookingModal } from "@/components/booking/BookingModal";

// Reusable Counter Component
interface CounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
}

function Counter({ value, decimals = 0, suffix = "" }: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = React.useState("0");

  React.useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(latest.toFixed(decimals));
        },
      });
      return () => controls.stop();
    }
  }, [inView, value, decimals]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
}

// Reusable FloatingCard wrapper
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

export function WhyChoose() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = React.useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Compass,
      title: "Personalized Guidance",
      desc: "Every student receives attention based on their individual goals and experience.",
    },
    {
      icon: Award,
      title: "Certified Instructor",
      desc: "Learn from Nistha, a dedicated yoga professional focused on safe and effective practice.",
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      desc: "Morning, evening, weekday and weekend classes.",
    },
    {
      icon: Heart,
      title: "Holistic Wellness",
      desc: "Improve physical fitness, mental clarity and emotional balance.",
    },
    {
      icon: Users,
      title: "Supportive Community",
      desc: "Join a positive and encouraging environment for your wellness journey.",
    },
    {
      icon: Smile,
      title: "Beginner Friendly",
      desc: "Perfect for beginners as well as experienced practitioners.",
    },
  ];

  const stats = [
    { value: 500, suffix: "+", label: "Students Guided", decimals: 0 },
    { value: 8, suffix: "+", label: "Years Experience", decimals: 0 },
    { value: 50, suffix: "+", label: "Corporate Sessions", decimals: 0 },
    { value: 5.0, suffix: "★", label: "Average Rating", decimals: 1 },
  ];

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeInRight: Variants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
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
      {/* Background soft gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div ref={sectionRef}>
        <Container className="space-y-24">
          {/* Two-Column Top Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Side: Visuals & Floating Cards */}
            <motion.div
              initial="hidden"
              animate={isSectionInView ? "visible" : "hidden"}
              variants={fadeInLeft}
              className="lg:col-span-5 relative flex justify-center items-center"
            >
              {/* Decorative shapes */}
              <div className="absolute -inset-4 border border-primary/20 rounded-[2.5rem] -z-10 scale-[0.98] rotate-2" />
              <div className="absolute -inset-4 bg-secondary/15 rounded-[2.5rem] -z-20 scale-[0.96] -rotate-1" />

              {/* Main Image */}
              <div className="relative w-full max-w-[400px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border border-border">
                <Image
                  src="/why-choose-yoga.jpg"
                  alt="Mindful yoga practitioner focusing on breathing in a serene environment"
                  fill
                  className="object-cover"
                  sizes="(max-w-768px) 100vw, 400px"
                />
              </div>

              {/* Floating Achievement Cards */}
              <FloatingCard
                initialX={-20}
                delay={0}
                className="absolute -left-6 top-[15%] hidden sm:block z-10"
              >
                <Card glass className="shadow-lg border-white/20 bg-white/60 dark:bg-black/60">
                  <CardContent className="flex items-center space-x-2 py-3 px-4">
                    <Check className="h-4 w-4 text-emerald-500 font-bold" />
                    <span className="text-xs font-semibold text-foreground">Certified Yoga Trainer</span>
                  </CardContent>
                </Card>
              </FloatingCard>

              <FloatingCard
                initialX={20}
                delay={1.5}
                className="absolute -right-6 top-[35%] hidden sm:block z-10"
              >
                <Card glass className="shadow-lg border-white/20 bg-white/60 dark:bg-black/60">
                  <CardContent className="flex items-center space-x-2 py-3 px-4">
                    <Check className="h-4 w-4 text-emerald-500 font-bold" />
                    <span className="text-xs font-semibold text-foreground">Personalized Sessions</span>
                  </CardContent>
                </Card>
              </FloatingCard>

              <FloatingCard
                initialX={-20}
                delay={0.7}
                className="absolute -left-10 bottom-[25%] hidden sm:block z-10"
              >
                <Card glass className="shadow-lg border-white/20 bg-white/60 dark:bg-black/60">
                  <CardContent className="flex items-center space-x-2 py-3 px-4">
                    <Check className="h-4 w-4 text-emerald-500 font-bold" />
                    <span className="text-xs font-semibold text-foreground">Online & Offline Classes</span>
                  </CardContent>
                </Card>
              </FloatingCard>

              <FloatingCard
                initialY={20}
                delay={2.2}
                className="absolute -right-4 bottom-[10%] hidden sm:block z-10"
              >
                <Card glass className="shadow-lg border-white/20 bg-white/60 dark:bg-black/60">
                  <CardContent className="flex items-center space-x-2 py-3 px-4">
                    <Check className="h-4 w-4 text-emerald-500 font-bold" />
                    <span className="text-xs font-semibold text-foreground">500+ Happy Students</span>
                  </CardContent>
                </Card>
              </FloatingCard>
            </motion.div>

            {/* Right Side: Header and Features List */}
            <motion.div
              initial="hidden"
              animate={isSectionInView ? "visible" : "hidden"}
              variants={fadeInRight}
              className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left"
            >
              {/* Badge */}
              <div className="inline-flex self-center lg:self-start">
                <span className="px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 rounded-full">
                  WHY CHOOSE MANOYOGA
                </span>
              </div>

              {/* Heading */}
              <Heading level={2} size="lg" className="font-sans leading-tight">
                Your Trusted Partner on the Journey to Better Health
              </Heading>

              {/* Description */}
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-sans">
                At ManoYoga, every session is designed with care, mindfulness, and personal attention. Our goal is to help you build a healthier body, a peaceful mind, and a balanced lifestyle through expert guidance and consistent practice.
              </p>

              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {features.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <Card key={idx} className="hover:-translate-y-1 transition-transform duration-300">
                      <CardContent className="flex items-start space-x-3 p-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-bold text-foreground">{feat.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{feat.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Achievements row below */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-border"
          >
            {stats.map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="text-center py-6 hover:-translate-y-1 transition-transform duration-300">
                  <CardContent className="p-0">
                    <p className="text-2xl md:text-3xl font-extrabold text-primary mb-1 tracking-tight font-sans">
                      <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {stat.label}
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
                  Ready to Begin Your Yoga Journey?
                </Heading>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto font-sans">
                  Take the first step toward a healthier and happier lifestyle with ManoYoga.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Button variant="default" className="w-full sm:w-auto" onClick={triggerBookingModal}>
                    Book Free Trial
                  </Button>
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
