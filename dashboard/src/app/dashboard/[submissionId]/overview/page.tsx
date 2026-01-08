'use client'

import { PageHeader } from '@/components/dashboard/page-header'
import { FinancialSummary } from '@/components/dashboard/financial-summary'
import { SlidersPanel } from '@/components/dashboard/sliders-panel'
import { TopFixes } from '@/components/dashboard/top-fixes'
import { TaskCompressions } from '@/components/dashboard/task-compressions'
import { KeyPersonRisk } from '@/components/dashboard/key-person-risk'
import { AIReadiness } from '@/components/dashboard/ai-readiness'

export default function OverviewPage() {
  return (
    <>
      <PageHeader />
      <FinancialSummary />
      <SlidersPanel />
      <div className="two-col">
        <TopFixes />
        <TaskCompressions />
      </div>
      <div className="two-col">
        <KeyPersonRisk />
        <AIReadiness />
      </div>
    </>
  )
}
