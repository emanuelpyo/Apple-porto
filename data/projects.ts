// ============================================================
// Projects data
// ------------------------------------------------------------
// This is the only file you edit to add a project. Copy the
// commented template below, fill the fields, and drop a real
// screenshot into `public/projects/`.
//
// Rules the UI enforces for you:
// - An empty `imagePath` renders a neutral placeholder block,
//   never a broken image.
// - An empty `liveDemoUrl` / `githubUrl` renders a disabled
//   button, never a dead link that looks active.
// - The section shows a clear empty state while this array is
//   empty, so the page never looks broken before content exists.
//
// Template:
// {
//   index: 0,
//   imagePath: "/projects/my-screenshot.png",
//   title: "Project Name",
//   shortDescription: "One or two sentences.",
//   createdAt: "2026", // optional, shown in the modal
//   features: ["Feature one", "Feature two"],
//   gallery: ["/projects/my/1.png", "/projects/my/2.png"], // optional extra shots in the modal
//   tech: ["Next.js", "TypeScript"],
//   githubUrl: "https://github.com/emanuelpyo/repo",
//   liveDemoUrl: "https://example.com",
//   isPrivateRepo: false,
// }
// ============================================================

export interface Project {
  index: number
  imagePath: string
  title: string
  shortDescription: string
  createdAt?: string
  features: string[]
  gallery?: string[]
  tech: string[]
  githubUrl?: string
  liveDemoUrl?: string
  isPrivateRepo?: boolean
}

export const projectList: Project[] = [
  {
    index: 0,
    imagePath: "/projects/cate-studio/1.png",
    title: "Cate Studio",
    shortDescription:
      "Platform e-commerce untuk brand fashion yang ingin toko online eksklusif. Menyediakan katalog produk, filter, keranjang belanja, integrasi pembayaran, dan nota digital.",
    features: [],
    gallery: [
      "/projects/cate-studio/1.png",
      "/projects/cate-studio/2.png",
      "/projects/cate-studio/3.png",
      "/projects/cate-studio/4.png",
      "/projects/cate-studio/5.png",
      "/projects/cate-studio/6.png",
      "/projects/cate-studio/7.png",
    ],
    tech: ["HTML", "CSS", "JavaScript"],
  },
]
