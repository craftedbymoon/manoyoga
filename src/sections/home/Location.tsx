"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion, Variants } from "framer-motion";
import { Phone, MessageCircle, MapPin, Mail, Clock, Calendar } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Location() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = React.useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const contactDetails = {
    studioName: "ManoYoga Studio",
    founder: "Nistha",
    address: "123 Serenity Lane, Wellness District, Delhi, India",
    phone: "+91 98765 43210",
    email: "contact@manoyoga.com",
    hours: "Monday - Saturday: 6:00 AM – 8:00 PM",
    sunday: "Closed",
  };

  const quickContacts = [
    {
      icon: Phone,
      title: "Call Us",
      value: contactDetails.phone,
      href: `tel:${contactDetails.phone}`,
      label: "Call",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "Chat with Nistha",
      href: "https://wa.me/#",
      label: "WhatsApp",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "View on Google Maps",
      href: "https://maps.google.com",
      label: "Directions",
    },
    {
      icon: Mail,
      title: "Email Us",
      value: contactDetails.email,
      href: `mailto:${contactDetails.email}`,
      label: "Email",
    },
  ];

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

  return (
    <Section className="relative overflow-hidden py-20 lg:py-28">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div ref={sectionRef}>
        <Container className="space-y-16">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <div className="inline-flex">
              <span className="px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase bg-accent/10 rounded-full">
                VISIT US
              </span>
            </div>
            <Heading level={2} size="lg" className="font-sans leading-tight">
              Find ManoYoga Near You
            </Heading>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
              Visit our yoga studio and experience a peaceful environment designed for your wellness journey. We also offer online classes for students across India.
            </p>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            {/* Left Side: Contact Cards & Hours */}
            <motion.div
              initial="hidden"
              animate={isSectionInView ? "visible" : "hidden"}
              variants={fadeInLeft}
              className="lg:col-span-5 flex flex-col justify-between space-y-6"
            >
              {/* Main Contact Card */}
              <Card className="border border-border/80 bg-card/60 flex-grow shadow-md">
                <CardContent className="p-6 sm:p-8 text-left space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-foreground font-sans tracking-tight">
                      {contactDetails.studioName}
                    </h4>
                    <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                      Guided by {contactDetails.founder}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Address */}
                    <div className="flex items-start space-x-3 text-sm font-sans text-muted-foreground leading-relaxed">
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{contactDetails.address}</span>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start space-x-3 text-sm font-sans text-muted-foreground">
                      <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">{contactDetails.hours}</p>
                        <p className="text-xs text-rose-500 mt-0.5">Sunday: {contactDetails.sunday}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contacts Grid */}
              <div className="grid grid-cols-2 gap-4">
                {quickContacts.map((contact, idx) => {
                  const Icon = contact.icon;
                  return (
                    <a
                      key={idx}
                      href={contact.href}
                      target={contact.href.startsWith("http") ? "_blank" : undefined}
                      rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="block group"
                      aria-label={`Contact via ${contact.label}`}
                    >
                      <Card className="hover:-translate-y-1 transition-transform duration-300 border border-border bg-card/50">
                        <CardContent className="flex flex-col items-center justify-center p-5 text-center space-y-2">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary transition-transform duration-300 group-hover:scale-105">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-xs font-bold text-foreground font-sans">
                            {contact.label}
                          </span>
                        </CardContent>
                      </Card>
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Side: Google Map Placeholder Container */}
            <motion.div
              initial="hidden"
              animate={isSectionInView ? "visible" : "hidden"}
              variants={fadeInRight}
              className="lg:col-span-7 flex"
            >
              <Card className="w-full border border-border/80 bg-card/40 shadow-xl overflow-hidden rounded-[2rem] min-h-[300px] lg:min-h-[400px] flex flex-col justify-center items-center relative group">
                {/* Visual grid backdrop mockup */}
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-900/20" />
                
                {/* Decorative gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-background to-card/50 -z-10" />

                <CardContent className="p-8 text-center space-y-4 z-10">
                  <div className="w-16 h-16 rounded-full bg-accent/15 text-accent flex items-center justify-center mx-auto shadow-md">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <div className="space-y-2 max-w-sm mx-auto">
                    <h4 className="text-lg font-bold text-foreground font-sans">
                      Interactive Map Placeholder
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                      Google Maps iframe can easily be embedded here by placing the element inside this wrapper container.
                    </p>
                  </div>
                  <div className="pt-2">
                    <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        Open in Google Maps
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
