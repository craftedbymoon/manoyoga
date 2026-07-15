"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Loader2, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { bookingSchema, BookingInput } from "@/lib/validations/booking";
import { createBooking, getActiveServices } from "@/lib/actions/booking";
import { Button } from "@/components/ui/button";

interface ServiceOption {
  id: string;
  name: string;
}

export function BookingModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [services, setServices] = React.useState<ServiceOption[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceId: "",
      date: "",
      time: "",
      mode: "Online",
      message: ""
    }
  });

  // Listen to open-booking-modal custom event
  React.useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSuccess(false);
      setSubmitError(null);
      reset();
    };

    window.addEventListener("open-booking-modal", handleOpen);
    return () => window.removeEventListener("open-booking-modal", handleOpen);
  }, [reset]);

  // Fetch active services when modal opens
  React.useEffect(() => {
    if (!isOpen) return;
    
    const loadServices = async () => {
      const data = await getActiveServices();
      // Fallback to mock list if database has no active services
      if (data && data.length > 0) {
        setServices(data.map(s => ({ id: s.id, name: s.name })));
      } else {
        setServices([
          { id: "SRV-101", name: "Beginner Yoga" },
          { id: "SRV-102", name: "Power Yoga Core" },
          { id: "SRV-103", name: "Deep Meditation & Breathing" }
        ]);
      }
    };
    loadServices();
  }, [isOpen]);

  const onSubmit = async (data: BookingInput) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createBooking(data);
      if (result.success) {
        setIsSuccess(true);
      } else {
        setSubmitError(result.error || "Failed to submit booking request. Please check inputs.");
      }
    } catch {
      setSubmitError("An unexpected system error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black cursor-pointer"
          />

          {/* Modal box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-card border border-border max-w-lg w-full rounded-2xl shadow-2xl z-10 overflow-hidden text-left relative"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="p-5 border-b border-border/60 flex justify-between items-center bg-primary/5 select-none">
              <div>
                <h3 className="text-base font-bold text-foreground font-sans">Book a Free Session</h3>
                <p className="text-[11px] text-muted-foreground font-sans mt-0.5">Your wellness journey starts today.</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-md"
                aria-label="Close dialog"
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>

            {/* Content area */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              
              {isSuccess ? (
                // Success screen
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-4"
                >
                  <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-1.5 max-w-sm mx-auto">
                    <h4 className="text-base font-bold text-foreground font-sans">Booking Request Submitted!</h4>
                    <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                      Thank you for scheduling a session. A confirmation email has been dispatched, and our support team will reach out shortly to finalize your slot.
                    </p>
                  </div>
                  <Button variant="default" onClick={() => setIsOpen(false)} className="mt-4">
                    Close
                  </Button>
                </motion.div>
              ) : (
                // Submission form
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {submitError && (
                    <div className="p-3 bg-rose-500/10 text-rose-600 rounded-lg flex items-start space-x-2.5 text-xs font-semibold">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Full Name</label>
                      <input
                        type="text"
                        {...register("name")}
                        className="w-full p-2 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent font-sans"
                        placeholder="e.g. Shivani Sharma"
                      />
                      {errors.name && (
                        <p className="text-[10px] text-rose-500 font-medium font-sans">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Email Address</label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full p-2 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent font-sans"
                        placeholder="e.g. name@domain.com"
                      />
                      {errors.email && (
                        <p className="text-[10px] text-rose-500 font-medium font-sans">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Phone Number</label>
                      <input
                        type="tel"
                        {...register("phone")}
                        className="w-full p-2 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent font-sans"
                        placeholder="e.g. +91 98765 43210"
                      />
                      {errors.phone && (
                        <p className="text-[10px] text-rose-500 font-medium font-sans">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Service Selection */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Select Service</label>
                      <select
                        {...register("serviceId")}
                        className="w-full p-2 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent font-sans cursor-pointer"
                      >
                        <option value="">Choose a Program...</option>
                        {services.map((srv) => (
                          <option key={srv.id} value={srv.id}>
                            {srv.name}
                          </option>
                        ))}
                      </select>
                      {errors.serviceId && (
                        <p className="text-[10px] text-rose-500 font-medium font-sans">{errors.serviceId.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Date */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Preferred Date</label>
                      <input
                        type="date"
                        {...register("date")}
                        className="w-full p-2 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent font-sans cursor-pointer"
                      />
                      {errors.date && (
                        <p className="text-[10px] text-rose-500 font-medium font-sans">{errors.date.message}</p>
                      )}
                    </div>

                    {/* Time Slot */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Preferred Time</label>
                      <select
                        {...register("time")}
                        className="w-full p-2 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent font-sans cursor-pointer"
                      >
                        <option value="">Select Time...</option>
                        <option value="07:00 AM">07:00 AM – 08:30 AM</option>
                        <option value="10:30 AM">10:30 AM – 11:30 AM</option>
                        <option value="04:00 PM">04:00 PM – 05:00 PM</option>
                        <option value="06:00 PM">06:00 PM – 07:30 PM</option>
                      </select>
                      {errors.time && (
                        <p className="text-[10px] text-rose-500 font-medium font-sans">{errors.time.message}</p>
                      )}
                    </div>

                    {/* Class Mode */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground font-sans">Class Mode</label>
                      <select
                        {...register("mode")}
                        className="w-full p-2 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent font-sans cursor-pointer"
                      >
                        <option value="Online">Online Sessions</option>
                        <option value="Offline">Studio Offline</option>
                      </select>
                      {errors.mode && (
                        <p className="text-[10px] text-rose-500 font-medium font-sans">{errors.mode.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground font-sans">Message (Optional)</label>
                    <textarea
                      {...register("message")}
                      className="w-full p-2 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent h-16 resize-none font-sans"
                      placeholder="Share any health notes, physical stiffness, or goals..."
                    />
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-[10px] text-muted-foreground font-sans">
                      <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                      <span>SSL Encrypted Connection</span>
                    </div>
                    <div className="flex space-x-3.5">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setIsOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button variant="default" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin mr-1 shrink-0" />
                            <span>Scheduling...</span>
                          </>
                        ) : (
                          <span>Book Session</span>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              )}

            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}

export function triggerBookingModal() {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("open-booking-modal");
    window.dispatchEvent(event);
  }
}
