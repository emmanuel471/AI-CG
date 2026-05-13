import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, DollarSign, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  selectUser,
  selectAIAnalysisData,
  selectAIAnalysisLoading,
  selectDecryptedTokens,
  type AppDispatch,
} from "@/store/store";
import { getAIAnalysis } from "@/auth-actions/AuthActions";
import type { Career } from "@/types/AIAnalysisResponse";

import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { Input } from "@/components/Input";
import { ProgressBar } from "@/components/ProgressBar";
import { Loader } from "@/components/Loader";

interface CareerCardProps {
  career: Career;
  index: number;
}

function CareerCard({ career, index }: CareerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link to={`/recommendations/${career.id}`} className="block h-full">
      <Card hoverable className="h-full cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold">{career.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
              {career.description}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground">Match</p>
            <p className="text-2xl font-bold text-gradient-primary">{career.confidence}%</p>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar value={career.confidence} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {career.tags.map((t) => (
            <Chip key={t} tone="primary">
              {t}
            </Chip>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" /> {career.salaryRange}
          </div>
          <div className="flex items-center gap-2 text-success">
            <TrendingUp className="h-4 w-4" />
            {career.growth.charAt(0) + career.growth.slice(1).toLowerCase()} growth
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-glass-border">
          <p className="text-xs text-muted-foreground mb-2">Key skills</p>
          <div className="flex flex-wrap gap-1.5">
            {career.skills.slice(0, 4).map((s) => (
              <Chip key={s.id}>{s.name}</Chip>
            ))}
          </div>
        </div>
      </Card>
      </Link>
    </motion.div>
  );
}

type SortKey = "match" | "demand";

export function RecommendationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const analysis = useSelector(selectAIAnalysisData);
  const loading = useSelector(selectAIAnalysisLoading);
  const { accessToken } = useSelector(selectDecryptedTokens);
  const [query, setQuery] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("match");

  useEffect(() => {
    if (!analysis && user?.userId && accessToken) {
      dispatch(getAIAnalysis(user.userId, accessToken) as any);
    }
  }, []);

  const filtered = useMemo(() => {
    const careers = analysis?.careers ?? [];
    const q = query.trim().toLowerCase();
    const list = careers.filter(
      (c) =>
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
    return list.sort((a, b) =>
      sort === "match" ? b.confidence - a.confidence : b.demand - a.demand
    );
  }, [analysis, query, sort]);

  if (loading && !analysis) return <Loader fullscreen label="Scanning the market…" />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary-glow" /> AI-curated
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">
            Career recommendations
          </h1>
          <p className="mt-2 text-muted-foreground">
            Ranked by your fit, growth potential, and live market demand.
          </p>
        </div>
      </div>

      <Card padded className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search by role or tag (e.g. AI, Strategy)"
            leftIcon={<Search className="h-4 w-4" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["match", "demand"] as SortKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className={`px-4 h-11 rounded-xl text-sm font-medium transition-all ${
                sort === k
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              Sort: {k === "match" ? "Best match" : "Demand"}
            </button>
          ))}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-lg font-medium">
            {analysis ? "No matches found" : "No analysis available"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {analysis
              ? "Try a different keyword or clear your search."
              : "Generate your career analysis from the dashboard."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((c, i) => (
            <CareerCard key={c.id} career={c} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
