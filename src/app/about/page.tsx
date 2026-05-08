import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — 6DAiNAS-OS',
  description: 'Learn about 6DAiNAS-OS — India\'s first open source AI NAS OS built by iampmpksamy.',
}

const TIMELINE = [
  { sprint: 'Sprint.27', version: 'v2.0.0', desc: 'RuntimeKernel, EventEngineV3, ConsensusAuthority, StorageGraph, OTA v2, AI Telemetry, Cluster Foundation.' },
  { sprint: 'Sprint.30', version: 'v2.3.0', desc: 'Comprehensive null-safety hardening — 13 crash sites fixed, safeArray/safeObject utils, API sanitizer layer.' },
  { sprint: 'Sprint.32', version: 'v2.5.0', desc: 'Runtime Survivability — 11-phase infinite-spinner elimination, dead-letter queue, chaos tests.' },
  { sprint: 'Sprint.33', version: 'v2.6.0', desc: 'Frontend Runtime Hardening — Phase 8 resilience suite, frontend async/await audit across all components.' },
  { sprint: 'Sprint.34', version: 'v2.7.0', desc: 'Full codebase bug sweep — 29 bugs fixed: nil route handler, .finaly() typo, unchecked json.Unmarshal, file panic→404.' },
  { sprint: 'Sprint.35', version: 'v2.8.0', desc: 'HomeLab Analytics Stack — self-hosted telemetry replacing Google Forms, private admin dashboard, device_id tracking.' },
]

export default function AboutPage() {
  return (
    <div className="section">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="badge-primary mb-4">The Story</div>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
          Built by a HomeLab<br />
          <span className="text-gradient-primary">enthusiast, for the world.</span>
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          6DAiNAS-OS started as a fork of CasaOS, completely rebranded and reimagined
          with AI intelligence, production-grade resilience, and India-first sensibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Story */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8">
            <h2 className="font-display font-bold text-xl text-white mb-4">Why We Built This</h2>
            <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
              <p>
                Commercial NAS solutions cost thousands of rupees per year in hardware + subscriptions,
                lock you into proprietary ecosystems, and send your metadata to the cloud.
                The HomeLab community deserves better.
              </p>
              <p>
                6DAiNAS-OS is India&apos;s answer — a full-featured, open-source NAS OS that you
                install on commodity hardware (an old laptop, a mini PC, a Raspberry Pi 5) and
                own completely. No accounts. No subscriptions. No telemetry leaving your network.
              </p>
              <p>
                Every line of code is public on GitHub. Every sprint is documented in the P&D logs.
                Every bug found is fixed — not hidden. That&apos;s the 6DAiNAS way.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass p-8">
            <h2 className="font-display font-bold text-xl text-white mb-6">Development Timeline</h2>
            <div className="space-y-4">
              {TIMELINE.map((item, i) => (
                <div key={item.sprint} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0
                      ${i === TIMELINE.length - 1 ? 'bg-primary-gradient shadow-primary-sm' : 'bg-white/[0.08] border border-white/10'}`}>
                      {i + 1}
                    </div>
                    {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-white/[0.06] my-2" />}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white text-sm">{item.sprint}</span>
                      <span className="badge-primary text-xs">{item.version}</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-primary p-6">
            <h2 className="font-display font-semibold text-white mb-4">Tech Stack</h2>
            <div className="space-y-3">
              {[
                { layer: 'Backend',   tech: 'Go 1.22 · Echo v4 · GORM' },
                { layer: 'Frontend',  tech: 'Vue 2.7 · Vuex · Buefy' },
                { layer: 'Database',  tech: 'SQLite (WAL mode)' },
                { layer: 'Storage',   tech: 'MergerFS · rclone' },
                { layer: 'Auth',      tech: 'JWT · Argon2' },
                { layer: 'Infra',     tech: 'Docker · systemd' },
                { layer: 'Analytics', tech: 'Echo · SQLite · Chart.js' },
              ].map(t => (
                <div key={t.layer} className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">{t.layer}</span>
                  <span className="text-gray-300 text-right">{t.tech}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6">
            <h2 className="font-display font-semibold text-white mb-4">Open Source</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              6DAiNAS-OS is MIT licensed. Fork it, contribute, or build your own version.
            </p>
            <a href="https://github.com/iampmpksamy/6dainas-os" target="_blank" rel="noopener noreferrer"
               className="btn-ghost w-full justify-center py-2.5 text-sm">
              View on GitHub →
            </a>
          </div>

          <div className="glass p-6">
            <h2 className="font-display font-semibold text-white mb-4">Creator</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Built and maintained by{' '}
              <a href="https://github.com/iampmpksamy" target="_blank" rel="noopener noreferrer"
                 className="text-primary-400 hover:text-primary-200 transition-colors">
                @iampmpksamy
              </a>{' '}
              — a HomeLab enthusiast, developer, and creator from India.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <Link href="/download" className="btn-primary px-8 py-4 text-base font-semibold">
          Download 6DAiNAS-OS Free →
        </Link>
      </div>
    </div>
  )
}
