import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { API_URL } from '../config'

export default function Expenses() {
  const [opexRows, setOpexRows] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rowsRes, summaryRes] = await Promise.all([
          axios.get(`${API_URL}/api/opex`),
          axios.get(`${API_URL}/api/opex/summary`),
        ])

        setOpexRows(rowsRes.data)
        setChartData(
          summaryRes.data.map((row) => ({
            category: row.category,
            Allocated: Number(row.allocated),
            Actual: Number(row.actual),
          }))
        )
      } catch (err) {
        console.error('Error fetching opex data:', err)
        setError('Could not load expense data. Check the server is running.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Expenses</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Departmental operating expense tracker</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">Loading expense data...</p>
      ) : (
        <>
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

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-slate-900">
                <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 sm:px-5 py-3 font-medium">Date</th>
                  <th className="px-4 sm:px-5 py-3 font-medium">Category</th>
                  <th className="px-4 sm:px-5 py-3 font-medium">Allocated</th>
                  <th className="px-4 sm:px-5 py-3 font-medium">Actual</th>
                  <th className="px-4 sm:px-5 py-3 font-medium">Variance</th>
                </tr>
              </thead>
              <tbody>
                {opexRows.map((row) => {
                  const variance = row.actualSpentUsd - row.allocatedBudgetUsd
                  const over = variance > 0
                  return (
                    <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="px-4 sm:px-5 py-3 text-slate-600 dark:text-slate-300">{row.expenseDate}</td>
                      <td className="px-4 sm:px-5 py-3 text-slate-600 dark:text-slate-300">{row.expenseCategory}</td>
                      <td className="px-4 sm:px-5 py-3 font-mono text-slate-900 dark:text-slate-100">${row.allocatedBudgetUsd}</td>
                      <td className="px-4 sm:px-5 py-3 font-mono text-slate-900 dark:text-slate-100">${row.actualSpentUsd}</td>
                      <td className={`px-4 sm:px-5 py-3 font-mono ${over ? 'text-red-400' : 'text-emerald-400'}`}>
                        {over ? '+' : ''}{variance.toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}