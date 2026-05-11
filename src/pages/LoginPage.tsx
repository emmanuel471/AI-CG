import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Mail, Lock, ArrowRight, Sparkles, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import { login } from "@/auth-actions/AuthActions";
import { toast } from "@/hooks/use-toast";
import { LoginRequest } from "@/types";

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = "Enter a valid email.";
    }

    if (!form.password.trim()) {
      e.password = "Password is required.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      const payload: LoginRequest = {
        email: form.email,
        password: form.password,
      };

      const res: any = await dispatch(login(payload) as any);

      if (res?.success) {
        toast({
          title: "Welcome back!",
          description: res.message,
          variant: "success",
        });

         window.location.href = "/dashboard";
      } else {
        if (
          res?.message?.toLowerCase().includes("email not verified")
        ) {
          sessionStorage.setItem("confirm_email", form.email);

          navigate("/verify-email", {
            state: { email: form.email },
          });

          return;
        }
        toast({
          title: "Error",
          description: res?.message || "Login failed",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const message = error?.message || "";

      if (message.toLowerCase().includes("email not verified")) {
        sessionStorage.setItem("confirm_email", form.email);

        navigate("/verify-email", {
          state: { email: form.email },
        });
        return;
      }

      toast({
        title: "Error",
        description: message || "Something went wrong",
        variant: "destructive",
      });
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
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to continue your journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <Input
              type="email"
              placeholder="Email"
              leftIcon={<Mail className="h-4 w-4" />}
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              error={errors.email}
            />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              leftIcon={<Lock className="h-4 w-4" />}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              error={errors.password}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              size="lg"
              loading={submitting}
              rightIcon={
                !submitting ? <ArrowRight className="h-4 w-4" /> : undefined
              }
            >
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="text-primary-glow cursor-pointer hover:underline">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}