"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion, Variants, animate } from "framer-motion";
import { Star, Check, Award, Compass, MapPin, Heart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent } from "@/components/ui/card";

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

export function TrustedBy() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = React.useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const stats = [
    { value: 500, suffix: "+", label: "Happy Students", decimals: 0 },
    { value: 8, suffix: "+", label: "Years of Experience", decimals: 0 },
    { value: 50, suffix: "+", label: "Corporate Workshops", decimals: 0 },
    { value: 5.0, suffix: "★", label: "Average Rating", decimals: 1 },
  ];

  const testimonials = [
    {
      name: "Aarav Mehta",
      avatar: "AM",
      rating: 5,
      text: "The personalized yoga sessions helped me reduce chronic back pain and significantly improve my flexibility in just a few weeks.",
    },
    {
      name: "Priya Sharma",
      avatar: "PS",
      rating: 5,
      text: "Yoga sessions at ManoYoga helped me reduce stress, improve my focus, and build a healthy morning routine that transforms my day.",
    },
    {
      name: "Rohan Das",
      avatar: "RD",
      rating: 5,
      text: "Outstanding corporate workshops. The breathing techniques Nistha taught our team have significantly boosted our workplace productivity.",
    },
  ];

  const badges = [
    { icon: Award, text: "Certified Yoga Trainer" },
    { icon: Compass, text: "Personalized Guidance" },
    { icon: MapPin, text: "Online & Offline Classes" },
    { icon: Heart, text: "Wellness Focused" },
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
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <Section className="bg-card/30 border-t border-b border-border py-20 relative overflow-hidden">
      <div ref={sectionRef}>
        {/* Subtle organic blurred shape */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <Container>
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isSectionInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <Heading level={2} size="lg" className="font-sans">
            Trusted by Hundreds of Happy Students
          </Heading>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-sans">
            Helping people transform their lives through yoga, mindfulness, and healthy living.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          animate={isSectionInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp} className="text-center">
              <Card className="h-full flex flex-col justify-center py-8 hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-0">
                  <div className="text-3xl md:text-4xl font-extrabold text-primary mb-2 font-sans tracking-tight">
                    <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Reviews Grid */}
        <div className="mb-20">
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:-translate-y-1 transition-transform duration-300">
                  <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                    {/* Header: Avatar, Name, Rating */}
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-sm select-none">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{testimonial.name}</h4>
                        <div className="flex items-center space-x-0.5 mt-0.5" aria-label={`${testimonial.rating} Star Rating`}>
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Text */}
                    <p className="text-sm text-muted-foreground italic leading-relaxed font-sans">
                      &quot;{testimonial.text}&quot;
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial="hidden"
          animate={isSectionInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="border-t border-border pt-10"
        >
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {badges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground font-medium">
                  <div className="p-1 bg-primary/10 rounded text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>{badge.text}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </Container>
      </div>
    </Section>
  );
}
