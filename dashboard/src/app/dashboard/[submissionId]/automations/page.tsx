'use client'

import { useMemo } from 'react'
import { useSubmissionStore } from '@/lib/stores/submission-store'
import { formatCurrency } from '@/lib/calculations'

export default function AutomationsPage() {
  const automationsWithValue = useSubmissionStore((s) => s.automationsWithValue)
  const taskCompressions = useSubmissionStore((s) => s.taskCompressions)

  // Group task compressions by automation
  const tasksByAutomation = useMemo(() => {
    const grouped: Record<string, Array<{
      name: string
      beforeMins: number
      afterMins: number
      reductionPct: number
    }>> = {}
    taskCompressions.forEach(task => {
      if (!grouped[task.automation]) grouped[task.automation] = []
      grouped[task.automation].push({
        name: task.task_name,
        beforeMins: task.before_mins,
        afterMins: task.after_mins,
        reductionPct: task.reduction_pct,
      })
    })
    return grouped
  }, [taskCompressions])

  // Sort by annual value descending
  const sortedAutomations = [...automationsWithValue].sort(
    (a, b) => b.annual_value - a.annual_value
  )

  // Calculate totals
  const totalValue = sortedAutomations.reduce((sum, a) => sum + a.annual_value, 0)
  const totalHours = sortedAutomations.reduce((sum, a) => sum + a.hours_per_week, 0)
  const totalFTE = totalHours / 40

  const getTypeClass = (fixType: string) => {
    if (fixType === 'capture') return 'capture'
    if (fixType === 'connect') return 'connect'
    return ''
  }

  return (
    <>
      <div className="page-header">
        <h1>Automations</h1>
        <p>Each automation shows the value it would unlock and which information gaps it fixes</p>
      </div>

      <div className="summary-bar">
        <div className="summary-item highlight">
          <div className="summary-value green">{formatCurrency(totalValue)}</div>
          <div className="summary-label">Total Annual Value</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{sortedAutomations.length}</div>
          <div className="summary-label">Automations</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{Math.round(totalHours)}</div>
          <div className="summary-label">Hours/Week Saved</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{totalFTE.toFixed(1)}</div>
          <div className="summary-label">FTE Equivalent</div>
        </div>
      </div>

      <div className="automation-grid">
        {sortedAutomations.map((automation) => {
          const tasks = tasksByAutomation[automation.automation] || []
          const fte = (automation.hours_per_week / 40).toFixed(1)

          return (
            <div key={automation.automation} className="automation-card">
              <div className="automation-card-header">
                <div>
                  <div className="automation-card-title">{automation.automation}</div>
                </div>
                <div className={`automation-card-type ${getTypeClass(automation.fix_type)}`}>
                  {automation.fix_type}
                </div>
              </div>

              <div className="automation-card-value">
                {formatCurrency(automation.annual_value)}
                <span>/year</span>
              </div>

              <div className="automation-stats">
                <div className="automation-stat">
                  <div className="automation-stat-value">{automation.info_types_fixable}</div>
                  <div className="automation-stat-label">Info Types</div>
                </div>
                <div className="automation-stat">
                  <div className="automation-stat-value">{automation.hours_per_week.toFixed(1)}</div>
                  <div className="automation-stat-label">Hrs/Week</div>
                </div>
                <div className="automation-stat">
                  <div className="automation-stat-value">{fte}</div>
                  <div className="automation-stat-label">FTE</div>
                </div>
              </div>

              {tasks.length > 0 && (
                <div className="automation-fixes">
                  {tasks.slice(0, 3).map((task) => (
                    <span key={task.name} className="fix-tag">
                      {task.name}
                    </span>
                  ))}
                  {tasks.length > 3 && (
                    <span className="fix-tag">+{tasks.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {sortedAutomations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#666' }}>
          No automation data available. Complete the questionnaire to see recommendations.
        </div>
      )}
    </>
  )
}
