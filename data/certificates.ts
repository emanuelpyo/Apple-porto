// Certificates preserved from the previous site. Real assets only.
export interface Certificate {
  issuer: string
  title: string
  type: "pdf" | "image"
  src: string
}

export const certificates: Certificate[] = [
  {
    issuer: "IBM",
    title: "Completion Certificate, SkillsBuild",
    type: "pdf",
    src: "/images/sertif/skillsbuild-completion.pdf",
  },
  {
    issuer: "IBM",
    title: "Natural Language Processing, SkillsBuild",
    type: "image",
    src: "/images/sertif/skillsbuild-nlp.jpg",
  },
]
