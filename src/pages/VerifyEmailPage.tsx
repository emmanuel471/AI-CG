import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MailCheck, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import { verifyEmail, resendVerification } from "@/auth-actions/AuthActions";
import { toast } from "@/hooks/use-toast";

interface FormState {
  email: string;
  code: string;
}

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const location = useLocation();

  const sessionEmail = sessionStorage.getItem("confirm_email");
  const stateEmail = (location.state as any)?.email;
  const queryEmail = params.get("email");

  const initialEmail = sessionEmail || stateEmail || queryEmail || "";

  const [form, setForm] = useState<FormState>({
    email: initialEmail,
    code: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const validate = () => {
    if (!form.email || !form.code) {
      return "Email and verification code are required.";
    }
    return "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res: any = await dispatch(verifyEmail(form.email, form.code) as any);

      if (res?.success) {
        toast({
          title: "Success",
          description: res.message || "Email verified successfully",
          variant: "success",
        });

        sessionStorage.removeItem("confirm_email");
        navigate("/dashboard");
      } else {
        toast({
          title: "Error",
          description: res?.message || "Verification failed",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!form.email) return;

    try {
      await dispatch(resendVerification(form.email) as any);

      toast({
        title: "Sent!",
        description: "Verification code resent",
        variant: "success",
      });

      setTimer(30);
      setCanResend(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to resend",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-gradient-primary p-2 rounded-xl">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">
            AI<span className="text-gradient-primary">CG</span>
          </span>
        </div>

        <Card className="shadow-elegant">
          <div className="text-center mb-6">
            <MailCheck className="mx-auto mb-2 h-6 w-6" />
            <h1 className="text-2xl font-bold">Verify your email</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the code sent to your email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {!sessionEmail && (
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            )}

            <Input
              placeholder="Verification code"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value })
              }
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              size="lg"
              loading={submitting}
              rightIcon={
                !submitting ? <ArrowRight className="h-4 w-4" /> : undefined
              }
            >
              Verify Email
            </Button>

            <div className="text-center text-sm mt-2">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary cursor-pointer font-semibold hover:underline"
                >
                  Resend code
                </button>
              ) : (
                <p className="text-muted-foreground">
                  Resend available in {timer}s
                </p>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}