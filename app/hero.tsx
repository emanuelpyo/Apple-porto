"use client"
import Image from "next/image"
import { useEffect, useState, useMemo } from "react"
import FadeRight from "@/components/animations/FadeRight"
import FadeLeft from "@/components/animations/FadeLeft"
import { profile } from "@/data/profile"
import { socialList, quickStatsList } from "@/data/hero"

const CV_PATH = "/cv/StivenDerylImanuelPyo_Resume_AppleAcademy.pdf"

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [hasCv, setHasCv] = useState(false)

  const texts = useMemo(() => profile.roles, [])

  const handleScroll = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Check whether the CV file exists before enabling the button, so we never
  // ship an active control that 404s.
  useEffect(() => {
    let active = true
    fetch(CV_PATH, { method: "HEAD" })
      .then((res) => {
        if (active) setHasCv(res.ok)
      })
      .catch(() => {
        if (active) setHasCv(false)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const currentIndex = index % texts.length

    const timeout = setTimeout(
      () => {
        const currentText = texts[currentIndex]

        if (!deleting && subIndex < currentText.length) {
          setSubIndex(subIndex + 1)
        } else if (deleting && subIndex > 0) {
          setSubIndex(subIndex - 1)
        } else if (!deleting && subIndex === currentText.length) {
          setDeleting(true)
        } else if (deleting && subIndex === 0) {
          setDeleting(false)
          setIndex((currentIndex + 1) % texts.length)
        }
      },
      deleting ? 75 : 150,
    )

    return () => clearTimeout(timeout)
  }, [subIndex, deleting, index, texts])

  return (
    <section id="home" className="w-full max-w-7xl mx-auto cursor-default grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center px-6 md:px-12 pt-32 md:pt-40 pb-24 md:pb-32 overflow-hidden">
      <FadeLeft>
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="text-text-primary text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-tight">
              Hi, I&apos;m
              <span className="text-transparent bg-clip-text bg-linear-to-r from-text-primary to-text-secondary"> {profile.shortName}</span>
            </h1>
          </div>

          <div className="relative">
            <span className="text-text-primary text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">{`${texts[index].substring(0, subIndex)}`}</span>
            <span className="animate-cursor text-text-secondary text-2xl lg:text-3xl font-light">|</span>
          </div>

          <div className="max-w-xl mt-4">
            <p className="text-text-secondary text-base md:text-lg leading-relaxed font-medium">{profile.tagline}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => handleScroll("projects")}
              className="cursor-pointer text-sm md:text-base font-bold bg-text-primary text-background px-8 py-4 rounded-xl flex flex-row items-center justify-center gap-3 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 ease-out"
            >
              Lihat Karya
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
              </svg>
            </button>

            {hasCv ? (
              <a
                href={CV_PATH}
                download
                className="cursor-pointer text-sm md:text-base font-bold border-2 border-text-secondary/20 hover:border-text-primary text-text-primary px-8 py-4 rounded-xl flex flex-row items-center justify-center gap-3 hover:-translate-y-1.5 hover:scale-[1.02] hover:bg-thirdary/40 transition-all duration-300 ease-out bg-background/50 backdrop-blur-sm"
              >
                Download CV
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4" />
                </svg>
              </a>
            ) : (
              <span
                aria-disabled="true"
                title="CV belum tersedia"
                className="text-sm md:text-base font-bold border-2 border-dashed border-text-secondary/20 text-text-secondary/60 px-8 py-4 rounded-xl flex flex-row items-center justify-center gap-3 cursor-not-allowed select-none"
              >
                Download CV
              </span>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-text-secondary/10">
            <span className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-4 block">Connect</span>
            <div className="flex flex-row gap-4">
              {socialList.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="p-3 border border-text-secondary/20 rounded-xl hover:border-text-primary hover:bg-text-primary hover:text-background text-text-primary transition-all duration-300"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </FadeLeft>

      <FadeRight>
        <div className="flex flex-col items-center justify-center relative mt-12 md:mt-0">
          <div className="absolute inset-0 bg-linear-to-tr from-thirdary to-background rounded-full scale-110 opacity-50 blur-2xl" />

          <div className="relative z-10 p-2 bg-background border border-text-secondary/10 rounded-full shadow-2xl">
            <Image src="/images/profile.jpeg" alt={profile.name} width={400} height={400} className="rounded-full object-cover aspect-square floating transition-all duration-700" priority />
          </div>

          <div className="absolute -bottom-10 md:-bottom-12 -left-4 md:-left-12 z-20 flex flex-col gap-3">
            {quickStatsList.map((stat, i) => (
              <div key={i} className="floating flex items-center gap-3 bg-background/90 backdrop-blur-md border border-text-secondary/10 p-3 pr-5 rounded-2xl shadow-xl hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="bg-text-primary text-background p-2 rounded-xl">{stat.icon}</div>
                <span className="text-xs md:text-sm font-semibold text-text-primary whitespace-nowrap">{stat.message}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeRight>
    </section>
  )
}
