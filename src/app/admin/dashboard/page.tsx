"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, Variants } from "framer-motion";
import {
  CalendarRange,
  Users,
  Mail,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Briefcase,
  Settings,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  Activity,
  Calendar,
  PenTool,
  Bookmark,
  Bell
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const shouldReduceMotion = useReducedMotion();
  const [quickNote, setQuickNote] = React.useState("");

  const stats = [
    { label: "Total Bookings", value: "128", change: "+12%", trend: "up", icon: CalendarRange },
    { label: "Active Students", value: "524", change: "+8%", trend: "up", icon: Users },
    { label: "Newsletter Subscribers", value: "1,284", change: "+15%", trend: "up", icon: Mail },
    { label: "Blog Articles", value: "26", change: "+3%", trend: "up", icon: FileText }
  ];

  const quickActions = [
    { title: "Manage Services", desc: "Update rates and catalog classes.", href: "/admin/services", icon: Briefcase },
    { title: "Manage Blog", desc: "Write and edit wellness articles.", href: "/admin/blog", icon: FileText },
    { title: "View Bookings", desc: "Review student schedules & slots.", href: "/admin/bookings", icon: CalendarRange },
    { title: "Website Settings", desc: "Configure metadata & branding.", href: "/admin/settings", icon: Settings }
  ];

  const recentBookings = [
    { id: 1, name: "Shivani Sharma", program: "Beginner Yoga", date: "July 15, 2026", status: "Confirmed" },
    { id: 2, name: "Aarav Gupta", program: "Meditation & Breathing", date: "July 16, 2026", status: "Pending" },
    { id: 3, name: "Diya Patel", program: "Private Wellness", date: "July 17, 2026", status: "Confirmed" },
    { id: 4, name: "Kabir Mehta", program: "Power Yoga Core", date: "July 18, 2026", status: "Cancelled" },
    { id: 5, name: "Ishaan Malhotra", program: "Corporate Mindfulness", date: "July 19, 2026", status: "Pending" }
  ];

  const recentMessages = [
    { id: 1, name: "Rohan Sen", subject: "Corporate Workshop Query", time: "10 mins ago", unread: true },
    { id: 2, name: "Meera Nair", subject: "Trial session reservation", time: "1 hour ago", unread: true },
    { id: 3, name: "Aditya Roy", subject: "Private one-on-one slot check", time: "3 hours ago", unread: false },
    { id: 4, name: "Kirti Verma", subject: "Feedback on Nistha's guidance", time: "5 hours ago", unread: false },
    { id: 5, name: "Devansh Gill", subject: "Online batch registration", time: "Yesterday", unread: false }
  ];

  const activities = [
    { id: 1, title: "New booking received", desc: "Shivani Sharma booked Beginner Yoga", time: "10 mins ago" },
    { id: 2, title: "Blog published", desc: "Nistha posted '10 Simple Yoga Poses'", time: "2 hours ago" },
    { id: 3, title: "Newsletter subscriber joined", desc: "shubh@gmail.com joined", time: "4 hours ago" },
    { id: 4, title: "Testimonial added", desc: "Ananya Kapoor posted 5★ review", time: "1 day ago" },
    { id: 5, title: "Gallery updated", desc: "3 new high-res photos uploaded", time: "2 days ago" }
  ];

  const todayClasses = [
    { id: 1, name: "Beginner Yoga", time: "07:00 AM – 08:30 AM", room: "Studio A" },
    { id: 2, name: "Meditation Batch B", time: "10:30 AM – 11:30 AM", room: "Online / Meet" },
    { id: 3, name: "Power Yoga Core", time: "05:30 PM – 07:00 PM", room: "Studio B" }
  ];

  const upcomingSessions = [
    { id: 1, client: "Diya Patel", type: "Private Wellness", time: "July 17, 10:00 AM" },
    { id: 2, client: "Kabir Mehta", type: "Yoga Assessment", time: "July 18, 04:00 PM" }
  ];

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col space-y-1.5 text-left border-b border-border/60 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground font-sans leading-relaxed">
          Welcome back, Nistha 👋 Today is a great day to help people live healthier lives.
        </p>
      </div>

      {/* 2. Top Statistics Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div key={idx} variants={fadeInUp}>
              <Card className="border border-border/80 bg-card shadow-sm hover:border-accent/40 transition-all duration-300">
                <CardContent className="p-6 space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase font-sans">
                      {stat.label}
                    </span>
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold tracking-tight text-foreground font-sans">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-emerald-500 font-semibold flex items-center space-x-1 font-sans">
                      <TrendingUp className="h-3.5 w-3.5 inline mr-1" />
                      <span>{stat.change}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* 3. Main Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8-Columns: Main Admin Feeds */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* A. Quick Actions Section */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground font-sans text-left">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Link key={idx} href={action.href} className="block group">
                    <Card className="border border-border bg-card/60 hover:-translate-y-0.5 hover:border-accent/40 transition-all duration-300 shadow-sm h-full">
                      <CardContent className="p-5 flex items-center justify-between text-left">
                        <div className="flex items-center space-x-4">
                          <div className="p-2.5 bg-accent/10 rounded-xl text-accent transition-transform duration-300 group-hover:scale-105">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-bold text-foreground font-sans">
                              {action.title}
                            </h4>
                            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                              {action.desc}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5" />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* B. Recent Bookings Table */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground font-sans text-left">
              Recent Bookings
            </h3>
            <Card className="border border-border/80 bg-card overflow-hidden shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-border/60 bg-primary/5 select-none">
                        <th className="p-4 font-bold text-foreground font-sans">Student</th>
                        <th className="p-4 font-bold text-foreground font-sans">Program</th>
                        <th className="p-4 font-bold text-foreground font-sans">Date</th>
                        <th className="p-4 font-bold text-foreground font-sans">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-border/40 hover:bg-primary/5 transition-colors">
                          <td className="p-4 font-semibold text-foreground font-sans">{booking.name}</td>
                          <td className="p-4 text-muted-foreground font-sans">{booking.program}</td>
                          <td className="p-4 text-muted-foreground font-sans">{booking.date}</td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                booking.status === "Confirmed"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : booking.status === "Pending"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : "bg-rose-500/10 text-rose-600"
                              }`}
                            >
                              {booking.status === "Confirmed" ? (
                                <CheckCircle2 className="h-3 w-3 shrink-0 mr-1" />
                              ) : booking.status === "Pending" ? (
                                <Clock className="h-3 w-3 shrink-0 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 shrink-0 mr-1" />
                              )}
                              <span>{booking.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* C. Recent Contact Messages */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground font-sans text-left">
              Recent Contact Messages
            </h3>
            <Card className="border border-border/80 bg-card shadow-sm">
              <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                  {recentMessages.map((msg) => (
                    <div key={msg.id} className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors text-left group cursor-pointer">
                      <div className="flex items-center space-x-3.5">
                        <div className={`p-2 rounded-lg ${msg.unread ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
                          <MessageSquare className="h-4.5 w-4.5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-foreground font-sans">{msg.name}</span>
                            {msg.unread && (
                              <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-accent text-accent-foreground rounded-full leading-none">
                                Unread
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground font-sans leading-normal">
                            {msg.subject}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 font-sans group-hover:text-foreground transition-colors shrink-0">
                        {msg.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* D. Recent Activity Timeline */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground font-sans text-left">
              Recent Activity
            </h3>
            <Card className="border border-border/80 bg-card shadow-sm">
              <CardContent className="p-6 space-y-6 text-left">
                <div className="space-y-6">
                  {activities.map((act) => (
                    <div key={act.id} className="relative pl-6 border-l border-border/80 space-y-1">
                      <span className="absolute left-[-4.5px] top-1.5 h-2 w-2 rounded-full bg-accent" />
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-foreground font-sans">{act.title}</p>
                        <span className="text-[10px] text-muted-foreground/60 font-sans">{act.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-normal font-sans">{act.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Right 4-Columns: Widgets Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* A. Today's Classes Widget */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground font-sans text-left">
              Today's Classes
            </h3>
            <Card className="border border-border/80 bg-card shadow-sm">
              <CardContent className="p-5 space-y-4 text-left">
                {todayClasses.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-border/60 bg-primary/5 space-y-1 hover:border-accent/40 transition-colors">
                    <p className="text-xs font-bold text-foreground font-sans">{item.name}</p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-sans">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.time}</span>
                      </div>
                      <span>{item.room}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* B. Upcoming Sessions Widget */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground font-sans text-left">
              Upcoming Private Sessions
            </h3>
            <Card className="border border-border/80 bg-card shadow-sm">
              <CardContent className="p-5 space-y-4 text-left">
                {upcomingSessions.map((sess) => (
                  <div key={sess.id} className="flex items-start justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-foreground font-sans">{sess.client}</p>
                      <p className="text-[10px] text-muted-foreground font-sans">{sess.type}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-accent font-sans bg-accent/10 px-2 py-0.5 rounded-full shrink-0">
                      {sess.time}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* C. Quick Notes Widget */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground font-sans text-left">
              Quick Notes
            </h3>
            <Card className="border border-border/80 bg-card shadow-sm">
              <CardContent className="p-5 space-y-4 text-left">
                <textarea
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="Draft reminders, thoughts or class updates..."
                  className="w-full min-h-[120px] p-3 text-xs rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 leading-relaxed font-sans"
                  aria-label="Admin quick notes draft"
                />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[9px] text-muted-foreground/60 font-sans">
                    Saved locally in draft state
                  </span>
                  <Button variant="default" size="sm" className="h-7 text-[10px] font-bold">
                    Save Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}
