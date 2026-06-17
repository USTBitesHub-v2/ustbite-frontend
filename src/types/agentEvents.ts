export type AgentSource = "infra" | "ordering";

export type AgentEventType =
  | "run.started"
  | "node.started"
  | "node.completed"
  | "node.failed"
  | "route.decided"
  | "tool.called"
  | "tool.completed"
  | "run.completed"
  | "run.failed";

export interface ToolCall {
  tool: string;
  args?: Record<string, unknown>;
  result?: unknown;
}

export interface AgentEvent {
  runId: string;
  source: AgentSource;
  seq: number;
  ts: number;
  type: AgentEventType;
  nodeId?: string;
  agent?: string;
  route?: string;
  toolCall?: ToolCall;
  message?: string;
}

export type NodeKind = "sequential" | "supervisor" | "leaf";

export interface WorkflowNode {
  id: string;
  label: string;
  kind: NodeKind;
}

export interface WorkflowEdge {
  from: string;
  to: string;
}

export interface WorkflowDef {
  id: string;
  source: AgentSource;
  title: string;
  entry: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export type NodeStatus = "idle" | "active" | "done" | "failed";
