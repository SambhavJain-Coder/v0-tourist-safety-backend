"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()

  const isPoliceRoute = pathname.startsWith("/police")

  if (isPoliceRoute) {
    return (
      <nav className="bg-slate-900/95 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/police" className="text-xl font-bold text-white hover:text-blue-200 transition-colors">
              Police Command
            </Link>
            <div className="flex space-x-6">
              <Link
                href="/police"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/police" ? "text-blue-300 font-semibold" : "text-slate-200 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/police/incidents"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/police/incidents" ? "text-blue-300 font-semibold" : "text-slate-200 hover:text-white"
                }`}
              >
                Incidents
              </Link>
              <Link
                href="/police/analytics"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/police/analytics" ? "text-blue-300 font-semibold" : "text-slate-200 hover:text-white"
                }`}
              >
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-emerald-500/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white hover:text-emerald-200 transition-colors">
            Tourist Safety
          </Link>
          <div className="flex space-x-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                pathname === "/dashboard" ? "text-emerald-300 font-semibold" : "text-slate-200 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/id-generator"
              className={`text-sm font-medium transition-colors ${
                pathname === "/id-generator" ? "text-emerald-300 font-semibold" : "text-slate-200 hover:text-white"
              }`}
            >
              Digital ID
            </Link>
            <Link
              href="/maps"
              className={`text-sm font-medium transition-colors ${
                pathname === "/maps" ? "text-emerald-300 font-semibold" : "text-slate-200 hover:text-white"
              }`}
            >
              Maps
            </Link>
            <Link
              href="/chat"
              className={`text-sm font-medium transition-colors ${
                pathname === "/chat" ? "text-emerald-300 font-semibold" : "text-slate-200 hover:text-white"
              }`}
            >
              AI Assistant
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
