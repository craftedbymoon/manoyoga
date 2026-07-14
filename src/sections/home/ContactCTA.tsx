"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion, Variants } from "framer-motion";
import { Check, Phone, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ContactCTA() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = React.useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const badges = [
    "Beginner Friendly",
    "Online & Offline Classes",
    "Certified Yoga Trainer",
    "Personalized Guidance",
  ];

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <Section id="contact" className="relative overflow-hidden py-20 lg:py-28">
      {/* Background gradients and blurred organic shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div ref={sectionRef}>
        <Container className="max-w-4xl text-center">
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="w-full"
          >
            <Card glass className="bg-card/75 border border-border/80 shadow-2xl rounded-[3rem] p-10 sm:p-16 relative overflow-hidden">
              {/* Extra light blob inside the card */}
              <div className="absolute -top-12 -left-12 w-[180px] h-[180px] rounded-full bg-primary/10 blur-[60px] -z-10" />
              <div className="absolute -bottom-12 -right-12 w-[180px] h-[180px] rounded-full bg-accent/10 blur-[60px] -z-10" />

              <CardContent className="p-0 space-y-8 max-w-2xl mx-auto flex flex-col items-center">
                {/* Badge */}
                <div className="inline-flex">
                  <span className="px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 rounded-full">
                    START YOUR JOURNEY
                  </span>
                </div>

                {/* Typography */}
                <div className="space-y-4">
                  <Heading level={2} size="xl" className="font-sans leading-tight">
                    Your Wellness Journey Starts Today
                  </Heading>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed font-sans max-w-xl mx-auto">
                    Whether you're looking to improve flexibility, reduce stress, increase strength or simply live a healthier life, Nistha at ManoYoga is here to guide you every step of the way.
                  </p>
                </div>

                {/* CTAs Trigger area */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-2">
                  <Link href="/contact" className="w-full sm:w-auto">
                    <Button variant="default" size="lg" className="w-full sm:w-auto">
                      Book Free Trial
                    </Button>
                  </Link>
                  <a
                    href="https://wa.me/#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>Chat on WhatsApp</span>
                    </Button>
                  </a>
                </div>

                {/* Phone Call Link */}
                <div className="pt-1">
                  <a
                    href="tel:#"
                    className="inline-flex items-center space-x-2 text-sm font-bold text-accent hover:text-accent/80 transition-colors group/phone"
                  >
                    <Phone className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover/phone:scale-110" />
                    <span>Call Now</span>
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="border-t border-border/80 pt-8 w-full">
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                    {badges.map((badge, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-xs text-muted-foreground font-medium select-none">
                        <div className="p-0.5 bg-emerald-500/10 rounded text-emerald-600">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span>{badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </div>
    </Section>
  );
}
