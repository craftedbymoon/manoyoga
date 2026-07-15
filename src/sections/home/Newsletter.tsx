"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion, Variants } from "framer-motion";
import { Check, Mail, Sparkles, Heart, Bell } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Newsletter() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = React.useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const benefits = [
    { icon: Sparkles, text: "Receive Weekly Yoga Tips" },
    { icon: Heart, text: "Exclusive Wellness Articles" },
    { icon: Bell, text: "Special Class Announcements" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

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
    <Section className="relative overflow-hidden py-20 lg:py-28 bg-card/5">
      {/* Background gradients and blurred organic shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[30%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div ref={sectionRef}>
        <Container className="max-w-4xl space-y-16">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <div className="inline-flex">
              <span className="px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 rounded-full">
                STAY CONNECTED
              </span>
            </div>
          </motion.div>

          {/* Centered Subscription Card */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="w-full"
          >
            <Card glass className="bg-card/70 border border-border/80 shadow-2xl rounded-[2.5rem] p-8 sm:p-12 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full bg-accent/5 blur-[60px] -z-10" />
              
              <CardContent className="p-0 space-y-8 text-center max-w-2xl mx-auto">
                <div className="space-y-4">
                  <Heading level={2} size="base" className="font-sans leading-tight">
                    Join the ManoYoga Wellness Community
                  </Heading>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-sans max-w-xl mx-auto">
                    Subscribe to receive yoga tips, wellness insights, mindfulness practices, class updates and exclusive offers directly in your inbox.
                  </p>
                </div>

                {/* Form implementation */}
                {!subscribed ? (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-stretch">
                    <div className="relative flex-grow">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/80" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="w-full pl-11 pr-4 py-3 text-sm rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 h-11"
                        aria-label="Email address for subscription"
                      />
                    </div>
                    <Button type="submit" variant="default" className="shrink-0">
                      Subscribe
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-sm font-semibold max-w-md mx-auto flex items-center justify-center space-x-2"
                  >
                    <Check className="h-5 w-5 shrink-0" />
                    <span>Thank you! You&apos;ve successfully subscribed to ManoYoga.</span>
                  </motion.div>
                )}

                {/* Privacy Note */}
                <p className="text-[11px] text-muted-foreground/80 font-sans">
                  We respect your privacy. No spam, unsubscribe anytime.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits Feature Cards Row */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div key={idx} variants={fadeInUp}>
                  <Card className="hover:-translate-y-1 transition-transform duration-300 bg-card/30 border-border/60">
                    <CardContent className="flex items-center space-x-3 p-4 justify-center sm:justify-start">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-muted-foreground text-left leading-tight">
                        {benefit.text}
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </div>
    </Section>
  );
}
