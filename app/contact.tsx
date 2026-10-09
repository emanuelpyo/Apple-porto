"use client"
import { useState, useEffect, useRef, useSyncExternalStore } from "react"
import FadeDown from "@/components/animations/FadeDown"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { profile } from "@/data/profile"
import { contactLinks } from "@/data/contact"
import { welcomeMessage, subscribe, getSnapshot, getServerSnapshot, setMessages, clearMessages, type ChatMessage } from "@/data/chat-store"

export default function Contact() {
  const [isOpenChat, setIsOpenChat] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const storedMessages = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const chatMessages = storedMessages.length > 0 ? storedMessages : [welcomeMessage(profile.shortName)]
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [configured, setConfigured] = useState<boolean | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const setInitialWelcomeMessage = () => {
    clearMessages()
  }

  useEffect(() => {
    if (isOpenChat) {
      scrollToBottom()
      inputRef.current?.focus()
    }
  }, [storedMessages, isOpenChat])

  // Close the chat overlay with Escape.
  useEffect(() => {
    if (!isOpenChat) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpenChat(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [isOpenChat])

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isChatLoading) return

    const userText = chatInput.trim()
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: new Date(),
    }

    const historyMessages = chatMessages.filter((msg) => msg.id !== "welcome-msg")
    const history = [
      {
        role: "system" as const,
        content: `System Context: Kamu adalah Deryl Assistant, asisten AI pribadi untuk ${profile.name} (${profile.shortName}). Jawab pertanyaan pengunjung website portofolio dengan ramah, profesional, dan ringkas dalam bahasa Indonesia.

Informasi tentang ${profile.shortName}:
1. Profil:
   - Nama: ${profile.name}
   - Peran: Web Developer dan IT Support, lulusan Informatika
   - Lokasi: ${profile.location}
   - Email: ${profile.email}
   - WhatsApp: ${profile.phoneLabel}
   - LinkedIn: ${profile.linkedin}
   - GitHub: ${profile.github}
   - Pendidikan: ${profile.education}
2. Pengalaman:
   - Web Developer di Lawkey (bergabung dalam tim)
   - Web Developer Intern di PT Primadaya Plastisindo Tbk (sedang menjalani magang)
3. Keahlian: HTML, CSS, JavaScript, TypeScript, React, Tailwind, PHP, Laravel, Node.js, MySQL, Python, TensorFlow.

Aturan: Jawab langsung ke intinya, jangan menambahkan informasi yang tidak ada di profil ini, dan selalu bersikap ramah.`,
      },
      ...historyMessages.map((msg) => ({
        role: msg.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      })),
    ]

    setMessages([...chatMessages, userMsg])
    setChatInput("")
    setIsChatLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText, history }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const contentType = response.headers.get("Content-Type") || ""
      if (contentType.includes("application/json")) {
        const data = await response.json()
        throw new Error(data.message || "Error dari server")
      }

      setConfigured(true)
      setIsChatLoading(false)

      const botMsgId = (Date.now() + 1).toString()
      setMessages([...chatMessages, userMsg, { id: botMsgId, sender: "bot", text: "", timestamp: new Date() }])

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let botText = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          botText += decoder.decode(value, { stream: true })
          setMessages([...chatMessages, userMsg, { id: botMsgId, sender: "bot", text: botText, timestamp: new Date() }])
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan."
      // The route tells us clearly when the AI is not configured, so the UI can
      // surface that honestly instead of pretending a reply happened.
      if (message.toLowerCase().includes("konfigurasi") || message.toLowerCase().includes("not configured")) {
        setConfigured(false)
      }
      setMessages([
        ...chatMessages,
        userMsg,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: message.toLowerCase().includes("konfigurasi")
            ? "Asisten AI belum dikonfigurasi pada server ini, jadi gue belum bisa menjawab otomatis. Silakan hubungi Deryl lewat email, WhatsApp, atau LinkedIn di bagian kontak."
            : `Maaf, terjadi kesalahan koneksi atau server AI. (${message})`,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsChatLoading(false)
    }
  }

  return (
    <section id="contacts" className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default bg-background relative overflow-hidden border-t border-text-secondary/10">
      <FadeDown>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24 w-full text-left">
          <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">Get In Touch</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">Contact Me</h3>
        </div>
      </FadeDown>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <FadeDown delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-background border border-text-secondary/20 rounded-3xl p-8 md:p-10 shadow-xl flex flex-col justify-center">
              <p className="text-2xl md:text-3xl font-black text-text-primary tracking-tight mb-4">Ada proyek atau peluang yang ingin dibicarakan?</p>
              <p className="text-base text-text-secondary font-medium leading-relaxed mb-8">
                Terbuka untuk kolaborasi, konsultasi, maupun tawaran penuh waktu. Kirim pesan lewat salah satu kanal di samping, atau ngobrol langsung dengan asisten AI di pojok kanan bawah.
              </p>
              <button
                type="button"
                onClick={() => setIsOpenChat(true)}
                className="self-start cursor-pointer text-sm font-bold bg-text-primary text-background px-6 py-3 rounded-xl flex items-center gap-3 hover:-translate-y-1 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-5 5v-5z" />
                </svg>
                Tanya Asisten AI
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group bg-background border border-text-secondary/20 rounded-2xl p-5 flex flex-col justify-between gap-6 hover:border-text-primary hover:bg-text-secondary/5 transition-all duration-300 shadow-sm hover:shadow-md min-h-[130px]"
                >
                  <div className="w-12 h-12 rounded-full bg-text-secondary/10 flex items-center justify-center text-text-primary group-hover:scale-110 transition-transform duration-300">{link.icon}</div>
                  <div>
                    <h4 className="text-base font-bold text-text-primary">{link.label}</h4>
                    <p className="text-xs font-medium text-text-secondary truncate">{link.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </FadeDown>
      </div>

      {/* Floating chat launcher */}
      <div className="fixed bottom-6 right-6 lg:bottom-12 lg:right-12 z-40">
        <button
          onClick={() => setIsOpenChat(true)}
          className="group bg-text-primary text-background p-4 md:p-5 rounded-full shadow-2xl hover:-translate-y-2 transition-all duration-300 flex items-center justify-center relative border-4 border-background"
          aria-label={`Buka asisten AI ${profile.shortName}`}
        >
          <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-2 -right-2 flex h-5 w-5 md:h-6 md:w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-5 w-5 md:h-6 md:w-6 bg-thirdary text-text-primary border border-text-secondary/20 text-[10px] md:text-xs font-bold items-center justify-center">AI</span>
          </span>
        </button>
      </div>

      {/* Chat overlay */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-0 transition-all duration-500 ${isOpenChat ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-background/90 backdrop-blur-xl transition-opacity duration-500 ${isOpenChat ? "opacity-100" : "opacity-0"}`} onClick={() => setIsOpenChat(false)} />

        <div
          className={`bg-background w-full h-[100dvh] shadow-2xl z-10 flex flex-col transition-all duration-500 transform ${isOpenChat ? "translate-y-0 scale-100 opacity-100" : "translate-y-12 scale-95 opacity-0"}`}
          role="dialog"
          aria-modal="true"
          aria-label="Asisten AI"
        >
          <div className="flex justify-between items-center p-4 md:p-6 border-b border-text-secondary/10 bg-background relative z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-thirdary flex items-center justify-center text-text-primary font-black border border-text-secondary/10">AI</div>
              <div>
                <h3 className="text-lg font-black text-text-primary tracking-tight leading-none">{profile.shortName} Assistant</h3>
                <span className="text-xs text-green-500 font-bold flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 block animate-pulse" /> Online
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setInitialWelcomeMessage(); localStorage.removeItem("deryl_chat_messages") }} className="text-text-secondary hover:text-red-500 transition-colors p-2 bg-text-secondary/5 rounded-full" title="Mulai baru" aria-label="Mulai percakapan baru">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />
                </svg>
              </button>
              <button onClick={() => setIsOpenChat(false)} className="text-text-secondary hover:text-text-primary transition-colors p-2 bg-text-secondary/5 rounded-full" title="Tutup" aria-label="Tutup asisten">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth custom-scrollbar bg-thirdary/10 flex flex-col items-center">
            <div className="w-full max-w-4xl flex flex-col gap-4 pb-4">
              {configured === false && (
                <div className="w-full text-center text-xs font-bold text-text-secondary bg-thirdary/40 border border-text-secondary/10 rounded-xl px-4 py-2">
                  Asisten AI belum dikonfigurasi. Riwayat percakapan tetap tersimpan di perangkat ini.
                </div>
              )}

              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${msg.sender === "user" ? "bg-text-primary text-background rounded-tr-sm" : "bg-background border border-text-secondary/10 text-text-primary rounded-tl-sm shadow-sm"}`}>
                    {msg.sender === "user" ? (
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className="text-sm font-medium leading-relaxed overflow-hidden">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                            strong: ({ ...props }) => <strong className="font-bold text-text-primary" {...props} />,
                            ul: ({ ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                            ol: ({ ...props }) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                            a: ({ ...props }) => <a className="text-text-primary underline hover:opacity-80 font-bold" target="_blank" rel="noopener noreferrer" {...props} />,
                            code: ({ children, ...props }) => (
                              <code className="bg-thirdary/30 px-1.5 py-0.5 rounded text-xs text-text-primary font-mono font-bold" {...props}>
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    )}
                    <span className={`text-[10px] uppercase font-bold tracking-wider mt-2 block ${msg.sender === "user" ? "text-background/70" : "text-text-secondary/70"}`}>
                      {msg.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex w-full justify-start">
                  <div className="max-w-[85%] bg-background border border-text-secondary/10 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-full bg-text-secondary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-text-secondary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-text-secondary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="p-4 border-t border-text-secondary/10 bg-background flex justify-center">
            <form onSubmit={handleSendChat} className="flex gap-2 w-full max-w-4xl">
              <input
                ref={inputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tanya apa saja soal Deryl..."
                className="flex-1 bg-thirdary/30 border border-text-secondary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-text-primary text-text-primary font-medium transition-colors"
                disabled={isChatLoading}
                aria-label="Tulis pesan"
              />
              <button type="submit" disabled={!chatInput.trim() || isChatLoading} className="bg-text-primary text-background p-3 rounded-xl hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" aria-label="Kirim pesan">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
