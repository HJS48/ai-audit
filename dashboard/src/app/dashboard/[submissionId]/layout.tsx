import { getFullSubmissionData } from '@/lib/actions/submissions'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { SubmissionProvider } from '@/components/dashboard/submission-provider'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ submissionId: string }>
}) {
  const { submissionId } = await params
  const { submission, maturity, gaps, automations, tasks } = await getFullSubmissionData(submissionId)

  return (
    <>
      <nav className="nav">
        <div className="logo">AUDIT</div>
        <DashboardNav />
        <div className="company-name">
          Audit for <span>Your Agency</span>
        </div>
      </nav>

      <main className="main">
        <SubmissionProvider
          initialData={{
            submission,
            automations,
            gaps,
            maturity,
            taskCompressions: tasks,
          }}
        >
          {children}
        </SubmissionProvider>
      </main>
    </>
  )
}
