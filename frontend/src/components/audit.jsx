import { useState, useEffect } from 'react'
import { Clock3 } from 'lucide-react'
import axios from 'axios'
import { UploadCloud, FileText, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

const mockFiles = [
  { file_id: 1, filename: 'stripe_invoices_staging.csv', sourceType: 'invoices', uploadedAt: '2026-07-18 10:22', status: 'processed' },
  { file_id: 2, filename: 'departmental_opsex_2025.xlsx', sourceType: 'opex', uploadedAt: '2026-07-19 09:05', status: 'pending' },
  { file_id: 3, filename: 'access_internal_payroll.csv', sourceType: 'payroll', uploadedAt: '2026-07-19 09:10', status: 'failed' },
]

const statusConfig = {
  processed: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Processed' },
  pending: { icon: Clock3, color: 'text-amber-400', label: 'Pending' },
  failed: { icon: XCircle, color: 'text-red-400', label: 'Failed' },
}

function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function Audit() {
  const [dragActive, setDragActive] = useState(false)
  const [sourceType, setSourceType] = useState('invoices')
  const [uploadState, setUploadState] = useState('idle') // idle | uploading | success | error
  const [uploadMessage, setUploadMessage] = useState('')
  const [files, setFiles] = useState(mockFiles)

  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/upload')
      setFiles(res.data)
    } catch (err) {
      console.error('Error fetching uploaded files:', err)
    }
  }

  // Load the file list once when the tab first mounts
  useEffect(() => {
    fetchFiles()
  }, [])

  const handleUpload = async (file) => {
    if (!file) return

    setUploadState('uploading')
    setUploadMessage('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('sourceType', sourceType)

    try {
      const res = await axios.post('http://localhost:8080/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setUploadState('success')
      setUploadMessage(res.data)
      fetchFiles() // refresh the table so the new upload shows up immediately
    } catch (err) {
      setUploadState('error')
      setUploadMessage(err.response?.data || 'Upload failed. Check the server is running.')
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleUpload(file)
    e.target.value = ''
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Uploads</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Upload CSV or Excel files to feed the pipeline</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          handleUpload(e.dataTransfer.files[0])
        }}
        className={`border-2 border-dashed rounded-lg p-8 sm:p-12 flex flex-col items-center justify-center text-center transition-colors ${
          dragActive
            ? 'border-emerald-400 bg-emerald-400/5'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
        }`}
      >
        <UploadCloud size={36} className="text-emerald-400 mb-3" />
        <p className="text-slate-700 dark:text-slate-300 font-medium">Drag and drop a file, or click to browse</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Accepts .csv and .xlsx only</p>

        <input
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          id="file-upload"
          onChange={handleFileInputChange}
        />

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
          <label
            htmlFor="file-upload"
            className="px-4 py-2 bg-emerald-400/10 text-emerald-400 text-sm font-medium rounded-md cursor-pointer hover:bg-emerald-400/20 transition-colors"
          >
            Choose File
          </label>

          <select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
            className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md shadow-sm focus:outline-none focus:border-emerald-400"
          >
            <option value="invoices">Invoices (Stripe)</option>
            <option value="payroll">Payroll</option>
            <option value="opex">Departmental Expenses</option>
          </select>
        </div>

        {uploadState === 'uploading' && (
          <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-4">
            <Loader2 size={16} className="animate-spin" /> Uploading...
          </p>
        )}
        {uploadState === 'success' && (
          <p className="flex items-center gap-2 text-sm text-emerald-400 mt-4">
            <CheckCircle2 size={16} /> {uploadMessage}
          </p>
        )}
        {uploadState === 'error' && (
          <p className="flex items-center gap-2 text-sm text-red-400 mt-4">
            <XCircle size={16} /> {uploadMessage}
          </p>
        )}
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
            {files.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 sm:px-5 py-6 text-center text-slate-400 dark:text-slate-500">
                  No files uploaded yet.
                </td>
              </tr>
            ) : (
              files.map((f) => {
                const { icon: Icon, color, label } = statusConfig[f.status]
                return (
                  <tr key={f.fileId} className="border-b border-slate-100 dark:border-slate-800/60">
                    <td className="px-4 sm:px-5 py-3 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <FileText size={16} className="text-slate-400" />
                      {f.filename}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-slate-600 dark:text-slate-400 capitalize">{f.sourceType}</td>
                    <td className="px-4 sm:px-5 py-3 text-slate-600 dark:text-slate-400">{formatDate(f.uploadedAt)}</td>
                    <td className="px-4 sm:px-5 py-3">
                      <Icon size={16} className={color} />
                    </td>
                  </tr>
                )}
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}