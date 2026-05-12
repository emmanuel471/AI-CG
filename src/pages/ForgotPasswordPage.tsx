import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Mail, Lock, KeyRound, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import { forgotPassword, resetPassword } from "@/auth-actions/AuthActions";
import { toast } from "@/hooks/use-toast";

type Step = "request" | "reset";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

interface FormErrors {
  email?: string;
  code?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validateRequest = (): boolean => {
    const e: FormErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateReset = (): boolean => {
    const e: FormErrors = {};
    if (!code.trim()) e.code = "Code is required.";
    if (!passwordRegex.test(newPassword))
      e.newPassword = "Password must be 8+ chars, include uppercase, lowercase, number & special char.";
    if (newPassword !== confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateRequest()) return;
    setSubmitting(true);
    try {
      const res: any = await dispatch(forgotPassword(email) as any);
      if (res?.success) {
        toast({ title: "Code sent", description: res.message || "Check your inbox.", variant: "success" });
        setStep("reset");
      } else {
        toast({ title: "Error", description: res?.message || "Failed to send code.", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateReset()) return;
    setSubmitting(true);
    try {
      const res: any = await dispatch(resetPassword({ email, code, newPassword }) as any);
      if (res?.success) {
        toast({ title: "Password reset", description: res.message || "You can now sign in.", variant: "success" });
        navigate("/login");
      } else {
        toast({ title: "Error", description: res?.message || "Reset failed.", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        <Link to="/" className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-gradient-primary p-2 rounded-xl">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">
            AI<span className="text-gradient-primary">CG</span>
          </span>
        </Link>

        <Card className="shadow-elegant">
          <div className="text-center mb-6">
            <KeyRound className="mx-auto mb-2 h-6 w-6" />
            <h1 className="text-2xl font-bold">
              {step === "request" ? "Forgot password?" : "Reset your password"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === "request"
                ? "Enter your email and we'll send you a reset code."
                : `A code was sent to ${email}`}
            </p>
          </div>

          {step === "request" ? (
            <form onSubmit={handleRequest} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                leftIcon={<Mail className="h-4 w-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <Button
                type="submit"
                className="w-full cursor-pointer"
                size="lg"
                loading={submitting}
                rightIcon={!submitting ? <ArrowRight className="h-4 w-4" /> : undefined}
              >
                Send reset code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <Input
                placeholder="Reset code"
                leftIcon={<KeyRound className="h-4 w-4" />}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                error={errors.code}
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={errors.newPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                size="lg"
                loading={submitting}
                rightIcon={!submitting ? <ArrowRight className="h-4 w-4" /> : undefined}
              >
                Reset password
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remember it?{" "}
            <Link to="/login" className="text-primary-glow cursor-pointer hover:underline">
              Back to sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
