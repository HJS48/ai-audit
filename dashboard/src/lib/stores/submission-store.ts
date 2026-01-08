import { create } from 'zustand'
import {
  SliderInputs,
  CostBreakdown,
  calculateFullROI,
  calculateHourlyRate,
  calculateAutomationAnnualValue
} from '@/lib/calculations'
import type {
  SubmissionFullROI,
  SubmissionAutomationROI,
  SubmissionGap,
  SubmissionDataMaturity,
  SubmissionTaskCompression
} from '@/types/database'

interface AutomationWithValue extends Omit<SubmissionAutomationROI, 'annual_value'> {
  annual_value: number // Recalculated based on current inputs
  original_annual_value: number // From server
}

interface SubmissionState {
  // Server data
  submissionId: string | null
  serverData: SubmissionFullROI | null
  automations: SubmissionAutomationROI[]
  gaps: SubmissionGap[]
  maturity: SubmissionDataMaturity[]
  taskCompressions: SubmissionTaskCompression[]

  // Client-side inputs (can be modified via sliders)
  inputs: SliderInputs

  // Calculated costs (recalculated on input change)
  costs: CostBreakdown

  // Recalculated automations
  automationsWithValue: AutomationWithValue[]

  // Derived values
  hourlyRate: number

  // Sync state
  isSyncing: boolean
  lastSyncedAt: Date | null

  // Actions
  setServerData: (data: {
    submission: SubmissionFullROI
    automations: SubmissionAutomationROI[]
    gaps: SubmissionGap[]
    maturity: SubmissionDataMaturity[]
    taskCompressions: SubmissionTaskCompression[]
  }) => void
  setInput: <K extends keyof SliderInputs>(field: K, value: SliderInputs[K]) => void
  resetToServerDefaults: () => void
  setSyncing: (syncing: boolean) => void
}

const defaultInputs: SliderInputs = {
  headcount: 25,
  avgSalary: 45000,
  numClients: 20,
  avgClientValue: 50000,
  churnRate: 10,
  dealsPerYear: 40,
  projectsPerYear: 100,
  revisionsPerProject: 2,
  costPerRevision: 200,
  painTimeBleding: 2.5,
  painChurn: 2.5,
  painDeals: 2.5,
  painRework: 2.5,
}

export const useSubmissionStore = create<SubmissionState>((set, get) => ({
  // Initial state
  submissionId: null,
  serverData: null,
  automations: [],
  gaps: [],
  maturity: [],
  taskCompressions: [],
  inputs: defaultInputs,
  costs: calculateFullROI(defaultInputs),
  automationsWithValue: [],
  hourlyRate: calculateHourlyRate(defaultInputs.avgSalary),
  isSyncing: false,
  lastSyncedAt: null,

  // Set server data and initialize inputs
  setServerData: ({ submission, automations, gaps, maturity, taskCompressions }) => {
    const inputs: SliderInputs = {
      headcount: submission.headcount,
      avgSalary: submission.avg_salary,
      numClients: submission.num_clients,
      avgClientValue: submission.avg_client_value,
      churnRate: 10, // Default, could come from submission
      dealsPerYear: 40, // Default
      projectsPerYear: 100, // Default
      revisionsPerProject: 2, // Default
      costPerRevision: 200, // Default
      painTimeBleding: 2.5, // Default
      painChurn: 2.5,
      painDeals: 2.5,
      painRework: 2.5,
    }

    const hourlyRate = calculateHourlyRate(inputs.avgSalary)
    const costs = calculateFullROI(inputs)

    // Recalculate automation values with current hourly rate
    const automationsWithValue: AutomationWithValue[] = automations.map(a => ({
      ...a,
      original_annual_value: a.annual_value,
      annual_value: calculateAutomationAnnualValue(a.hours_per_week, hourlyRate),
    }))

    set({
      submissionId: submission.submission_id,
      serverData: submission,
      automations,
      gaps,
      maturity,
      taskCompressions,
      inputs,
      costs,
      hourlyRate,
      automationsWithValue,
      lastSyncedAt: new Date(),
    })
  },

  // Update a single input and recalculate
  setInput: (field, value) => {
    const { inputs, automations } = get()
    const newInputs = { ...inputs, [field]: value }
    const costs = calculateFullROI(newInputs)
    const hourlyRate = calculateHourlyRate(newInputs.avgSalary)

    // Recalculate automation values
    const automationsWithValue: AutomationWithValue[] = automations.map(a => ({
      ...a,
      original_annual_value: a.annual_value,
      annual_value: calculateAutomationAnnualValue(a.hours_per_week, hourlyRate),
    }))

    set({
      inputs: newInputs,
      costs,
      hourlyRate,
      automationsWithValue,
    })
  },

  // Reset to server defaults
  resetToServerDefaults: () => {
    const { serverData, automations } = get()
    if (!serverData) return

    const inputs: SliderInputs = {
      headcount: serverData.headcount,
      avgSalary: serverData.avg_salary,
      numClients: serverData.num_clients,
      avgClientValue: serverData.avg_client_value,
      churnRate: 10,
      dealsPerYear: 40,
      projectsPerYear: 100,
      revisionsPerProject: 2,
      costPerRevision: 200,
      painTimeBleding: 2.5,
      painChurn: 2.5,
      painDeals: 2.5,
      painRework: 2.5,
    }

    const hourlyRate = calculateHourlyRate(inputs.avgSalary)
    const costs = calculateFullROI(inputs)

    const automationsWithValue: AutomationWithValue[] = automations.map(a => ({
      ...a,
      original_annual_value: a.annual_value,
      annual_value: calculateAutomationAnnualValue(a.hours_per_week, hourlyRate),
    }))

    set({
      inputs,
      costs,
      hourlyRate,
      automationsWithValue,
    })
  },

  setSyncing: (syncing) => set({ isSyncing: syncing }),
}))
