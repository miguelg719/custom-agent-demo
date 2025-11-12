export type IssueType = "feature" | "bug"
export type IssuePriority = "critical" | "high" | "medium" | "low"
export type BugSeverity = "critical" | "major" | "minor" | "trivial"
export type AccountPlan = "enterprise" | "pro" | "starter" | "free"
export type IssueSource = "pylon" | "slack" | "discord" | "github"
export type IssueStatus = "unreviewed" | "enterprise" | "community" | "revenue-impact" | "quick-wins"

export interface Issue {
  id: string
  title: string
  description: string
  type: IssueType
  priority: IssuePriority
  source: IssueSource
  status: IssueStatus
  createdAt: Date
  votes: number
  accountPlan?: AccountPlan
  bugSeverity?: BugSeverity
  customerName?: string
  labels?: string[]
  linearIssueId?: string
  notionDocId?: string
}
