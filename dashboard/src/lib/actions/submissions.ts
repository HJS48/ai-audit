'use server'

import { createClient } from '@/lib/supabase/server'
import type {
  SubmissionFullROI,
  SubmissionDataMaturity,
  SubmissionGap,
  SubmissionAutomationROI,
  SubmissionTaskCompression
} from '@/types/database'

export async function getSubmissionOverview(submissionId: string): Promise<SubmissionFullROI | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('submission_full_roi')
    .select('*')
    .eq('submission_id', submissionId)
    .single()

  if (error) {
    console.error('Error fetching submission overview:', error)
    return null
  }

  return data
}

export async function getSubmissionMaturity(submissionId: string): Promise<SubmissionDataMaturity[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('submission_data_maturity')
    .select('*')
    .eq('submission_id', submissionId)

  if (error) {
    console.error('Error fetching maturity data:', error)
    return []
  }

  return data || []
}

export async function getSubmissionGaps(submissionId: string): Promise<SubmissionGap[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('submission_gaps')
    .select('*')
    .eq('submission_id', submissionId)
    .order('mins_per_week', { ascending: false })

  if (error) {
    console.error('Error fetching gaps:', error)
    return []
  }

  return data || []
}

export async function getSubmissionAutomations(submissionId: string): Promise<SubmissionAutomationROI[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('submission_automation_roi')
    .select('*')
    .eq('submission_id', submissionId)
    .order('annual_value', { ascending: false })

  if (error) {
    console.error('Error fetching automations:', error)
    return []
  }

  return data || []
}

export async function getSubmissionTaskCompressions(submissionId: string): Promise<SubmissionTaskCompression[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('submission_task_compressions')
    .select('*')
    .eq('submission_id', submissionId)

  if (error) {
    console.error('Error fetching task compressions:', error)
    return []
  }

  return data || []
}

export async function getFullSubmissionData(submissionId: string) {
  const [submission, maturity, gaps, automations, tasks] = await Promise.all([
    getSubmissionOverview(submissionId),
    getSubmissionMaturity(submissionId),
    getSubmissionGaps(submissionId),
    getSubmissionAutomations(submissionId),
    getSubmissionTaskCompressions(submissionId),
  ])

  return {
    submission,
    maturity,
    gaps,
    automations,
    tasks,
  }
}
