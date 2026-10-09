"use client"
import { useState, useEffect, useRef } from "react"
import FadeDown from "@/components/animations/FadeDown"
import FadeUp from "@/components/animations/FadeUp"
import { certificates, type Certificate } from "@/data/certificates"

export default function Certificates() {
  const [active, setActive] = useState<Certificate | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!active) return
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [active])

  return (
    <section id="certificates" className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10">
      <FadeDown>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24 w-full text-left">
          <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">Sertifikasi</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">Certificates</h3>
        </div>
      </FadeDown>

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-4">
        {certificates.map((cert, i) => (
          <FadeUp key={i} delay={i * 0.08}>
            <button
              type="button"
              onClick={() => setActive(cert)}
              className="group w-full flex items-center justify-between gap-4 p-6 md:p-8 bg-background border border-text-secondary/20 hover:border-text-primary/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-left"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold tracking-widest text-text-secondary uppercase">{cert.issuer}</span>
                <span className="text-lg md:text-xl font-bold text-text-primary tracking-tight">{cert.title}</span>
              </div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-text-primary flex items-center gap-3 shrink-0">
                Lihat
                <span className="w-8 h-[2px] bg-text-primary group-hover:w-12 transition-all duration-300" />
              </span>
            </button>
          </FadeUp>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 md:p-12" role="dialog" aria-modal="true" aria-label={active.title}>
          <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setActive(null)} />
          <div className="relative z-10 w-full max-w-4xl h-[85vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-text-primary tracking-tight">{active.title}</span>
              <button ref={closeRef} type="button" onClick={() => setActive(null)} className="p-3 rounded-full bg-text-secondary/10 hover:bg-text-secondary/20 text-text-primary transition-colors" aria-label="Tutup sertifikat">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 bg-thirdary/20 rounded-2xl overflow-hidden border border-text-secondary/20">
              {active.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={active.src} alt={active.title} className="w-full h-full object-contain" />
              ) : (
                <iframe src={active.src} title={active.title} className="w-full h-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
