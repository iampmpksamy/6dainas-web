import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Download — 6DAiNAS-OS',
  description: 'Download 6DAiNAS-OS for x86_64 and ARM64. Free, open source, self-hosted NAS OS.',
}

const REQUIREMENTS = [
  { label: 'CPU',       value: 'x86_64 or ARM64 (64-bit)' },
  { label: 'RAM',       value: '4 GB minimum (8 GB recommended)' },
  { label: 'Storage',   value: '32 GB SSD for OS + data drives' },
  { label: 'Network',   value: 'Ethernet (Wi-Fi supported)' },
  { label: 'OS',        value: 'Ubuntu 22.04 / Debian 12 base' },
  { label: 'Docker',    value: 'Docker 24+ (installed by script)' },
]

export default function DownloadPage() {
  return (
    <div className="section">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="badge-primary mb-4">Free Download</div>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
          Get 6DAiNAS-OS
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          One install script. Under 5 minutes. Your HomeLab will never be the same.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick install */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-7">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-primary-gradient flex items-center justify-center text-white text-xs font-bold shadow-primary-sm">1</div>
              <h2 className="font-display font-semibold text-white text-base">Quick Install (Recommended)</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">Run this on a fresh Ubuntu 22.04 or Debian 12 machine:</p>
            <div className="bg-black/60 border border-white/[0.07] rounded-xl p-4 font-mono text-sm overflow-x-auto">
              <span className="text-gray-500 select-none">$ </span>
              <span className="text-primary-400">curl</span>
              <span className="text-gray-300"> -fsSL https://raw.githubusercontent.com/iampmpksamy/6dainas-os/main/install.sh </span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-300"> bash</span>
            </div>
            <p className="text-gray-600 text-xs mt-3">
              The script installs Docker, pulls all services, and starts 6DAiNAS-OS on port 6080.
            </p>
          </div>

          <div className="glass p-7">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-electric-gradient flex items-center justify-center text-white text-xs font-bold shadow-electric-sm">2</div>
              <h2 className="font-display font-semibold text-white text-base">Access the Dashboard</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">Open your browser and navigate to:</p>
            <div className="bg-black/60 border border-white/[0.07] rounded-xl p-4 font-mono text-sm">
              <span className="text-electric-400">http://</span>
              <span className="text-gray-300">YOUR_SERVER_IP</span>
              <span className="text-electric-400">:6080</span>
            </div>
            <p className="text-gray-600 text-xs mt-3">
              Create your admin account on first launch — all data stays on your hardware.
            </p>
          </div>

          <div className="glass p-7">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-primary-gradient flex items-center justify-center text-white text-xs font-bold shadow-primary-sm">3</div>
              <h2 className="font-display font-semibold text-white text-base">Manual Install (Advanced)</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">Clone the repository and build from source:</p>
            <div className="bg-black/60 border border-white/[0.07] rounded-xl p-4 font-mono text-sm space-y-1 overflow-x-auto">
              {[
                'git clone https://github.com/iampmpksamy/6dainas-os.git',
                'cd 6dainas-os',
                'go build ./...',
                'pnpm --dir ui install && pnpm --dir ui build',
              ].map(cmd => (
                <div key={cmd}>
                  <span className="text-gray-500 select-none">$ </span>
                  <span className="text-gray-300">{cmd}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-3">Requires Go 1.22+ and Node 22+.</p>
          </div>
        </div>

        {/* System requirements */}
        <div className="space-y-6">
          <div className="glass p-6">
            <h2 className="font-display font-semibold text-white mb-5">System Requirements</h2>
            <div className="space-y-3.5">
              {REQUIREMENTS.map(r => (
                <div key={r.label}>
                  <div className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-0.5">{r.label}</div>
                  <div className="text-sm text-gray-300">{r.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-primary p-6">
            <h2 className="font-display font-semibold text-white mb-3">Analytics Service</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              After installation, the analytics collector runs on port 7000 — capturing user
              registrations to your private HomeLab dashboard.
            </p>
            <div className="text-xs text-gray-500 font-mono bg-black/40 rounded-lg px-3 py-2">
              ANALYTICS_PORT=7000<br />
              ANALYTICS_KEY=your-secret
            </div>
          </div>

          <div className="glass p-6">
            <h2 className="font-display font-semibold text-white mb-3">What&apos;s Included</h2>
            <ul className="space-y-2">
              {[
                'Main dashboard service',
                'User auth service',
                'App management service',
                'Local storage service',
                'Analytics service (port 7000)',
                'Message bus',
                'Gateway / reverse proxy',
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
