"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion, Variants } from "framer-motion";
import { Sparkles, Heart, Zap, Wind, Moon, Brain } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { triggerBookingModal } from "@/components/booking/BookingModal";

export function Benefits() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = React.useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const benefitsList = [
    {
      icon: Sparkles,
      title: "Better Flexibility",
      desc: "Improve mobility, posture, and body balance through guided yoga practice.",
      accent: "from-amber-500/10 to-orange-500/10",
      iconColor: "text-amber-500",
    },
    {
      icon: Heart,
      title: "Stress Relief",
      desc: "Reduce anxiety and experience greater emotional well-being.",
      accent: "from-rose-500/10 to-pink-500/10",
      iconColor: "text-rose-500",
    },
    {
      icon: Zap,
      title: "Strength & Balance",
      desc: "Build core strength while improving stability and coordination.",
      accent: "from-emerald-500/10 to-teal-500/10",
      iconColor: "text-emerald-500",
    },
    {
      icon: Wind,
      title: "Better Breathing",
      desc: "Learn mindful breathing techniques to increase energy and focus.",
      accent: "from-sky-500/10 to-blue-500/10",
      iconColor: "text-sky-500",
    },
    {
      icon: Moon,
      title: "Better Sleep",
      desc: "Relax your body and mind for deeper, healthier sleep.",
      accent: "from-indigo-500/10 to-violet-500/10",
      iconColor: "text-indigo-500",
    },
    {
      icon: Brain,
      title: "Mental Clarity",
      desc: "Improve concentration, mindfulness, and inner peace.",
      accent: "from-purple-500/10 to-fuchsia-500/10",
      iconColor: "text-purple-500",
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

  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <Section className="relative overflow-hidden py-20 lg:py-28 bg-card/10">
      {/* Background gradients and decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[40%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div ref={sectionRef}>
        <Container className="space-y-20">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <div className="inline-flex">
              <span className="px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 rounded-full">
                WHY YOGA
              </span>
            </div>
            <Heading level={2} size="lg" className="font-sans leading-tight">
              Discover the Benefits of a Healthier Lifestyle
            </Heading>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
              Yoga is more than movement—it&apos;s a holistic practice that nurtures your body, mind, and soul. Experience lasting wellness through consistent practice at ManoYoga.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {benefitsList.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div key={idx} variants={scaleIn}>
                  <Card className="h-full border border-border/80 hover:-translate-y-1.5 transition-transform duration-300 relative group overflow-hidden bg-card/50">
                    {/* Top gradient highlight on card hover */}
                    <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${benefit.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <CardContent className="p-6 sm:p-8 flex flex-col space-y-4">
                      {/* Icon wrapper */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${benefit.accent} ${benefit.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      
                      <div className="space-y-2 text-left">
                        <h4 className="text-lg font-bold text-foreground font-sans tracking-tight">
                          {benefit.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                          {benefit.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Centered CTA Section */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto pt-8 border-t border-border"
          >
            <Card className="bg-gradient-to-br from-secondary/30 via-background to-card/50 border border-border/80 shadow-xl rounded-[2rem] p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-accent/5 blur-[50px] -z-10" />
              
              <CardContent className="p-0 space-y-6">
                <Heading level={3} size="base" className="font-sans leading-tight">
                  Start Your Wellness Journey Today
                </Heading>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto font-sans">
                  Join ManoYoga and discover how small daily practices can transform your life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Button variant="default" className="w-full sm:w-auto" onClick={triggerBookingModal}>
                    Book Free Trial
                  </Button>
                  <Link href="/services">
                    <Button variant="outline" className="w-full sm:w-auto">
                      View Programs
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
