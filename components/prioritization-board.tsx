"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import RequestCard from "@/components/request-card"
import RequestModal from "@/components/request-modal"
import ThemeToggle from "@/components/theme-toggle"
import NewRequestModal from "@/components/new-request-modal"
import type { Issue } from "@/types/kanban"

const initialIssues: Issue[] = [
  {
    id: "1",
    title: "Add dark mode support",
    description: "Users requesting dark mode for better accessibility",
    type: "feature",
    priority: "high",
    source: "pylon",
    status: "unreviewed",
    createdAt: new Date("2025-01-15"),
    votes: 23,
    accountPlan: "enterprise",
    customerName: "Acme Corp",
  },
  {
    id: "2",
    title: "Fix login redirect issue",
    description: "Users unable to redirect after OAuth login",
    type: "bug",
    priority: "critical",
    source: "github",
    status: "enterprise",
    createdAt: new Date("2025-01-10"),
    votes: 45,
    bugSeverity: "critical",
    accountPlan: "pro",
    customerName: "TechStart Inc",
  },
  {
    id: "3",
    title: "Export to CSV functionality",
    description: "Allow users to export data to CSV format",
    type: "feature",
    priority: "medium",
    source: "slack",
    status: "community",
    createdAt: new Date("2025-01-12"),
    votes: 67,
    accountPlan: "free",
  },
  {
    id: "4",
    title: "Performance optimization for large datasets",
    description: "Dashboard loading slowly with large datasets",
    type: "bug",
    priority: "high",
    source: "discord",
    status: "revenue-impact",
    createdAt: new Date("2025-01-14"),
    votes: 34,
    bugSeverity: "major",
    accountPlan: "enterprise",
    customerName: "BigData Solutions",
  },
  {
    id: "5",
    title: "Add keyboard shortcuts",
    description: "Power users want keyboard navigation",
    type: "feature",
    priority: "low",
    source: "pylon",
    status: "quick-wins",
    createdAt: new Date("2025-01-16"),
    votes: 12,
    accountPlan: "free",
  },
  {
    id: "6",
    title: "SSO integration request",
    description: "Enterprise customers requesting SAML SSO",
    type: "feature",
    priority: "critical",
    source: "pylon",
    status: "enterprise",
    createdAt: new Date("2025-01-13"),
    votes: 89,
    accountPlan: "enterprise",
    customerName: "Fortune 500 Co",
  },
  {
    id: "7",
    title: "API webhook support",
    description: "Allow users to set up webhooks for events",
    type: "feature",
    priority: "medium",
    source: "github",
    status: "revenue-impact",
    createdAt: new Date("2025-01-11"),
    votes: 28,
    accountPlan: "pro",
  },
]

export default function PrioritizationBoard() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Local persistence (client-only)
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem("kanban-issues")
      if (raw) {
        const parsed = JSON.parse(raw) as Array<Omit<Issue, "createdAt"> & { createdAt: string }>
        const revived = parsed.map((i) => ({ ...i, createdAt: new Date(i.createdAt) })) as Issue[]
        setIssues(revived)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const toStore = issues.map((i) => ({ ...i, createdAt: i.createdAt.toISOString() }))
      window.localStorage.setItem("kanban-issues", JSON.stringify(toStore))
    } catch {
      // ignore
    }
  }, [issues])

  const handleCreateLinearIssue = (issueId: string) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== issueId))
    setSelectedIssue(null)
  }

  const handleCreateNotionDoc = (issueId: string) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== issueId))
    setSelectedIssue(null)
  }

  const handleUpdateStatus = (issueId: string, newStatus: Issue["status"]) => {
    setIssues((prev) => prev.map((issue) => (issue.id === issueId ? { ...issue, status: newStatus } : issue)))
  }

  // Create new request
  const handleCreateIssue = (partial: Pick<Issue, "title" | "description" | "type" | "priority" | "source">) => {
    const id = Math.random().toString(36).slice(2)
    const newIssue: Issue = {
      id,
      title: partial.title,
      description: partial.description,
      type: partial.type,
      priority: partial.priority,
      source: partial.source,
      status: "unreviewed",
      createdAt: new Date(),
      votes: 0,
    }
    setIssues((prev) => [newIssue, ...prev])
    setIsCreateOpen(false)
  }

  // DnD helpers
  const onCardDragStart = (issueId: string, e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", issueId)
    e.dataTransfer.effectAllowed = "move"
  }
  const onColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }
  const onColumnDrop = (status: Issue["status"], e: React.DragEvent) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/plain")
    if (id) handleUpdateStatus(id, status)
  }

  const groupedIssues = useMemo(() => ({
    unreviewed: issues.filter((i) => i.status === "unreviewed"),
    enterprise: issues.filter((i) => i.status === "enterprise"),
    community: issues.filter((i) => i.status === "community"),
    revenueImpact: issues.filter((i) => i.status === "revenue-impact"),
    quickWins: issues.filter((i) => i.status === "quick-wins"),
  }), [issues])

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Request Buffer</h1>
            <p className="text-sm text-muted-foreground">Triage incoming requests</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground font-mono">{issues.length} in buffer</div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" aria-label="Open Linear">
              <ExternalLink className="h-4 w-4" />
              Linear
            </Button>
            <Button size="sm" onClick={() => setIsCreateOpen(true)} aria-label="Add request">Add request</Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 gap-4 overflow-x-auto p-6">
        <div className="flex min-w-[320px] flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Unreviewed</h3>
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-mono">
              {groupedIssues.unreviewed.length}
            </Badge>
          </div>
          <div
            className="flex flex-1 flex-col gap-2 overflow-y-auto"
            onDragOver={onColumnDragOver}
            onDrop={(e) => onColumnDrop("unreviewed", e)}
            aria-label="Unreviewed column"
          >
            {groupedIssues.unreviewed.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-md border-2 border-dashed border-border/50 p-8 bg-muted/30">
                <p className="text-sm text-muted-foreground">No unreviewed requests</p>
              </div>
            ) : (
              groupedIssues.unreviewed.map((issue) => (
                <RequestCard
                  key={issue.id}
                  issue={issue}
                  onCreateLinearIssue={handleCreateLinearIssue}
                  onCreateNotionDoc={handleCreateNotionDoc}
                  onUpdateStatus={handleUpdateStatus}
                  onClick={() => setSelectedIssue(issue)}
                  compact
                  draggable
                  onDragStart={onCardDragStart}
                />
              ))
            )}
          </div>
        </div>

        {/* Enterprise Customers */}
        <div className="flex min-w-[320px] flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Enterprise</h3>
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-mono">
              {groupedIssues.enterprise.length}
            </Badge>
          </div>
          <div
            className="flex flex-1 flex-col gap-3 rounded-lg bg-muted/30 p-3 overflow-y-auto"
            onDragOver={onColumnDragOver}
            onDrop={(e) => onColumnDrop("enterprise", e)}
            aria-label="Enterprise column"
          >
            {groupedIssues.enterprise.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-md border-2 border-dashed border-border/50 p-8">
                <p className="text-sm text-muted-foreground">No requests</p>
              </div>
            ) : (
              groupedIssues.enterprise.map((issue) => (
                <RequestCard
                  key={issue.id}
                  issue={issue}
                  onCreateLinearIssue={handleCreateLinearIssue}
                  onCreateNotionDoc={handleCreateNotionDoc}
                  onUpdateStatus={handleUpdateStatus}
                  onClick={() => setSelectedIssue(issue)}
                  draggable
                  onDragStart={onCardDragStart}
                />
              ))
            )}
          </div>
        </div>

        {/* Revenue Impact */}
        <div className="flex min-w-[320px] flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Revenue Impact</h3>
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-mono">
              {groupedIssues.revenueImpact.length}
            </Badge>
          </div>
          <div
            className="flex flex-1 flex-col gap-3 rounded-lg bg-muted/30 p-3 overflow-y-auto"
            onDragOver={onColumnDragOver}
            onDrop={(e) => onColumnDrop("revenue-impact", e)}
            aria-label="Revenue Impact column"
          >
            {groupedIssues.revenueImpact.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-md border-2 border-dashed border-border/50 p-8">
                <p className="text-sm text-muted-foreground">No requests</p>
              </div>
            ) : (
              groupedIssues.revenueImpact.map((issue) => (
                <RequestCard
                  key={issue.id}
                  issue={issue}
                  onCreateLinearIssue={handleCreateLinearIssue}
                  onCreateNotionDoc={handleCreateNotionDoc}
                  onUpdateStatus={handleUpdateStatus}
                  onClick={() => setSelectedIssue(issue)}
                  draggable
                  onDragStart={onCardDragStart}
                />
              ))
            )}
          </div>
        </div>

        {/* Community Requests */}
        <div className="flex min-w-[320px] flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Community</h3>
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-mono">
              {groupedIssues.community.length}
            </Badge>
          </div>
          <div
            className="flex flex-1 flex-col gap-3 rounded-lg bg-muted/30 p-3 overflow-y-auto"
            onDragOver={onColumnDragOver}
            onDrop={(e) => onColumnDrop("community", e)}
            aria-label="Community column"
          >
            {groupedIssues.community.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-md border-2 border-dashed border-border/50 p-8">
                <p className="text-sm text-muted-foreground">No requests</p>
              </div>
            ) : (
              groupedIssues.community.map((issue) => (
                <RequestCard
                  key={issue.id}
                  issue={issue}
                  onCreateLinearIssue={handleCreateLinearIssue}
                  onCreateNotionDoc={handleCreateNotionDoc}
                  onUpdateStatus={handleUpdateStatus}
                  onClick={() => setSelectedIssue(issue)}
                  draggable
                  onDragStart={onCardDragStart}
                />
              ))
            )}
          </div>
        </div>

        {/* Quick Wins */}
        <div className="flex min-w-[320px] flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Quick Wins</h3>
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-mono">
              {groupedIssues.quickWins.length}
            </Badge>
          </div>
          <div
            className="flex flex-1 flex-col gap-3 rounded-lg bg-muted/30 p-3 overflow-y-auto"
            onDragOver={onColumnDragOver}
            onDrop={(e) => onColumnDrop("quick-wins", e)}
            aria-label="Quick Wins column"
          >
            {groupedIssues.quickWins.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-md border-2 border-dashed border-border/50 p-8">
                <p className="text-sm text-muted-foreground">No requests</p>
              </div>
            ) : (
              groupedIssues.quickWins.map((issue) => (
                <RequestCard
                  key={issue.id}
                  issue={issue}
                  onCreateLinearIssue={handleCreateLinearIssue}
                  onCreateNotionDoc={handleCreateNotionDoc}
                  onUpdateStatus={handleUpdateStatus}
                  onClick={() => setSelectedIssue(issue)}
                  draggable
                  onDragStart={onCardDragStart}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {selectedIssue && (
        <RequestModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onCreateLinearIssue={handleCreateLinearIssue}
          onCreateNotionDoc={handleCreateNotionDoc}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {isCreateOpen && (
        <NewRequestModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onCreate={handleCreateIssue}
        />
      )}
    </div>
  )
}
