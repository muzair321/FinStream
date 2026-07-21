import { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { API_URL } from '../config'

const statusStyles = {
  Paid: 'bg-emerald-400/10 text-emerald-400',
  Failed: 'bg-red-400/10 text-red-400',
  Refunded: 'bg-amber-400/10 text-amber-400',
  Draft: 'bg-slate-400/10 text-slate-400',
}

export default function Revenue() {
  const [invoices, setInvoices] = useState([])
  const [mrrByTier, setMrrByTier] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoicesRes, mrrRes] = await Promise.all([
          axios.get(`${API_URL}/api/invoices`),
          axios.get(`${API_URL}/api/invoices/mrr-by-tier`),
        ])

        setInvoices(invoicesRes.data)

        // Transform { "2026-05": { Basic: 4500, ... }, ... } into
        // [{ month: '2026-05', Basic: 4500, Professional: ..., Enterprise: ... }, ...]
        const transformedMrr = Object.entries(mrrRes.data).map(([month, tiers]) => ({
          month,
          Basic: Number(tiers.Basic || 0),
          Professional: Number(tiers.Professional || 0),
          Enterprise: Number(tiers.Enterprise || 0),
        }))
        setMrrByTier(transformedMrr)
      } catch (err) {
        console.error('Error fetching revenue data:', err)
        setError('Could not load revenue data. Check the server is running.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filtered = filter === 'all' ? invoices : invoices.filter((i) => i.status === filter)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Revenue & Billing</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Stripe invoice data and MRR breakdown</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">Loading revenue data...</p>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">MRR by Subscription Tier</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={mrrByTier}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#e2e8f0' }} />
                <Line type="monotone" dataKey="Basic" stroke="#64748b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Professional" stroke="#38bdf8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Enterprise" stroke="#34d399" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Invoices <span className="text-slate-400 dark:text-slate-500 font-normal">({filtered.length})</span>
              </h3>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md px-2 py-1.5 border border-slate-200 dark:border-slate-700"
              >
                <option value="all">All statuses</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-900">
                  <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-4 sm:px-5 py-3 font-medium">Invoice ID</th>
                    <th className="px-4 sm:px-5 py-3 font-medium">Customer</th>
                    <th className="px-4 sm:px-5 py-3 font-medium">Amount</th>
                    <th className="px-4 sm:px-5 py-3 font-medium">Plan</th>
                    <th className="px-4 sm:px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => (
                    <tr key={inv.invoiceId} className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="px-4 sm:px-5 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs">{inv.invoiceId}</td>
                      <td className="px-4 sm:px-5 py-3 text-slate-600 dark:text-slate-300">{inv.customerId}</td>
                      <td className="px-4 sm:px-5 py-3 text-slate-900 dark:text-slate-100 font-mono">${inv.amountUsd}</td>
                      <td className="px-4 sm:px-5 py-3 text-slate-600 dark:text-slate-300">{inv.subscriptionPlan}</td>
                      <td className="px-4 sm:px-5 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[inv.status]}`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}