import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const mockOpex = [
  { expense_date: '2026-07-01', expense_category: 'AWS Cloud Hosting', allocated_budget_usd: 8000, actual_spent_usd: 9200 },
  { expense_date: '2026-07-02', expense_category: 'Marketing Ads', allocated_budget_usd: 6000, actual_spent_usd: 5100 },
  { expense_date: '2026-07-03', expense_category: 'Software Licenses', allocated_budget_usd: 3000, actual_spent_usd: 3400 },
  { expense_date: '2026-07-04', expense_category: 'Office Rent', allocated_budget_usd: 12000, actual_spent_usd: 12000 },
  { expense_date: '2026-07-05', expense_category: 'Travel Expenses', allocated_budget_usd: 2500, actual_spent_usd: 1800 },
]

const chartData = mockOpex.map(o => ({
  category: o.expense_category,
  Allocated: o.allocated_budget_usd,
  Actual: o.actual_spent_usd,
}))

export default function Expenses() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Expenses</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Departmental operating expense tracker</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Allocated vs Actual Spend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="category" stroke="#64748b" fontSize={10} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#e2e8f0' }} />
            <Bar dataKey="Allocated" fill="#475569" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Actual" fill="#34d399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <th className="px-4 sm:px-5 py-3 font-medium">Date</th>
              <th className="px-4 sm:px-5 py-3 font-medium">Category</th>
              <th className="px-4 sm:px-5 py-3 font-medium">Allocated</th>
              <th className="px-4 sm:px-5 py-3 font-medium">Actual</th>
              <th className="px-4 sm:px-5 py-3 font-medium">Variance</th>
            </tr>
          </thead>
          <tbody>
            {mockOpex.map((row, i) => {
              const variance = row.actual_spent_usd - row.allocated_budget_usd
              const over = variance > 0
              return (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800/60">
                  <td className="px-4 sm:px-5 py-3 text-slate-600 dark:text-slate-300">{row.expense_date}</td>
                  <td className="px-4 sm:px-5 py-3 text-slate-600 dark:text-slate-300">{row.expense_category}</td>
                  <td className="px-4 sm:px-5 py-3 font-mono text-slate-900 dark:text-slate-100">${row.allocated_budget_usd}</td>
                  <td className="px-4 sm:px-5 py-3 font-mono text-slate-900 dark:text-slate-100">${row.actual_spent_usd}</td>
                  <td className={`px-4 sm:px-5 py-3 font-mono ${over ? 'text-red-400' : 'text-emerald-400'}`}>
                    {over ? '+' : ''}{variance}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}