import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Features — 6DAiNAS-OS',
  description: 'Full feature list of 6DAiNAS-OS — AI NAS, file management, Docker apps, storage merging, analytics, and more.',
}

const SECTIONS = [
  {
    category: 'Core OS',
    color: 'primary',
    features: [
      { title: 'AI Storage Intelligence', desc: 'ML-based file organisation, deduplication suggestions, and predictive usage alerts.' },
      { title: 'Go + Echo Backend', desc: 'High-performance Go backend with Echo v4 — handles thousands of concurrent file operations.' },
      { title: 'Vue 2 Frontend', desc: 'Responsive single-page app with real-time WebSocket updates for system events.' },
      { title: 'SQLite Persistence', desc: 'Lightweight, embedded database with WAL mode — no MySQL or Postgres required.' },
    ],
  },
  {
    category: 'File Management',
    color: 'electric',
    features: [
      { title: 'Advanced File Browser', desc: 'Full file manager with drag-and-drop, multi-select, copy/paste, rename, and bulk operations.' },
      { title: 'Secure File Sharing', desc: 'Generate time-limited share links with optional password protection.' },
      { title: 'Cloud Storage Sync', desc: 'Mount and sync with rclone-compatible cloud providers — Google Drive, S3, Backblaze.' },
      { title: 'USB Auto-Mount', desc: 'Plug in a USB drive and it appears instantly in the file browser.' },
    ],
  },
  {
    category: 'App Management',
    color: 'primary',
    features: [
      { title: '1-Click Docker Apps', desc: 'Deploy from a curated catalogue of 100+ HomeLab apps — Plex, Jellyfin, Home Assistant, Nextcloud, and more.' },
      { title: 'Container Lifecycle', desc: 'Start, stop, restart, update, and remove containers from the UI — no Docker CLI needed.' },
      { title: 'Port Management', desc: 'Automatic port conflict detection and host/container port mapping.' },
      { title: 'Environment Variables', desc: 'Manage Docker env vars, volume mounts, and networks from the app install wizard.' },
    ],
  },
  {
    category: 'Storage & Networking',
    color: 'electric',
    features: [
      { title: 'Drive Merging (MergerFS)', desc: 'Combine multiple drives into one unified storage pool — maximise capacity without RAID.' },
      { title: 'ZeroTier Integration', desc: 'Built-in ZeroTier network management for secure remote access without port forwarding.' },
      { title: 'Storage Metrics', desc: 'Real-time storage usage, SMART health, and per-drive I/O statistics.' },
      { title: 'USB / SATA / NVMe', desc: 'Full support for all common storage interfaces and filesystems (ext4, btrfs, ntfs, exfat).' },
    ],
  },
  {
    category: 'Security & Privacy',
    color: 'primary',
    features: [
      { title: 'Local-First Analytics', desc: 'All telemetry stored on your own HomeLab SQLite database — never sent to third parties.' },
      { title: 'JWT Auth', desc: 'Stateless JWT authentication with refresh tokens and secure httpOnly cookies.' },
      { title: 'CSP Headers', desc: 'Content Security Policy enforced on all API and static responses.' },
      { title: '100% Self-Hosted', desc: 'Your data never leaves your hardware. No accounts, no cloud, no tracking.' },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="section">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="badge-primary mb-4">Full Feature List</div>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
          Everything you need,<br />
          <span className="text-gradient-primary">nothing you don&apos;t.</span>
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          6DAiNAS-OS is built to be your complete HomeLab OS — not a starter kit that upsells you into a subscription.
        </p>
      </div>

      {/* Feature sections */}
      <div className="space-y-16">
        {SECTIONS.map(section => (
          <div key={section.category}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-1.5 h-6 rounded-full ${section.color === 'primary' ? 'bg-primary-gradient' : 'bg-electric-gradient'}`} />
              <h2 className="font-display font-bold text-xl text-white">{section.category}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.features.map(f => (
                <div key={f.title} className="glass p-5 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full mt-0.5 shrink-0 flex items-center justify-center text-white text-xs font-bold
                      ${section.color === 'primary' ? 'bg-primary-gradient shadow-primary-sm' : 'bg-electric-gradient shadow-electric-sm'}`}>
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm mb-1">{f.title}</div>
                      <div className="text-gray-500 text-sm leading-relaxed">{f.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <Link href="/download" className="btn-primary px-8 py-4 text-base font-semibold">
          Download 6DAiNAS-OS →
        </Link>
      </div>
    </div>
  )
}
