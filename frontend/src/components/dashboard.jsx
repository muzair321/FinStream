import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Flame, Clock, Target } from 'lucide-react'

// --- Mock data — replace with API calls once Spring Boot endpoints exist ---
const kpis = [
  { label: 'MRR', value: '$48,320', change: '+12.4%', icon: TrendingUp, positive: true },
  { label: 'Burn Rate', value: '$31,900/mo', change: '+3.1%', icon: Flame, positive: false },
  { label: 'Runway', value: '14.2 mo', change: '-0.8 mo', icon: Clock, positive: false },
  { label: 'Budget Variance', value: '+6.7%', change: 'over budget', icon: Target, positive: false },
]

const revenueTrend = [
  { month: 'Jan', revenue: 32000 },
  { month: 'Feb', revenue: 34500 },
  { month: 'Mar', revenue: 33800 },
  { month: 'Apr', revenue: 38200 },
  { month: 'May', revenue: 41000 },
  { month: 'Jun', revenue: 43900 },
  { month: 'Jul', revenue: 485320 },
]

const budgetByDept = [
  { department: 'Engineering', allocated: 42000, actual: 45200 },
  { department: 'Marketing', allocated: 18000, actual: 16400 },
  { department: 'Sales', allocated: 15000, actual: 17800 },
  { department: 'HR', allocated: 8000, actual: 7600 },
  { department: 'Executive', allocated: 12000, actual: 13100 },
]

function KpiCard({ label, value, change, icon: Icon, positive }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</span>
        <Icon size={18} className="text-emerald-400" />
      </div>
      <span className="text-2xl font-semibold text-slate-900 dark:text-slate-100 font-mono">{value}</span><br></br>
      <span className={`text-xs font-medium ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
        {change}
      </span>
    </div>
  )
}

export default function Dashboard({ theme }) {
  const isDark = theme === 'dark'
  const gridColor = isDark ? '#1e293b' : '#e2e8f0'
  const axisColor = isDark ? '#64748b' : '#475569'
  const tooltipBg = isDark ? '#0f172a' : '#ffffff'

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dashboard</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Overview of key financial metrics</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue trend line chart */}
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
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#34d399"
                strokeWidth={2}
                dot={{ fill: '#34d399', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Budget vs actual bar chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Budget vs Actual by Department</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={budgetByDept}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="department" stroke={axisColor} fontSize={11} />
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
    </div>
  )
}