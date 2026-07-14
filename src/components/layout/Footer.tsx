"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, Youtube, Linkedin, ArrowUp, Flame, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";

export function Footer() {
  const shouldReduceMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  // Monitor scroll height to show back-to-top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ];

  const programs = [
    { label: "Beginner Yoga", href: "/services" },
    { label: "Power Yoga", href: "/services" },
    { label: "Meditation", href: "/services" },
    { label: "Corporate Yoga", href: "/services" },
    { label: "Online Classes", href: "/services" },
    { label: "Private Sessions", href: "/services" },
  ];

  return (
    <footer className="relative w-full border-t border-border bg-card/90 dark:bg-black/40 pt-16 pb-8 font-sans">
      <Container className="space-y-12">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 text-left">
          {/* Column 1: Brand details & socials */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center space-x-2 font-semibold text-xl text-primary">
              <Flame className="h-6 w-6 text-accent animate-pulse" />
              <span>ManoYoga</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Helping people build a healthier body, calmer mind and balanced lifestyle through mindful yoga practice.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-border hover:bg-primary/5 hover:text-accent hover:border-accent/40 text-muted-foreground transition-all duration-300"
                    aria-label={`Follow ManoYoga on ${social.label}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-foreground tracking-wider uppercase">
              Quick Links
            </h4>
            <nav className="flex flex-col space-y-2.5">
              {quickLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Programs */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-foreground tracking-wider uppercase">
              Programs
            </h4>
            <nav className="flex flex-col space-y-2.5">
              {programs.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Contact Info */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-foreground tracking-wider uppercase">
              Contact
            </h4>
            <div className="space-y-3.5 text-sm text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground">Guided by Nistha</p>
              
              <div className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-1" />
                <span>123 Serenity Lane, Wellness District, Delhi, India</span>
              </div>
              
              <div className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+919876543210" className="hover:text-primary transition-colors">
                  +91 98765 43210
                </a>
              </div>
              
              <div className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:contact@manoyoga.com" className="hover:text-primary transition-colors">
                  contact@manoyoga.com
                </a>
              </div>

              <div className="flex items-start space-x-2.5 pt-1">
                <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p>Monday–Saturday: 6 AM – 8 PM</p>
                  <p className="text-xs text-rose-500">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/80">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {currentYear} ManoYoga. All Rights Reserved.
          </p>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              Refund Policy
            </Link>
          </nav>
        </div>
      </Container>

      {/* Back to Top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/95 transition-colors cursor-pointer z-50 border border-white/10"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
