import type { AgentEvent, AgentEventType, AgentSource, ToolCall } from "@/types/agentEvents";
import { workflowBySource } from "./workflows";

type RawEvent = {
  type: AgentEventType;
  nodeId?: string;
  agent?: string;
  route?: string;
  toolCall?: ToolCall;
  message?: string;
};

type Step = { delay: number; ev: RawEvent };

const uuid = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `run-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

function infraSteps(intent: string): Step[] {
  const steps: Step[] = [];
  steps.push({ delay: 0, ev: { type: "run.started", message: intent } });

  const node = (id: string, agent: string, work: Step[]) => {
    steps.push({ delay: 700, ev: { type: "node.started", nodeId: id, agent } });
    steps.push(...work);
    steps.push({ delay: 800, ev: { type: "node.completed", nodeId: id, agent } });
  };

  const tool = (id: string, tool: string, args: Record<string, unknown>, result: unknown): Step[] => [
    { delay: 600, ev: { type: "tool.called", nodeId: id, toolCall: { tool, args } } },
    { delay: 900, ev: { type: "tool.completed", nodeId: id, toolCall: { tool, args, result } } },
  ];

  node("architecture-design", "architecture-design",
    tool("architecture-design", "list_golden_templates", { domain: "eks" }, { templates: ["eks-service", "rds-postgres", "elasticache-redis"] }));
  node("terraform-generation", "terraform-generation",
    tool("terraform-generation", "fetch_template_files", { template: "rds-postgres" }, { files: ["main.tf", "variables.tf", "outputs.tf"] }));
  node("security-review", "security-review",
    tool("security-review", "list_compliance_findings", { framework: "CIS" }, { findings: 0, status: "pass" }));
  node("deployment-review", "deployment-review", []);

  steps.push({
    delay: 900,
    ev: { type: "run.completed", message: "Opened pull request against ustbites-infra · estimated +$24/mo" },
  });
  return steps;
}

function orderingSteps(message: string): Step[] {
  const route = "food_discovery";
  const steps: Step[] = [];
  steps.push({ delay: 0, ev: { type: "run.started", message } });
  steps.push({ delay: 600, ev: { type: "node.started", nodeId: "router", agent: "router" } });
  steps.push({ delay: 700, ev: { type: "route.decided", nodeId: "router", route, message: `Routed to ${route}` } });
  steps.push({ delay: 500, ev: { type: "node.completed", nodeId: "router", agent: "router" } });

  steps.push({ delay: 600, ev: { type: "node.started", nodeId: route, agent: route } });
  const tcalls: Array<[string, Record<string, unknown>, unknown]> = [
    ["search_restaurants", { cuisine: "South Indian", max_price: 200 }, { restaurants: ["Annapoorna", "Saravana"] }],
    ["search_menu", { restaurant: "Annapoorna", query: "masala dosa" }, { items: ["Masala Dosa ₹120"] }],
    ["add_to_cart", { item_id: "dosa-1", qty: 2, price: 120 }, { ok: true, cart_total: 240 }],
  ];
  for (const [tool, args, result] of tcalls) {
    steps.push({ delay: 700, ev: { type: "tool.called", nodeId: route, toolCall: { tool, args } } });
    steps.push({ delay: 850, ev: { type: "tool.completed", nodeId: route, toolCall: { tool, args, result } } });
  }
  steps.push({ delay: 700, ev: { type: "node.completed", nodeId: route, agent: route } });
  steps.push({ delay: 700, ev: { type: "run.completed", message: "Added 2 × Masala Dosa from Annapoorna to cart" } });
  return steps;
}

export function runSimulation(
  source: AgentSource,
  ctx: { intent?: string },
  onEvent: (e: AgentEvent) => void,
): () => void {
  const runId = uuid();
  const wf = workflowBySource[source];
  const steps = source === "infra" ? infraSteps(ctx.intent ?? "") : orderingSteps(ctx.intent ?? "");

  const timers: ReturnType<typeof setTimeout>[] = [];
  let seq = 0;
  let elapsed = 0;

  for (const step of steps) {
    elapsed += step.delay;
    const t = setTimeout(() => {
      onEvent({
        runId,
        source,
        seq: seq++,
        ts: Date.now(),
        ...step.ev,
      });
    }, elapsed);
    timers.push(t);
  }

  void wf;
  return () => timers.forEach(clearTimeout);
}
