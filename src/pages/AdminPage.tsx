import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Store, Server, Boxes, ArrowRight, Sparkles, GitPullRequest, Activity, Play, RotateCcw } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/ust/Card";
import { Button } from "@/components/ui/ust/Button";
import { Badge } from "@/components/ui/ust/Badge";
import { TextArea } from "@/components/ui/ust/Input";
import { AgentTimeline } from "@/components/admin/AgentTimeline";
import { useAuthStore } from "@/store/authStore";
import { useAgentRunStore } from "@/store/agentRunStore";
import { cn } from "@/lib/utils";

const AgentPlayground3D = lazy(() => import("@/components/admin/AgentPlayground3D"));

type Tab = "operations" | "infrastructure" | "playground";

export default function AdminPage() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<Tab>("operations");

  useEffect(() => {
    document.title = "Mission Control — USTBite";
  }, []);

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Card className="p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-md bg-brand-navy text-white flex items-center justify-center">
              <Activity className="size-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Mission Control</h1>
              <p className="text-sm text-text-secondary">
                Operations, infrastructure and live agent activity for USTBite
              </p>
            </div>
          </div>
          <Badge>{user?.fullName ?? "Admin"}</Badge>
        </Card>

        <div className="mt-6 flex gap-1 border-b border-border-soft overflow-x-auto" role="tablist">
          {([
            { k: "operations", label: "Operations", icon: Store },
            { k: "infrastructure", label: "Infrastructure", icon: Server },
            { k: "playground", label: "Agent Playground", icon: Boxes },
          ] as { k: Tab; label: string; icon: typeof Store }[]).map(({ k, label, icon: Icon }) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2 border-b-2 -mb-px whitespace-nowrap",
                tab === k ? "border-brand-amber text-foreground" : "border-transparent text-text-secondary hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "operations" && <OperationsTab />}
          {tab === "infrastructure" && <InfrastructureTab onOpenPlayground={() => setTab("playground")} />}
          {tab === "playground" && <PlaygroundTab />}
        </div>
      </div>
    </PageWrapper>
  );
}

const OperationsTab = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <Card className="p-5 space-y-2">
      <Store className="size-5 text-brand-amber" />
      <h2 className="font-semibold text-foreground">Restaurants & Menus</h2>
      <p className="text-sm text-text-secondary">Manage campus restaurants, menu items and availability.</p>
      <Button asChild variant="subtle" size="sm"><Link to="/restaurants">View restaurants <ArrowRight className="size-4" /></Link></Button>
    </Card>
    <Card className="p-5 space-y-2">
      <Activity className="size-5 text-brand-amber" />
      <h2 className="font-semibold text-foreground">Orders</h2>
      <p className="text-sm text-text-secondary">Live order volume, status breakdown and fulfillment health.</p>
    </Card>
    <Card className="p-5 space-y-2">
      <Sparkles className="size-5 text-brand-amber" />
      <h2 className="font-semibold text-foreground">AI Ordering</h2>
      <p className="text-sm text-text-secondary">Usage of the AI ordering assistant across departments.</p>
    </Card>
  </div>
);

const InfrastructureTab = ({ onOpenPlayground }: { onOpenPlayground: () => void }) => {
  const [intent, setIntent] = useState("");
  const start = useAgentRunStore((s) => s.start);
  const status = useAgentRunStore((s) => s.status);
  const source = useAgentRunStore((s) => s.source);
  const running = status === "running";

  const submit = () => {
    if (!intent.trim()) return;
    start("infra", { intent: intent.trim() });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="p-5 space-y-3 lg:col-span-2">
        <div className="flex items-center gap-2">
          <Server className="size-5 text-brand-navy" />
          <h2 className="font-semibold text-foreground">Infrastructure Co-pilot</h2>
        </div>
        <p className="text-sm text-text-secondary">
          Describe an infrastructure change in plain English. CloudOS agents design the change,
          generate Terraform, run a security review and open a pull request against USTBite&apos;s infra.
        </p>
        <TextArea
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          rows={3}
          placeholder="e.g. Add a read replica to the order-service database and scale restaurant-service to 3 replicas"
        />
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-text-secondary">Connects to CloudOS · agent pipeline</span>
          <Button variant="amber" onClick={submit} loading={running} disabled={running || !intent.trim()}>
            <GitPullRequest className="size-4" />
            Submit intent
          </Button>
        </div>

        {(source === "infra" || running) && (
          <div className="pt-2 border-t border-border-soft">
            <AgentTimeline />
            <Button variant="ghost" size="sm" className="mt-2" onClick={onOpenPlayground}>
              <Boxes className="size-4" /> Watch in 3D
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="font-semibold text-foreground">Agent pipeline</h2>
        <ol className="space-y-2">
          {["architecture-design", "terraform-generation", "security-review", "deployment-review"].map((step, i) => (
            <li key={step} className="flex items-center gap-3 text-sm">
              <span className="size-6 rounded-full bg-surface-soft text-text-secondary flex items-center justify-center text-xs font-semibold">{i + 1}</span>
              <span className="text-foreground">{step}</span>
            </li>
          ))}
        </ol>
        <p className="text-xs text-text-secondary">
          Demo runs a simulated pipeline. Wire to the live CloudOS SSE endpoint to drive this from real agents.
        </p>
      </Card>
    </div>
  );
};

const PlaygroundTab = () => {
  const start = useAgentRunStore((s) => s.start);
  const reset = useAgentRunStore((s) => s.reset);
  const status = useAgentRunStore((s) => s.status);
  const running = status === "running";

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-5 border-b border-border-soft flex items-center gap-2 flex-wrap">
        <Boxes className="size-5 text-brand-navy" />
        <h2 className="font-semibold text-foreground">Agent Playground</h2>
        <Badge>3D</Badge>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="subtle" size="sm" disabled={running} onClick={() => start("ordering", { intent: "Add 2 masala dosas under ₹200" })}>
            <Play className="size-4" /> Ordering agent
          </Button>
          <Button variant="amber" size="sm" disabled={running} onClick={() => start("infra", { intent: "Add a read replica to order-service DB" })}>
            <Play className="size-4" /> Infra agents
          </Button>
          <Button variant="ghost" size="sm" onClick={reset} aria-label="Reset">
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>
      <Suspense fallback={<div className="h-[460px] flex items-center justify-center bg-[#070b14] text-white/60 text-sm">Loading 3D scene…</div>}>
        <AgentPlayground3D />
      </Suspense>
      <div className="p-4 text-xs text-text-secondary border-t border-border-soft">
        Watch every agent across USTBite work in real time — ordering agents and infrastructure agents flow through the same factory. Drag to orbit, scroll to zoom.
      </div>
    </Card>
  );
};
