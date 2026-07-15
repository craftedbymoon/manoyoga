"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion, Variants } from "framer-motion";
import { Sparkles, Activity, Brain, Heart, Users, Video, Clock, BarChart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Services() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = React.useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const servicesList = [
    {
      icon: Sparkles,
      title: "Beginner Yoga",
      desc: "Perfect for those starting their yoga journey with guided foundational poses and breathing techniques.",
      duration: "60 Minutes",
      level: "Beginner",
    },
    {
      icon: Activity,
      title: "Power Yoga",
      desc: "Increase strength, stamina and flexibility through dynamic yoga sessions.",
      duration: "75 Minutes",
      level: "Intermediate",
    },
    {
      icon: Brain,
      title: "Meditation & Mindfulness",
      desc: "Reduce stress, improve focus and cultivate inner peace through guided meditation.",
      duration: "45 Minutes",
      level: "All Levels",
    },
    {
      icon: Heart,
      title: "Prenatal Yoga",
      desc: "Gentle yoga sessions designed for expecting mothers.",
      duration: "60 Minutes",
      level: "Beginner",
    },
    {
      icon: Users,
      title: "Corporate Yoga",
      desc: "Wellness sessions designed for companies and teams to reduce stress and improve productivity.",
      duration: "Flexible",
      level: "All Levels",
    },
    {
      icon: Video,
      title: "Online Yoga Classes",
      desc: "Practice yoga from anywhere with live interactive online sessions.",
      duration: "Flexible",
      level: "All Levels",
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
    <Section id="services" className="relative overflow-hidden py-20 lg:py-28 bg-card/20 border-t border-b border-border">
      {/* Background organic blurred element */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-primary/5 blur-[120px]" />
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
                OUR SERVICES
              </span>
            </div>
            <Heading level={2} size="lg" className="font-sans leading-tight">
              Yoga Programs Designed For Every Stage Of Your Wellness Journey
            </Heading>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
              Whether you&apos;re just beginning your yoga journey or looking to deepen your practice, ManoYoga offers personalized programs that help improve flexibility, strength, mindfulness and overall well-being.
            </p>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {servicesList.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div key={idx} variants={fadeInUp}>
                  <Card className="h-full border border-border/80 hover:-translate-y-1.5 transition-transform duration-300 relative group overflow-hidden bg-card/60 flex flex-col justify-between">
                    <CardContent className="p-6 sm:p-8 flex flex-col space-y-5 h-full justify-between">
                      {/* Top: Icon + Details */}
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="space-y-2 text-left">
                          <h4 className="text-lg font-bold text-foreground font-sans tracking-tight">
                            {service.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                            {service.desc}
                          </p>
                        </div>
                      </div>

                      {/* Bottom: Badges + CTA */}
                      <div className="space-y-4 pt-4 border-t border-border/60">
                        <div className="flex flex-wrap gap-2">
                          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/5 text-primary border border-primary/10">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{service.duration}</span>
                          </div>
                          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/5 text-accent border border-accent/10">
                            <BarChart className="h-3.5 w-3.5" />
                            <span>{service.level}</span>
                          </div>
                        </div>
                        <div className="pt-2 text-left">
                          <Link href="/services">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              Learn More
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom CTA Card */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto pt-8"
          >
            <Card className="bg-gradient-to-br from-secondary/30 via-background to-card/50 border border-border/80 shadow-xl rounded-[2rem] p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-accent/5 blur-[50px] -z-10" />
              
              <CardContent className="p-0 space-y-6">
                <Heading level={3} size="base" className="font-sans leading-tight">
                  Not Sure Which Program Is Right For You?
                </Heading>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-sans">
                  Book a free consultation with Nistha and receive personalized guidance based on your goals and experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Link href="/contact">
                    <Button variant="default" className="w-full sm:w-auto">
                      Book Free Consultation
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="outline" className="w-full sm:w-auto">
                      View Pricing
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
