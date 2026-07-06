"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FavoriteItem, HistoryItem, ChatSession, ChatMessage } from "@/lib/types";
import { generateId } from "@/lib/utils";

export type DateGroup = "today" | "yesterday" | "last7" | "last30" | "older";

export function getDateGroup(timestamp: number): DateGroup {
  const now = Date.now();
  const diff = now - timestamp;
  const day = 86400000;
  if (diff < day) return "today";
  if (diff < 2 * day) return "yesterday";
  if (diff < 7 * day) return "last7";
  if (diff < 30 * day) return "last30";
  return "older";
}

export const DATE_GROUP_LABELS: Record<DateGroup, string> = {
  today: "Today",
  yesterday: "Yesterday",
  last7: "Previous 7 Days",
  last30: "Previous 30 Days",
  older: "Older",
};

interface AppState {
  history: HistoryItem[];
  favorites: FavoriteItem[];
  chatSessions: ChatSession[];
  activeChatId: string | null;
  pinnedChatIds: string[];
  archivedChatIds: string[];

  addHistory: (item: Omit<HistoryItem, "id" | "createdAt">) => HistoryItem;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
  addFavorite: (item: HistoryItem, folder?: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  createChatSession: (title?: string) => string;
  deleteChatSession: (id: string) => void;
  renameChatSession: (id: string, title: string) => void;
  setActiveChatId: (id: string | null) => void;
  addMessageToSession: (sessionId: string, message: Omit<ChatMessage, "id" | "createdAt">) => ChatMessage;
  updateMessageInSession: (sessionId: string, messageId: string, content: string) => void;
  clearChatSessions: () => void;
  getSessionMessages: (sessionId: string) => ChatMessage[];

  pinChat: (id: string) => void;
  unpinChat: (id: string) => void;
  archiveChat: (id: string) => void;
  restoreChat: (id: string) => void;
  duplicateChat: (id: string) => string | null;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      history: [],
      favorites: [],
      chatSessions: [],
      activeChatId: null,
      pinnedChatIds: [],
      archivedChatIds: [],

      addHistory: (item) => {
        const newItem: HistoryItem = { ...item, id: generateId(), createdAt: Date.now() };
        set((state) => ({ history: [newItem, ...state.history].slice(0, 100) }));
        return newItem;
      },
      removeHistory: (id) => set((state) => ({ history: state.history.filter((h) => h.id !== id) })),
      clearHistory: () => set({ history: [] }),

      addFavorite: (item, folder = "General") => {
        if (get().favorites.some((f) => f.id === item.id)) return;
        set((state) => ({ favorites: [{ ...item, folder }, ...state.favorites] }));
      },
      removeFavorite: (id) => set((state) => ({ favorites: state.favorites.filter((f) => f.id !== id) })),
      isFavorite: (id) => get().favorites.some((f) => f.id === id),

      createChatSession: (title) => {
        const id = generateId();
        const session: ChatSession = {
          id,
          title: title || `Chat ${get().chatSessions.length + 1}`,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          chatSessions: [session, ...state.chatSessions],
          activeChatId: id,
        }));
        return id;
      },

      deleteChatSession: (id) =>
        set((state) => {
          const remaining = state.chatSessions.filter((s) => s.id !== id);
          return {
            chatSessions: remaining,
            archivedChatIds: state.archivedChatIds.filter((a) => a !== id),
            pinnedChatIds: state.pinnedChatIds.filter((p) => p !== id),
            activeChatId: state.activeChatId === id ? remaining[0]?.id ?? null : state.activeChatId,
          };
        }),

      renameChatSession: (id, title) =>
        set((state) => ({
          chatSessions: state.chatSessions.map((s) => (s.id === id ? { ...s, title, updatedAt: Date.now() } : s)),
        })),

      setActiveChatId: (id) => set({ activeChatId: id }),

      addMessageToSession: (sessionId, message) => {
        const newMsg: ChatMessage = { ...message, id: generateId(), createdAt: Date.now() };
        set((state) => ({
          chatSessions: state.chatSessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: [...(s.messages.length >= 50 ? s.messages.slice(-49) : s.messages), newMsg],
                  updatedAt: Date.now(),
                  title: s.messages.length === 0 && message.role === "user" ? message.content.slice(0, 60) : s.title,
                }
              : s
          ),
        }));
        return newMsg;
      },

      updateMessageInSession: (sessionId, messageId, content) =>
        set((state) => ({
          chatSessions: state.chatSessions.map((s) =>
            s.id === sessionId
              ? { ...s, messages: s.messages.map((m) => (m.id === messageId ? { ...m, content } : m)), updatedAt: Date.now() }
              : s
          ),
        })),

      clearChatSessions: () => set({ chatSessions: [], activeChatId: null, pinnedChatIds: [], archivedChatIds: [] }),

      getSessionMessages: (sessionId) => get().chatSessions.find((s) => s.id === sessionId)?.messages ?? [],

      pinChat: (id) =>
        set((state) => ({
          pinnedChatIds: state.pinnedChatIds.includes(id) ? state.pinnedChatIds : [id, ...state.pinnedChatIds],
        })),

      unpinChat: (id) =>
        set((state) => ({ pinnedChatIds: state.pinnedChatIds.filter((p) => p !== id) })),

      archiveChat: (id) =>
        set((state) => ({
          archivedChatIds: state.archivedChatIds.includes(id) ? state.archivedChatIds : [...state.archivedChatIds, id],
          activeChatId: state.activeChatId === id ? state.chatSessions.find((s) => s.id !== id && !state.archivedChatIds.includes(s.id))?.id ?? null : state.activeChatId,
        })),

      restoreChat: (id) =>
        set((state) => ({ archivedChatIds: state.archivedChatIds.filter((a) => a !== id) })),

      duplicateChat: (id) => {
        const original = get().chatSessions.find((s) => s.id === id);
        if (!original) return null;
        const newId = generateId();
        const copy: ChatSession = {
          id: newId,
          title: original.title + " (copy)",
          messages: original.messages.map((m) => ({ ...m, id: generateId(), createdAt: Date.now() })),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ chatSessions: [copy, ...state.chatSessions], activeChatId: newId }));
        return newId;
      },
    }),
    { name: "sqlmind-storage" }
  )
);
