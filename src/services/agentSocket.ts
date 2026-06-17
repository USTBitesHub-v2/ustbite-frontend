import type { HistoryMessage, ToolCallInfo } from "./agentService";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

function buildWsUrl(path: string): string {
  const isAbsolute = /^https?:\/\//.test(API_BASE);
  if (isAbsolute) {
    return API_BASE.replace(/^http/, "ws") + path;
  }
  const proto = window.location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${window.location.host}${API_BASE}${path}`;
}

function readAuthToken(): string {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1] || ""
  );
}

interface StreamEvent {
  type: "tool_start" | "tool_result" | "text_delta" | "done" | "error";
  tool?: string;
  args?: Record<string, unknown>;
  result?: unknown;
  text?: string;
  tool_calls_made?: ToolCallInfo[];
  message?: string;
}

export interface StreamHandlers {
  onToolStart?: (tool: string) => void;
  onToolResult?: (tool: string, args: Record<string, unknown>, result: unknown) => void;
  onTextDelta?: (text: string) => void;
  onDone?: (toolCallsMade: ToolCallInfo[]) => void;
  onError?: (message: string) => void;
}

/** Opens a streaming chat connection; returns a cleanup function to close it early. */
export function streamChat(
  message: string,
  sessionId: string,
  history: HistoryMessage[],
  handlers: StreamHandlers,
): () => void {
  const ws = new WebSocket(buildWsUrl("/agent/ws/chat"));

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        message,
        session_id: sessionId,
        history,
        token: readAuthToken(),
      }),
    );
  };

  ws.onmessage = (evt) => {
    let data: StreamEvent;
    try {
      data = JSON.parse(evt.data);
    } catch {
      return;
    }
    switch (data.type) {
      case "tool_start":
        if (data.tool) handlers.onToolStart?.(data.tool);
        break;
      case "tool_result":
        if (data.tool) handlers.onToolResult?.(data.tool, data.args ?? {}, data.result);
        break;
      case "text_delta":
        if (data.text) handlers.onTextDelta?.(data.text);
        break;
      case "done":
        handlers.onDone?.(data.tool_calls_made ?? []);
        ws.close();
        break;
      case "error":
        handlers.onError?.(data.message || "Something went wrong.");
        ws.close();
        break;
    }
  };

  ws.onerror = () => {
    handlers.onError?.("Connection error. Please try again.");
  };

  return () => {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  };
}
