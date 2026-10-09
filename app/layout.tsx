import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "../styles/globals.css"
import PageLoader from "@/components/PageLoader"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    default: "Stiven Deryl Imanuel Pyo | Portfolio",
    template: "%s | Stiven Deryl Imanuel Pyo",
  },
  description:
    "Portfolio pribadi Stiven Deryl Imanuel Pyo, Web Developer dan IT Support. Lulusan Informatika yang membangun antarmuka web dan merawat sistem di baliknya.",
  keywords: ["Stiven Deryl Imanuel Pyo", "Deryl Pyo", "Portfolio", "Web Developer", "IT Support", "Frontend", "Laravel", "React"],
  authors: [{ name: "Stiven Deryl Imanuel Pyo" }],
  creator: "Stiven Deryl Imanuel Pyo",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    title: "Stiven Deryl Imanuel Pyo | Portfolio",
    description: "Portfolio pribadi Stiven Deryl Imanuel Pyo, Web Developer dan IT Support.",
    siteName: "Deryl Portfolio",
    images: [{ url: "/images/profile.jpeg", width: 1200, height: 630, alt: "Stiven Deryl Imanuel Pyo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stiven Deryl Imanuel Pyo | Portfolio",
    description: "Portfolio pribadi Stiven Deryl Imanuel Pyo, Web Developer dan IT Support.",
    images: ["/images/profile.jpeg"],
  },
  icons: {
    icon: "/images/profile.jpeg",
    apple: "/images/profile.jpeg",
  },
  alternates: {
    canonical: "/",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <PageLoader />
        {children}
      </body>
    </html>
  )
}
