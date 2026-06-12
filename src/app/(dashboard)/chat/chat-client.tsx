"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { ChatBrandContext } from "@/lib/ai/prompts/chat";

interface Brand {
  id: string;
  name: string;
  onboardingStatus: string;
  completionPercentage: number;
}

interface ChatPageProps {
  brands: Brand[];
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
  };
}

export default function ChatClient({ brands, user }: ChatPageProps) {
  const activeBrand = brands[0] ?? null;
  const [attachContext, setAttachContext] = useState(true);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const brandContext: ChatBrandContext = attachContext && activeBrand
    ? {
        brandProfile: activeBrand.name,
        audience: "",
        brandVoice: "",
        existingCampaigns: "",
        previousConversations: "",
      }
    : {
        brandProfile: "",
        audience: "",
        brandVoice: "",
        existingCampaigns: "",
        previousConversations: "",
      };

  const transport = new DefaultChatTransport({
    body: { brandContext },
  });

  const { messages, status, sendMessage, stop } = useChat({ transport });
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const target = e.target;
    target.style.height = "auto";
    target.style.height = Math.min(target.scrollHeight, 160) + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;

    sendMessage({ text }, { body: { brandContext } });
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const userInitials = user.firstName[0] + user.lastName[0];
  const userAvatarUrl =
    user.avatarUrl ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + "+" + user.lastName)}&background=138BC8&color=fff&size=32`;

  return (
    <div className="h-[calc(100vh-4rem)] flex -m-6">
      {/* Left Context Panel */}
      <div className="w-[340px] hidden lg:flex flex-col border-r border-outline-variant overflow-y-auto">
        <div className="p-4 border-b border-outline-variant">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-on-surface">
              Context Engine
            </h2>
            <button className="p-2 rounded-lg hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">
                tune
              </span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Active Brand Card */}
          {activeBrand ? (
            <div className="glass-panel p-4 glow-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-lg">
                    business
                  </span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-on-surface">
                    {activeBrand.name}
                  </h3>
                  <span className="status-pill bg-primary/15 text-primary">
                    {activeBrand.onboardingStatus === "completed"
                      ? "Active"
                      : "Onboarding"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {attachContext
                  ? "Brand context is attached to this conversation. AI responses will reference your brand profile."
                  : "Brand context is not attached. Enable it for personalized responses."}
              </p>
            </div>
          ) : (
            <div className="glass-panel p-4">
              <p className="text-sm text-on-surface-variant">
                No brands yet. Create a brand to enable context-aware conversations.
              </p>
            </div>
          )}

          {/* AI Strategist Info */}
          {activeBrand && (
            <div className="glass-panel p-4 glow-hover">
              <h3 className="font-heading text-sm font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">
                  person
                </span>
                AI Strategist
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Your AI marketing strategist uses your brand context to provide
                tailored campaign advice, messaging recommendations, and growth strategies.
              </p>
            </div>
          )}

          {/* Conversation Stats */}
          {messages.length > 0 && (
            <div>
              <h3 className="font-heading text-sm font-semibold text-on-surface mb-3">
                Conversation
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low">
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                    chat_bubble
                  </span>
                  <div>
                    <p className="text-sm text-on-surface font-medium">
                      {messages.length} message{messages.length !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      Current session
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${isLoading ? "bg-warning animate-pulse-glow" : "bg-success animate-pulse-glow"}`} />
            <span className="text-sm font-medium text-on-surface">
              {isLoading ? "AI Strategist Thinking..." : "AI Strategist Ready"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {isLoading && (
              <button
                onClick={() => stop()}
                className="p-2 rounded-lg hover:bg-surface-container-high transition-colors"
                title="Stop generating"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-xl">
                  stop_circle
                </span>
              </button>
            )}
            <button className="p-2 rounded-lg hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">
                history
              </span>
            </button>
            <button className="p-2 rounded-lg hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">
                more_vert
              </span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Date Divider */}
          <div className="flex items-center justify-center">
            <span className="bg-surface px-4 py-1 rounded-full text-xs text-on-surface-variant">
              Today
            </span>
          </div>

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">
                  auto_awesome
                </span>
              </div>
              <h3 className="font-heading text-lg font-semibold text-on-surface mb-2">
                Start a Conversation
              </h3>
              <p className="text-sm text-on-surface-variant max-w-md">
                Ask your AI strategist anything about marketing strategy, campaign ideas,
                audience targeting, or brand positioning.
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const text = msg.parts
              ?.filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
              .map((p) => p.text)
              .join("") ?? "";

            return (
              <div key={msg.id}>
                {msg.role === "assistant" ? (
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-sm">
                        auto_awesome
                      </span>
                    </div>
                    <div>
                      <div className="glass-panel rounded-2xl rounded-tl-sm px-4 py-3">
                        <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
                          {text}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 max-w-[85%] ml-auto flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={userAvatarUrl}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-surface rounded-2xl rounded-tr-sm border border-outline-variant px-4 py-3">
                      <p className="text-sm text-on-surface leading-relaxed">
                        {text}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-sm">
                  auto_awesome
                </span>
              </div>
              <div className="glass-panel rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 p-4 bg-background">
          <div className="glass-panel-strong rounded-2xl p-3">
            {/* Brand Context Toggle */}
            <div className="flex items-center gap-2 mb-2 px-1">
              <button
                type="button"
                onClick={() => setAttachContext(!attachContext)}
                className="flex items-center gap-2 text-xs"
              >
                <div
                  className={`w-8 h-4 rounded-full relative transition-colors ${
                    attachContext ? "bg-primary" : "bg-surface-container-high"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${
                      attachContext ? "left-4" : "left-0.5"
                    }`}
                  />
                </div>
                <span className="text-on-surface-variant">
                  Attach Brand Context
                </span>
                <span className="material-symbols-outlined text-primary text-sm">
                  link
                </span>
              </button>
            </div>

            {/* Textarea */}
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask your AI strategist..."
                rows={1}
                className="flex-1 bg-transparent border-0 resize-none text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-0 focus:shadow-none min-h-[40px] max-h-[160px] py-2"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="gradient-primary rounded-xl p-2.5 text-white disabled:opacity-40 hover:ai-glow transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-lg">
                  send
                </span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant mt-2 px-1">
              AI can make mistakes. Review responses carefully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
