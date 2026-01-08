'use client'

import { useSubmissionStore } from '@/lib/stores/submission-store'
import { formatCurrency } from '@/lib/calculations'

export function FinancialSummary() {
  const costs = useSubmissionStore((s) => s.costs)
  const inputs = useSubmissionStore((s) => s.inputs)

  const baseHoursPerWeek = 487.1
  const hoursPerWeek = Math.round(baseHoursPerWeek * (inputs.headcount / 25))
  const fteEquivalent = (hoursPerWeek * 52) / (40 * 52)

  return (
    <div className="cost-summary">
      <div className="cost-card primary">
        <div className="cost-card-label">Total Annual Cost</div>
        <div className="cost-card-value">{formatCurrency(costs.totalAnnualCost)}</div>
        <div className="cost-card-sub">
          Equivalent to <span>{fteEquivalent.toFixed(1)} full-time people</span>
        </div>
      </div>
      <div className="cost-card">
        <div className="cost-card-label">Time Bleeding</div>
        <div className="cost-card-value">{formatCurrency(costs.timeBleedingAnnual)}</div>
        <div className="cost-card-sub">{hoursPerWeek} hrs/week wasted</div>
      </div>
      <div className="cost-card">
        <div className="cost-card-label">Preventable Churn</div>
        <div className="cost-card-value">{formatCurrency(costs.churnAnnual)}</div>
        <div className="cost-card-sub">
          {(inputs.numClients * inputs.churnRate / 100 * 0.2).toFixed(1)} clients/year
        </div>
      </div>
      <div className="cost-card">
        <div className="cost-card-label">Missed Deals</div>
        <div className="cost-card-value">{formatCurrency(costs.missedDealsAnnual)}</div>
        <div className="cost-card-sub">{Math.round(inputs.dealsPerYear * 0.05)} extra deals possible</div>
      </div>
      <div className="cost-card">
        <div className="cost-card-label">Rework</div>
        <div className="cost-card-value">{formatCurrency(costs.reworkAnnual)}</div>
        <div className="cost-card-sub">{inputs.projectsPerYear * inputs.revisionsPerProject} wasted revisions</div>
      </div>
    </div>
  )
}
