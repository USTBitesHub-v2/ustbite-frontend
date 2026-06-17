import { apiClient } from "./apiClient";

export interface ToolCallInfo {
  tool: string;
  args: Record<string, unknown>;
  result: unknown;
}

export interface ChatResponse {
  response: string;
  tool_calls_made: ToolCallInfo[];
}

export interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export const agentService = {
  chat: async (message: string, sessionId: string, history: HistoryMessage[] = []): Promise<ChatResponse> => {
    const res = await apiClient.post<ChatResponse>(
      "/agent/chat",
      {
        message,
        session_id: sessionId,
        history,
      },
      {
        timeout: 120000,
      },
    );
    return res.data;
  },
};
