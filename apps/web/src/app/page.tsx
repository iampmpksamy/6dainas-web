import Link from 'next/link'

const FEATURES = [
  {
    icon: '🧠',
    title: 'AI-Powered NAS',
    desc: 'Machine-learning file organisation, smart deduplication, and predictive storage management built right into the OS.',
    badge: 'Core',
  },
  {
    icon: '📦',
    title: '1-Click App Store',
    desc: 'Deploy Plex, Jellyfin, Home Assistant, and 100+ Docker apps with a single click — no terminal required.',
    badge: 'Apps',
  },
  {
    icon: '📁',
    title: 'Advanced File Browser',
    desc: 'Full file manager with batch operations, drag-and-drop upload, sharing links, preview, and search.',
    badge: 'Files',
  },
  {
    icon: '💽',
    title: 'Storage Merging',
    desc: 'Merge multiple drives into a single unified volume using MergerFS — maximise capacity without RAID complexity.',
    badge: 'Storage',
  },
  {
    icon: '📊',
    title: 'Local Analytics',
    desc: 'Full install telemetry stored on your HomeLab — no data leaves your network. Private dashboard only for you.',
    badge: 'Privacy',
  },
  {
    icon: '🌐',
    title: 'Remote Access',
    desc: 'Secure remote access via Tailscale or ZeroTier — access your NAS from anywhere without port forwarding.',
    badge: 'Network',
  },
]

const STATS = [
  { num: '100+', label: 'Docker Apps' },
  { num: '10+', label: 'Sprints Shipped' },
  { num: '100%', label: 'Open Source' },
  { num: '0', label: 'Cloud Lock-in' },
]

export default function LandingPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.09) 0%, transparent 70%)' }} />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)' }} />

        <div className="text-center max-w-4xl mx-auto mb-16 animate-slide-up">
          {/* Launch badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 text-xs font-semibold"
               style={{ borderColor: 'rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.07)', color: '#a78bfa' }}>
            <span className="live-dot" />
            Open Source · Free Forever · Made in India
          </div>

          {/* H1 */}
          <h1 className="font-display font-bold text-white leading-[1.02] mb-6"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)' }}>
            Your HomeLab,<br />
            <span className="text-gradient-cyber">AI-Powered.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-gray-400 leading-relaxed mb-4 max-w-2xl mx-auto"
             style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>
            6DAiNAS-OS is India&apos;s first open-source AI NAS operating system — built for HomeLab
            enthusiasts, developers, and creators who demand full control over their data.
          </p>
          <p className="text-sm text-gray-600 mb-10">
            Built on Go + Vue · Self-hosted · No subscriptions · No cloud dependency
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/download"
                  className="btn-primary px-8 py-4 text-base font-semibold">
              Download Free →
            </Link>
            <a href="https://github.com/iampmpksamy/6dainas-os"
               target="_blank" rel="noopener noreferrer"
               className="btn-ghost px-7 py-4 text-base">
              View on GitHub
            </a>
          </div>
        </div>

        {/* Terminal preview card */}
        <div className="max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-dark rounded-3xl overflow-hidden border"
               style={{ borderColor: 'rgba(255,255,255,0.07)', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 80px rgba(124,58,237,0.06)' }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b"
                 style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57', opacity: 0.8 }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e', opacity: 0.8 }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28c840', opacity: 0.8 }} />
              </div>
              <div className="flex-1 bg-white/[0.04] rounded-lg px-3 py-1 text-xs text-gray-600 font-mono">
                homelab.local:6080 · 6DAiNAS-OS Dashboard
              </div>
              <div className="flex items-center gap-1.5">
                <span className="live-dot" />
                <span className="text-xs text-emerald-400 font-medium">System Online</span>
              </div>
            </div>

            {/* Mock dashboard content */}
            <div className="p-6 font-mono text-sm space-y-3" style={{ background: 'rgba(2,6,23,0.8)' }}>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Storage</span>
                <div className="flex items-center gap-3">
                  <div className="w-40 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary-gradient" style={{ width: '43%' }} />
                  </div>
                  <span className="text-gray-300 text-xs">4.3 TB / 10 TB</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">CPU</span>
                <div className="flex items-center gap-3">
                  <div className="w-40 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-electric-gradient" style={{ width: '18%' }} />
                  </div>
                  <span className="text-gray-300 text-xs">18% · 4 cores</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Memory</span>
                <div className="flex items-center gap-3">
                  <div className="w-40 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '62%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)' }} />
                  </div>
                  <span className="text-gray-300 text-xs">4.9 GB / 8 GB</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.05] grid grid-cols-3 gap-4">
                {[
                  { label: 'Apps Running', val: '7' },
                  { label: 'Shared Files', val: '23' },
                  { label: 'Uptime', val: '14d 6h' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-lg font-display font-bold text-white">{s.val}</div>
                    <div className="text-xs text-gray-600">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] py-8 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display font-bold text-3xl text-gradient-primary mb-1">{s.num}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section className="section">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="badge-primary mb-4">What&apos;s Inside</div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            Everything your HomeLab needs,<br />
            <span className="text-gradient-primary">right out of the box.</span>
          </h2>
          <p className="text-gray-500">No paid tiers. No vendor lock-in. No compromises.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <div key={f.title}
                 className="glass p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 group">
              <div className="text-3xl mb-4">{f.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-display font-semibold text-white text-base">{f.title}</h3>
                <span className="badge-primary text-xs">{f.badge}</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY SECTION ───────────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="glass-primary rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: 'radial-gradient(ellipse 600px 400px at 70% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)' }} />
          <div className="relative max-w-2xl">
            <div className="badge-primary mb-6">Why 6DAiNAS-OS?</div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-6 leading-tight">
              Built by a HomeLab enthusiast,<br />for HomeLab enthusiasts.
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Commercial NAS solutions are expensive, closed-source, and constantly pushing you
              toward subscriptions. 6DAiNAS-OS gives you enterprise-grade features — AI storage
              intelligence, Docker app management, advanced sharing — completely free and fully
              under your control.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/features" className="btn-primary px-6 py-3">Explore Features →</Link>
              <Link href="/download" className="btn-ghost px-6 py-3">Get Started</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-white mb-4">
            Ready to own your data?
          </h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Download 6DAiNAS-OS — free, open source, and always will be.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/download" className="btn-primary px-8 py-4 text-base font-semibold">
              Download Now →
            </Link>
            <Link href="/about" className="btn-ghost px-7 py-4 text-base">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
