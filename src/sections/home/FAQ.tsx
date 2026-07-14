"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView, useReducedMotion, Variants } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent } from "@/components/ui/card";

export function FAQ() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = React.useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);

  const faqs = [
    {
      q: "Do I need prior yoga experience?",
      a: "No. Our classes are designed for beginners as well as experienced practitioners.",
    },
    {
      q: "Do you offer online classes?",
      a: "Yes. ManoYoga offers both online and offline yoga sessions.",
    },
    {
      q: "What should I bring to my first class?",
      a: "Comfortable clothing, a yoga mat and a positive mindset are all you need.",
    },
    {
      q: "Can I book a trial session?",
      a: "Yes. You can easily book a free trial session through our website.",
    },
    {
      q: "Are private sessions available?",
      a: "Yes. Personalized one-on-one yoga sessions are available based on your goals.",
    },
    {
      q: "How do I contact ManoYoga?",
      a: "You can contact us through the contact form, WhatsApp or phone.",
    },
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const accordionVariants: Variants = {
    collapsed: { height: 0, opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    expanded: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <Section id="faq" className="relative overflow-hidden py-20 lg:py-28 bg-card/10">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-primary/5 blur-[120px]" />
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
                FAQ
              </span>
            </div>
            <Heading level={2} size="lg" className="font-sans leading-tight">
              Frequently Asked Questions
            </Heading>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
              Find answers to the most common questions about ManoYoga, classes, bookings and wellness programs.
            </p>
          </motion.div>

          {/* FAQ Accordion List */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="space-y-4"
          >
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <Card
                  key={idx}
                  className="overflow-hidden border border-border/80 bg-card/50 hover:border-accent/30 transition-colors duration-300"
                >
                  <CardContent className="p-0 text-left">
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-base font-bold text-foreground font-sans tracking-tight focus:outline-none focus:ring-1 focus:ring-accent focus:ring-offset-2 rounded-t-lg transition-colors cursor-pointer"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${idx}`}
                      id={`faq-question-${idx}`}
                    >
                      <span>{faq.q}</span>
                      <span className="p-1.5 bg-primary/10 rounded-full text-primary shrink-0 ml-4 transition-transform duration-300">
                        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${idx}`}
                          role="region"
                          aria-labelledby={`faq-question-${idx}`}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          variants={accordionVariants}
                        >
                          <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed font-sans border-t border-border/40 pt-4">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        </Container>
      </div>
    </Section>
  );
}
