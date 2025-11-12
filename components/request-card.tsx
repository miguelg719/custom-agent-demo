"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, Github, MessageSquare, AlertCircle } from "lucide-react"
import type { Issue } from "@/types/kanban"
import { cn } from "@/lib/utils"

interface RequestCardProps {
  issue: Issue
  onCreateLinearIssue: (issueId: string) => void
  onCreateNotionDoc: (issueId: string) => void
  onUpdateStatus: (issueId: string, status: Issue["status"]) => void
  onClick: () => void
  compact?: boolean
  // Drag & drop hooks (optional)
  draggable?: boolean
  onDragStart?: (issueId: string, e: React.DragEvent) => void
}

const sourceIcons = {
  github: Github,
  slack: MessageSquare,
  discord: MessageSquare,
  pylon: AlertCircle,
}

const priorityColors = {
  critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  low: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
}

const severityColors = {
  critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  major: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  minor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  trivial: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
}

const planColors = {
  enterprise: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  pro: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  starter: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  free: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
}

export default function RequestCard({
  issue,
  onCreateLinearIssue,
  onCreateNotionDoc,
  onUpdateStatus,
  onClick,
  compact = false,
  draggable = false,
  onDragStart,
}: RequestCardProps) {
  const SourceIcon = sourceIcons[issue.source]

  if (compact) {
    return (
      <Card
        className="p-3 hover:shadow-sm transition-shadow bg-card/50 border-dashed cursor-pointer hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        }}
        draggable={draggable}
        onDragStart={draggable ? (e) => onDragStart?.(issue.id, e) : undefined}
        data-issue-id={issue.id}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm leading-tight text-card-foreground truncate">{issue.title}</h4>
              {issue.type === "bug" && (
                <Badge
                  variant="outline"
                  className="px-1.5 py-0 text-[10px] shrink-0 bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                >
                  BUG
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <SourceIcon className="h-3 w-3" />
              <span>{issue.votes} votes</span>
              {issue.customerName && (
                <>
                  <span>•</span>
                  <span className="truncate">{issue.customerName}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      draggable={draggable}
      onDragStart={draggable ? (e) => onDragStart?.(issue.id, e) : undefined}
      data-issue-id={issue.id}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {issue.type === "bug" && (
              <Badge
                variant="outline"
                className="px-2 py-0.5 text-[10px] font-medium uppercase bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
              >
                BUG
              </Badge>
            )}
            {issue.priority === "critical" || issue.priority === "high" ? (
              <Badge
                variant="outline"
                className={cn(
                  "px-2 py-0.5 text-[10px] font-medium uppercase",
                  issue.priority === "critical"
                    ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                    : "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
                )}
              >
                {issue.priority}
              </Badge>
            ) : null}
          </div>

          <h4 className="font-medium text-sm leading-snug text-card-foreground">{issue.title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{issue.description}</p>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 text-muted-foreground">
              <SourceIcon className="h-3.5 w-3.5" />
              <div className="flex items-center gap-1">
                <ArrowUp className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{issue.votes}</span>
              </div>
            </div>
            {issue.customerName && <span className="text-xs text-muted-foreground">{issue.customerName}</span>}
          </div>
        </div>
      </div>
    </Card>
  )
}
