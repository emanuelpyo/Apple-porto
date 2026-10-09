"use client"
import Image from "next/image"
import FadeDown from "@/components/animations/FadeDown"
import FadeUp from "@/components/animations/FadeUp"
import GlareHover from "@/components/GlareHover"
import { companies } from "@/data/companies"

export default function Companies() {
  return (
    <section id="companies" className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10">
      <FadeDown>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24 w-full text-left">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">KOLABORASI</h3>
        </div>
      </FadeDown>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {companies.map((company, index) => {
          const card = (
            <GlareHover className="group flex flex-col h-full bg-background border border-text-secondary/20 hover:border-text-primary/50 rounded-2xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl">
              <div className="relative flex items-center justify-center aspect-[16/10] bg-thirdary/30 border-b border-text-secondary/10 p-8">
                <div className="relative w-full h-full">
                  <Image src={company.logo} alt={`Logo ${company.name}`} fill sizes="(max-width: 768px) 100vw, 480px" className="object-contain transition-all duration-700 group-hover:scale-105" />
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <span className="text-xs font-bold tracking-widest text-text-secondary uppercase mb-2">{company.role}</span>
                <h4 className="text-2xl font-black text-text-primary tracking-tight leading-tight mb-3">{company.name}</h4>
                <p className="text-sm text-text-secondary font-medium leading-relaxed flex-grow">{company.description}</p>

                {company.url ? (
                  <span className="mt-6 inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-text-primary group/link">
                    Kunjungi Website
                    <span className="w-8 h-[2px] bg-text-primary group-hover:w-12 transition-all duration-300" />
                  </span>
                ) : (
                  <span className="mt-6 text-xs font-bold tracking-[0.2em] uppercase text-text-secondary/60">Magang Aktif</span>
                )}
              </div>
            </GlareHover>
          )

          return (
            <FadeUp key={index} delay={index * 0.1}>
              {company.url ? (
                <a href={company.url} target="_blank" rel="noopener noreferrer" className="block h-full focus-visible:outline-2" aria-label={`Buka website ${company.name}`}>
                  {card}
                </a>
              ) : (
                <div className="h-full">{card}</div>
              )}
            </FadeUp>
          )
        })}
      </div>
    </section>
  )
}
