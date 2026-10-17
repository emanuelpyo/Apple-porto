export interface ExperienceItem {
  id: number
  company: string
  role: string
  date: string
  description: string
  skills: string[]
}

export const experiences: ExperienceItem[] = [
  {
    id: 1,
    company: "Lawkey",
    role: "Web Developer",
    date: "Oktober 2026",
    description:
      "Bergabung dengan tim Lawkey sebagai Web Developer, mengerjakan pengembangan antarmuka dan fitur web.",
    skills: ["Web Development"],
  },
  {
    id: 2,
    company: "PT Primadaya Plastisindo Tbk",
    role: "Web Developer Intern",
    date: "September 2026",
    description:
      "Sedang menjalani magang sebagai Web Developer, membantu pengembangan sistem web internal perusahaan.",
    skills: ["Web Development"],
  },
]
