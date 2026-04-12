export default function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 text-sm">
            <span className="font-semibold text-white">Pinnacle Wealth Management</span>
            <span className="hidden md:inline text-blue-300">|</span>
            <span className="text-blue-200">&copy; 2026 All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a
              href="#"
              className="text-blue-200 hover:text-white transition-colors duration-150"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-blue-200 hover:text-white transition-colors duration-150"
            >
              Terms of Service
            </a>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-800 text-center text-xs text-blue-300">
          This is a demo application. All data shown is fictional and for illustration purposes only.
        </div>
      </div>
    </footer>
  )
}
