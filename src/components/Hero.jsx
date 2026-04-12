"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pcb-grid">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />

      {/* Floating circuit elements */}
      <div className="absolute top-1/4 left-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-16 h-40 w-40 rounded-full bg-accent/5 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs font-medium tracking-wider text-primary uppercase font-mono">
              Precision PCB Manufacturing
            </span>
          </motion.div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            From <span className="text-primary glow-text">Design</span> to{" "}
            <span className="text-primary glow-text">Delivery</span>
            <br />
            <span className="text-muted-foreground font-light">Your PCB Partner</span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Expert PCB fabrication, assembly, and component procurement.
            Get a custom quotation tailored to your exact specifications — no hidden costs.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:brightness-110 glow-primary"
            >
              Request a Quote
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-8 border-t border-border/50 pt-8"
          >
            {[
              { value: "10K+", label: "Boards Delivered" },
              { value: "48hr", label: "Quick Turn" },
              { value: "99.8%", label: "Quality Rate" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-primary font-mono">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
