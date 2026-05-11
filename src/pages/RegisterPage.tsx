import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User as UserIcon, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { RegisterRequest } from "@/types";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import { register } from "@/auth-actions/AuthActions";
import { toast } from "@/hooks/use-toast";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";

    if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email.";

    if (!passwordRegex.test(form.password))
      e.password =
        "Password must be 8+ chars, include uppercase, lowercase, number & special char.";

    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      const payload: RegisterRequest = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      };

      const res: any = await dispatch(register(payload) as any);

      if (res?.success) {
        toast({
          title: "Registered!",
          description: res.message,
          variant: "success",
        });
        sessionStorage.setItem("confirm_email", form.email);
        navigate("/verify-email", { state: { email: form.email } });
      } else {
        toast({
          title: "Error",
          description: res?.message || "Registration failed",
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
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
            <h1 className="text-2xl font-bold">Create your profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              60 seconds to your first match.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <Input
              placeholder="First name"
              leftIcon={<UserIcon className="h-4 w-4" />}
              value={form.firstName}
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
              error={errors.firstName}
            />

            <Input
              placeholder="Last name"
              leftIcon={<UserIcon className="h-4 w-4" />}
              value={form.lastName}
              onChange={(e) =>
                setForm({ ...form, lastName: e.target.value })
              }
              error={errors.lastName}
            />

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

            <Input
              type="password"
              placeholder="Password"
              leftIcon={<Lock className="h-4 w-4" />}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              error={errors.password}
            />

            <Input
              type="password"
              placeholder="Repeat password"
              leftIcon={<Lock className="h-4 w-4" />}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              className="w-full cursor-pointer"
              size="lg"
              loading={submitting}
              rightIcon={
                !submitting ? <ArrowRight className="h-4 w-4" /> : undefined
              }
            >
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-glow hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}