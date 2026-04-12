export const advisorData = {
  advisor: {
    name: "Michael Torres",
    firm: "Pinnacle Wealth Management",
    advisorId: "ADV-1042",
    totalAUM: 42800000,
    clientCount: 47,
    ytdRevenue: 214000,
    netNewAssets: 3200000,
    trend30d: [38000000, 39200000, 40100000, 41500000, 42800000]
  },
  clients: [
    { id: 1, name: "Sarah Johnson", accountValue: 1248500, ytdReturn: 8.4, riskProfile: "Moderate", lastContact: "2024-03-01", status: "Active" },
    { id: 2, name: "Robert Chen", accountValue: 3450000, ytdReturn: -2.1, riskProfile: "Aggressive", lastContact: "2023-12-15", status: "At Risk" },
    { id: 3, name: "Emily Watson", accountValue: 875000, ytdReturn: 5.2, riskProfile: "Conservative", lastContact: "2024-04-01", status: "Active" },
    { id: 4, name: "James Martinez", accountValue: 2100000, ytdReturn: 11.3, riskProfile: "Aggressive", lastContact: "2024-03-28", status: "Active" },
    { id: 5, name: "Linda Zhao", accountValue: 580000, ytdReturn: 3.1, riskProfile: "Conservative", lastContact: "2024-02-10", status: "New" },
    { id: 6, name: "David Kim", accountValue: 4200000, ytdReturn: -5.8, riskProfile: "Aggressive", lastContact: "2024-01-05", status: "At Risk" },
    { id: 7, name: "Patricia Wells", accountValue: 1850000, ytdReturn: 7.9, riskProfile: "Moderate", lastContact: "2024-03-20", status: "Active" },
    { id: 8, name: "Thomas Brown", accountValue: 3900000, ytdReturn: 9.2, riskProfile: "Moderate", lastContact: "2024-04-05", status: "Active" },
    { id: 9, name: "Nancy Lee", accountValue: 420000, ytdReturn: 4.5, riskProfile: "Conservative", lastContact: "2024-04-08", status: "New" },
    { id: 10, name: "Kevin Davis", accountValue: 2750000, ytdReturn: -1.3, riskProfile: "Aggressive", lastContact: "2024-02-28", status: "At Risk" }
  ],
  aumBySegment: [
    { segment: "Mass Affluent", aum: 8500000 },
    { segment: "High Net Worth", aum: 22300000 },
    { segment: "Ultra HNW", aum: 12000000 }
  ],
  monthlyRevenue: [
    { month: "May", advisory: 12000, planning: 3500, transaction: 1200 },
    { month: "Jun", advisory: 12500, planning: 4000, transaction: 1500 },
    { month: "Jul", advisory: 13000, planning: 3000, transaction: 900 },
    { month: "Aug", advisory: 12800, planning: 3800, transaction: 1100 },
    { month: "Sep", advisory: 13200, planning: 4200, transaction: 1300 },
    { month: "Oct", advisory: 14000, planning: 3600, transaction: 1600 },
    { month: "Nov", advisory: 13500, planning: 4500, transaction: 1400 },
    { month: "Dec", advisory: 15000, planning: 5000, transaction: 2000 },
    { month: "Jan", advisory: 14500, planning: 4000, transaction: 1300 },
    { month: "Feb", advisory: 15200, planning: 4800, transaction: 1700 },
    { month: "Mar", advisory: 16000, planning: 5200, transaction: 2100 },
    { month: "Apr", advisory: 16800, planning: 5500, transaction: 2300 }
  ],
  atRiskClients: [
    { id: 2, name: "Robert Chen", reason: "Portfolio down 2.1% YTD", urgency: "High", accountValue: 3450000 },
    { id: 6, name: "David Kim", reason: "Portfolio down 5.8% YTD; No contact in 96 days", urgency: "Critical", accountValue: 4200000 },
    { id: 10, name: "Kevin Davis", reason: "No contact in 42 days", urgency: "Medium", accountValue: 2750000 }
  ]
}
