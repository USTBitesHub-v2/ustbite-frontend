import { CheckCircle2, Loader2, Circle, XCircle, Wrench, GitBranch } from "lucide-react";
import { useAgentRunStore } from "@/store/agentRunStore";
import { cn } from "@/lib/utils";
import type { NodeStatus } from "@/types/agentEvents";

const statusIcon = (status: NodeStatus) => {
  switch (status) {
    case "active":
      return <Loader2 className="size-4 text-brand-amber animate-spin" />;
    case "done":
      return <CheckCircle2 className="size-4 text-success" />;
    case "failed":
      return <XCircle className="size-4 text-accent-red" />;
    default:
      return <Circle className="size-4 text-text-secondary/50" />;
  }
};

export const AgentTimeline = () => {
  const workflow = useAgentRunStore((s) => s.workflow);
  const nodeStatus = useAgentRunStore((s) => s.nodeStatus);
  const toolEvents = useAgentRunStore((s) => s.toolEvents);
  const status = useAgentRunStore((s) => s.status);
  const summary = useAgentRunStore((s) => s.summary);
  const chosenRoute = useAgentRunStore((s) => s.chosenRoute);

  if (!workflow) {
    return <p className="text-sm text-text-secondary">Submit an intent to start the agent pipeline.</p>;
  }

  return (
    <div className="space-y-3">
      <ol className="space-y-2">
        {workflow.nodes.map((node) => {
          const ns = nodeStatus[node.id] ?? "idle";
          const tools = toolEvents.filter((t) => t.nodeId === node.id);
          const dimmed = chosenRoute && node.kind === "leaf" && node.id !== chosenRoute && node.id !== "router";
          return (
            <li
              key={node.id}
              className={cn(
                "rounded-md border px-3 py-2.5 transition-colors",
                ns === "active" ? "border-brand-amber bg-brand-amber-soft" : "border-border-soft bg-white",
                dimmed && "opacity-40",
              )}
            >
              <div className="flex items-center gap-2.5">
                {statusIcon(ns)}
                <span className="text-sm font-medium text-foreground">{node.label}</span>
                {node.kind === "supervisor" && chosenRoute && (
                  <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
                    <GitBranch className="size-3" /> {chosenRoute}
                  </span>
                )}
                <span className="ml-auto text-xs uppercase tracking-wide text-text-secondary">{ns}</span>
              </div>
              {tools.length > 0 && (
                <div className="mt-2 pl-6 flex flex-wrap gap-1.5">
                  {tools.map((t) => (
                    <span
                      key={t.id}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-mono",
                        t.status === "completed"
                          ? "bg-success/10 text-[hsl(142_71%_28%)]"
                          : "bg-surface-soft text-text-secondary",
                      )}
                    >
                      <Wrench className="size-3" />
                      {t.tool}
                    </span>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {summary && (
        <div
          className={cn(
            "rounded-md px-3 py-2.5 text-sm",
            status === "completed" ? "bg-success/10 text-[hsl(142_71%_28%)]" : "bg-surface-soft text-text-secondary",
          )}
        >
          {summary}
        </div>
      )}
    </div>
  );
};
