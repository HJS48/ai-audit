'use client'

import { useSubmissionStore } from '@/lib/stores/submission-store'

export function TaskCompressions() {
  const taskCompressions = useSubmissionStore((s) => s.taskCompressions)

  // Sort by reduction percentage descending, take top 4
  const topTasks = [...taskCompressions]
    .sort((a, b) => b.reduction_pct - a.reduction_pct)
    .slice(0, 4)

  const formatMins = (mins: number) => {
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60)
      const remainingMins = mins % 60
      return remainingMins > 0 ? `${hrs}h ${remainingMins}m` : `${hrs} hour${hrs > 1 ? 's' : ''}`
    }
    return `${mins} min${mins > 1 ? 's' : ''}`
  }

  if (topTasks.length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Tasks That Become Instant</div>
          <div className="panel-action">View all →</div>
        </div>
        <p style={{ color: '#666', fontSize: '14px' }}>No task data available.</p>
      </div>
    )
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Tasks That Become Instant</div>
        <div className="panel-action">View all {taskCompressions.length} →</div>
      </div>
      {topTasks.map((task) => (
        <div key={task.task_name} className="task-item">
          <div className="task-header">
            <span className="task-name">{task.task_name}</span>
            <span className="task-reduction">-{task.reduction_pct}%</span>
          </div>
          <div className="task-bar">
            <div
              className="task-bar-before"
              style={{ width: `${100 - task.reduction_pct}%` }}
            />
            <div
              className="task-bar-after"
              style={{ width: `${task.reduction_pct}%` }}
            />
          </div>
          <div className="task-times">
            <span>Before: {formatMins(task.before_mins)}</span>
            <span>After: {formatMins(task.after_mins)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
