"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion, Variants } from "framer-motion";
import { Check, Flame, Heart, Sparkles, Smile, Star, ShieldCheck, UserCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function About() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = React.useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const featureCards = [
    { icon: Smile, title: "Personalized Yoga", desc: "Tailored to your body type, flexability, and health goals." },
    { icon: Sparkles, title: "Holistic Wellness", desc: "Harmonizing body and mind for sustainable healthy living." },
    { icon: Heart, title: "Mindfulness Practice", desc: "Integrates breathing and somatic meditation techniques." },
    { icon: UserCheck, title: "Certified Guidance", desc: "Expert, safe, and attentive instruction for all levels." },
  ];

  const highlights = [
    { value: "500+", label: "Happy Students" },
    { value: "8+", label: "Years of Experience" },
    { value: "50+", label: "Corporate Workshops" },
    { value: "100%", label: "Personal Attention" },
  ];

  const fadeIn: Variants = {
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
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Section id="about" className="relative overflow-hidden py-20 lg:py-28">
      {/* Decorative Background Shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div ref={sectionRef}>
        <Container className="space-y-20">
          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Side: Image & Background Accents */}
            <motion.div
              initial="hidden"
              animate={isSectionInView ? "visible" : "hidden"}
              variants={fadeInLeft}
              className="lg:col-span-5 relative flex justify-center items-center"
            >
              {/* Outer decorative borders and organic shape backdrop */}
              <div className="absolute -inset-4 border border-accent/20 rounded-[2.5rem] -z-10 scale-[0.98] rotate-2" />
              <div className="absolute -inset-4 bg-secondary/20 rounded-[2.5rem] -z-20 scale-[0.96] -rotate-1" />

              <div className="relative w-full max-w-[400px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border border-border">
                <Image
                  src="/about-nistha.jpg"
                  alt="Nistha, Certified Yoga & Wellness instructor smiling warmly in a studio"
                  fill
                  className="object-cover"
                  sizes="(max-w-768px) 100vw, 400px"
                />
              </div>
            </motion.div>

            {/* Right Side: Content & Features */}
            <motion.div
              initial="hidden"
              animate={isSectionInView ? "visible" : "hidden"}
              variants={fadeInRight}
              className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left"
            >
              {/* Section Badge */}
              <div className="inline-flex self-center lg:self-start">
                <span className="px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 rounded-full">
                  ABOUT MANOYOGA
                </span>
              </div>

              {/* Section Heading */}
              <Heading level={2} size="lg" className="font-sans leading-tight">
                Meet Nistha – Your Yoga & Wellness Guide
              </Heading>

              {/* Description paragraphs */}
              <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed font-sans">
                <p>
                  At ManoYoga, we believe yoga is more than just physical exercise—it is a journey toward a healthier body, a calmer mind, and a balanced life.
                </p>
                <p>
                  Founded by Nistha, ManoYoga is dedicated to helping people of all ages improve flexibility, reduce stress, build confidence, and embrace a healthier lifestyle through personalized yoga sessions.
                </p>
                <p>
                  Whether you are a beginner or an experienced practitioner, every session is designed with care, mindfulness, and individual attention.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {featureCards.map((feat, idx) => {
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

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link href="/about">
                  <Button variant="default" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Book a Free Trial
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Experience Highlights Cards */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-border"
          >
            {highlights.map((highlight, idx) => (
              <motion.div key={idx} variants={fadeIn}>
                <Card className="text-center py-6 hover:-translate-y-1 transition-transform duration-300">
                  <CardContent className="p-0">
                    <p className="text-2xl md:text-3xl font-extrabold text-primary mb-1 tracking-tight font-sans">
                      {highlight.value}
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {highlight.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </div>
    </Section>
  );
}
