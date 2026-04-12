export const executiveData = {
  executive: { name: "Patricia Wells", title: "Chief Executive Officer", firm: "Pinnacle Wealth Management", healthScore: 87, lastUpdated: "April 12, 2026 9:00 AM" },
  kpis: [
    { label: "Total AUM", value: "$4.2B", change: 3.2, trend: "up" },
    { label: "Total Clients", value: "1,847", change: 2.1, trend: "up" },
    { label: "Net New Assets MTD", value: "$38M", change: 12.5, trend: "up" },
    { label: "Avg Advisor AUM", value: "$42.8M", change: 1.8, trend: "up" },
    { label: "YTD Revenue", value: "$8.4M", change: 7.3, trend: "up" },
    { label: "Client Retention", value: "96.2%", change: -0.3, trend: "down" }
  ],
  aumHistory: {
    "1Y": [
      { date: "May 25", aum: 3600, benchmark: 3500 }, { date: "Jun 25", aum: 3650, benchmark: 3520 },
      { date: "Jul 25", aum: 3700, benchmark: 3560 }, { date: "Aug 25", aum: 3680, benchmark: 3540 },
      { date: "Sep 25", aum: 3750, benchmark: 3580 }, { date: "Oct 25", aum: 3800, benchmark: 3610 },
      { date: "Nov 25", aum: 3900, benchmark: 3650 }, { date: "Dec 25", aum: 3980, benchmark: 3700 },
      { date: "Jan 26", aum: 4050, benchmark: 3750 }, { date: "Feb 26", aum: 4100, benchmark: 3790 },
      { date: "Mar 26", aum: 4150, benchmark: 3820 }, { date: "Apr 26", aum: 4200, benchmark: 3850 }
    ],
    "3Y": [
      { date: "Apr 23", aum: 2800, benchmark: 2700 }, { date: "Oct 23", aum: 3000, benchmark: 2900 },
      { date: "Apr 24", aum: 3100, benchmark: 2950 }, { date: "Oct 24", aum: 3200, benchmark: 3000 },
      { date: "Apr 25", aum: 3500, benchmark: 3300 }, { date: "Oct 25", aum: 3800, benchmark: 3600 },
      { date: "Apr 26", aum: 4200, benchmark: 3850 }
    ],
    "5Y": [
      { date: "Apr 21", aum: 2100, benchmark: 2000 }, { date: "Apr 22", aum: 2300, benchmark: 2200 },
      { date: "Apr 23", aum: 2800, benchmark: 2700 }, { date: "Apr 24", aum: 3100, benchmark: 2950 },
      { date: "Apr 25", aum: 3500, benchmark: 3300 }, { date: "Apr 26", aum: 4200, benchmark: 3850 }
    ]
  },
  advisorLeaderboard: [
    { rank: 1, name: "Michael Torres", aum: 42800000, clients: 47, netNewAssets: 3200000, ytdRevenue: 214000, targetPct: 122 },
    { rank: 2, name: "Linda Zhao", aum: 38100000, clients: 41, netNewAssets: 1800000, ytdRevenue: 190500, targetPct: 98 },
    { rank: 3, name: "James Park", aum: 35400000, clients: 38, netNewAssets: 2100000, ytdRevenue: 177000, targetPct: 112 },
    { rank: 4, name: "Sarah Kim", aum: 31200000, clients: 35, netNewAssets: 900000, ytdRevenue: 156000, targetPct: 88 },
    { rank: 5, name: "David Chen", aum: 28900000, clients: 32, netNewAssets: 1500000, ytdRevenue: 144500, targetPct: 95 },
    { rank: 6, name: "Emily Roberts", aum: 26500000, clients: 30, netNewAssets: 800000, ytdRevenue: 132500, targetPct: 79 },
    { rank: 7, name: "Tom Williams", aum: 24100000, clients: 28, netNewAssets: 1200000, ytdRevenue: 120500, targetPct: 91 },
    { rank: 8, name: "Anna Patel", aum: 21800000, clients: 25, netNewAssets: 600000, ytdRevenue: 109000, targetPct: 84 },
    { rank: 9, name: "Carlos Rivera", aum: 19500000, clients: 22, netNewAssets: 400000, ytdRevenue: 97500, targetPct: 76 },
    { rank: 10, name: "Michelle Lee", aum: 17200000, clients: 20, netNewAssets: 200000, ytdRevenue: 86000, targetPct: 68 }
  ],
  businessMix: {
    revenue: [
      { name: "Wealth Management", value: 65 },
      { name: "Retirement Planning", value: 20 },
      { name: "Insurance", value: 15 }
    ],
    clients: [
      { name: "Mass Affluent", value: 45 },
      { name: "High Net Worth", value: 35 },
      { name: "Ultra HNW", value: 15 },
      { name: "Institutional", value: 5 }
    ]
  },
  riskCompliance: [
    { label: "Open Compliance Issues", value: 3, status: "warning" },
    { label: "Regulatory Filings Due", value: 1, status: "warning" },
    { label: "Audit Findings (YTD)", value: 0, status: "good" },
    { label: "Client Complaints (MTD)", value: 2, status: "warning" }
  ],
  geoDistribution: [
    { state: "CA", clients: 312, aum: 840000000 },
    { state: "NY", clients: 287, aum: 720000000 },
    { state: "FL", clients: 198, aum: 480000000 },
    { state: "TX", clients: 175, aum: 390000000 },
    { state: "IL", clients: 142, aum: 310000000 },
    { state: "MA", clients: 118, aum: 280000000 },
    { state: "NJ", clients: 98, aum: 235000000 },
    { state: "WA", clients: 87, aum: 195000000 }
  ],
  executiveAlerts: [
    { category: "Growth", priority: "High", message: "Q1 net new assets exceeded target by 12.5% — fastest growth since Q2 2021" },
    { category: "Risk", priority: "Medium", message: "3 open compliance issues require board review before April 30" },
    { category: "Retention", priority: "High", message: "Client retention rate dipped 0.3% — review at-risk segment strategy" },
    { category: "Talent", priority: "Medium", message: "2 senior advisor positions open in the Northeast region" },
    { category: "Market", priority: "Low", message: "Interest rate environment favoring fixed income reallocation — opportunity to capture flows" }
  ]
}
