'use client'

import { useSubmissionStore } from '@/lib/stores/submission-store'
import { formatCurrency, formatFTE } from '@/lib/calculations'

export function TopFixes() {
  const automationsWithValue = useSubmissionStore((s) => s.automationsWithValue)

  // Sort by annual value descending, take top 5
  const topFixes = [...automationsWithValue]
    .sort((a, b) => b.annual_value - a.annual_value)
    .slice(0, 5)

  if (topFixes.length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Top Fixes</div>
        </div>
        <p style={{ color: '#666', fontSize: '14px' }}>
          No automation data available yet.
        </p>
      </div>
    )
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Top Fixes</div>
        <div className="panel-action">Ranked by annual value</div>
      </div>
      {topFixes.map((fix) => (
        <div key={fix.automation} className="automation-item">
          <div>
            <div className="automation-name">{fix.automation}</div>
            <div className="automation-meta">
              {fix.info_types_fixable} info types • {fix.hours_per_week.toFixed(1)} hrs/week
            </div>
          </div>
          <div className="automation-fte">{formatFTE(fix.hours_per_week)}</div>
          <div className="automation-value">{formatCurrency(fix.annual_value)}</div>
        </div>
      ))}
    </div>
  )
}
