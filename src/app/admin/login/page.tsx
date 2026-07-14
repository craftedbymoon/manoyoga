"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Flame, Mail, Lock, ShieldAlert, ArrowLeft, Loader2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils";
import { signIn } from "@/lib/auth/config";

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [error, setError] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFields) => {
    setError("");
    
    try {
      const result = await signIn(data.email, data.password);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      } else {
        setError(result.error || "Invalid credentials. Try: admin@manoyoga.com / Admin@123");
      }
    } catch {
      setError("An unexpected error occurred during authentication.");
    }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex font-sans bg-background">
      {/* 1. Left Side Panel: Branding & Quote */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 items-center justify-center overflow-hidden border-r border-border/10 select-none">
        {/* Modern glowing gradient backing */}
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-zinc-950 to-primary/20 opacity-80" />
        <div className="absolute top-[20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-accent/10 blur-[130px] -z-10" />
        <div className="absolute bottom-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-primary/10 blur-[130px] -z-10" />

        {/* Floating grid patterns */}
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

        {/* Content container */}
        <div className="relative max-w-lg p-12 text-left space-y-8 z-10">
          <div className="inline-flex items-center space-x-2.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <Flame className="h-4.5 w-4.5 text-accent animate-pulse" />
            <span className="text-xs font-semibold text-white/95 tracking-wide">ManoYoga Management</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Empowering wellness through mindful management.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
              Streamline booking confirmations, program additions, articles publication, and student inquiries from a single modern console.
            </p>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-sans">
              ManoYoga Core Admin V1.0
            </p>
          </div>
        </div>
      </div>

      {/* 2. Right Side Panel: Centered Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/20">
        {/* Background gradient blob for mobile viewports */}
        <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/5 blur-[120px] lg:hidden" />
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="w-full max-w-md space-y-6 z-10"
        >
          {/* Card Wrapper */}
          <Card className="border border-border/80 bg-card/80 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
            <CardContent className="p-8 text-left space-y-6">
              
              {/* Header */}
              <div className="space-y-2">
                <Heading level={1} size="lg" className="font-sans leading-tight">
                  Welcome Back
                </Heading>
                <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                  Sign in to access the ManoYoga Admin Dashboard.
                </p>
              </div>

              {/* Status Info boxes */}
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold rounded-lg flex items-center space-x-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {isSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold rounded-lg flex items-center space-x-2">
                  <Check className="h-4 w-4 shrink-0 animate-bounce" />
                  <span>Authentication successful. Launching dashboard...</span>
                </div>
              )}

              {/* Form details */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Email address field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground font-sans" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
                    <input
                      id="email"
                      type="email"
                      disabled={isSubmitting || isSuccess}
                      placeholder="name@example.com"
                      {...register("email")}
                      className={cn(
                        "w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 h-10 font-sans",
                        errors.email ? "border-rose-500/80 focus:ring-rose-500/30 focus:border-rose-500" : "border-border"
                      )}
                      aria-invalid={errors.email ? "true" : "false"}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-rose-500 font-semibold font-sans mt-0.5" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground font-sans" htmlFor="password">
                      Password
                    </label>
                    <span className="text-[10px] text-accent font-semibold cursor-pointer hover:underline font-sans">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
                    <input
                      id="password"
                      type="password"
                      disabled={isSubmitting || isSuccess}
                      placeholder="••••••••"
                      {...register("password")}
                      className={cn(
                        "w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-foreground transition-all placeholder:text-muted-foreground/60 h-10 font-sans",
                        errors.password ? "border-rose-500/80 focus:ring-rose-500/30 focus:border-rose-500" : "border-border"
                      )}
                      aria-invalid={errors.password ? "true" : "false"}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-rose-500 font-semibold font-sans mt-0.5" role="alert">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me checkbox */}
                <div className="flex items-center space-x-2 pt-1.5 select-none">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    disabled={isSubmitting || isSuccess}
                    {...register("rememberMe")}
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent/50 bg-background/50 cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="text-xs font-semibold text-muted-foreground cursor-pointer font-sans">
                    Remember Me
                  </label>
                </div>

                {/* Submitting button controls */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full flex items-center justify-center space-x-2"
                    disabled={isSubmitting || isSuccess}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </Button>
                </div>
              </form>

              {/* Demo Credentials Hint */}
              <div className="text-center pt-2 border-t border-border/40">
                <p className="text-[10px] text-muted-foreground/80 font-sans leading-relaxed">
                  Use demo credentials: <span className="font-semibold text-foreground">admin@manoyoga.com</span> / <span className="font-semibold text-foreground">Admin@123</span>
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Secondary CTA: Back to website */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group/back"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/back:-translate-x-0.5" />
              <span>Back to Website</span>
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
