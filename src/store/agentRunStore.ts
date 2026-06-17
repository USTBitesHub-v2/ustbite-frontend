import { create } from "zustand";
import type { AgentEvent, AgentSource, NodeStatus, WorkflowDef } from "@/types/agentEvents";
import { workflowBySource } from "@/agents/workflows";
import { runSimulation } from "@/agents/simulator";

export interface ToolEventUI {
  id: string;
  nodeId: string;
  tool: string;
  status: "called" | "completed";
  ts: number;
}

export type RunStatus = "idle" | "running" | "completed" | "failed";

interface AgentRunState {
  source: AgentSource | null;
  workflow: WorkflowDef | null;
  runId: string | null;
  status: RunStatus;
  nodeStatus: Record<string, NodeStatus>;
  activeNodeId: string | null;
  prevNodeId: string | null;
  chosenRoute: string | null;
  events: AgentEvent[];
  toolEvents: ToolEventUI[];
  summary: string | null;
  cancelFn: (() => void) | null;
  start: (source: AgentSource, ctx?: { intent?: string }) => void;
  apply: (e: AgentEvent) => void;
  reset: () => void;
}

function freshNodeStatus(wf: WorkflowDef): Record<string, NodeStatus> {
  const m: Record<string, NodeStatus> = {};
  for (const n of wf.nodes) m[n.id] = "idle";
  return m;
}

export const useAgentRunStore = create<AgentRunState>((set, get) => ({
  source: null,
  workflow: null,
  runId: null,
  status: "idle",
  nodeStatus: {},
  activeNodeId: null,
  prevNodeId: null,
  chosenRoute: null,
  events: [],
  toolEvents: [],
  summary: null,
  cancelFn: null,

  start: (source, ctx = {}) => {
    get().cancelFn?.();
    const wf = workflowBySource[source];
    set({
      source,
      workflow: wf,
      runId: null,
      status: "running",
      nodeStatus: freshNodeStatus(wf),
      activeNodeId: null,
      prevNodeId: null,
      chosenRoute: null,
      events: [],
      toolEvents: [],
      summary: null,
    });
    const cancel = runSimulation(source, ctx, (e) => get().apply(e));
    set({ cancelFn: cancel });
  },

  apply: (e) => {
    set((s) => {
      const next: Partial<AgentRunState> = {
        events: [...s.events, e],
        runId: e.runId,
      };
      const nodeStatus = { ...s.nodeStatus };
      switch (e.type) {
        case "run.started":
          next.status = "running";
          if (e.message) next.summary = e.message;
          break;
        case "node.started":
          if (e.nodeId) {
            nodeStatus[e.nodeId] = "active";
            next.prevNodeId = s.activeNodeId;
            next.activeNodeId = e.nodeId;
            next.nodeStatus = nodeStatus;
          }
          break;
        case "node.completed":
          if (e.nodeId) {
            nodeStatus[e.nodeId] = "done";
            next.nodeStatus = nodeStatus;
          }
          break;
        case "node.failed":
          if (e.nodeId) {
            nodeStatus[e.nodeId] = "failed";
            next.nodeStatus = nodeStatus;
          }
          next.status = "failed";
          break;
        case "route.decided":
          next.chosenRoute = e.route ?? null;
          break;
        case "tool.called":
          if (e.nodeId && e.toolCall) {
            next.toolEvents = [
              ...s.toolEvents,
              { id: `${e.seq}-${e.toolCall.tool}`, nodeId: e.nodeId, tool: e.toolCall.tool, status: "called" as const, ts: e.ts },
            ].slice(-12);
          }
          break;
        case "tool.completed":
          if (e.nodeId && e.toolCall) {
            next.toolEvents = [
              ...s.toolEvents,
              { id: `${e.seq}-${e.toolCall.tool}-c`, nodeId: e.nodeId, tool: e.toolCall.tool, status: "completed" as const, ts: e.ts },
            ].slice(-12);
          }
          break;
        case "run.completed":
          next.status = "completed";
          next.activeNodeId = null;
          if (e.message) next.summary = e.message;
          break;
        case "run.failed":
          next.status = "failed";
          if (e.message) next.summary = e.message;
          break;
      }
      return next;
    });
  },

  reset: () => {
    get().cancelFn?.();
    set({
      source: null,
      workflow: null,
      runId: null,
      status: "idle",
      nodeStatus: {},
      activeNodeId: null,
      prevNodeId: null,
      chosenRoute: null,
      events: [],
      toolEvents: [],
      summary: null,
      cancelFn: null,
    });
  },
}));
