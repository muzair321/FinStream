import { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Clock } from 'lucide-react'
import { API_URL } from '../config'

export default function Forecast({ theme }) {
  const isDark = theme === 'dark'
  const gridColor = isDark ? '#1e293b' : '#e2e8f0'
  const axisColor = isDark ? '#64748b' : '#475569'
  const tooltipBg = isDark ? '#0f172a' : '#ffffff'

  const [chartData, setChartData] = useState([])
  const [runway, setRunway] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revenueRes, forecastRes, snapshotRes] = await Promise.all([
          axios.get('${API_URL}/api/invoices/revenue-trend'),
          axios.get('${API_URL}/api/forecast'),
          axios.get('${API_URL}/api/metrics/latest'),
        ])

        const actualPoints = Object.entries(revenueRes.data).map(([month, revenue]) => ({
          month,
          actual: Number(revenue),
          projected: null,
        }))

        const projectedPoints = forecastRes.data.map((row) => ({
          month: row.forecastDate.slice(0, 7), // "2026-08-15" -> "2026-08"
          actual: null,
          projected: Number(row.projectedRevenue),
        }))

        // Bridge point: last actual month also gets a projected value,
        // so the dashed line connects visually instead of jumping
        if (actualPoints.length > 0 && projectedPoints.length > 0) {
          actualPoints[actualPoints.length - 1].projected = actualPoints[actualPoints.length - 1].actual
        }

        setChartData([...actualPoints, ...projectedPoints])
        setRunway(snapshotRes.data?.runwayMonths ?? null)
      } catch (err) {
        console.error('Error fetching forecast data:', err)
        setError('Could not load forecast data. Check the server is running.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Forecast</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Cash flow projection based on a linear trend of historical revenue
        </p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">Loading forecast...</p>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5 inline-flex items-center gap-3">
            <Clock size={20} className="text-emerald-400" />
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-sm block">Runway</span>
              <span className="text-2xl font-semibold font-mono text-slate-900 dark:text-slate-100">
                {runway ? `${Number(runway).toFixed(1)} months` : '∞'}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Revenue: Actual vs Projected</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              Projection is a simple linear trend, not a full time-series model — treat as a rough estimate.
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${gridColor}`, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="actual" stroke="#34d399" strokeWidth={2} name="Actual" connectNulls />
                <Line type="monotone" dataKey="projected" stroke="#38bdf8" strokeWidth={2} strokeDasharray="5 5" name="Projected" connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}