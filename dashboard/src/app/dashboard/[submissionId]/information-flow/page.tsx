'use client'

import { useState, useMemo } from 'react'
import { useSubmissionStore } from '@/lib/stores/submission-store'

// Circular layout positions matching HTML prototype
const deptPositions: Record<string, { left: string; top: string; transform?: string }> = {
  'Account Management': { left: '50%', top: '8%', transform: 'translateX(-50%)' },
  'Analytics': { left: '82%', top: '20%' },
  'Creative': { left: '95%', top: '45%', transform: 'translateX(-50%)' },
  'Finance': { left: '82%', top: '70%' },
  'HR': { left: '50%', top: '85%', transform: 'translateX(-50%)' },
  'Leadership': { left: '18%', top: '70%' },
  'Media': { left: '5%', top: '45%', transform: 'translateX(50%)' },
  'Operations': { left: '18%', top: '20%' },
  'Production': { left: '30%', top: '50%' },
  'Sales': { left: '70%', top: '50%' },
  'Strategy': { left: '50%', top: '50%', transform: 'translateX(-50%)' },
}

type Status = 'dying' | 'trapped' | 'partial' | 'poor' | 'healthy'

function getOverallStatus(gaps: Array<{ status: string }>): Status {
  const counts = { dying: 0, trapped: 0, poor: 0, partial: 0, healthy: 0 }
  gaps.forEach(g => {
    if (g.status in counts) counts[g.status as Status]++
  })
  if (counts.dying > 0) return 'dying'
  if (counts.trapped > 0) return 'trapped'
  if (counts.poor > 0) return 'poor'
  if (counts.partial > 0) return 'partial'
  return 'healthy'
}

export default function InformationFlowPage() {
  const gaps = useSubmissionStore((s) => s.gaps)
  const [selectedDept, setSelectedDept] = useState<string | null>(null)
  const [filter, setFilter] = useState<Status | 'all'>('all')

  // Calculate overall status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    gaps.forEach(g => {
      counts[g.status] = (counts[g.status] || 0) + 1
    })
    return counts
  }, [gaps])

  // Aggregate gaps by department
  const departments = useMemo(() => {
    const deptMap = new Map<string, typeof gaps>()
    gaps.forEach(gap => {
      const dept = gap.from_dept
      if (!deptMap.has(dept)) deptMap.set(dept, [])
      deptMap.get(dept)!.push(gap)
    })
    return Array.from(deptMap.entries()).map(([name, deptGaps]) => {
      const dyingCount = deptGaps.filter(g => g.status === 'dying').length
      const poorCount = deptGaps.filter(g => g.status === 'poor' || g.status === 'trapped').length
      return {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        position: deptPositions[name] || { left: '50%', top: '50%' },
        infoTypes: deptGaps.length,
        status: getOverallStatus(deptGaps),
        isHighRisk: dyingCount >= 10 || poorCount >= 15,
        gaps: deptGaps,
        dyingCount,
        poorCount,
      }
    })
  }, [gaps])

  const effectiveSelected = selectedDept ?? departments[0]?.name ?? null
  const filteredDepts = filter === 'all' ? departments : departments.filter(d => d.status === filter)
  const selectedDeptData = departments.find(d => d.name === effectiveSelected)
  const infoTypes = selectedDeptData?.gaps ?? []

  // Build page header text
  const headerParts: string[] = []
  if (statusCounts.dying) headerParts.push(`${statusCounts.dying} dying`)
  if (statusCounts.trapped) headerParts.push(`${statusCounts.trapped} trapped`)
  if (statusCounts.poor) headerParts.push(`${statusCounts.poor} poor`)
  if (statusCounts.partial) headerParts.push(`${statusCounts.partial} partial`)

  if (gaps.length === 0) {
    return (
      <div className="page-header">
        <h1>Information Flow</h1>
        <p>No information flow data. Complete the questionnaire to see your information gaps.</p>
      </div>
    )
  }

  return (
    <>
      <div className="page-header">
        <h1>
          <span>{gaps.length}</span> information types: {headerParts.join(', ')}
        </h1>
        <p>Click a department to see what information flows in and out</p>
      </div>

      <div className="flow-container">
        <div className="flow-viz">
          {filteredDepts.map((dept) => (
            <div
              key={dept.id}
              className={`dept-node ${effectiveSelected === dept.name ? 'selected' : ''}`}
              style={{
                left: dept.position.left,
                top: dept.position.top,
                transform: dept.position.transform,
              }}
              onClick={() => setSelectedDept(dept.name)}
            >
              <div className={`dept-circle ${dept.status} ${dept.isHighRisk ? 'high-risk' : ''}`}>
                {dept.infoTypes}
              </div>
              <div className="dept-label">{dept.name}</div>
            </div>
          ))}

          <div className="flow-legend">
            <div className="legend-item">
              <div className="legend-dot dying"></div>
              <span>Dying (in heads)</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot trapped"></div>
              <span>Trapped/Poor</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot healthy"></div>
              <span>Healthy</span>
            </div>
          </div>
        </div>

        <div className="flow-sidebar">
          <div className="flow-filters">
            <div className="filter-group">
              <div className="filter-label">Status</div>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`filter-btn dying ${filter === 'dying' ? 'active' : ''}`}
                  onClick={() => setFilter('dying')}
                >
                  Dying
                </button>
                <button
                  className={`filter-btn trapped ${filter === 'trapped' || filter === 'poor' ? 'active' : ''}`}
                  onClick={() => setFilter('poor')}
                >
                  Trapped
                </button>
                <button
                  className={`filter-btn healthy ${filter === 'healthy' || filter === 'partial' ? 'active' : ''}`}
                  onClick={() => setFilter('partial')}
                >
                  Healthy
                </button>
              </div>
            </div>
          </div>

          <div className="flow-details">
            {selectedDeptData ? (
              <>
                <div className="detail-header">{selectedDeptData.name}</div>
                <div className="detail-subtitle">
                  {selectedDeptData.infoTypes} info types · {selectedDeptData.dyingCount} dying, {selectedDeptData.poorCount} trapped
                </div>
                <div className="info-list">
                  {infoTypes
                    .sort((a, b) => b.mins_per_week - a.mins_per_week)
                    .map((info) => (
                      <div
                        key={info.info_type}
                        className={`info-item ${info.status === 'trapped' || info.status === 'poor' ? 'trapped' : ''}`}
                      >
                        <div className="info-item-name">{info.info_type}</div>
                        <div className="info-item-meta">
                          Stored in: {info.default_storage || 'Unknown'} · {info.mins_per_week} min/wk
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <p style={{ color: '#666', fontSize: '14px' }}>
                Click on a department node to see its information gaps.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
