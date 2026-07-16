import { useState } from 'react'

function TabContainer({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'revenue', label: 'Revenue & Billing' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'payroll', label: 'Payroll' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'uploads', label: 'Uploads' },
    { id: 'about', label: 'About' },
  ]

  return (
    <nav className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="px-6 py-6 border-b border-slate-800">
        <h1 className="text-xl font-mono font-semibold text-emerald-400 tracking-tight">
          FinStream
        </h1>
      </div>
      <ul className="flex-1 px-3 py-4 space-y-1">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              onClick={() => setActiveTab(tab.id)}
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
  )
}

// --- Placeholder pages: replace each with real content later ---
function Home() {
  return <div className="p-8 text-slate-300">Home page — dashboard KPIs go here.</div>
}
function Revenue() {
  return <div className="p-8 text-slate-300">Revenue & Billing — Stripe invoice data goes here.</div>
}
function Expenses() {
  return <div className="p-8 text-slate-300">Expenses — departmental opex tracker goes here.</div>
}
function Payroll() {
  return <div className="p-8 text-slate-300">Payroll — internal payroll summary goes here.</div>
}
function Forecast() {
  return <div className="p-8 text-slate-300">Forecast — burn rate & runway projections go here.</div>
}
function Uploads() {
  return <div className="p-8 text-slate-300">Uploads — file upload & processing status goes here.</div>
}
function About() {
  return <div className="p-8 text-slate-300">About — project description goes here.</div>
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

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
      <TabContainer activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">{renderTabContent()}</main>
    </div>
  )
}