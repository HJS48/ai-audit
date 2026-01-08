'use client'

import { useSubmissionStore } from '@/lib/stores/submission-store'

export function SlidersPanel() {
  const inputs = useSubmissionStore((s) => s.inputs)
  const setInput = useSubmissionStore((s) => s.setInput)

  const formatCurrency = (v: number) => `£${v.toLocaleString()}`
  const formatPercent = (v: number) => `${v}%`
  const formatNumber = (v: number) => v.toLocaleString()

  return (
    <div className="assumptions-panel">
      <div className="panel-header">
        <div className="panel-title">Adjust Assumptions</div>
        <div className="panel-action">Reset to defaults</div>
      </div>
      <div className="assumptions-grid">
        <div className="slider-group">
          <div className="slider-label">
            <span className="slider-name">Total Headcount</span>
            <span className="slider-value">{formatNumber(inputs.headcount)}</span>
          </div>
          <input
            type="range"
            min={5}
            max={200}
            step={5}
            value={inputs.headcount}
            onChange={(e) => setInput('headcount', Number(e.target.value))}
          />
        </div>
        <div className="slider-group">
          <div className="slider-label">
            <span className="slider-name">Average Salary</span>
            <span className="slider-value">{formatCurrency(inputs.avgSalary)}</span>
          </div>
          <input
            type="range"
            min={25000}
            max={100000}
            step={5000}
            value={inputs.avgSalary}
            onChange={(e) => setInput('avgSalary', Number(e.target.value))}
          />
        </div>
        <div className="slider-group">
          <div className="slider-label">
            <span className="slider-name">Number of Clients</span>
            <span className="slider-value">{formatNumber(inputs.numClients)}</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={inputs.numClients}
            onChange={(e) => setInput('numClients', Number(e.target.value))}
          />
        </div>
        <div className="slider-group">
          <div className="slider-label">
            <span className="slider-name">Avg Client Value</span>
            <span className="slider-value">{formatCurrency(inputs.avgClientValue)}</span>
          </div>
          <input
            type="range"
            min={10000}
            max={500000}
            step={10000}
            value={inputs.avgClientValue}
            onChange={(e) => setInput('avgClientValue', Number(e.target.value))}
          />
        </div>
        <div className="slider-group">
          <div className="slider-label">
            <span className="slider-name">Churn Rate</span>
            <span className="slider-value">{formatPercent(inputs.churnRate)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={inputs.churnRate}
            onChange={(e) => setInput('churnRate', Number(e.target.value))}
          />
        </div>
        <div className="slider-group">
          <div className="slider-label">
            <span className="slider-name">Deals Pitched / Year</span>
            <span className="slider-value">{formatNumber(inputs.dealsPerYear)}</span>
          </div>
          <input
            type="range"
            min={10}
            max={200}
            step={10}
            value={inputs.dealsPerYear}
            onChange={(e) => setInput('dealsPerYear', Number(e.target.value))}
          />
        </div>
        <div className="slider-group">
          <div className="slider-label">
            <span className="slider-name">Projects / Year</span>
            <span className="slider-value">{formatNumber(inputs.projectsPerYear)}</span>
          </div>
          <input
            type="range"
            min={20}
            max={500}
            step={20}
            value={inputs.projectsPerYear}
            onChange={(e) => setInput('projectsPerYear', Number(e.target.value))}
          />
        </div>
        <div className="slider-group">
          <div className="slider-label">
            <span className="slider-name">Extra Revisions / Project</span>
            <span className="slider-value">{formatNumber(inputs.revisionsPerProject)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={inputs.revisionsPerProject}
            onChange={(e) => setInput('revisionsPerProject', Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}
