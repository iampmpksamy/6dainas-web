import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black/20 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center text-white font-bold text-sm shadow-primary-sm">
                6D
              </div>
              <span className="font-display font-bold text-white text-base">
                6DAiNAS<span className="text-gradient-primary">-OS</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              India&apos;s 1st Open Source AI NAS Operating System — built for HomeLab enthusiasts,
              developers, and creators who want full control over their data.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="live-dot w-1.5 h-1.5"></span>
              Open Source · MIT License
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Product</p>
            <ul className="space-y-2.5">
              <li><Link href="/features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/download" className="text-sm text-gray-400 hover:text-white transition-colors">Download</Link></li>
              <li><Link href="/about"    className="text-sm text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li>
                <a href="https://github.com/iampmpksamy/6dainas-os" target="_blank" rel="noopener noreferrer"
                   className="text-sm text-gray-400 hover:text-white transition-colors">
                  GitHub ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Community</p>
            <ul className="space-y-2.5">
              <li>
                <a href="https://youtube.com/@iampmpksamy" target="_blank" rel="noopener noreferrer"
                   className="text-sm text-gray-400 hover:text-white transition-colors">YouTube ↗</a>
              </li>
              <li>
                <a href="https://instagram.com/iampmpksamy" target="_blank" rel="noopener noreferrer"
                   className="text-sm text-gray-400 hover:text-white transition-colors">Instagram ↗</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} 6DAiNAS-OS · Built with ❤️ in India by{' '}
            <a href="https://github.com/iampmpksamy" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">iampmpksamy</a>
          </p>
          <p className="text-xs text-gray-700">Open source · MIT License</p>
        </div>
      </div>
    </footer>
  )
}
