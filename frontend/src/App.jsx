import { useState } from 'react'
import { Menu, X } from 'lucide-react'

function TabContainer({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'revenue', label: 'Revenue & Billing' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'payroll', label: 'Payroll' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'uploads', label: 'Uploads' },
    { id: 'about', label: 'About' },
  ]

  const handleTabClick = (id) => {
    setActiveTab(id)
    setIsOpen(false) // auto-close drawer on mobile after picking a tab
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
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800
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
                className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-400/10 text-emerald-400 border-l-2 border-emerald-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

// --- Placeholder pages: replace each with real content later ---
function Home() {
  return <div className="p-4 sm:p-6 lg:p-8 text-slate-300">Home page — dashboard KPIs go here.</div>
}
function Revenue() {
  return <div className="p-4 sm:p-6 lg:p-8 text-slate-300">Revenue & Billing — Stripe invoice data goes here.</div>
}
function Expenses() {
  return <div className="p-4 sm:p-6 lg:p-8 text-slate-300">Expenses — departmental opex tracker goes here.</div>
}
function Payroll() {
  return <div className="p-4 sm:p-6 lg:p-8 text-slate-300">Payroll — internal payroll summary goes here.</div>
}
function Forecast() {
  return <div className="p-4 sm:p-6 lg:p-8 text-slate-300">Forecast — burn rate & runway projections go here.</div>
}
function Uploads() {
  return <div className="p-4 sm:p-6 lg:p-8 text-slate-300">Uploads — file upload & processing status goes here.</div>
}
function About() {
  return <div className="p-4 sm:p-6 lg:p-8 text-slate-300">About — project description goes here.</div>
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const tabLabels = {
    home: 'Home',
    revenue: 'Revenue & Billing',
    expenses: 'Expenses',
    payroll: 'Payroll',
    forecast: 'Forecast',
    uploads: 'Uploads',
    about: 'About',
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home': return <Home />
      case 'revenue': return <Revenue />
      case 'expenses': return <Expenses />
      case 'payroll': return <Payroll />
      case 'forecast': return <Forecast />
      case 'uploads': return <Uploads />
      case 'about': return <About />
      default: return <Home />
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <TabContainer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar with hamburger — hidden on desktop since the sidebar is always visible there */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-300 hover:text-emerald-400"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="text-slate-200 font-medium text-sm">{tabLabels[activeTab]}</span>
        </header>

        <main className="flex-1 overflow-x-hidden">{renderTabContent()}</main>
      </div>
    </div>
  )
}