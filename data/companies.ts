export interface Company {
  name: string
  role: string
  logo: string
  description: string
  url?: string
}

export const companies: Company[] = [
  {
    name: "Lawkey",
    role: "Web Developer",
    logo: "/images/logo/lawkey-dashboardweb.jpeg",
    description: "Bergabung dengan tim Lawkey sebagai Web Developer.",
    url: "https://www.lawkey.id/#top",
  },
  {
    name: "PT Primadaya Plastisindo Tbk",
    role: "Web Developer Intern",
    logo: "/images/logo/pdpsolo.jpeg",
    description: "Menjalani magang di Departemen IT Support & Web Developer.",
    url: "",
  },
]
