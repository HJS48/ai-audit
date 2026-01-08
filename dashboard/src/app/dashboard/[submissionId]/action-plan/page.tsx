'use client'

import { useSubmissionStore } from '@/lib/stores/submission-store'
import { formatCurrency } from '@/lib/calculations'

export default function ActionPlanPage() {
  const automationsWithValue = useSubmissionStore((s) => s.automationsWithValue)

  // Sort by annual value and split into 3 phases
  const sorted = [...automationsWithValue].sort((a, b) => b.annual_value - a.annual_value)

  const phases = [
    { name: 'Foundation', weeks: 'Weeks 1-4', items: sorted.slice(0, 2) },
    { name: 'Integration', weeks: 'Weeks 5-8', items: sorted.slice(2, 4) },
    { name: 'Optimization', weeks: 'Weeks 9-12', items: sorted.slice(4) },
  ].filter(p => p.items.length > 0)

  // Calculate totals
  const totalValue = sorted.reduce((sum, a) => sum + a.annual_value, 0)
  const totalFTE = sorted.reduce((sum, a) => sum + a.hours_per_week, 0) / 40

  return (
    <>
      <div className="page-header">
        <h1>Action Plan</h1>
        <p>Your 12-week implementation roadmap</p>
      </div>

      <div className="summary-bar">
        <div className="summary-item highlight">
          <div className="summary-value green">{formatCurrency(totalValue)}</div>
          <div className="summary-label">Total Value</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{totalFTE.toFixed(1)}</div>
          <div className="summary-label">FTE Recovered</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{sorted.length}</div>
          <div className="summary-label">Automations</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">12</div>
          <div className="summary-label">Weeks</div>
        </div>
      </div>

      <div className="roadmap">
        {phases.map((phase, phaseIndex) => {
          const phaseValue = phase.items.reduce((sum, a) => sum + a.annual_value, 0)
          const phaseFTE = phase.items.reduce((sum, a) => sum + a.hours_per_week, 0) / 40

          return (
            <div key={phase.name} className="roadmap-phase">
              <div className="phase-header">
                <div className="phase-title">
                  <div className={`phase-number ${phaseIndex === 0 ? 'active' : ''}`}>
                    {phaseIndex + 1}
                  </div>
                  <div>
                    <div className="phase-name">{phase.name}</div>
                    <div className="phase-timeline">{phase.weeks}</div>
                  </div>
                </div>
                <div className="phase-value">
                  <div className="phase-value-amount">{formatCurrency(phaseValue)}</div>
                  <div className="phase-value-label">{phaseFTE.toFixed(1)} FTE</div>
                </div>
              </div>

              <div className="phase-items">
                {phase.items.map((automation) => (
                  <div key={automation.automation} className="phase-item">
                    <div className="phase-item-info">
                      <div className="phase-item-icon">
                        {automation.fix_type === 'capture' ? '📥' : '🔗'}
                      </div>
                      <div>
                        <div className="phase-item-name">{automation.automation}</div>
                        <div className="phase-item-desc">
                          {automation.info_types_fixable} info types • {automation.fix_type}
                        </div>
                      </div>
                    </div>
                    <div className="phase-item-value">
                      <div className="phase-item-amount">{formatCurrency(automation.annual_value)}</div>
                      <div className="phase-item-fte">
                        {(automation.hours_per_week / 40).toFixed(1)} FTE
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {phases.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#666' }}>
          No automation data available. Complete the questionnaire to see your action plan.
        </div>
      )}
    </>
  )
}
