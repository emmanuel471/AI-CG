import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import {
  selectUser,
  selectAIAnalysisData,
  selectAIAnalysisLoading,
  selectDecryptedTokens,
  type AppDispatch,
} from "@/store/store";
import { getAIAnalysis } from "@/auth-actions/AuthActions";
import type { Skill } from "@/types/AIAnalysisResponse";

import { Card, CardHeader, CardTitle } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { ProgressBar } from "@/components/ProgressBar";
import { Loader } from "@/components/Loader";

type Filter = "all" | "TECHNICAL" | "SOFT" | "DOMAIN" | "TOOL";

const filters: Filter[] = ["all", "TECHNICAL", "SOFT", "DOMAIN", "TOOL"];

const filterLabel: Record<Filter, string> = {
  all: "All skills",
  TECHNICAL: "Technical",
  SOFT: "Soft",
  DOMAIN: "Domain",
  TOOL: "Tool",
};

interface SkillRowProps {
  skill: Skill;
  index: number;
}

function SkillRow({ skill, index }: SkillRowProps) {
  const required = skill.required ?? 0;
  const gap = required - skill.level;
  const closed = gap <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Card padded={false} className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold">{skill.name}</h3>
              <Chip>{filterLabel[skill.category as Filter] ?? skill.category}</Chip>
              {skill.trending && (
                <Chip tone="accent">
                  <TrendingUp className="h-3 w-3" /> Trending
                </Chip>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              You: {skill.level}% · Target: {required}%
            </p>
          </div>
          <div className="shrink-0">
            {closed ? (
              <Chip tone="success">
                <CheckCircle2 className="h-3 w-3" /> On track
              </Chip>
            ) : (
              <Chip tone="warning">
                <AlertCircle className="h-3 w-3" /> Gap of {gap}%
              </Chip>
            )}
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={skill.level} required={required} />
        </div>
      </Card>
    </motion.div>
  );
}

export function SkillsGapPage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const analysis = useSelector(selectAIAnalysisData);
  const loading = useSelector(selectAIAnalysisLoading);
  const { accessToken } = useSelector(selectDecryptedTokens);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (!analysis && user?.userId && accessToken) {
      dispatch(getAIAnalysis(user.userId, accessToken) as any);
    }
  }, []);

  const skills = analysis?.skills ?? [];

  const filtered = useMemo(() => {
    return filter === "all" ? skills : skills.filter((s) => s.category === filter);
  }, [skills, filter]);

  const stats = useMemo(() => {
    let gaps = 0;
    let onTrack = 0;
    let biggest: Skill | null = null;
    let biggestGap = -1;
    for (const s of skills) {
      const g = (s.required ?? 0) - s.level;
      if (g > 0) {
        gaps++;
        if (g > biggestGap) {
          biggestGap = g;
          biggest = s;
        }
      } else onTrack++;
    }
    return { gaps, onTrack, biggest };
  }, [skills]);

  if (loading && !analysis) return <Loader fullscreen label="Analyzing your skills…" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Skills gap</h1>
        <p className="mt-2 text-muted-foreground">
          The clearest path to your target role. Yellow markers show what's required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>On track</CardTitle>
          </CardHeader>
          <p className="text-4xl font-bold text-success">{stats.onTrack}</p>
          <p className="text-sm text-muted-foreground mt-1">skills already meeting target</p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gaps to close</CardTitle>
          </CardHeader>
          <p className="text-4xl font-bold text-warning">{stats.gaps}</p>
          <p className="text-sm text-muted-foreground mt-1">skills below required level</p>
        </Card>
        <Card className="shadow-glow">
          <CardHeader>
            <CardTitle>Biggest opportunity</CardTitle>
          </CardHeader>
          {stats.biggest ? (
            <>
              <p className="text-xl font-semibold">{stats.biggest.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {(stats.biggest.required ?? 0) - stats.biggest.level}% to close
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {analysis ? "All caught up 🎉" : "No analysis yet"}
            </p>
          )}
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 h-9 rounded-full text-sm font-medium transition-all ${
              filter === f
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {filterLabel[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-lg font-medium">
            {analysis ? "No skills in this category" : "No analysis available"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {analysis
              ? "Try a different filter."
              : "Generate your career analysis from the dashboard."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((s, i) => (
            <SkillRow key={s.id} skill={s} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
