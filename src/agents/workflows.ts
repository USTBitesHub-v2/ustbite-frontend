import type { AgentSource, WorkflowDef } from "@/types/agentEvents";

export const infraWorkflow: WorkflowDef = {
  id: "cloudos-terraform-pipeline",
  source: "infra",
  title: "Infrastructure Pipeline",
  entry: "architecture-design",
  nodes: [
    { id: "architecture-design", label: "Architecture", kind: "sequential" },
    { id: "terraform-generation", label: "Terraform", kind: "sequential" },
    { id: "security-review", label: "Security", kind: "sequential" },
    { id: "deployment-review", label: "Deployment", kind: "sequential" },
  ],
  edges: [
    { from: "architecture-design", to: "terraform-generation" },
    { from: "terraform-generation", to: "security-review" },
    { from: "security-review", to: "deployment-review" },
  ],
};

export const orderingWorkflow: WorkflowDef = {
  id: "ustbites-food-order",
  source: "ordering",
  title: "AI Ordering",
  entry: "router",
  nodes: [
    { id: "router", label: "Supervisor", kind: "supervisor" },
    { id: "food_discovery", label: "Food Discovery", kind: "leaf" },
    { id: "order_management", label: "Order Mgmt", kind: "leaf" },
    { id: "general", label: "General", kind: "leaf" },
  ],
  edges: [
    { from: "router", to: "food_discovery" },
    { from: "router", to: "order_management" },
    { from: "router", to: "general" },
  ],
};

export const workflowBySource: Record<AgentSource, WorkflowDef> = {
  infra: infraWorkflow,
  ordering: orderingWorkflow,
};

export type Vec3 = [number, number, number];

export function computeLayout(wf: WorkflowDef): Record<string, Vec3> {
  const depth: Record<string, number> = { [wf.entry]: 0 };
  const queue = [wf.entry];
  while (queue.length) {
    const cur = queue.shift() as string;
    for (const e of wf.edges) {
      if (e.from === cur && depth[e.to] === undefined) {
        depth[e.to] = depth[cur] + 1;
        queue.push(e.to);
      }
    }
  }
  for (const n of wf.nodes) if (depth[n.id] === undefined) depth[n.id] = 0;

  const columns: Record<number, string[]> = {};
  for (const n of wf.nodes) {
    const d = depth[n.id];
    (columns[d] ||= []).push(n.id);
  }

  const colSpacing = 4.2;
  const rowSpacing = 3.4;
  const depths = Object.keys(columns).map(Number);
  const maxDepth = Math.max(...depths);

  const pos: Record<string, Vec3> = {};
  for (const d of depths) {
    const ids = columns[d];
    const x = d * colSpacing - (maxDepth * colSpacing) / 2;
    ids.forEach((id, i) => {
      const z = i * rowSpacing - ((ids.length - 1) * rowSpacing) / 2;
      pos[id] = [x, 0, z];
    });
  }
  return pos;
}
