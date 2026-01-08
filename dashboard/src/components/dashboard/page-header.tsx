'use client'

import { useSubmissionStore } from '@/lib/stores/submission-store'
import { formatCurrency } from '@/lib/calculations'

export function PageHeader() {
  const costs = useSubmissionStore((s) => s.costs)
  const inputs = useSubmissionStore((s) => s.inputs)

  return (
    <div className="page-header">
      <h1>
        Your information gaps cost <span>{formatCurrency(costs.totalAnnualCost)}/year</span>
      </h1>
      <p>
        Based on {inputs.headcount} employees, £{(inputs.avgSalary / 1000).toFixed(0)}k avg salary,{' '}
        {inputs.numClients} clients at £{(inputs.avgClientValue / 1000).toFixed(0)}k average value
      </p>
    </div>
  )
}
