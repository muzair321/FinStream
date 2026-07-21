import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Dashboard from './components/dashboard.jsx'
import { useTheme, ThemeToggle } from './theme/ThemeToggle'
import Revenue from './components/revenue.jsx'
import Expenses from './components/expenses.jsx'
import Payroll from './components/payroll.jsx'
import Forecast from './components/forecast.jsx'
import Audit from './components/audit.jsx'
import About from './components/about.jsx'
import { Download } from 'lucide-react'
import axios from 'axios'
import { API_URL } from './config.js'

function TabContainer({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const tabs = [
    { id: 'home', label: 'Dashboard' },
    { id: 'revenue', label: 'Revenue & Billing' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'payroll', label: 'Payroll' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'audit', label: 'Audited Files' },
    { id: 'about', label: 'About' },
  ]

  const handleTabClick = (id) => {
    setActiveTab(id)
    setIsOpen(false) // auto-close drawer on mobile after picking a tab
  }
  const handleExport = async () => {
    try {
      const res = await axios.get('${API_URL}/api/export/excel', {
        responseType: 'blob', // tells axios to expect binary data, not JSON
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'finstream_export.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
      alert('Export failed. Check the server is running.')
    }
  }

  return (
    <>
      {/* Backdrop, mobile only, shown when drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 fixed md:static top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800
          flex flex-col z-40 transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="px-6 py-6 border-b border-slate-800 flex items-center justify-between">
          <h1 className="text-xl font-mono font-semibold text-emerald-400 tracking-tight">
            FinStream
          </h1>
          <button
            className="md:hidden text-slate-400 hover:text-slate-200"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <ul className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => handleTabClick(tab.id)}
                className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                    ? 'bg-emerald-400/10 text-emerald-400 border-l-2 border-emerald-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="px-3 py-4 border-t border-slate-800">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 transition-colors"
          >
            <Download size={16} />
            Export Data (Excel)
          </button>
        </div>
      </nav>
    </>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [theme, setTheme] = useTheme()

  const tabLabels = {
    home: 'Dashboard',
    revenue: 'Revenue & Billing',
    expenses: 'Expenses',
    payroll: 'Payroll',
    forecast: 'Forecast',
    uploads: 'Audited Files',
    about: 'About',
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard theme={theme} />
      case 'revenue': return <Revenue />
      case 'expenses': return <Expenses />
      case 'payroll': return <Payroll />
      case 'forecast': return <Forecast />
      case 'audit': return <Audit />
      case 'about': return <About />
      default: return <Home />
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <TabContainer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-slate-500 dark:text-slate-300 hover:text-emerald-500"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <span className="text-slate-700 dark:text-slate-200 font-medium text-sm">
              {tabLabels[activeTab]}
            </span>
          </div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </header>

        <main className="flex-1 overflow-x-hidden">{renderTabContent()}</main>
      </div>
    </div>
  )
}