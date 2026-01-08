// Client-side ROI calculation formulas
// These mirror the DB view logic for instant slider feedback

export interface SliderInputs {
  headcount: number
  avgSalary: number
  numClients: number
  avgClientValue: number
  churnRate: number // percentage (0-100)
  dealsPerYear: number
  projectsPerYear: number
  revisionsPerProject: number
  costPerRevision: number
  painTimeBleding: number // 1-4 scale
  painChurn: number // 1-4 scale
  painDeals: number // 1-4 scale
  painRework: number // 1-4 scale
}

export interface CostBreakdown {
  timeBleedingAnnual: number
  churnAnnual: number
  missedDealsAnnual: number
  reworkAnnual: number
  totalAnnualCost: number
}

// Constants from ROI model
const BASE_HOURS_PER_WEEK = 487.1 // for 25-person agency
const HOURS_PER_YEAR = 2080

export function calculateHourlyRate(avgSalary: number): number {
  return avgSalary / HOURS_PER_YEAR
}

export function calculatePainMultiplier(painScore: number): number {
  // Pain score is 1-4, multiplier = score / 2.5
  // Range: 0.4 (low pain) to 1.6 (high pain)
  return painScore / 2.5
}

export function calculateTimeBleedingAnnual(
  headcount: number,
  avgSalary: number,
  painScore: number
): number {
  const hourlyRate = calculateHourlyRate(avgSalary)
  const painMultiplier = calculatePainMultiplier(painScore)
  const headcountRatio = headcount / 25 // Normalized to base 25-person agency

  // Base hours × headcount ratio × pain multiplier × 52 weeks × hourly rate
  return BASE_HOURS_PER_WEEK * headcountRatio * painMultiplier * 52 * hourlyRate
}

export function calculateChurnAnnual(
  numClients: number,
  churnRate: number,
  avgClientValue: number,
  painScore: number
): number {
  const painMultiplier = calculatePainMultiplier(painScore)
  const churnRateDecimal = churnRate / 100

  // Clients × churn rate × 20% preventable × client value × 2 (replacement cost) × pain multiplier
  return numClients * churnRateDecimal * 0.2 * avgClientValue * 2 * painMultiplier
}

export function calculateMissedDealsAnnual(
  dealsPerYear: number,
  avgClientValue: number,
  painScore: number
): number {
  const painMultiplier = calculatePainMultiplier(painScore)

  // Deals × 5% missed due to info gaps × client value × pain multiplier
  return dealsPerYear * 0.05 * avgClientValue * painMultiplier
}

export function calculateReworkAnnual(
  projectsPerYear: number,
  revisionsPerProject: number,
  costPerRevision: number,
  painScore: number
): number {
  const painMultiplier = calculatePainMultiplier(painScore)

  // Projects × extra revisions × cost per revision × 50% avoidable × pain multiplier
  return projectsPerYear * revisionsPerProject * costPerRevision * 0.5 * painMultiplier
}

export function calculateFullROI(inputs: SliderInputs): CostBreakdown {
  const timeBleedingAnnual = calculateTimeBleedingAnnual(
    inputs.headcount,
    inputs.avgSalary,
    inputs.painTimeBleding
  )

  const churnAnnual = calculateChurnAnnual(
    inputs.numClients,
    inputs.churnRate,
    inputs.avgClientValue,
    inputs.painChurn
  )

  const missedDealsAnnual = calculateMissedDealsAnnual(
    inputs.dealsPerYear,
    inputs.avgClientValue,
    inputs.painDeals
  )

  const reworkAnnual = calculateReworkAnnual(
    inputs.projectsPerYear,
    inputs.revisionsPerProject,
    inputs.costPerRevision,
    inputs.painRework
  )

  return {
    timeBleedingAnnual,
    churnAnnual,
    missedDealsAnnual,
    reworkAnnual,
    totalAnnualCost: timeBleedingAnnual + churnAnnual + missedDealsAnnual + reworkAnnual,
  }
}

// For automation values - recalculated when hourly rate changes
export function calculateAutomationAnnualValue(
  hoursPerWeek: number,
  hourlyRate: number
): number {
  return hoursPerWeek * 52 * hourlyRate
}

// Format currency for display
export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `£${(value / 1000000).toFixed(1)}m`
  }
  if (value >= 1000) {
    return `£${Math.round(value / 1000)}k`
  }
  return `£${Math.round(value)}`
}

// Format hours for display
export function formatHours(hours: number): string {
  return `${Math.round(hours)} hrs/week`
}

// Format FTE for display
export function formatFTE(hours: number): string {
  const fte = hours / 40 // 40 hours per week
  return `${fte.toFixed(1)} FTE`
}
