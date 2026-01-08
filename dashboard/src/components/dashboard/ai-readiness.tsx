'use client'

const capabilities = [
  { name: 'Query past client conversations', blocked: true },
  { name: 'AI meeting summaries', blocked: true },
  { name: 'Auto-surface at-risk clients', blocked: true },
  { name: 'Search all company knowledge', blocked: true },
  { name: 'Auto-generate client reports', blocked: true },
  { name: 'Instant new hire onboarding', blocked: true },
]

export function AIReadiness() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">AI Readiness</div>
        <div className="panel-action">What becomes possible</div>
      </div>
      <div className="unlock-grid">
        {capabilities.map((cap) => (
          <div key={cap.name} className={`unlock-item ${!cap.blocked ? 'enabled' : ''}`}>
            <div className={`unlock-icon ${cap.blocked ? 'blocked' : ''}`}>
              {cap.blocked ? '✗' : '✓'}
            </div>
            <div className="unlock-text">{cap.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
