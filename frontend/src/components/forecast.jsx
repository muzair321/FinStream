import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Clock } from 'lucide-react'

const forecastData = [
  { month: 'May', actual: 41000, projected: null },
  { month: 'Jun', actual: 43900, projected: null },
  { month: 'Jul', actual: 48320, projected: 48320 },
  { month: 'Aug', actual: null, projected: 51200 },
  { month: 'Sep', actual: null, projected: 53800 },
  { month: 'Oct', actual: null, projected: 56100 },
]

export default function Forecast() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Forecast</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Cash flow projection and runway estimate</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5 inline-flex items-center gap-3">
        <Clock size={20} className="text-emerald-400" />
        <div>
          <span className="text-slate-500 dark:text-slate-400 text-sm block">Runway</span>
          <span className="text-2xl font-semibold font-mono text-slate-900 dark:text-slate-100">14.2 months</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Revenue: Actual vs Projected</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#e2e8f0' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="actual" stroke="#34d399" strokeWidth={2} name="Actual" connectNulls />
            <Line type="monotone" dataKey="projected" stroke="#38bdf8" strokeWidth={2} strokeDasharray="5 5" name="Projected" connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}