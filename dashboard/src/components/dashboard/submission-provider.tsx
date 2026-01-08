'use client'

import { useEffect, useState } from 'react'
import { useSubmissionStore } from '@/lib/stores/submission-store'
import type {
  SubmissionFullROI,
  SubmissionAutomationROI,
  SubmissionGap,
  SubmissionDataMaturity,
  SubmissionTaskCompression
} from '@/types/database'

interface SubmissionProviderProps {
  children: React.ReactNode
  initialData: {
    submission: SubmissionFullROI | null
    automations: SubmissionAutomationROI[]
    gaps: SubmissionGap[]
    maturity: SubmissionDataMaturity[]
    taskCompressions: SubmissionTaskCompression[]
  }
}

export function SubmissionProvider({ children, initialData }: SubmissionProviderProps) {
  const setServerData = useSubmissionStore((s) => s.setServerData)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (initialData.submission) {
      setServerData({
        submission: initialData.submission,
        automations: initialData.automations,
        gaps: initialData.gaps,
        maturity: initialData.maturity,
        taskCompressions: initialData.taskCompressions,
      })
    }
    setIsLoaded(true)
  }, [initialData, setServerData])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-text-muted">Loading...</div>
      </div>
    )
  }

  if (!initialData.submission) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-text-primary text-lg mb-2">Submission not found</p>
          <p className="text-text-muted">This audit submission doesn&apos;t exist or you don&apos;t have access.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
