import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, DollarSign, TrendingUp, Sparkles, Layers } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import {
  selectUser,
  selectAIAnalysisData,
  selectAIAnalysisLoading,
  selectDecryptedTokens,
  type AppDispatch,
} from "@/store/store";
import { getAIAnalysis } from "@/auth-actions/AuthActions";

import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { ProgressBar } from "@/components/ProgressBar";
import { Loader } from "@/components/Loader";

export function CareerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectUser);
  const analysis = useSelector(selectAIAnalysisData);
  const loading = useSelector(selectAIAnalysisLoading);
  const { accessToken } = useSelector(selectDecryptedTokens);

  useEffect(() => {
    if (!analysis && user?.userId && accessToken) {
      dispatch(getAIAnalysis(user.userId, accessToken) as any);
    }
  }, []);

  if (loading && !analysis) return <Loader fullscreen label="Loading career details…" />;

  const career = analysis?.careers.find((c) => c.id === id);

  if (!career) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <p className="text-lg font-medium">Career not found.</p>
        <button
          onClick={() => navigate("/recommendations")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to recommendations
        </button>
      </div>
    );
  }

  const growthLabel =
    career.growth.charAt(0) + career.growth.slice(1).toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Back button */}
      <button
        onClick={() => navigate("/recommendations")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to recommendations
      </button>

      {/* Header card */}
      <Card padded>
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-primary-glow" /> AI recommendation
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {career.title}
            </h1>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground">Match score</p>
            <p className="text-5xl font-bold text-gradient-primary leading-none mt-1">
              {career.confidence}%
            </p>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar value={career.confidence} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {career.tags.map((t) => (
            <Chip key={t} tone="primary">
              {t}
            </Chip>
          ))}
        </div>
      </Card>

      {/* Description card */}
      <Card padded>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Overview
        </h2>
        <p className="text-base leading-relaxed">{career.description}</p>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Card padded className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5 text-primary-glow" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Salary range</p>
            <p className="text-lg font-semibold mt-0.5">{career.salaryRange}</p>
          </div>
        </Card>

        <Card padded className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Growth outlook</p>
            <p className="text-lg font-semibold mt-0.5 text-success">
              {growthLabel}
            </p>
          </div>
        </Card>
      </div>

      {/* Skills card */}
      <Card padded>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Required skills
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {career.skills.map((s) => (
            <Chip key={s.id}>{s.name}</Chip>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
