"use client"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import FadeDown from "@/components/animations/FadeDown"
import FadeUp from "@/components/animations/FadeUp"
import { graduationPhotos } from "@/data/graduation"

export default function Graduation() {
  const [expanded, setExpanded] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const initialCount = 3
  const visible = expanded ? graduationPhotos : graduationPhotos.slice(0, initialCount)
  const hasMore = graduationPhotos.length > initialCount

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const showNext = useCallback(() => setLightboxIndex((i) => (i === null ? i : (i + 1) % graduationPhotos.length)), [])
  const showPrev = useCallback(() => setLightboxIndex((i) => (i === null ? i : (i - 1 + graduationPhotos.length) % graduationPhotos.length)), [])

  // Escape closes, arrows move, and body scroll locks while the lightbox is open.
  useEffect(() => {
    if (lightboxIndex === null) return
    document.body.style.overflow = "hidden"

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowRight") showNext()
      if (e.key === "ArrowLeft") showPrev()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [lightboxIndex, closeLightbox, showNext, showPrev])

  return (
    <section id="graduation" className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10">
      <FadeDown>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24 w-full text-left">
          <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">Momen</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">Dokumentasi Wisuda</h3>
        </div>
      </FadeDown>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((photo, index) => (
            <FadeUp key={photo.src} delay={index * 0.08}>
              <button
                type="button"
                onClick={() => setLightboxIndex(graduationPhotos.findIndex((p) => p.src === photo.src))}
                className="group relative block w-full aspect-[3/4] rounded-2xl overflow-hidden border border-text-secondary/20 hover:border-text-primary/50 transition-all duration-500 shadow-sm hover:shadow-2xl cursor-pointer"
                aria-label={`Perbesar ${photo.alt}`}
              >
                <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 bg-linear-to-t from-background/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-widest text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500">Perbesar</span>
              </button>
            </FadeUp>
          ))}
        </div>

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="inline-flex items-center gap-3 px-8 py-4 bg-background border border-text-secondary/20 text-text-primary hover:border-text-primary hover:bg-text-primary hover:text-background rounded-xl font-bold tracking-widest text-sm uppercase transition-all duration-300 ease-out group hover:-translate-y-1.5 hover:scale-[1.02] shadow-sm hover:shadow-xl"
            >
              <span>{expanded ? "Tampilkan Lebih Sedikit" : "Lihat Semua Foto"}</span>
              <svg className={`w-5 h-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-12" role="dialog" aria-modal="true" aria-label="Pratinjau foto wisuda">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={closeLightbox} />

          <button type="button" onClick={closeLightbox} className="absolute top-4 right-4 md:top-8 md:right-8 z-10 p-3 rounded-full bg-text-secondary/10 hover:bg-text-secondary/20 text-text-primary transition-colors" aria-label="Tutup pratinjau foto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {graduationPhotos.length > 1 && (
            <>
              <button type="button" onClick={showPrev} className="absolute left-4 md:left-8 z-10 p-3 rounded-full bg-text-secondary/10 hover:bg-text-secondary/20 text-text-primary transition-colors" aria-label="Foto sebelumnya">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button type="button" onClick={showNext} className="absolute right-4 md:right-8 z-10 p-3 rounded-full bg-text-secondary/10 hover:bg-text-secondary/20 text-text-primary transition-colors" aria-label="Foto berikutnya">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 6 6 6-6 6" />
                </svg>
              </button>
            </>
          )}

          <div className="relative z-10 w-full max-w-3xl h-[80vh]">
            <Image src={graduationPhotos[lightboxIndex].src} alt={graduationPhotos[lightboxIndex].alt} fill sizes="100vw" className="object-contain" priority />
          </div>
        </div>
      )}
    </section>
  )
}
