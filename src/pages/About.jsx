"use client";

import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const values = [
  {
    title: "Precision Engineering",
    desc: "Every board is manufactured to exacting tolerances with advanced CNC drilling, automated optical inspection, and rigorous quality gates.",
  },
  {
    title: "Quick Turnaround",
    desc: "From prototype to production, we optimize every step. 48-hour quick-turn available for urgent projects without compromising quality.",
  },
  {
    title: "End-to-End Service",
    desc: "Fabrication, assembly, and procurement under one roof. Streamline your supply chain with a single trusted partner.",
  },
  {
    title: "Quality Assurance",
    desc: "IPC Class 2 & 3 standards. Every batch undergoes electrical testing, visual inspection, and cross-section analysis when required.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="text-xs font-medium text-primary uppercase font-mono">About Us</span>
              </div>
              <h1 className="text-3xl font-bold mb-4">
                Building the <span className="text-primary">Foundation</span> of Electronics
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-6">
                CircuitForge is a professional PCB manufacturing service provider specializing in high-quality circuit board fabrication, surface mount and through-hole assembly, and component procurement. We serve engineers, startups, and enterprises who demand reliability and precision.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With years of experience in the electronics manufacturing industry, our team understands the critical role that PCB quality plays in product success. We combine modern manufacturing equipment with rigorous process control to deliver boards that meet the highest standards.
              </p>
            </motion.div>

            <div className="mt-16 grid gap-5 sm:grid-cols-2">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <h3 className="text-sm font-semibold mb-2">{v.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
