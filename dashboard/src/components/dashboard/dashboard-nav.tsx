'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { name: 'Overview', href: 'overview' },
  { name: 'Information Flow', href: 'information-flow' },
  { name: 'Automations', href: 'automations' },
  { name: 'Action Plan', href: 'action-plan' },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="nav-tabs">
      {tabs.map((tab) => {
        const isActive = pathname.includes(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`nav-tab ${isActive ? 'active' : ''}`}
          >
            {tab.name}
          </Link>
        )
      })}
    </div>
  )
}
