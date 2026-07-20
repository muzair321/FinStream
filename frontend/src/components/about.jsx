import {
  Database, Server, Code2, GitBranch, Layers,
  CheckCircle2, Circle,
} from 'lucide-react'

// Inline SVG — lucide-react doesn't reliably ship a GitHub mark across versions
function GithubIcon({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

const architectureLayers = [
  { label: 'Data Sources', detail: 'Mock Stripe invoices, Access-style payroll, Excel opex tracker' },
  { label: 'Java Spring Boot API', detail: 'REST endpoints, JPA/Hibernate, PostgreSQL connection pooling' },
  { label: 'Python ETL Pipeline', detail: 'pandas cleaning, currency normalization, metric computation, forecasting' },
  { label: 'PostgreSQL (Neon)', detail: 'Central data warehouse — invoices, payroll, expenses, computed snapshots' },
  { label: 'React Dashboard', detail: 'Live charts and tables, Axios-driven, dark/light theming' },
]

const credits = [
  {
    name: 'Shahwar Haider',
    role: 'Financial Data Engineer',
    contributions: [
      'Python ETL pipeline design (pandas, SQLAlchemy)',
      'PKR → USD normalization logic',
      'Missing-data handling for the expense tracker',
      'Core financial metric formulas (MRR, burn rate, budget variance)',
    ],
  },
  {
    name: 'Uzair',
    role: 'Full-Stack Infrastructure Engineer',
    contributions: [
      'Spring Boot REST API — all endpoints, entities, and services',
      'PostgreSQL schema design and Neon migration',
      'React dashboard — all six tabs, charts, and upload flow',
      'File upload pipeline with source-type validation and status tracking',
    ],
  },
]

const techStack = [
  { name: 'React + Vite', icon: Code2, status: 'live' },
  { name: 'Spring Boot', icon: Server, status: 'live' },
  { name: 'PostgreSQL (Neon)', icon: Database, status: 'live' },
  { name: 'Python (pandas)', icon: Code2, status: 'live' },
  { name: 'n8n Automation', icon: GitBranch, status: 'planned' },
  { name: 'Docker + Deployment', icon: Layers, status: 'planned' },
]

export default function About() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl">
      {/* Header — always full width */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">About FinStream</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-3xl">
          FinStream consolidates fragmented financial data — billing records, payroll, and departmental
          spend — into one live dashboard, replacing the manual spreadsheet reconciliation that finance
          teams typically do by hand.
        </p>
      </div>

      {/* Card sections — vertical on narrow screens, 2-column grid on wide screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* The problem */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">The Problem</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Financial data in most companies lives in three disconnected places: a billing platform (Stripe),
            a relational database (payroll, assets), and departmental spreadsheets. Someone has to manually
            pull all three together before anyone can answer a simple question like "what's our burn rate this
            month?" FinStream automates that reconciliation and computes the answer continuously instead of
            once a quarter.
          </p>
        </div>

        {/* Architecture */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">System Design</h3>
          <div className="space-y-2">
            {architectureLayers.map((layer, i) => (
              <div key={layer.label} className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1">
                  <span className="w-6 h-6 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {i < architectureLayers.length - 1 && (
                    <span className="w-px h-8 bg-slate-200 dark:bg-slate-700 mt-1" />
                  )}
                </div>
                <div className="pb-2">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{layer.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{layer.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How the pipeline works */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">How It Works</h3>
          <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside leading-relaxed">
            <li>Raw files (or a user upload) are read by the Python ETL pipeline.</li>
            <li>Data is cleaned — missing values are forward-filled, currencies normalized to USD.</li>
            <li>Clean tables are written into PostgreSQL, replacing the previous run's data.</li>
            <li>Core metrics (MRR, burn rate, runway, budget variance) are computed and snapshotted.</li>
            <li>A simple linear trend projects revenue and burn forward for the Forecast tab.</li>
            <li>The Spring Boot API serves all of this to the React dashboard in real time.</li>
          </ol>
        </div>

        {/* Tech stack */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">Tech Stack</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {techStack.map((tech) => {
              const Icon = tech.icon
              const isLive = tech.status === 'live'
              return (
                <div
                  key={tech.name}
                  className="flex items-center gap-2 p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
                >
                  <Icon size={16} className="text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{tech.name}</p>
                    <span className={`flex items-center gap-1 text-[10px] font-medium ${isLive ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isLive ? <CheckCircle2 size={10} /> : <Circle size={10} />}
                      {isLive ? 'Live' : 'Planned'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            n8n workflow automation and Docker-based deployment are part of the original design but not yet
            implemented — the pipeline currently runs on demand rather than on a schedule.
          </p>
        </div>

        {/* Credits — spans both columns on wide screens since it already has an internal 2-column grid */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 xl:col-span-2">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">Team & Credits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {credits.map((person) => (
              <div key={person.name} className="border border-slate-200 dark:border-slate-800 rounded-md p-4">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{person.name}</p>
                <p className="text-xs text-emerald-400 mb-2">{person.role}</p>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                  {person.contributions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer — always full width */}
      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 pt-2">
        <GithubIcon size={14} />
        <span>FinStream — built as a full-stack financial analytics portfolio project</span>
      </div>
    </div>
  )
}