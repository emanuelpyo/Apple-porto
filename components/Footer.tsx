import React from "react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-text-secondary/10 bg-background py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm font-medium text-text-secondary">&copy; {currentYear} Stiven Deryl Imanuel Pyo. All rights reserved.</p>
          <p className="text-xs font-medium text-text-secondary/70 mt-1">Next.js &amp; TypeScript</p>
        </div>
      </div>
    </footer>
  )
}
