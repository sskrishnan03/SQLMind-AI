"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Send,
  MessagesSquare,
  Loader2,
  Copy,
  RefreshCw,
  Pencil,
  Trash2,
  Check,
  X,
  Bot,
  User,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import type { DatabaseDialect } from "@/lib/types";

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
    if (match[1]) parts.push(<code key={parts.length} className="rounded bg-white/10 px-1.5 py-0.5 text-[13px] font-mono text-accent">{match[1].slice(1, -1)}</code>);
    else if (match[2]) parts.push(<strong key={parts.length} className="font-semibold text-white">{match[2].slice(2, -2)}</strong>);
    else if (match[3]) parts.push(<em key={parts.length} className="italic text-white/90">{match[3].slice(1, -1)}</em>);
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

function renderBlocks(text: string): React.ReactNode[] {
  const blocks = text.split(/\n\n+/);
  const elements: React.ReactNode[] = [];
  let inList: "ul" | "ol" | null = null;
  let listItems: React.ReactNode[] = [];

  function flushList() {
    if (inList && listItems.length > 0) {
      elements.push(
        inList === "ul" ? (
          <ul key={elements.length} className="list-disc space-y-1 pl-5">{listItems}</ul>
        ) : (
          <ol key={elements.length} className="list-decimal space-y-1 pl-5">{listItems}</ol>
        )
      );
      listItems = [];
      inList = null;
    }
  }

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    const lines = trimmed.split("\n").filter((l) => l.trim());

    if (lines.every((l) => /^[-*]\s/.test(l))) {
      if (inList !== "ul") { flushList(); inList = "ul"; }
      for (const line of lines) {
        listItems.push(<li key={`li-${listItems.length}`} className="text-sm text-white/85 leading-relaxed">{renderInline(line.replace(/^[-*]\s/, ""))}</li>);
      }
    } else if (lines.every((l) => /^\d+[.)]\s/.test(l))) {
      if (inList !== "ol") { flushList(); inList = "ol"; }
      for (const line of lines) {
        listItems.push(<li key={`li-${listItems.length}`} className="text-sm text-white/85 leading-relaxed">{renderInline(line.replace(/^\d+[.)]\s/, ""))}</li>);
      }
    } else {
      flushList();
      elements.push(
        <p key={elements.length} className="whitespace-pre-wrap break-words text-sm text-white/85 leading-relaxed">
          {renderInline(trimmed)}
        </p>
      );
    }
  }
  flushList();
  return elements;
}

const SUGGESTIONS = ["Why this JOIN?", "Explain the HAVING clause", "How do I optimize this?"];

interface ChatPanelProps {
  sql: string;
  dialect: DatabaseDialect;
}

export function ChatPanel({ sql, dialect }: ChatPanelProps) {
  const chatSessions = useAppStore((s) => s.chatSessions);
  const activeChatId = useAppStore((s) => s.activeChatId);
  const createChatSession = useAppStore((s) => s.createChatSession);
  const deleteChatSession = useAppStore((s) => s.deleteChatSession);
  const renameChatSession = useAppStore((s) => s.renameChatSession);
  const setActiveChatId = useAppStore((s) => s.setActiveChatId);
  const addMessageToSession = useAppStore((s) => s.addMessageToSession);
  const updateMessageInSession = useAppStore((s) => s.updateMessageInSession);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const renameRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSession = chatSessions.find((s) => s.id === activeChatId);
  const messages = activeSession?.messages ?? [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus();
      editRef.current.setSelectionRange(editContent.length, editContent.length);
    }
  }, [editingId, editContent]);

  useEffect(() => {
    if (renaming && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renaming]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeChatId]);

  const send = useCallback(async (content: string) => {
    if (!content.trim() || loading) return;

    let sessionId = activeChatId;
    if (!sessionId) {
      sessionId = createChatSession(content.slice(0, 60));
    }

    const userMsg = addMessageToSession(sessionId, { role: "user", content });
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql,
          dialect,
          messages: [...(chatSessions.find(s => s.id === sessionId)?.messages ?? []), userMsg]
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chat request failed.");

      addMessageToSession(sessionId, {
        role: "assistant",
        content: data.reply,
      });
    } catch (err) {
      addMessageToSession(sessionId, {
        role: "assistant",
        content: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }, [loading, activeChatId, sql, dialect, addMessageToSession, createChatSession, chatSessions]);

  async function handleRegenerate() {
    if (!activeSession || messages.length < 2 || loading) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql,
          dialect,
          messages: [...messages.slice(0, -1), lastUserMsg]
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chat request failed.");

      addMessageToSession(activeSession.id, { role: "assistant", content: data.reply });
    } catch (err) {
      addMessageToSession(activeSession.id, {
        role: "assistant",
        content: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(messageId: string, content: string) {
    setEditingId(messageId);
    setEditContent(content);
  }

  function handleSaveEdit() {
    if (!editingId || !activeSession || !editContent.trim()) return;
    updateMessageInSession(activeSession.id, editingId, editContent.trim());
    setEditingId(null);
    setEditContent("");
  }

  function handleCancelEdit() { setEditingId(null); setEditContent(""); }

  async function handleCopy(content: string, id: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  }

  async function handleCopyAll() {
    if (!messages.length) return;
    const text = messages.map((m) => `[${m.role === "user" ? "You" : "AI"}]: ${m.content}`).join("\n\n");
    await handleCopy(text, "all");
  }

  function handleNewChat() {
    if (chatSessions.some((s) => s.messages.length === 0)) {
      const empty = chatSessions.find((s) => s.messages.length === 0);
      if (empty) { setActiveChatId(empty.id); return; }
    }
    createChatSession();
    setRenaming(false);
    setDeleteConfirm(false);
  }

  function handleDelete() {
    if (deleteConfirm) {
      if (activeChatId) deleteChatSession(activeChatId);
      setDeleteConfirm(false);
    } else {
      setDeleteConfirm(true);
    }
  }

  function startRename() {
    if (!activeSession) return;
    setRenameValue(activeSession.title);
    setRenaming(true);
  }

  function saveRename() {
    if (activeChatId && renameValue.trim()) {
      renameChatSession(activeChatId, renameValue.trim());
    }
    setRenaming(false);
  }

  function handleSuggestionClick(suggestion: string) { send(suggestion); }

  const hasAssistantMessages = messages.some((m) => m.role === "assistant");

  return (
    <div className="flex h-full flex-col bg-surface">
      {/* Session Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border px-3 py-2 scrollbar-none">
        <div className="flex items-center gap-1 mr-1 shrink-0">
          <MessagesSquare className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-medium text-white mr-1">Ask AI</span>
        </div>
        {chatSessions.map((s) => (
          <button
            key={s.id}
            onClick={() => { setActiveChatId(s.id); setDeleteConfirm(false); setRenaming(false); }}
            className={cn(
              "shrink-0 rounded-md px-2 py-1 text-xs font-medium transition-all",
              s.id === activeChatId
                ? "bg-accent/15 text-accent"
                : "text-muted hover:text-white hover:bg-white/5"
            )}
          >
            {s.title.length > 15 ? s.title.slice(0, 15) + "…" : s.title}
          </button>
        ))}
        <button
          onClick={handleNewChat}
          className="shrink-0 rounded-md px-2 py-1 text-xs text-muted hover:text-white hover:bg-white/5 transition-all flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          New
        </button>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
              <Bot className="h-5.5 w-5.5 text-accent" />
            </div>
            <div className="text-center">
              <p className="text-sm text-white font-medium">Ask about this query</p>
              <p className="text-xs text-muted mt-0.5">Get explanations, optimizations, and more</p>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-all hover:border-accent/40 hover:text-white hover:bg-accent/5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 py-3 space-y-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-border">
              <span className="text-[11px] text-muted">{messages.length} message{messages.length !== 1 ? "s" : ""}</span>
              <div className="flex items-center gap-0.5">
                <button onClick={handleCopyAll} className="rounded-md px-2 py-1 text-[11px] text-muted hover:text-white hover:bg-white/5 transition-all flex items-center gap-1" title="Copy all">
                  {copiedId === "all" ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                  Copy
                </button>
                {hasAssistantMessages && (
                  <button onClick={handleRegenerate} disabled={loading} className="rounded-md px-2 py-1 text-[11px] text-muted hover:text-white hover:bg-white/5 transition-all flex items-center gap-1" title="Regenerate last">
                    <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
                    Regenerate
                  </button>
                )}
                {/* Rename */}
                {!renaming ? (
                  <button onClick={startRename} className="rounded-md px-2 py-1 text-[11px] text-muted hover:text-white hover:bg-white/5 transition-all" title="Rename">
                    <Pencil className="h-3 w-3" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1 rounded-md bg-accent/10 px-2 py-1">
                    <input
                      ref={renameRef}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveRename(); if (e.key === "Escape") setRenaming(false); }}
                      className="w-20 bg-transparent text-[11px] text-white outline-none"
                    />
                    <button onClick={saveRename} className="rounded p-0.5 text-success hover:bg-success/10 transition-colors"><Check className="h-3 w-3" /></button>
                    <button onClick={() => setRenaming(false)} className="rounded p-0.5 text-muted hover:text-white transition-colors"><X className="h-3 w-3" /></button>
                  </div>
                )}
                {/* Delete */}
                {deleteConfirm ? (
                  <div className="flex items-center gap-1 rounded-md bg-danger/10 px-2 py-1">
                    <span className="text-[11px] text-danger font-medium">Delete?</span>
                    <button onClick={handleDelete} className="rounded p-0.5 text-danger hover:bg-danger/20 transition-colors"><Check className="h-3 w-3" /></button>
                    <button onClick={() => setDeleteConfirm(false)} className="rounded p-0.5 text-muted hover:text-white transition-colors"><X className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <button onClick={handleDelete} className="rounded-md px-2 py-1 text-[11px] text-muted hover:text-danger hover:bg-danger/5 transition-all" title="Delete chat">
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            {messages.map((m, idx) => (
              <div key={m.id} className="group">
                {editingId === m.id ? (
                  <div className="space-y-2 pl-9 py-2">
                    <textarea
                      ref={editRef}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full rounded-lg border border-border bg-[#161616] px-3 py-2 text-sm text-white outline-none focus:border-accent/60 resize-none"
                      rows={3}
                    />
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="primary" onClick={handleSaveEdit}><Check className="h-3.5 w-3.5" /> Save</Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 py-2">
                    <div className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5",
                      m.role === "user" ? "bg-accent/15" : "bg-[#161616] border border-border"
                    )}>
                      {m.role === "user" ? <User className="h-3.5 w-3.5 text-accent" /> : <Bot className="h-3.5 w-3.5 text-accent" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-white/70">{m.role === "user" ? "You" : "AI"}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleCopy(m.content, m.id)} className="rounded p-0.5 text-muted hover:text-white transition-colors" title="Copy">
                            {copiedId === m.id ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                          </button>
                          {m.role === "user" && (
                            <button onClick={() => handleEdit(m.id, m.content)} className="rounded p-0.5 text-muted hover:text-white transition-colors" title="Edit">
                              <Pencil className="h-3 w-3" />
                            </button>
                          )}
                          {m.role === "assistant" && idx === messages.length - 1 && idx > 0 && (
                            <button onClick={handleRegenerate} disabled={loading} className="rounded p-0.5 text-muted hover:text-white transition-colors" title="Regenerate">
                              <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-sm leading-relaxed text-white/85 whitespace-pre-wrap break-words">{m.role === "assistant" ? renderBlocks(m.content) : m.content}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2.5 pl-9 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#161616] border border-border">
                  <Bot className="h-3.5 w-3.5 text-accent" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-border px-4 py-3">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 rounded-lg border border-border bg-[#161616] px-3 py-2 text-sm text-white outline-none focus:border-accent/60 placeholder:text-muted/60 transition-colors"
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
