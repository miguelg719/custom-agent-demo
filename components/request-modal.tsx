"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowUp, Github, MessageSquare, AlertCircle, Building2, Calendar, MoveRight, ChevronDown } from "lucide-react"
import type { Issue } from "@/types/kanban"
import { cn } from "@/lib/utils"
import { useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface RequestModalProps {
  issue: Issue
  onClose: () => void
  onCreateLinearIssue: (issueId: string) => void
  onCreateNotionDoc: (issueId: string) => void
  onUpdateStatus: (issueId: string, status: Issue["status"]) => void
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

const statusLabels = {
  unreviewed: "Unreviewed",
  enterprise: "Enterprise",
  "revenue-impact": "Revenue Impact",
  community: "Community",
  "quick-wins": "Quick Wins",
}

export default function RequestModal({
  issue,
  onClose,
  onCreateLinearIssue,
  onCreateNotionDoc,
  onUpdateStatus,
}: RequestModalProps) {
  const SourceIcon = sourceIcons[issue.source]
  const { toast } = useToast()

  const handleMove = useCallback((status: Issue["status"]) => {
    onUpdateStatus(issue.id, status)
    toast({ title: "Moved", description: `Request moved to ${statusLabels[status]}` })
  }, [issue.id, onUpdateStatus, toast])

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {issue.type === "bug" && (
                  <Badge
                    variant="outline"
                    className="px-2 py-0.5 text-xs font-medium uppercase bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                  >
                    BUG
                  </Badge>
                )}
                {/* Show bug severity for bugs, otherwise show priority */}
                {issue.type === "bug" && issue.bugSeverity ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-2 py-0.5 text-xs font-medium uppercase",
                      issue.bugSeverity === "critical"
                        ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                        : issue.bugSeverity === "major"
                          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
                          : issue.bugSeverity === "minor"
                          ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                          : "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
                    )}
                  >
                    {issue.bugSeverity}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className={cn("px-2 py-0.5 text-xs font-medium uppercase", priorityColors[issue.priority])}
                  >
                    {issue.priority}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl">{issue.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{issue.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <SourceIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Source:</span>
                <span className="font-medium capitalize">{issue.source}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ArrowUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Votes:</span>
                <span className="font-medium">{issue.votes}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{issue.createdAt.toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-1">
              {issue.customerName && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-medium">{issue.customerName}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Plan:</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "px-2 py-0.5 text-xs font-medium capitalize",
                    issue.accountPlan === "enterprise"
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                      : issue.accountPlan === "pro"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                        : "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
                  )}
                >
                  {issue.accountPlan}
                </Badge>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 flex items-center justify-between gap-3">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent" aria-label={`Move to ${statusLabels[issue.status]}`}>
                  <MoveRight className="h-4 w-4" />
                  Move to {statusLabels[issue.status]}
                  <ChevronDown className="h-4 w-4 ml-auto opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="z-[9999]">
                <DropdownMenuItem onClick={() => handleMove("unreviewed")}>
                  Unreviewed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMove("enterprise")}>
                  Enterprise
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMove("revenue-impact")}>
                  Revenue Impact
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMove("community")}>
                  Community
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMove("quick-wins")}>
                  Quick Wins
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onCreateNotionDoc(issue.id)}>
                Create Notion Doc
              </Button>
              <Button onClick={() => onCreateLinearIssue(issue.id)}>Create in Linear</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
