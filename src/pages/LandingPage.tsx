import { motion } from "framer-motion";
import { Sparkles, Brain, Target, TrendingUp, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: "AI Match Engine",
    desc: "Confidence-scored career paths tailored to your profile, goals, and market signals.",
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "Skills Gap Radar",
    desc: "See exactly which skills to grow — and by how much — to land your target role.",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Live Market Demand",
    desc: "Salary bands, growth velocity, and demand scores updated in real time.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Personalized Path",
    desc: "An adaptive learning roadmap that recalibrates as you build new skills.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6 pt-2 pb-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Chip tone="primary" className="mb-6 mt-6">
              <Sparkles className="h-3 w-3" /> Powered by next-gen AI
            </Chip>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-5xl font-bold tracking-tight leading-[1.05]"
          >
            Your career,
            <br />
            <span className="text-gradient-primary">guided by intelligence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground"
          >
            AI-CG maps your skills, scores your fit across thousands of roles, and builds the
            path to your next chapter — in minutes, not months.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Everything you need to <span className="text-gradient-primary">level up</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built for ambitious people navigating a fast-changing market.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card hoverable className="h-full">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-glass-border mt-10">
        <div className="mx-auto max-w-7xl px-6 py-8">  
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                AI-CG
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1">
                Intelligent career guidance powered by AI. Discover your path, close your gaps, and grow with confidence.
              </p>
            </div>
            <div className="text-sm text-muted-foreground flex flex-col md:items-end gap-1">
              <span>© {new Date().getFullYear()} AI-CG</span>
              <span>Built with intent.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
