import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Hero from "./hero"
import Companies from "./companies"
import About from "./about"
import Graduation from "./graduation"
import Experience from "./experience"
import TechStack from "./tech-stack"
import Project from "./project"
import Certificates from "./certificates"
import Contact from "./contact"

export default function Home() {
  return (
    <>
      <header className="cursor-default sticky top-0 z-50">
        <Header />
      </header>
      <Hero />
      <Companies />
      <About />
      <Graduation />
      <Experience />
      <TechStack />
      <Project />
      <Certificates />
      <Contact />
      <Footer />
    </>
  )
}
