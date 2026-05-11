import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Sparkles,
  Target,
  Compass,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import {
  selectUser,
  selectAIAnalysisData,
  selectAIAnalysisLoading,
  selectAIAnalysisTriggering,
  selectDecryptedTokens,
  type AppDispatch,
} from "@/store/store";
import { getAIAnalysis, triggerAIAnalysis } from "@/auth-actions/AuthActions";

import { Card, CardTitle } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { ProgressBar } from "@/components/ProgressBar";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/Button";
import { toast } from "@/hooks/use-toast";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <Card hoverable>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {trend && <p className="mt-1 text-xs text-success">{trend}</p>}
        </div>
        <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const analysis = useSelector(selectAIAnalysisData);
  const loading = useSelector(selectAIAnalysisLoading);
  const triggering = useSelector(selectAIAnalysisTriggering);
  const { accessToken } = useSelector(selectDecryptedTokens);

  useEffect(() => {
    if (!analysis && user?.userId && accessToken) {
      dispatch(getAIAnalysis(user.userId, accessToken) as any);
    }
  }, []);

  const handleRegenerate = async () => {
    if (!user?.userId || !accessToken) return;
    try {
      await dispatch(triggerAIAnalysis(user.userId, accessToken) as any);
      dispatch(getAIAnalysis(user.userId, accessToken) as any);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to generate analysis",
        variant: "destructive",
      });
    }
  };

  const firstName = user?.firstName ?? "User";

  if (loading && !analysis) return <Loader fullscreen label="Loading your analysis…" />;

  if (!analysis) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Hello, <span className="text-gradient-primary">{firstName}</span> 👋
          </h1>
        </div>
        <Card className="text-center py-16 shadow-glow">
          <Sparkles className="h-10 w-10 mx-auto text-primary-glow mb-4" />
          <h2 className="text-xl font-semibold">No analysis yet</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Generate your personalised AI career analysis based on your profile
            skills and interests.
          </p>
          <div className="mt-6">
            <Button
              onClick={handleRegenerate}
              loading={triggering || loading}
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              Generate Analysis
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const top = [...analysis.careers].sort((a, b) => b.confidence - a.confidence)[0];
  const avgSkill = Math.round(
    analysis.skills.reduce((acc, s) => acc + s.level, 0) / analysis.skills.length
  );
  const generatedDate = new Date(analysis.meta.generatedAt).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Hello,{" "}
            <span className="text-gradient-primary">{firstName}</span> 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            Here's how your career trajectory looks today.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRegenerate}
            loading={triggering || loading}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Regenerate
          </Button>
          <p className="text-xs text-muted-foreground">Last analysed: {generatedDate}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Top match"
          value={`${top.confidence}%`}
          icon={<Sparkles className="h-5 w-5" />}
        />
        <StatCard
          label="Skills tracked"
          value={`${analysis.skills.length}`}
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="Avg skill level"
          value={`${avgSkill}%`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Career options"
          value={`${analysis.careers.length}`}
          icon={<Compass className="h-5 w-5" />}
        />
      </div>

      {/* TOP RECOMMENDATION — full width */}
      <Card className="shadow-glow">
        <p className="text-xs uppercase tracking-wider text-primary-glow">
          Top recommendation
        </p>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold">{top.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              {top.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {top.tags.map((t) => (
                <Chip key={t} tone="primary">
                  {t}
                </Chip>
              ))}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground">AI confidence</p>
            <p className="text-4xl font-bold text-gradient-primary">
              {top.confidence}%
            </p>
          </div>
        </div>

        <div className="mt-5">
          <ProgressBar value={top.confidence} />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {top.salaryRange} ·{" "}
            <span className="text-success">
              {top.growth.charAt(0) + top.growth.slice(1).toLowerCase()} growth
            </span>
          </div>
          <Link to="/recommendations">
            <Button size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
              See all matches
            </Button>
          </Link>
        </div>
      </Card>

      {/* RECOMMENDED ACTIVITIES — horizontal scroll strip */}
      {analysis.activity.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Recommended activities
            </p>
            <span className="text-xs text-muted-foreground">
              {analysis.activity.length} tasks
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
            {analysis.activity.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="snap-start shrink-0 w-52 rounded-xl border border-border bg-card px-4 py-3.5 flex flex-col gap-2"
              >
                <div className="h-1 w-8 rounded-full bg-gradient-primary" />
                <p className="text-sm font-medium leading-snug">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-auto">{item.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SKILLS SNAPSHOT — full width, 3-col on large screens */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <CardTitle>Skills snapshot</CardTitle>
          <Link to="/skills-gap">
            <Button
              size="sm"
              variant="ghost"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Open skills gap
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {analysis.skills.slice(0, 6).map((s) => (
            <div key={s.id}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">{s.level}%</span>
              </div>
              <ProgressBar value={s.level} required={s.required} />
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}