import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/ust/Card";
import { Button } from "@/components/ui/ust/Button";
import { Field, TextField, SelectField } from "@/components/ui/ust/Input";
import { Logo } from "@/components/layout/Logo";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { DEPARTMENTS } from "@/utils/constants";
import { toast } from "sonner";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({
    fullName: "", employeeId: "", email: "", department: "IT",
    floor: "", password: "", confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof typeof form>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const user = await authService.register({
        name: form.fullName,
        employee_id: form.employeeId,
        email: form.email,
        password: form.password,
        department: form.department,
        floor_number: form.floor,
      });
      setUser(user);
      toast.success("Account created. Welcome to USTBite!");
      navigate("/restaurants");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper hideFooter>
      <div className="min-h-[calc(100vh-4rem-3px)] bg-surface-soft py-12 px-4 flex items-start justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <div className="inline-flex"><Logo /></div>
            <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Create your account</h1>
            <p className="mt-1.5 text-sm text-text-secondary">Use your UST employee credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name" htmlFor="fullName">
              <TextField id="fullName" required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Aarav Kumar" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Employee ID" htmlFor="empId">
                <TextField id="empId" required value={form.employeeId} onChange={(e) => update("employeeId", e.target.value)} placeholder="UST-12345" />
              </Field>
              <Field label="Floor Number" htmlFor="floor">
                <TextField id="floor" required value={form.floor} onChange={(e) => update("floor", e.target.value)} placeholder="5" />
              </Field>
            </div>
            <Field label="Email" htmlFor="email">
              <TextField id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@ust.com" />
            </Field>
            <Field label="Department" htmlFor="department">
              <SelectField id="department" value={form.department} onChange={(e) => update("department", e.target.value)}>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </SelectField>
            </Field>
            <Field label="Password" htmlFor="password" hint="At least 6 characters">
              <div className="relative">
                <TextField id="password" type={showPw ? "text" : "password"} required value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" className="pr-10" />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground" aria-label="Toggle password visibility">
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>
            <Field label="Confirm Password" htmlFor="confirm" error={error ?? undefined}>
              <TextField id="confirm" type={showPw ? "text" : "password"} required value={form.confirm} onChange={(e) => update("confirm", e.target.value)} placeholder="••••••••" />
            </Field>

            <Button type="submit" variant="amber" className="w-full" loading={submitting}>
              {submitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link to="/login" className="text-accent-red font-semibold hover:underline">Sign in</Link>
          </p>
        </Card>
      </div>
    </PageWrapper>
  );
}
