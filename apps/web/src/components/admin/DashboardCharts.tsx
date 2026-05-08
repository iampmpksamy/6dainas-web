'use client'

import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const COLORS = ['#7c3aed', '#3b82f6', '#a78bfa', '#60a5fa', '#10b981', '#f59e0b', '#f472b6', '#34d399']

const donutOptions = {
  responsive: true,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { size: 11 }, padding: 12 } },
  },
  cutout: '58%',
}

const barOptions = {
  responsive: true,
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { ticks: { color: '#64748b' }, grid: { color: '#ffffff0a' } },
    y: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } },
  },
}

function donut(obj: Record<string, number>) {
  const labels = Object.keys(obj).filter(k => k !== '').slice(0, 8)
  return { labels, datasets: [{ data: labels.map(k => obj[k]), backgroundColor: COLORS, borderWidth: 0, hoverOffset: 4 }] }
}

function bar(obj: Record<string, number>, maxItems = 8) {
  const sorted = Object.entries(obj).filter(([k]) => k !== '').sort((a, b) => b[1] - a[1]).slice(0, maxItems)
  const labels = sorted.map(([k]) => k.length > 30 ? k.slice(0, 28) + '…' : k)
  return {
    labels,
    datasets: [{
      data: sorted.map(([, v]) => v),
      backgroundColor: '#7c3aed99',
      borderColor: '#7c3aed',
      borderWidth: 1,
      borderRadius: 4,
    }],
  }
}

function Empty() {
  return <div className="h-40 flex items-center justify-center text-gray-700 text-sm">No data yet</div>
}

// ── OS Charts ─────────────────────────────────────────────────────────────────

interface OSChartsProps {
  bySource:     Record<string, number>
  byExperience: Record<string, number>
  byPayment:    Record<string, number>
  byVersion:    Record<string, number>
}

export function OSCharts({ bySource, byExperience, byPayment, byVersion }: OSChartsProps) {
  const charts = [
    { title: 'How They Found Us', data: bySource },
    { title: 'Experience Level',  data: byExperience },
    { title: 'Payment Willingness', data: byPayment },
    { title: 'OS Version', data: byVersion },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {charts.map(c => (
        <div key={c.title} className="glass p-5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">{c.title}</h3>
          {Object.keys(c.data).length > 0
            ? <Doughnut data={donut(c.data)} options={donutOptions} />
            : <Empty />}
        </div>
      ))}
    </div>
  )
}

// ── Web Charts ────────────────────────────────────────────────────────────────

interface WebChartsProps {
  byPage: Record<string, number>
  byType: Record<string, number>
}

export function WebCharts({ byPage, byType }: WebChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass p-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Top Pages</h3>
        {Object.keys(byPage).length > 0
          ? <Bar data={bar(byPage)} options={barOptions} />
          : <Empty />}
      </div>
      <div className="glass p-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Event Types</h3>
        {Object.keys(byType).length > 0
          ? <Doughnut data={donut(byType)} options={donutOptions} />
          : <Empty />}
      </div>
    </div>
  )
}

// ── Legacy default export (backward compat) ───────────────────────────────────

interface Props {
  bySource:     Record<string, number>
  byExperience: Record<string, number>
  byPayment:    Record<string, number>
}

export default function DashboardCharts({ bySource, byExperience, byPayment }: Props) {
  return <OSCharts bySource={bySource} byExperience={byExperience} byPayment={byPayment} byVersion={{}} />
}
