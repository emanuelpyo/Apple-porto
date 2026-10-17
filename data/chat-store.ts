// Chat message store.
//
// Reads/writes localStorage through a tiny external store so the component can
// use useSyncExternalStore. This keeps server and client initial renders
// identical (both start from the deterministic welcome message) while still
// persisting history on the device. See R-27 (states) and hydration safety.
"use client"

export interface ChatMessage {
  id: string
  sender: "user" | "bot"
  text: string
  timestamp: Date
}

const STORAGE_KEY = "deryl_chat_messages"

export function welcomeMessage(shortName: string): ChatMessage {
  return {
    id: "welcome-msg",
    sender: "bot",
    text: `Halo! Gue asisten AI ${shortName}. Ada yang bisa gue bantu soal portofolio, pengalaman, atau project ${shortName}?`,
    timestamp: new Date(0),
  }
}

type Listener = () => void

let listeners: Listener[] = []
let cache: ChatMessage[] | null = null

function read(): ChatMessage[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as ChatMessage[]
    return parsed.map((msg) => ({ ...msg, timestamp: new Date(msg.timestamp) }))
  } catch {
    return []
  }
}

function getSnapshot(): ChatMessage[] {
  if (cache === null) {
    cache = read()
  }
  return cache
}

export { getSnapshot }

// Server snapshot must be stable and identical across calls.
const EMPTY: ChatMessage[] = []

function getServerSnapshot(): ChatMessage[] {
  return EMPTY
}

export function subscribe(listener: Listener): () => void {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function emit() {
  listeners.forEach((l) => l())
}

export function setMessages(messages: ChatMessage[]): void {
  cache = messages
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }
  emit()
}

export function clearMessages(): void {
  cache = []
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
  emit()
}

export { getServerSnapshot }
