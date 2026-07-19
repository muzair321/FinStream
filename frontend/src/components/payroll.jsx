import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Aggregated only — no individual salaries shown, even in a demo
const deptCosts = [
  { department: 'Engineering', totalCostUsd: 62400 },
  { department: 'Marketing', totalCostUsd: 21800 },
  { department: 'Sales', totalCostUsd: 24600 },
  { department: 'HR', totalCostUsd: 11200 },
  { department: 'Executive', totalCostUsd: 34500 },
]

export default function Payroll() {
  const total = deptCosts.reduce((sum, d) => sum + d.totalCostUsd, 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Payroll</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Department-level payroll cost summary</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5 inline-block">
        <span className="text-slate-500 dark:text-slate-400 text-sm">Total Monthly Payroll</span>
        <p className="text-2xl font-semibold font-mono text-slate-900 dark:text-slate-100">${total.toLocaleString()}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Cost by Department</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={deptCosts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" stroke="#64748b" fontSize={12} />
            <YAxis type="category" dataKey="department" stroke="#64748b" fontSize={12} width={90} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#e2e8f0' }} />
            <Bar dataKey="totalCostUsd" fill="#34d399" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}