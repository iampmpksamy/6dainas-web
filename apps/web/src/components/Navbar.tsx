'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] backdrop-blur-2xl bg-black/30">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center text-white font-bold text-sm shadow-primary-sm">
            6D
          </div>
          <span className="font-display font-bold text-white text-base tracking-tight">
            6DAiNAS<span className="text-gradient-primary">-OS</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          <Link href="/features" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">Features</Link>
          <Link href="/download" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">Download</Link>
          <Link href="/about"    className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">About</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          <a href="https://github.com/iampmpksamy/6dainas-os" target="_blank" rel="noopener noreferrer" className="btn-ghost px-4 py-2 text-sm">
            GitHub →
          </a>
          <Link href="/download" className="btn-primary px-5 py-2 text-sm">
            Download Free
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden ml-auto text-gray-400 hover:text-white" onClick={() => setOpen(o => !o)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-black/80 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            <Link href="/features" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/[0.04]">Features</Link>
            <Link href="/download" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/[0.04]">Download</Link>
            <Link href="/about"    onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/[0.04]">About</Link>
            <div className="mt-3 flex gap-2">
              <Link href="/download" onClick={() => setOpen(false)} className="btn-primary flex-1 text-sm py-2.5 text-center">Download Free</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
