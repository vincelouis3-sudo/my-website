import { Link } from 'react-router-dom'
import WeatherWidget from '../components/WeatherWidget'

const pets = [
  { id: 1, name: "Biscuit", type: "Golden Retriever", fact: "Loves to shred financial reports — only the bearish ones.", img: "https://placedog.net/400/300?id=1" },
  { id: 2, name: "Mochi", type: "Tabby Cat", fact: "Has predicted 3 out of 3 market corrections by napping on the keyboard.", img: "https://cataas.com/cat?width=400&height=300&t=1" },
  { id: 3, name: "Duke", type: "Border Collie", fact: "Manages the office calendar and has never double-booked.", img: "https://placedog.net/400/300?id=5" },
  { id: 4, name: "Luna", type: "Siamese Cat", fact: "Sits in on every earnings call. Has strong opinions about Q3.", img: "https://cataas.com/cat?width=400&height=300&t=2" },
  { id: 5, name: "Archie", type: "Beagle", fact: "Certified emotional support animal during volatile trading sessions.", img: "https://placedog.net/400/300?id=10" },
  { id: 6, name: "Cleo", type: "Persian Cat", fact: "Has a higher Sharpe ratio than most mutual funds.", img: "https://cataas.com/cat?width=400&height=300&t=3" },
]

const features = [
  {
    to: '/client',
    icon: '👤',
    title: 'Client View',
    description: 'A full portfolio dashboard with real-time performance, asset allocation, holdings, and transaction history — all designed for clarity.',
    color: 'border-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    iconBg: 'bg-blue-100 dark:bg-blue-800/40',
  },
  {
    to: '/advisor',
    icon: '📊',
    title: 'Advisor View',
    description: 'Book-of-business management with client tables, revenue tracking, AUM breakdown, and at-risk client alerts.',
    color: 'border-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    iconBg: 'bg-purple-100 dark:bg-purple-800/40',
  },
  {
    to: '/back-office',
    icon: '⚙️',
    title: 'Back Office',
    description: 'Operations command center — action queues, compliance alerts, onboarding pipeline, and real-time activity feeds.',
    color: 'border-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    iconBg: 'bg-amber-100 dark:bg-amber-800/40',
  },
  {
    to: '/executive',
    icon: '🏛️',
    title: 'Executive View',
    description: 'C-suite intelligence: firm-wide KPIs, AUM trends, advisor leaderboard, business mix, and strategic risk overview.',
    color: 'border-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconBg: 'bg-emerald-100 dark:bg-emerald-800/40',
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 py-32 md:py-44"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2848 50%, #1a4a7a 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Fintech Demo Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Modern Wealth Management,{' '}
            <span className="text-blue-300">Reimagined</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Explore cutting-edge financial technology UI/UX designed for clients, advisors, and executives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/client"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1e3a5f] font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:bg-blue-50 transition-colors duration-200"
            >
              Explore Client View
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/executive"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white font-semibold px-8 py-3.5 rounded-lg border border-white/40 hover:bg-white/10 transition-colors duration-200"
            >
              Executive Dashboard
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto w-full">
          {[
            { value: '$4.2B', label: 'Assets Under Management' },
            { value: '1,847', label: 'Active Clients' },
            { value: '98', label: 'Advisors' },
            { value: '96.2%', label: 'Client Retention' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-blue-300 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="bg-white dark:bg-gray-900 py-20 px-6 transition-colors duration-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a5f] dark:text-blue-300 mb-3">Explore the Platform</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Four purpose-built dashboards, each tailored to a distinct role in the wealth management ecosystem.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.to}
                className={`group rounded-xl border-t-4 ${f.color} ${f.bg} p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col`}
              >
                <div className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center text-2xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300 mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1">{f.description}</p>
                <Link
                  to={f.to}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#1e3a5f] dark:text-blue-300 hover:underline group-hover:gap-2 transition-all duration-150"
                >
                  View Demo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Pet Gallery */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20 px-6 transition-colors duration-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a5f] dark:text-blue-300 mb-3">Meet Our Office Pets</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">A little fun in a world of finance.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-default"
              >
                <div className="relative h-52 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={pet.img}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div
                    className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900"
                    style={{ display: 'none' }}
                  >
                    <span className="text-5xl">{pet.type.includes('Cat') ? '🐱' : '🐶'}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-blue-300">{pet.name}</h3>
                    <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full">
                      {pet.type}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic leading-relaxed">"{pet.fact}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1a4a7a 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to see the full platform?
          </h2>
          <p className="text-blue-200 mb-8">
            Pick any dashboard below and explore the complete demo experience.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {features.map((f) => (
              <Link
                key={f.to}
                to={f.to}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
              >
                {f.icon} {f.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
