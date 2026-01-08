'use client'

import { formatCurrency, formatHours, formatFTE } from '@/lib/calculations'

interface AutomationCardProps {
  name: string
  annualValue: number
  infoTypes: number
  hoursPerWeek: number
  fixType: string
  tasks?: Array<{
    name: string
    beforeMins: number
    afterMins: number
    reductionPct: number
  }>
}

const fixTypeColors: Record<string, string> = {
  file_access: 'bg-info/20 text-info border-info/30',
  call_capture: 'bg-success/20 text-success border-success/30',
  comms_capture: 'bg-warning/20 text-warning border-warning/30',
  email_capture: 'bg-danger/20 text-danger border-danger/30',
  crm_sync: 'bg-info/20 text-info border-info/30',
  ad_data: 'bg-warning/20 text-warning border-warning/30',
}

const fixTypeLabels: Record<string, string> = {
  file_access: 'File Access',
  call_capture: 'Call Capture',
  comms_capture: 'Comms Capture',
  email_capture: 'Email Capture',
  crm_sync: 'CRM Sync',
  ad_data: 'Ad Data',
}

export function AutomationCard({
  name,
  annualValue,
  infoTypes,
  hoursPerWeek,
  fixType,
  tasks = [],
}: AutomationCardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-medium text-text-primary">{name}</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium border ${
            fixTypeColors[fixType] || 'bg-surface text-text-muted border-border'
          }`}>
            {fixTypeLabels[fixType] || fixType}
          </span>
        </div>
        <p className="text-3xl font-mono font-bold text-success">
          {formatCurrency(annualValue)}
          <span className="text-sm font-normal text-text-muted ml-1">/year</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="p-3 text-center">
          <p className="text-lg font-mono font-semibold text-text-primary">
            {infoTypes}
          </p>
          <p className="text-xs text-text-muted">Info Types</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-lg font-mono font-semibold text-text-primary">
            {formatHours(hoursPerWeek).replace(' hrs/week', '')}
          </p>
          <p className="text-xs text-text-muted">Hrs/Week</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-lg font-mono font-semibold text-text-primary">
            {formatFTE(hoursPerWeek).replace(' FTE', '')}
          </p>
          <p className="text-xs text-text-muted">FTE</p>
        </div>
      </div>

      {/* Task Examples */}
      {tasks.length > 0 && (
        <div className="p-4">
          <h4 className="text-xs uppercase tracking-wide text-text-dim mb-3">
            Task Compressions
          </h4>
          <div className="space-y-3">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-muted">{task.name}</span>
                  <span className="text-success font-mono">
                    -{task.reductionPct}%
                  </span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full"
                    style={{ width: `${100 - task.reductionPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
