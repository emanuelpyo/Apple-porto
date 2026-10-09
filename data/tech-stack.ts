export interface TechCategory {
  title: string
  description: string
  technologies: { name: string; svg?: string }[]
}

export const techCategories: TechCategory[] = [
  {
    title: "Frontend",
    description: "Bahasa dan library untuk membangun antarmuka web yang interaktif.",
    technologies: [
      { name: "HTML5", svg: "/icons/html.svg" },
      { name: "CSS3", svg: "/icons/css.svg" },
      { name: "JavaScript" },
      { name: "TypeScript", svg: "/icons/typescript.svg" },
      { name: "React.js", svg: "/icons/react.svg" },
      { name: "Tailwind CSS", svg: "/icons/tailwindcss.svg" },
    ],
  },
  {
    title: "Backend",
    description: "Teknologi sisi server dan framework.",
    technologies: [
      { name: "PHP" },
      { name: "Laravel", svg: "/icons/laravel.svg" },
    ],
  },
  {
    title: "Database & Data",
    description: "Basis data dan tools untuk pengolahan data.",
    technologies: [
      { name: "MySQL", svg: "/icons/mysql.svg" },
      { name: "Python" },
    ],
  },
  {
    title: "Tools & Infrastructure",
    description: "Version control, editor, dan deployment.",
    technologies: [
      { name: "Git", svg: "/icons/git.svg" },
      { name: "GitHub", svg: "/icons/github.svg" },
      { name: "Docker", svg: "/icons/docker.svg" },
    ],
  },
]
