"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  User,
  Send,
  Plus,
  Search,
  MessageSquare,
  Trash2,
  Copy,
  RefreshCw,
  Pencil,
  Check,
  X,
  Pin,
  PinOff,
  Archive,
  CopyPlus,
  MoreHorizontal,
  Download,
  Sparkles,
  Loader2,
  PanelRightClose,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore, getDateGroup, DATE_GROUP_LABELS } from "@/store/useAppStore";
import { cn, generateId } from "@/lib/utils";
import type { ChatMessage, DatabaseDialect } from "@/lib/types";
import type { DateGroup } from "@/store/useAppStore";

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

interface MessageBubbleProps {
  m: ChatMessage;
  idx: number;
  messages: ChatMessage[];
  loading: boolean;
  activeSessionId: string | undefined;
  editingMsgId: string | null;
  editContent: string;
  copiedId: string | null;
  onStartEdit: (id: string, content: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (sessionId: string, messageId: string) => void;
  onSetEditContent: (content: string) => void;
  onCopyMsg: (content: string, id: string) => Promise<void>;
  onRegenerate: () => Promise<void>;
}

function MessageBubble({
  m, idx, messages, loading, activeSessionId,
  editingMsgId, editContent, copiedId,
  onStartEdit, onCancelEdit, onSaveEdit, onSetEditContent,
  onCopyMsg, onRegenerate,
}: MessageBubbleProps) {
  const updateMessageInSession = useAppStore((s) => s.updateMessageInSession);
  const isUser = m.role === "user";
  const isEditing = editingMsgId === m.id;
  const isLastAssistant = !isUser && idx === messages.length - 1 && idx > 0;
  const editRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      editRef.current.setSelectionRange(editContent.length, editContent.length);
    }
  }, [isEditing, editContent]);

  const parts = useMemo(() => {
    if (isUser) return null;
    type TextBlock = { type: "text"; content: string };
    type CodeBlock = { type: "code"; content: string; lang?: string };
    const blocks: (TextBlock | CodeBlock)[] = [];
    const regex = /```(\w*)\n?([\s\S]*?)```/g;
    let lastIdx = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(m.content)) !== null) {
      if (match.index > lastIdx) blocks.push({ type: "text" as const, content: m.content.slice(lastIdx, match.index) });
      blocks.push({ type: "code" as const, content: (match[2] ?? "").trim(), lang: match[1] ?? "text" });
      lastIdx = match.index + (match[0] ?? "").length;
    }
    if (lastIdx < m.content.length) blocks.push({ type: "text" as const, content: m.content.slice(lastIdx) });
    return blocks.length > 0 ? blocks : [{ type: "text" as const, content: m.content }];
  }, [m.content, isUser]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group"
    >
      {isEditing ? (
        <div className="space-y-2 max-w-2xl mx-auto py-2">
          <textarea
            ref={editRef}
            value={editContent}
            onChange={(e) => onSetEditContent(e.target.value)}
            className="w-full rounded-xl border border-border bg-[#161616] px-4 py-3 text-sm text-white outline-none focus:border-accent/60 resize-none"
            rows={4}
          />
          <div className="flex items-center gap-2">
            <Button size="sm" variant="primary" onClick={() => {
              if (activeSessionId && editContent.trim()) {
                updateMessageInSession(activeSessionId, m.id, editContent.trim());
                onSaveEdit(activeSessionId, m.id);
              }
            }}>
              <Check className="h-3.5 w-3.5" /> Save
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className={cn("flex gap-3 max-w-2xl mx-auto py-3", isUser && "flex-row-reverse")}>
          <div className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
            isUser ? "bg-accent/15" : "bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20"
          )}>
            {isUser ? <User className="h-4 w-4 text-accent" /> : <Bot className="h-4 w-4 text-accent" />}
          </div>
          <div className={cn("min-w-0 flex-1", isUser && "flex flex-col items-end")}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-medium text-white/60">{isUser ? "You" : "AI Assistant"}</span>
              <span className="text-[10px] text-white/20">{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            {isUser ? (
              <div className="inline-block rounded-2xl bg-gradient-to-br from-accent to-accent/80 px-4 py-2.5 text-sm text-white leading-relaxed max-w-[85%] shadow-sm">
                {m.content}
              </div>
            ) : (
              <div className="text-sm leading-relaxed text-white/85 space-y-2">
                {parts?.map((part, pi) =>
                  part.type === "code" ? (
                    <div key={pi} className="group/code">
                      <div className="flex items-center justify-between rounded-t-xl bg-[#0d0d0d] px-4 py-1.5 border-b border-white/5">
                        <span className="text-[11px] text-white/40 font-mono">{part.lang}</span>
                        <button
                          onClick={() => onCopyMsg(part.content, `code-${pi}`)}
                          className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white transition-colors"
                        >
                          {copiedId === `code-${pi}` ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                          {copiedId === `code-${pi}` ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <pre className="rounded-b-xl bg-[#0d0d0d] px-4 py-3 overflow-x-auto text-[13px] font-mono leading-relaxed text-white/80">
                        <code>{part.content}</code>
                      </pre>
                    </div>
                  ) : (
                    <div key={pi} className="space-y-2">{renderBlocks(part.content)}</div>
                  )
                )}
              </div>
            )}
            <div className={cn(
              "flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
              isUser && "flex-row-reverse"
            )}>
              <button onClick={() => onCopyMsg(m.content, m.id)} className="rounded p-1 text-white/30 hover:text-white/70 transition-colors" title="Copy">
                {copiedId === m.id ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              {isUser && (
                <button onClick={() => onStartEdit(m.id, m.content)} className="rounded p-1 text-white/30 hover:text-white/70 transition-colors" title="Edit">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
              {isLastAssistant && (
                <button onClick={onRegenerate} disabled={loading} className="rounded p-1 text-white/30 hover:text-white/70 transition-colors" title="Regenerate">
                  <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

const SUGGESTIONS = [
  { icon: Sparkles, label: "Explain", prompt: "Explain this SQL query step by step" },
  { icon: RefreshCw, label: "Optimize", prompt: "How can I optimize this SQL query?" },
  { icon: Copy, label: "Simplify", prompt: "Can you simplify this query?" },
  { icon: Bot, label: "Debug", prompt: "Are there any issues with this query?" },
  { icon: RefreshCw, label: "Convert to MySQL", prompt: "Convert this query to MySQL" },
  { icon: RefreshCw, label: "Convert to MongoDB", prompt: "Convert this query to a MongoDB aggregation pipeline" },
];

interface ChatWorkspaceProps {
  open: boolean;
  onClose: () => void;
  sql: string;
  dialect: DatabaseDialect;
}

export function ChatWorkspace({ open, onClose, sql, dialect }: ChatWorkspaceProps) {
  const chatSessions = useAppStore((s) => s.chatSessions);
  const activeChatId = useAppStore((s) => s.activeChatId);
  const pinnedChatIds = useAppStore((s) => s.pinnedChatIds);
  const archivedChatIds = useAppStore((s) => s.archivedChatIds);
  const createChatSession = useAppStore((s) => s.createChatSession);
  const deleteChatSession = useAppStore((s) => s.deleteChatSession);
  const renameChatSession = useAppStore((s) => s.renameChatSession);
  const setActiveChatId = useAppStore((s) => s.setActiveChatId);
  const addMessageToSession = useAppStore((s) => s.addMessageToSession);
  const updateMessageInSession = useAppStore((s) => s.updateMessageInSession);
  const pinChat = useAppStore((s) => s.pinChat);
  const unpinChat = useAppStore((s) => s.unpinChat);
  const archiveChat = useAppStore((s) => s.archiveChat);
  const restoreChat = useAppStore((s) => s.restoreChat);
  const duplicateChat = useAppStore((s) => s.duplicateChat);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [menuChatId, setMenuChatId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const renameRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeSession = chatSessions.find((s) => s.id === activeChatId);
  const messages = activeSession?.messages ?? [];

  // Close menu on click outside
  useEffect(() => {
    if (!menuPos) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuPos(null);
        setMenuChatId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuPos]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages.length, loading]);

  // Focus input on active session change
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeChatId]);

  // Focus rename input
  useEffect(() => {
    if (renamingId && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renamingId]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && !showDeleteDialog && !renamingId && !editingMsgId) {
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, showDeleteDialog, renamingId, editingMsgId, onClose]);

  const send = useCallback(async (content: string) => {
    if (!content.trim() || loading) return;

    let sessionId = activeChatId;
    if (showWelcome || !sessionId) {
      sessionId = createChatSession(content.slice(0, 60));
      setShowWelcome(false);
    }

    const userMsg = addMessageToSession(sessionId, { role: "user", content });
    setInput("");
    setLoading(true);

    try {
      const currentMessages = useAppStore.getState().chatSessions.find((s) => s.id === sessionId)?.messages ?? [];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql,
          dialect,
          messages: [...currentMessages, userMsg]
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      let data: { reply?: string; error?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response from server. Please try again.");
      }
      if (!res.ok) throw new Error(data.error ?? "Chat request failed.");
      addMessageToSession(sessionId, { role: "assistant", content: data.reply ?? "No response." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : typeof err === "string" ? err : "Something went wrong. Please try again.";
      addMessageToSession(sessionId, { role: "assistant", content: msg });
    } finally {
      setLoading(false);
    }
  }, [loading, activeChatId, showWelcome, sql, dialect, addMessageToSession, createChatSession]);

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
          messages: [...messages.slice(0, -1), lastUserMsg].slice(-10).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      let data: { reply?: string; error?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response from server. Please try again.");
      }
      if (!res.ok) throw new Error(data.error ?? "Chat request failed.");
      addMessageToSession(activeSession.id, { role: "assistant", content: data.reply ?? "No response." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : typeof err === "string" ? err : "Something went wrong. Please try again.";
      addMessageToSession(activeSession.id, { role: "assistant", content: msg });
    } finally {
      setLoading(false);
    }
  }

  function handleNewChat() {
    setShowWelcome(true);
    setActiveChatId(null);
    setInput("");
  }

  function handleSelectChat(id: string) {
    setShowWelcome(false);
    setActiveChatId(id);
    setMenuPos(null);
    setMenuChatId(null);
  }

  function handleDeleteRequest(id: string) {
    setDeleteTargetId(id);
    setShowDeleteDialog(true);
    setMenuPos(null);
    setMenuChatId(null);
  }

  function confirmDelete() {
    if (deleteTargetId) deleteChatSession(deleteTargetId);
    setShowDeleteDialog(false);
    setDeleteTargetId(null);
  }

  function handleContextMenu(e: React.MouseEvent, id: string) {
    e.preventDefault();
    setMenuChatId(id);
    setMenuPos({ x: e.clientX, y: e.clientY });
  }

  async function handleCopyMsg(content: string, id: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  }

  const handleCopyAll = useCallback(async () => {
    if (!messages.length) return;
    const text = messages.map((m) => `[${m.role === "user" ? "You" : "AI"}]: ${m.content}`).join("\n\n");
    await handleCopyMsg(text, "all");
  }, [messages]);

  // Group sidebar chats
  const groupedChats = useMemo(() => {
    const visible = chatSessions.filter((s) => !archivedChatIds.includes(s.id));
    const pinned = visible.filter((s) => pinnedChatIds.includes(s.id));
    const unpinned = visible.filter((s) => !pinnedChatIds.includes(s.id));

    const searchLower = sidebarSearch.toLowerCase();
    const filter = (s: typeof visible) =>
      searchLower
        ? s.filter((c) => c.title.toLowerCase().includes(searchLower) || c.messages.some((m) => m.content.toLowerCase().includes(searchLower)))
        : s;

    const groups: { label: string; chats: typeof visible }[] = [];
    const filteredPinned = filter(pinned);
    if (filteredPinned.length > 0) groups.push({ label: "Pinned", chats: filteredPinned });

    const grouped = new Map<DateGroup, typeof unpinned>();
    filter(unpinned).forEach((s) => {
      const g = getDateGroup(s.updatedAt);
      if (!grouped.has(g)) grouped.set(g, []);
      grouped.get(g)!.push(s);
    });

    const dateOrder: DateGroup[] = ["today", "yesterday", "last7", "last30", "older"];
    dateOrder.forEach((g) => {
      const chats = grouped.get(g);
      if (chats && chats.length > 0) groups.push({ label: DATE_GROUP_LABELS[g], chats });
    });

    return groups;
  }, [chatSessions, pinnedChatIds, archivedChatIds, sidebarSearch]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Workspace Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300, mass: 0.8 }}
        className="fixed right-0 top-0 z-50 h-full w-[62vw] min-w-[500px] max-w-[1200px] flex bg-[#0f0f0f] border-l border-white/10 shadow-2xl"
      >
        {/* === SIDEBAR === */}
        <div className="w-[280px] shrink-0 border-r border-white/5 flex flex-col bg-[#0a0a0a]">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/70">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">AI Chat</span>
            </div>
            <button onClick={onClose} className="rounded-md p-1.5 text-white/30 hover:text-white/70 hover:bg-white/5 transition-all">
              <PanelRightClose className="h-4 w-4" />
            </button>
          </div>

          {/* Search */}
          <div className="px-3 pt-3 pb-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
              <input
                ref={searchRef}
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Search chats...  \u2318K"
                className="w-full rounded-lg border border-white/10 bg-white/5 pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-accent/40 focus:bg-white/[0.07] placeholder:text-white/20 transition-all"
              />
            </div>
          </div>

          {/* New Chat Button */}
          <div className="px-3 pb-2">
            <button
              onClick={handleNewChat}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-2 text-xs text-white/40 hover:text-white hover:border-accent/30 hover:bg-accent/5 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              New Chat
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-3 pb-2">
            {groupedChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                <MessageSquare className="h-6 w-6 text-white/10 mb-2" />
                <p className="text-xs text-white/20">No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {groupedChats.map((group) => (
                  <div key={group.label}>
                    <p className="text-[10px] font-medium text-white/20 uppercase tracking-wider px-1 mb-1">
                      {group.label === "Pinned" && <><Pin className="h-3 w-3 inline mr-1" />{group.label}</>}
                      {group.label !== "Pinned" && group.label}
                    </p>
                    <div className="space-y-0.5">
                      {group.chats.map((s) => {
                        const isActive = s.id === activeChatId && !showWelcome;
                        const isPinned = pinnedChatIds.includes(s.id);
                        const isRenaming = renamingId === s.id;
                        const lastMsg = s.messages[s.messages.length - 1];

                        return (
                          <div key={s.id}>
                            {isRenaming ? (
                              <div className="flex items-center gap-1 px-2 py-1.5">
                                <input
                                  ref={renameRef}
                                  value={renameValue}
                                  onChange={(e) => setRenameValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && renameValue.trim()) {
                                      renameChatSession(s.id, renameValue.trim());
                                      setRenamingId(null);
                                    }
                                    if (e.key === "Escape") setRenamingId(null);
                                  }}
                                  className="flex-1 bg-white/10 rounded px-2 py-1 text-xs text-white outline-none"
                                />
                                <button onClick={() => { if (renameValue.trim()) { renameChatSession(s.id, renameValue.trim()); setRenamingId(null); } }} className="rounded p-0.5 text-success hover:bg-success/10"><Check className="h-3 w-3" /></button>
                                <button onClick={() => setRenamingId(null)} className="rounded p-0.5 text-white/30 hover:text-white"><X className="h-3 w-3" /></button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleSelectChat(s.id)}
                                onContextMenu={(e) => handleContextMenu(e, s.id)}
                                className={cn(
                                  "w-full text-left px-2.5 py-2 rounded-lg transition-all group/item",
                                  isActive
                                    ? "bg-accent/10 border-l-2 border-accent"
                                    : "hover:bg-white/[0.04] border-l-2 border-transparent"
                                )}
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <span className={cn(
                                    "text-xs font-medium truncate flex-1",
                                    isActive ? "text-white" : "text-white/60"
                                  )}>
                                    {s.title}
                                  </span>
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => { e.stopPropagation(); handleContextMenu(e, s.id); }}
                                    className="rounded p-0.5 opacity-0 group-hover/item:opacity-100 text-white/20 hover:text-white transition-all cursor-pointer"
                                  >
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                  </div>
                                </div>
                                {lastMsg && (
                                  <p className="text-[11px] text-white/20 truncate mt-0.5">
                                    {lastMsg.role === "user" ? "You: " : ""}{lastMsg.content}
                                  </p>
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* === MAIN CHAT AREA === */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0f0f0f]">
          {showWelcome || !activeSession ? (
            /* === WELCOME/EMPTY STATE === */
            <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col items-center text-center max-w-lg">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 mb-6 shadow-lg shadow-accent/5">
                  <Bot className="h-8 w-8 text-accent" />
                </div>
                <h1 className="text-xl font-semibold text-white mb-2">How can I help you?</h1>
                <p className="text-sm text-white/40 mb-8">Ask anything — explain this query, convert databases, debug, or chat about code.</p>

                <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => send(s.prompt)}
                      className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center hover:border-accent/30 hover:bg-accent/5 transition-all group"
                    >
                      <s.icon className="h-5 w-5 text-white/30 group-hover:text-accent transition-colors" />
                      <span className="text-xs text-white/50 group-hover:text-white/80">{s.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            /* === ACTIVE CHAT === */
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-medium text-white truncate">{activeSession.title}</h2>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-mono">AI</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-white/30">{messages.length} message{messages.length !== 1 ? "s" : ""}</span>
                    <span className="text-white/10">·</span>
                    <span className="text-[11px] text-white/30">Updated {new Date(activeSession.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={handleCopyAll} className="rounded-lg px-2 py-1.5 text-white/30 hover:text-white/70 hover:bg-white/5 transition-all" title="Copy all">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button onClick={() => { setRenamingId(activeSession.id); setRenameValue(activeSession.title); }} className="rounded-lg px-2 py-1.5 text-white/30 hover:text-white/70 hover:bg-white/5 transition-all" title="Rename">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDeleteRequest(activeSession.id)} className="rounded-lg px-2 py-1.5 text-white/30 hover:text-danger hover:bg-danger/5 transition-all" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      const text = messages.map((m) => `[${m.role === "user" ? "You" : "AI"}]: ${m.content}`).join("\n\n");
                      const blob = new Blob([text], { type: "text/markdown" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${activeSession.title.slice(0, 30)}.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="rounded-lg px-2 py-1.5 text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
                    title="Export"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-1">
                  {messages.map((m, idx) => (
                    <MessageBubble
                      key={m.id}
                      m={m}
                      idx={idx}
                      messages={messages}
                      loading={loading}
                      activeSessionId={activeSession?.id}
                      editingMsgId={editingMsgId}
                      editContent={editContent}
                      copiedId={copiedId}
                      onStartEdit={(id, content) => { setEditingMsgId(id); setEditContent(content); }}
                      onCancelEdit={() => { setEditingMsgId(null); setEditContent(""); }}
                      onSaveEdit={() => { setEditingMsgId(null); setEditContent(""); }}
                      onSetEditContent={setEditContent}
                      onCopyMsg={handleCopyMsg}
                      onRegenerate={handleRegenerate}
                    />
                  ))}

                  {/* Loading state */}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 max-w-2xl mx-auto py-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
                        <Bot className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-white/60">AI Assistant</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/40">
                          <Loader2 className="h-4 w-4 animate-spin text-accent" />
                          Thinking...
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-white/5 px-4 py-3 shrink-0">
                <div className="max-w-2xl mx-auto">
                  <div className="relative flex items-end gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 focus-within:border-accent/30 focus-within:bg-white/[0.07] transition-all">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                      placeholder="Ask me anything..."
                      rows={1}
                      className="flex-1 bg-transparent text-sm text-white outline-none resize-none placeholder:text-white/20 max-h-32 scrollbar-none"
                      style={{ minHeight: "20px" }}
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => send(input)}
                        disabled={loading || !input.trim()}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 text-white shadow-lg shadow-accent/20 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-accent/30 transition-all"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/15 text-center mt-2">
                    Enter to send · Shift+Enter for new line
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* === CONTEXT MENU === */}
      {menuPos && menuChatId && (
        <div
          ref={menuRef}
          style={{ left: menuPos.x, top: menuPos.y }}
          className="fixed z-[60] w-44 rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl overflow-hidden py-1"
        >
          <button onClick={() => { setRenamingId(menuChatId); setRenameValue(chatSessions.find(s => s.id === menuChatId)?.title || ""); setMenuPos(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white/70 hover:bg-white/5 transition-colors">
            <Pencil className="h-3.5 w-3.5" /> Rename
          </button>
          <button onClick={() => { const s = chatSessions.find(c => c.id === menuChatId); if (s) { pinnedChatIds.includes(s.id) ? unpinChat(s.id) : pinChat(s.id); } setMenuPos(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white/70 hover:bg-white/5 transition-colors">
            {pinnedChatIds.includes(menuChatId) ? <><PinOff className="h-3.5 w-3.5" /> Unpin</> : <><Pin className="h-3.5 w-3.5" /> Pin</>}
          </button>
          <button onClick={() => { duplicateChat(menuChatId); setMenuPos(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white/70 hover:bg-white/5 transition-colors">
            <CopyPlus className="h-3.5 w-3.5" /> Duplicate
          </button>
          <button onClick={() => { archiveChat(menuChatId); setMenuPos(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white/70 hover:bg-white/5 transition-colors">
            <Archive className="h-3.5 w-3.5" /> Archive
          </button>
          <div className="border-t border-white/5 my-1" />
          <button onClick={() => { handleDeleteRequest(menuChatId); setMenuPos(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-danger/80 hover:bg-danger/5 transition-colors">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      )}

      {/* === DELETE CONFIRMATION DIALOG === */}
      <AnimatePresence>
        {showDeleteDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteDialog(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 mb-4">
                <Trash2 className="h-6 w-6 text-danger" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Delete Conversation?</h3>
              <p className="text-sm text-white/50 mb-6">This cannot be undone. All messages in this conversation will be permanently deleted.</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 rounded-xl bg-danger px-4 py-2.5 text-sm font-medium text-white hover:bg-danger/80 transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
