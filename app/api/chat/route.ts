import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export const runtime = "nodejs"

interface HistoryEntry {
  role: "system" | "user" | "assistant"
  content: string
}

// POST /api/chat
// Streams a chat completion as plain text. The API key is read from the server
// environment only and is never sent to the client.
//
// Required environment (see .env.example):
//   AI_API_KEY      server-side key for an OpenAI-compatible endpoint
//   AI_BASE_URL     optional, defaults to the NVIDIA integrate endpoint
//   AI_MODEL        optional, defaults to a small instruct model
//
// Without AI_API_KEY the route returns a clear "not configured" message so the
// UI can show an honest error state instead of a fake reply.
export async function POST(req: NextRequest) {
  try {
    const { text, history = [] }: { text: string; history: HistoryEntry[] } = await req.json()

    if (!text) {
      return NextResponse.json({ success: false, message: "Pesan tidak boleh kosong" }, { status: 400 })
    }

    const apiKey = process.env.AI_API_KEY
    if (!apiKey) {
      console.error("AI_API_KEY is missing in environment variables")
      return NextResponse.json({ success: false, message: "Konfigurasi API AI tidak ditemukan." }, { status: 500 })
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: process.env.AI_BASE_URL || "https://integrate.api.nvidia.com/v1",
    })

    const messages = [...history, { role: "user", content: text }]

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "meta/llama-3.1-8b-instruct",
      messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature: 0.7,
      top_p: 0.7,
      max_tokens: 1024,
      stream: true,
    })

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices?.[0]?.delta?.content || ""
            if (content) {
              controller.enqueue(new TextEncoder().encode(content))
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json({ success: false, message: "Gagal terhubung ke server AI." }, { status: 500 })
  }
}
