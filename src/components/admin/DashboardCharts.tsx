'use client'

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = ['#7c3aed', '#3b82f6', '#a78bfa', '#60a5fa', '#10b981', '#f59e0b', '#f472b6', '#34d399']

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8',
        font: { size: 11 },
        padding: 12,
      },
    },
  },
  cutout: '58%',
}

function buildDataset(obj: Record<string, number>) {
  const labels = Object.keys(obj).filter(k => k !== '')
  const data   = labels.map(k => obj[k])
  return { labels, datasets: [{ data, backgroundColor: COLORS, borderWidth: 0, hoverOffset: 4 }] }
}

interface Props {
  bySource:     Record<string, number>
  byExperience: Record<string, number>
  byPayment:    Record<string, number>
}

export default function DashboardCharts({ bySource, byExperience, byPayment }: Props) {
  const hasSource = Object.keys(bySource).length > 0
  const hasExp    = Object.keys(byExperience).length > 0
  const hasPay    = Object.keys(byPayment).length > 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: 'How They Found Us', has: hasSource,  data: bySource },
        { title: 'Experience Level',  has: hasExp,     data: byExperience },
        { title: 'Payment Willingness', has: hasPay,   data: byPayment },
      ].map(chart => (
        <div key={chart.title} className="glass p-5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">{chart.title}</h3>
          {chart.has
            ? <Doughnut data={buildDataset(chart.data)} options={chartOptions} />
            : <div className="h-40 flex items-center justify-center text-gray-700 text-sm">No data yet</div>
          }
        </div>
      ))}
    </div>
  )
}
