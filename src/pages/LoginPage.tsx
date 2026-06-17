import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/ust/Card";
import { Button } from "@/components/ui/ust/Button";
import { Field, TextField } from "@/components/ui/ust/Input";
import { Logo } from "@/components/layout/Logo";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const enterDemoAdmin = () => {
    setUser({
      id: "demo-admin",
      fullName: "Demo Admin",
      email: "admin@ust.com",
      employeeId: "ADMIN-001",
      department: "Management",
      floor: "10",
      role: "admin",
    });
    toast.success("Entered demo as Admin");
    navigate("/admin");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await authService.login({ email, password });
      setUser(user);
      toast.success(`Welcome back, ${user.fullName.split(" ")[0]}`);
      navigate("/restaurants");
    } catch {
      toast.error("Sign-in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper hideFooter>
      <div className="min-h-[calc(100vh-4rem-3px)] bg-surface-soft py-12 px-4 flex items-start sm:items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-7">
            <div className="inline-flex"><Logo /></div>
            <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-1.5 text-sm text-text-secondary">Sign in with your UST employee account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email" htmlFor="email">
              <TextField id="email" type="email" required value={email} autoComplete="email"
                onChange={(e) => setEmail(e.target.value)} placeholder="you@ust.com" />
            </Field>
            <Field label="Password" htmlFor="password">
              <div className="relative">
                <TextField
                  id="password" type={showPw ? "text" : "password"} required value={password}
                  autoComplete="current-password" onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className="pr-10"
                />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}>
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>

            <Button type="submit" variant="amber" className="w-full" loading={submitting}>
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            New to USTBite?{" "}
            <Link to="/register" className="text-accent-red font-semibold hover:underline">Create an account</Link>
          </p>

          <div className="mt-6 pt-5 border-t border-border-soft">
            <Button type="button" variant="subtle" className="w-full" onClick={enterDemoAdmin}>
              Explore Mission Control (demo admin)
            </Button>
            <p className="mt-2 text-center text-[11px] text-text-secondary">
              Opens the admin console with simulated agents — no backend required.
            </p>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}

const GoogleIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#EA4335" d="M12 5c1.6 0 3 .55 4.1 1.6l3-3C17.1 1.7 14.7.7 12 .7 7.3.7 3.3 3.4 1.4 7.3l3.5 2.7C5.7 7 8.6 5 12 5z"/>
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.7-2.3 3.5l3.6 2.8c2.1-2 3.7-4.9 3.7-8.4z"/>
    <path fill="#FBBC05" d="M4.9 14.3c-.2-.6-.4-1.3-.4-2 0-.7.1-1.4.4-2L1.4 7.6C.5 9 0 10.4 0 12s.5 3 1.4 4.4l3.5-2.7z"/>
    <path fill="#34A853" d="M12 23.3c3.2 0 5.9-1.1 7.8-2.9l-3.6-2.8c-1 .7-2.3 1.1-4.2 1.1-3.4 0-6.3-2-7.1-4.7L1.4 16.4C3.3 20.3 7.3 23.3 12 23.3z"/>
  </svg>
);
