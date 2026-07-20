import { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Flame, Clock, Target } from 'lucide-react'




function KpiCard({ label, value, icon: Icon, change }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</span>
        <Icon size={18} className="text-emerald-400" />
      </div>
      <span className="text-2xl font-semibold text-slate-900 dark:text-slate-100 font-mono block mt-1">
        {value}
      </span>
      {change ? (
        <span className={`text-xs font-medium ${change.positive ? 'text-emerald-400' : 'text-red-400'}`}>
          {change.text} vs last quarter
        </span>
      ) : (
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          Not enough history yet
        </span>
      )}
    </div>
  )
}

export default function Dashboard({ theme }) {
  const isDark = theme === 'dark'
  const gridColor = isDark ? '#1e293b' : '#e2e8f0'
  const axisColor = isDark ? '#64748b' : '#475569'
  const tooltipBg = isDark ? '#0f172a' : '#ffffff'

  const [dashboardData, setDashboardData] = useState(null)
  const [revenueTrend, setRevenueTrend] = useState([])
  const [budgetByCategory, setBudgetByCategory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashboardRes, revenueRes, opexRes] = await Promise.all([
          axios.get('http://localhost:8080/api/metrics/latest-with-change'),
          axios.get('http://localhost:8080/api/invoices/revenue-trend'),
          axios.get('http://localhost:8080/api/opex/summary'),
        ])

        setDashboardData(dashboardRes.data)

        setRevenueTrend(
          Object.entries(revenueRes.data).map(([month, revenue]) => ({
            month,
            revenue: Number(revenue),
          }))
        )

        setBudgetByCategory(
          opexRes.data.map((row) => ({
            category: row.category,
            allocated: Number(row.allocated),
            actual: Number(row.actual),
          }))
        )
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Could not load dashboard data. Check the server is running.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const snapshot = dashboardData?.snapshot
  const changes = dashboardData?.changes

  const formatChange = (val, higherIsBetter = true) => {
    if (val === null || val === undefined) return null
    const positive = higherIsBetter ? val >= 0 : val <= 0
    return { text: `${val > 0 ? '+' : ''}${val.toFixed(1)}%`, positive }
  }

  const kpis = snapshot
    ? [
      {
        label: 'MRR',
        value: `$${Number(snapshot.mrr).toLocaleString()}`,
        icon: TrendingUp,
        change: formatChange(changes?.mrr, true), // higher MRR = good
      },
      {
        label: 'Burn Rate',
        value: `$${Number(snapshot.burnRate).toLocaleString()}/mo`,
        icon: Flame,
        change: formatChange(changes?.burnRate, false), // higher burn = bad
      },
      {
        label: 'Runway',
        value: snapshot.runwayMonths ? `${Number(snapshot.runwayMonths).toFixed(1)} mo` : '∞',
        icon: Clock,
        change: formatChange(changes?.runwayMonths, true), // more runway = good
      },
      {
        label: 'Budget Variance',
        value: `${Number(snapshot.budgetVariancePct).toFixed(1)}%`,
        icon: Target,
        change: formatChange(changes?.budgetVariancePct, false), // more over-budget = bad
      },
    ]
    : []

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dashboard</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Overview of key financial metrics</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">Loading dashboard...</p>
      ) : !snapshot ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">
          No metrics snapshot yet — run the ETL pipeline to generate one.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.label} {...kpi} />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
                  <YAxis stroke={axisColor} fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${gridColor}`, borderRadius: 8 }}
                    labelStyle={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={2} dot={{ fill: '#34d399', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Budget vs Actual by Category</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={budgetByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="category" stroke={axisColor} fontSize={10} />
                  <YAxis stroke={axisColor} fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${gridColor}`, borderRadius: 8 }}
                    labelStyle={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="allocated" fill="#475569" radius={[4, 4, 0, 0]} name="Allocated" />
                  <Bar dataKey="actual" fill="#34d399" radius={[4, 4, 0, 0]} name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}