import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, ChevronDown } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/ust/Button";
import { agentService } from "@/services/agentService";
import { streamChat } from "@/services/agentSocket";
import { cartService } from "@/services/cartService";
import type { ToolCallInfo, HistoryMessage } from "@/services/agentService";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ── types ───────────────────────────────────────────────────────── */
type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  text: string;
  toolCalls?: ToolCallInfo[];
  loading?: boolean;
  statusText?: string;
}

const TOOL_LABELS: Record<string, string> = {
  search_restaurants: "Searching restaurants…",
  search_menu: "Browsing the menu…",
  search_menu_semantic: "Finding dishes that match…",
  add_to_cart: "Adding to your cart…",
  get_cart: "Checking your cart…",
  remove_from_cart: "Updating your cart…",
  place_order: "Placing your order…",
  get_order_status: "Checking order status…",
};

const uuid = () =>
  typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });

const SUGGESTIONS = [
  "Show me South Indian restaurants",
  "What's in my cart?",
  "Add 2 masala dosas to cart",
  "Where is my latest order?",
  "Find veg options under ₹150",
];

let sessionId = uuid();

/* ── component ───────────────────────────────────────────────────── */
export default function AiAssistantPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const setFromServer = useCartStore((s) => s.setFromServer);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm your USTBites AI assistant 🍽️ I can help you browse restaurants, add items to your cart, place orders, and track deliveries. What can I get you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingRef = useRef<string>("");

  useEffect(() => {
    document.title = "USTBite — AI Assistant";
    if (!isAuthenticated) {
      toast.error("Please sign in to use the AI assistant");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    if (loading) {
      pendingRef.current = text;
      setInput("");
      return;
    }

    const userMsg: Message = { id: uuid(), role: "user", text };
    const assistantId = uuid();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      text: "",
      loading: true,
      statusText: "Thinking…",
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setLoading(true);

    const history: HistoryMessage[] = messages
      .filter((m) => !m.loading && m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.text }));

    const finishLoading = () => {
      setLoading(false);
      const pending = pendingRef.current;
      pendingRef.current = "";
      if (pending) {
        sendMessage(pending);
      } else {
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };

    const fallbackToRest = async () => {
      try {
        const res = await agentService.chat(text, sessionId, history);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  loading: false,
                  text: res.response,
                  toolCalls: res.tool_calls_made?.length ? res.tool_calls_made : undefined,
                }
              : m,
          ),
        );
        if (res.tool_calls_made?.some((tc) => tc.tool === "add_to_cart")) {
          cartService.get().then((items) => setFromServer(items)).catch(() => {});
        }
      } catch (err: unknown) {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        const axiosErr = err as { response?: { status?: number; data?: { detail?: string } } };
        const status = axiosErr?.response?.status;
        const detail = axiosErr?.response?.data?.detail;
        if (status === 429) {
          toast.warning(detail || "AI is busy — please wait a moment and try again.");
        } else {
          toast.error(detail || "Agent unavailable. Please try again.");
        }
      } finally {
        finishLoading();
      }
    };

    let receivedAny = false;

    streamChat(text, sessionId, history, {
      onToolStart: (tool) => {
        receivedAny = true;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, statusText: TOOL_LABELS[tool] || `Using ${tool}…` } : m,
          ),
        );
      },
      onToolResult: (tool) => {
        if (tool === "add_to_cart") {
          cartService.get().then((items) => setFromServer(items)).catch(() => {});
        }
      },
      onTextDelta: (delta) => {
        receivedAny = true;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, loading: false, text: m.text + delta } : m)),
        );
      },
      onDone: (toolCallsMade) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, loading: false, toolCalls: toolCallsMade.length ? toolCallsMade : undefined }
              : m,
          ),
        );
        finishLoading();
      },
      onError: (message) => {
        if (receivedAny) {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, loading: false } : m)),
          );
          toast.error(message);
          finishLoading();
        } else {
          fallbackToRest();
        }
      },
    });
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <PageWrapper hideFooter>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Header */}
        <div className="border-b border-border-soft bg-white px-4 py-3 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-brand-navy flex items-center justify-center flex-shrink-0">
            <Sparkles className="size-4 text-brand-amber" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">USTBites AI</h1>
            <p className="text-xs text-text-secondary">Powered by Qwen 2.5 · Order with natural language</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-text-secondary">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions (only when no user messages yet) */}
        {messages.length === 1 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2 justify-center">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                disabled={loading}
                className="px-3 py-1.5 rounded-full border border-border-soft text-xs text-text-secondary bg-surface-soft hover:bg-brand-amber-soft hover:border-brand-amber hover:text-brand-navy transition-colors disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div className="border-t border-border-soft bg-white px-4 py-3">
          <div className="max-w-3xl mx-auto flex gap-2 items-center">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="e.g. Add 2 masala dosas from Annapoorna…"
              className="flex-1 px-4 py-2.5 rounded-lg border border-border-soft bg-surface-soft text-sm text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-amber focus:border-transparent transition"
            />
            <Button
              variant="amber"
              size="sm"
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="px-4 py-2.5"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
          <p className="text-center text-[10px] text-text-secondary mt-2">
            AI can make mistakes. Verify cart before placing orders.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

/* ── message bubble ───────────────────────────────────────────────── */
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const [showTools, setShowTools] = useState(false);

  return (
    <div className={cn("flex gap-3 max-w-3xl mx-auto", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "size-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
          isUser ? "bg-brand-navy" : "bg-brand-amber-soft border border-brand-amber/30",
        )}
      >
        {isUser ? (
          <User className="size-4 text-white" />
        ) : (
          <Bot className="size-4 text-brand-amber" />
        )}
      </div>

      {/* Bubble */}
      <div className={cn("flex flex-col gap-1.5 max-w-[80%]", isUser && "items-end")}>
        {msg.loading ? (
          <div className="px-4 py-3 rounded-2xl bg-surface-soft border border-border-soft flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin text-brand-amber flex-shrink-0" />
              <span className="text-sm text-text-secondary">{msg.statusText || msg.text || "Thinking…"}</span>
            </div>
            <div className="flex gap-1 pl-6">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 rounded-full bg-brand-amber animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
              isUser
                ? "bg-brand-navy text-white rounded-tr-sm"
                : "bg-white border border-border-soft text-foreground rounded-tl-sm shadow-card",
            )}
          >
            {msg.text}
          </div>
        )}

        {/* Tool calls disclosure */}
        {msg.toolCalls && msg.toolCalls.length > 0 && (
          <button
            onClick={() => setShowTools((v) => !v)}
            className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-foreground transition-colors"
          >
            <ChevronDown
              className={cn("size-3 transition-transform", showTools && "rotate-180")}
            />
            {msg.toolCalls.length} tool{msg.toolCalls.length > 1 ? "s" : ""} used
          </button>
        )}
        {showTools && msg.toolCalls && (
          <div className="w-full space-y-1">
            {msg.toolCalls.map((tc, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-lg bg-surface-soft border border-border-soft text-[11px] font-mono text-text-secondary"
              >
                <span className="text-brand-navy font-semibold">{tc.tool}</span>
                {" · "}
                {JSON.stringify(tc.args)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
