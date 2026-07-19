import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useState } from 'react'

const mockInvoices = [
  { invoice_id: 'INV-STRIPE-100234', customer_id: 'CUST-7821', amount_usd: 199, status: 'Paid', subscription_plan: 'Professional', created_at: '2026-07-01' },
  { invoice_id: 'INV-STRIPE-100235', customer_id: 'CUST-6612', amount_usd: 999, status: 'Paid', subscription_plan: 'Enterprise', created_at: '2026-07-02' },
  { invoice_id: 'INV-STRIPE-100236', customer_id: 'CUST-9034', amount_usd: 49, status: 'Failed', subscription_plan: 'Basic', created_at: '2026-07-03' },
  { invoice_id: 'INV-STRIPE-100237', customer_id: 'CUST-5521', amount_usd: 199, status: 'Refunded', subscription_plan: 'Professional', created_at: '2026-07-04' },
]

const mrrByTier = [
  { month: 'Apr', Basic: 4200, Professional: 12400, Enterprise: 18900 },
  { month: 'May', Basic: 4500, Professional: 13100, Enterprise: 19600 },
  { month: 'Jun', Basic: 4800, Professional: 14200, Enterprise: 21800 },
  { month: 'Jul', Basic: 5100, Professional: 15600, Enterprise: 24000 },
]

const statusStyles = {
  Paid: 'bg-emerald-400/10 text-emerald-400',
  Failed: 'bg-red-400/10 text-red-400',
  Refunded: 'bg-amber-400/10 text-amber-400',
  Draft: 'bg-slate-400/10 text-slate-400',
}

export default function Revenue() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? mockInvoices : mockInvoices.filter(i => i.status === filter)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Revenue & Billing</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Stripe invoice data and MRR breakdown</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">MRR by Subscription Tier</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={mrrByTier}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
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
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Invoices</h3>
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
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
                <tr key={inv.invoice_id} className="border-b border-slate-100 dark:border-slate-800/60">
                  <td className="px-4 sm:px-5 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs">{inv.invoice_id}</td>
                  <td className="px-4 sm:px-5 py-3 text-slate-600 dark:text-slate-300">{inv.customer_id}</td>
                  <td className="px-4 sm:px-5 py-3 text-slate-900 dark:text-slate-100 font-mono">${inv.amount_usd}</td>
                  <td className="px-4 sm:px-5 py-3 text-slate-600 dark:text-slate-300">{inv.subscription_plan}</td>
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
    </div>
  )
}