'use client'

import { useMemo } from 'react'
import { useSubmissionStore } from '@/lib/stores/submission-store'

export function KeyPersonRisk() {
  const gaps = useSubmissionStore((s) => s.gaps)

  // Count "dying" status info types per department (info in heads only)
  const riskByDept = useMemo(() => {
    const deptRisk: Record<string, number> = {}

    gaps.forEach(gap => {
      if (gap.status === 'dying') {
        deptRisk[gap.from_dept] = (deptRisk[gap.from_dept] || 0) + 1
      }
    })

    return Object.entries(deptRisk)
      .map(([dept, count]) => ({ dept, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [gaps])

  if (riskByDept.length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Key Person Risk</div>
          <div className="panel-action">If someone leaves, what walks out?</div>
        </div>
        <p style={{ color: '#666', fontSize: '14px' }}>No high-risk information identified.</p>
      </div>
    )
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Key Person Risk</div>
        <div className="panel-action">If someone leaves, what walks out?</div>
      </div>
      <div className="risk-grid">
        {riskByDept.map((item, index) => (
          <div
            key={item.dept}
            className={`risk-card ${index < 3 ? 'high' : ''}`}
          >
            <div className="risk-dept">{item.dept}</div>
            <div className="risk-value">{item.count}</div>
            <div className="risk-label">info types in heads</div>
          </div>
        ))}
      </div>
    </div>
  )
}
