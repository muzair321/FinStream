import { useState } from 'react'
import { UploadCloud, FileText, CheckCircle2, Clock3, XCircle } from 'lucide-react'

const mockFiles = [
  { file_id: 1, filename: 'stripe_invoices_staging.csv', source_type: 'invoices', uploaded_at: '2026-07-18 10:22', status: 'processed' },
  { file_id: 2, filename: 'departmental_opsex_2025.xlsx', source_type: 'opex', uploaded_at: '2026-07-19 09:05', status: 'pending' },
  { file_id: 3, filename: 'access_internal_payroll.csv', source_type: 'payroll', uploaded_at: '2026-07-19 09:10', status: 'failed' },
]

const statusConfig = {
  processed: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Processed' },
  pending: { icon: Clock3, color: 'text-amber-400', label: 'Pending' },
  failed: { icon: XCircle, color: 'text-red-400', label: 'Failed' },
}

export default function Uploads() {
  const [dragActive, setDragActive] = useState(false)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Uploads</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Upload CSV or Excel files to feed the pipeline</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false) /* wire actual upload here */ }}
        className={`border-2 border-dashed rounded-lg p-8 sm:p-12 flex flex-col items-center justify-center text-center transition-colors ${
          dragActive
            ? 'border-emerald-400 bg-emerald-400/5'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
        }`}
      >
        <UploadCloud size={36} className="text-emerald-400 mb-3" />
        <p className="text-slate-700 dark:text-slate-300 font-medium">Drag and drop a file, or click to browse</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Accepts .csv and .xlsx only</p>
        <input type="file" accept=".csv,.xlsx" className="hidden" id="file-upload" />
        <label
          htmlFor="file-upload"
          className="mt-4 px-4 py-2 bg-emerald-400/10 text-emerald-400 text-sm font-medium rounded-md cursor-pointer hover:bg-emerald-400/20 transition-colors"
        >
          Choose File
        </label>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <th className="px-4 sm:px-5 py-3 font-medium">File</th>
              <th className="px-4 sm:px-5 py-3 font-medium">Source</th>
              <th className="px-4 sm:px-5 py-3 font-medium">Uploaded</th>
              <th className="px-4 sm:px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockFiles.map((f) => {
              const { icon: Icon, color, label } = statusConfig[f.status]
              return (
                <tr key={f.file_id} className="border-b border-slate-100 dark:border-slate-800/60">
                  <td className="px-4 sm:px-5 py-3 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <FileText size={16} className="text-slate-400" />
                    {f.filename}
                  </td>
                  <td className="px-4 sm:px-5 py-3 text-slate-600 dark:text-slate-400">{f.source_type}</td>
                  <td className="px-4 sm:px-5 py-3 text-slate-600 dark:text-slate-400">{f.uploaded_at}</td>
                  <td className="px-4 sm:px-5 py-3">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>
                      <Icon size={14} /> {label}
                    </span>
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