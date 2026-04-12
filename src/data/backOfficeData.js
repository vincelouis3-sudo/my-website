export const backOfficeData = {
  user: { name: "Jamie Park", role: "Operations Analyst", team: "Wealth Ops", date: "April 11, 2024" },
  nextBestActions: [
    { id: 1, priority: "Critical", title: "Resolve failed trade settlement - ACC-00293", dueDate: "2024-04-11T12:00:00", category: "Trade" },
    { id: 2, priority: "Critical", title: "Escalate margin call for account ACC-00817", dueDate: "2024-04-11T11:00:00", category: "Risk" },
    { id: 3, priority: "High", title: "Complete KYC review for new client Robert Chen", dueDate: "2024-04-11T17:00:00", category: "Onboarding" },
    { id: 4, priority: "High", title: "Process 3 pending wire transfer approvals", dueDate: "2024-04-11T16:00:00", category: "Operations" },
    { id: 5, priority: "High", title: "Review 5 flagged compliance alerts from yesterday", dueDate: "2024-04-11T15:00:00", category: "Compliance" },
    { id: 6, priority: "Medium", title: "Update beneficiary for account ACC-00341", dueDate: "2024-04-12T12:00:00", category: "Account Maintenance" },
    { id: 7, priority: "Medium", title: "Send quarterly statement to 12 clients", dueDate: "2024-04-12T17:00:00", category: "Communications" },
    { id: 8, priority: "Medium", title: "Reconcile end-of-day position discrepancy", dueDate: "2024-04-12T09:00:00", category: "Operations" }
  ],
  alerts: [
    { id: 1, severity: "Error", message: "Trade settlement failed for ACC-00293 — requires immediate action", timestamp: "2024-04-11T09:15:00" },
    { id: 2, severity: "Error", message: "Margin call triggered on account ACC-00817", timestamp: "2024-04-11T08:47:00" },
    { id: 3, severity: "Warning", message: "Client Sarah Johnson has not been contacted in 90 days", timestamp: "2024-04-11T08:00:00" },
    { id: 4, severity: "Warning", message: "3 accounts have missing required documentation", timestamp: "2024-04-10T17:30:00" },
    { id: 5, severity: "Warning", message: "Unusual transaction volume detected on ACC-00552", timestamp: "2024-04-10T15:20:00" },
    { id: 6, severity: "Info", message: "End-of-day reconciliation completed with 1 discrepancy", timestamp: "2024-04-10T18:00:00" }
  ],
  taskQueue: [
    { label: "Pending Review", count: 12, color: "blue" },
    { label: "In Progress", count: 5, color: "yellow" },
    { label: "Awaiting Approval", count: 3, color: "orange" },
    { label: "Completed Today", count: 18, color: "green" },
    { label: "Overdue", count: 2, color: "red" }
  ],
  onboardingPipeline: [
    { stage: "Application", count: 8, color: "#3B82F6" },
    { stage: "KYC/AML", count: 5, color: "#8B5CF6" },
    { stage: "Account Setup", count: 3, color: "#F59E0B" },
    { stage: "Funding", count: 2, color: "#10B981" },
    { stage: "Active", count: 1, color: "#059669" }
  ],
  recentActivity: [
    { time: "10:32am", actor: "M. Torres", action: "Account ACC-00482 updated — beneficiary added" },
    { time: "10:15am", actor: "System", action: "Trade settlement failed for ACC-00293" },
    { time: "9:58am", actor: "L. Zhao", action: "KYC documents submitted for Robert Chen" },
    { time: "9:45am", actor: "J. Park", action: "Wire transfer approved for ACC-00710 — $45,000" },
    { time: "9:30am", actor: "System", action: "Margin call triggered on account ACC-00817" },
    { time: "9:15am", actor: "T. Brown", action: "New account application received — Kevin Liu" },
    { time: "8:55am", actor: "System", action: "End-of-day reconciliation report generated" },
    { time: "8:40am", actor: "J. Park", action: "5 compliance alerts reviewed and escalated" },
    { time: "8:20am", actor: "M. Torres", action: "Client Patricia Wells quarterly review scheduled" },
    { time: "8:00am", actor: "System", action: "Daily market data feed ingested successfully" }
  ]
}
