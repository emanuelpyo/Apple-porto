"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import FadeDown from "@/components/animations/FadeDown"
import FadeUp from "@/components/animations/FadeUp"
import GlareHover from "@/components/GlareHover"
import { projectList, type Project } from "@/data/projects"

export default function Project() {
  const [isOpen, setIsOpen] = useState<number | null>(null)
  const [activeImage, setActiveImage] = useState(0)

  const openProject = (index: number) => {
    setActiveImage(0)
    setIsOpen(index)
  }

  useEffect(() => {
    if (isOpen !== null) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Escape closes the project modal.
  useEffect(() => {
    if (isOpen === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen])

  const activeProject = projectList.find((p) => p.index === isOpen)
  const hasProjects = projectList.length > 0

  return (
    <section id="projects" className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10">
      <FadeDown>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24 w-full text-left">
          <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">Portfolio</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">Selected Works</h3>
        </div>
      </FadeDown>

      {!hasProjects ? (
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <FadeUp>
            <div className="flex flex-col items-center justify-center text-center border border-dashed border-text-secondary/20 rounded-3xl py-20 px-6 bg-thirdary/10">
              <div className="w-14 h-14 mb-6 rounded-2xl bg-text-secondary/10 flex items-center justify-center text-text-secondary">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" />
                </svg>
              </div>
              <h4 className="text-xl font-black text-text-primary tracking-tight mb-2">Karya sedang disiapkan</h4>
              <p className="text-sm text-text-secondary font-medium max-w-md">
                Foto dan detail proyek akan ditambahkan. Data proyek tersimpan di
                <code className="mx-1 px-1.5 py-0.5 rounded bg-text-secondary/10 text-text-primary font-mono text-xs">data/projects.ts</code>
                dan tinggal diisi.
              </p>
            </div>
          </FadeUp>
        </div>
      ) : (
        <div className="hidden lg:grid max-w-7xl mx-auto grid-cols-3 gap-8 px-6 md:px-12">
          {projectList.map((project, index) => (
            <FadeUp key={`desktop-${index}`}>
              <ProjectCard project={project} onOpen={() => openProject(project.index)} />
            </FadeUp>
          ))}
        </div>
      )}

      {hasProjects && (
        <div className="lg:hidden w-full overflow-hidden relative py-4">
          <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div className="flex gap-6 px-3" key={copy}>
                {projectList.map((project, index) => (
                  <div key={`mobile${copy}-${index}`} className="w-[85vw] sm:w-[400px] flex-shrink-0">
                    <ProjectCard project={project} onOpen={() => openProject(project.index)} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {isOpen !== null && activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={() => setIsOpen(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background border border-text-secondary/20 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative z-10"
              role="dialog"
              aria-modal="true"
              aria-label={activeProject.title}
            >
              <div className="flex justify-between items-center p-6 border-b border-text-secondary/10">
                <h4 className="text-2xl font-black text-text-primary tracking-tight">{activeProject.title}</h4>
                <button className="text-text-secondary hover:text-text-primary transition-colors p-2 bg-text-secondary/5 rounded-full" onClick={() => setIsOpen(null)} aria-label="Tutup detail proyek">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto flex-grow custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 pb-8 border-b border-text-secondary/10">
                  {activeProject.createdAt && (
                    <div>
                      <span className="text-xs font-bold tracking-widest text-text-secondary uppercase block mb-3">Dibuat</span>
                      <span className="text-sm font-bold bg-thirdary text-text-primary px-3 py-1.5 rounded-lg border border-text-secondary/10">{activeProject.createdAt}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold tracking-widest text-text-secondary uppercase block mb-3">Teknologi</span>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.tech.map((tech, i) => (
                        <span key={i} className="text-xs font-bold bg-thirdary text-text-primary px-3 py-1.5 rounded-lg border border-text-secondary/10 uppercase tracking-wider">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {activeProject.features.length > 0 && (
                  <div>
                    <span className="text-xs font-bold tracking-widest text-text-secondary uppercase block mb-5">Fitur Utama</span>
                    <ul className="space-y-4">
                      {activeProject.features.map((feature, i) => (
                        <li key={i} className="flex items-center bg-thirdary/50 p-4 rounded-xl border border-text-secondary/5">
                          <span className="text-text-primary mr-3 font-black">&rarr;</span>
                          <span className="text-sm font-bold text-text-primary uppercase tracking-wide">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeProject.gallery && activeProject.gallery.length > 0 && (
                  <div className="mb-8">
                    <span className="text-xs font-bold tracking-widest text-text-secondary uppercase block mb-3">Tampilan</span>
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-text-secondary/15 bg-thirdary/20">
                      <Image src={activeProject.gallery[activeImage]} alt={`${activeProject.title} tampilan ${activeImage + 1}`} fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover" />
                    </div>
                    {activeProject.gallery.length > 1 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                        {activeProject.gallery.map((src, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActiveImage(i)}
                            aria-label={`Lihat tampilan ${i + 1}`}
                            aria-current={i === activeImage}
                            className={`relative shrink-0 w-20 h-12 rounded-lg overflow-hidden border transition-all duration-300 ${i === activeImage ? "border-text-primary opacity-100" : "border-text-secondary/20 opacity-60 hover:opacity-100"}`}
                          >
                            <Image src={src} alt={`Thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-sm text-text-secondary font-medium leading-relaxed mt-6">{activeProject.shortDescription}</p>
              </div>

              <div className="p-6 border-t border-text-secondary/10 flex flex-col sm:flex-row gap-4 bg-background">
                {activeProject.liveDemoUrl ? (
                  <a href={activeProject.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center font-bold text-sm tracking-widest uppercase bg-text-primary text-background py-4 rounded-xl hover:-translate-y-1 transition-transform duration-300">
                    Live Demo
                  </a>
                ) : (
                  <span className="flex-1 text-center font-bold text-sm tracking-widest uppercase border-2 border-text-secondary/20 text-text-secondary/50 py-4 rounded-xl cursor-not-allowed select-none">Live Demo Belum Ada</span>
                )}

                {activeProject.isPrivateRepo ? (
                  <button disabled className="flex-1 flex justify-center items-center gap-2 text-center font-bold text-sm tracking-widest uppercase border-2 border-text-secondary/20 text-text-secondary opacity-50 cursor-not-allowed py-4 rounded-xl">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Source Code
                  </button>
                ) : activeProject.githubUrl ? (
                  <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 text-center font-bold text-sm tracking-widest uppercase border-2 border-text-secondary/20 text-text-primary hover:border-text-primary hover:-translate-y-1 transition-all duration-300 py-4 rounded-xl">
                    Source Code
                  </a>
                ) : (
                  <span className="flex-1 text-center font-bold text-sm tracking-widest uppercase border-2 border-text-secondary/20 text-text-secondary/50 py-4 rounded-xl cursor-not-allowed select-none">Source Code</span>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <GlareHover className="group flex flex-col h-full bg-background border border-text-secondary/20 hover:border-text-primary/50 rounded-xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl">
      <div className="relative overflow-hidden aspect-[16/10] bg-text-secondary/5 border-b border-text-secondary/10">
        {project.imagePath ? (
          <Image src={project.imagePath} alt={project.title} fill sizes="(max-width: 1024px) 85vw, 400px" className="object-cover transition-all duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-secondary/40 text-xs font-bold uppercase tracking-widest">Foto belum ada</div>
        )}

        {project.tech.length > 0 && (
          <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-[-10px] group-hover:translate-y-0">
            {project.tech.slice(0, 3).map((tech, i) => (
              <span key={i} className="text-[10px] font-bold bg-background/90 text-text-primary px-2 py-1 rounded backdrop-blur-md border border-text-secondary/20 uppercase tracking-widest shadow-sm">
                {tech}
              </span>
            ))}
            {project.tech.length > 3 && <span className="text-[10px] font-bold bg-background/90 text-text-primary px-2 py-1 rounded backdrop-blur-md border border-text-secondary/20 uppercase tracking-widest shadow-sm">+{project.tech.length - 3}</span>}
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-grow relative">
        <div className="absolute top-0 right-6 -translate-y-1/2 bg-background border border-text-secondary/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-text-secondary shadow-sm">{String(project.index + 1).padStart(2, "0")}</div>

        <h4 className="text-2xl font-black text-text-primary tracking-tight leading-tight mb-4">{project.title}</h4>

        <p className="text-sm text-text-secondary font-medium leading-relaxed mb-8 flex-grow line-clamp-3">{project.shortDescription}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-text-secondary/10">
          <button className="text-xs font-bold tracking-[0.2em] uppercase text-text-primary flex items-center gap-3 group/btn" onClick={onOpen}>
            View Details
            <span className="w-8 h-[2px] bg-text-primary group-hover/btn:w-12 transition-all duration-300" />
          </button>

          {project.liveDemoUrl ? (
            <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="p-2 border border-text-secondary/20 rounded-full text-text-secondary hover:text-background hover:bg-text-primary hover:border-text-primary transition-all duration-300" aria-label={`Buka demo ${project.title}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
            <span className="p-2 border border-text-secondary/10 rounded-full text-text-secondary/30" aria-hidden="true">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </GlareHover>
  )
}
