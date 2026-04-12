export const clientData = {
  client: {
    name: "Sarah Johnson",
    accountNumber: "ACC-00482",
    portfolioValue: 1248500,
    todayGain: 3200,
    todayGainPct: 0.26,
    ytdReturn: 8.4,
    annualizedReturn: 6.2,
    lastUpdated: "April 12, 2026"
  },
  assetAllocation: [
    { name: "US Equities", value: 45, amount: 561825 },
    { name: "International Equities", value: 20, amount: 249700 },
    { name: "Fixed Income", value: 25, amount: 312125 },
    { name: "Alternatives", value: 7, amount: 87395 },
    { name: "Cash", value: 3, amount: 37455 }
  ],
  holdings: [
    { name: "Apple Inc.", ticker: "AAPL", shares: 50, price: 189.50, marketValue: 9475, dayChange: 0.8, totalReturn: 24.3 },
    { name: "Microsoft Corp.", ticker: "MSFT", shares: 30, price: 415.20, marketValue: 12456, dayChange: 1.2, totalReturn: 31.5 },
    { name: "Vanguard Total Bond", ticker: "BND", shares: 200, price: 73.20, marketValue: 14640, dayChange: -0.1, totalReturn: 3.1 },
    { name: "Amazon.com Inc.", ticker: "AMZN", shares: 25, price: 182.30, marketValue: 4558, dayChange: 2.1, totalReturn: 18.7 },
    { name: "iShares MSCI EAFE", ticker: "EFA", shares: 150, price: 78.45, marketValue: 11768, dayChange: -0.3, totalReturn: 7.2 },
    { name: "Alphabet Inc.", ticker: "GOOGL", shares: 20, price: 171.95, marketValue: 3439, dayChange: 0.5, totalReturn: 22.1 },
    { name: "SPDR S&P 500 ETF", ticker: "SPY", shares: 40, price: 518.60, marketValue: 20744, dayChange: 0.7, totalReturn: 15.3 },
    { name: "Blackstone Real Estate", ticker: "BREIT", shares: 100, price: 29.80, marketValue: 2980, dayChange: 0.0, totalReturn: 5.8 }
  ],
  performanceHistory: {
    "1M": [
      { date: "Mar 11", value: 1210000 }, { date: "Mar 18", value: 1225000 },
      { date: "Mar 25", value: 1218000 }, { date: "Apr 1", value: 1235000 },
      { date: "Apr 8", value: 1242000 }, { date: "Apr 11", value: 1248500 }
    ],
    "3M": [
      { date: "Jan 11", value: 1150000 }, { date: "Feb 11", value: 1180000 },
      { date: "Mar 11", value: 1210000 }, { date: "Apr 11", value: 1248500 }
    ],
    "6M": [
      { date: "Oct 11", value: 1080000 }, { date: "Nov 11", value: 1100000 },
      { date: "Dec 11", value: 1120000 }, { date: "Jan 11", value: 1150000 },
      { date: "Feb 11", value: 1180000 }, { date: "Mar 11", value: 1210000 },
      { date: "Apr 11", value: 1248500 }
    ],
    "1Y": [
      { date: "Apr 25", value: 1050000 }, { date: "Jun 25", value: 1070000 },
      { date: "Aug 25", value: 1060000 }, { date: "Oct 25", value: 1080000 },
      { date: "Dec 25", value: 1120000 }, { date: "Feb 26", value: 1180000 },
      { date: "Apr 26", value: 1248500 }
    ]
  },
  benchmarkHistory: {
    "1M": [
      { date: "Mar 11", value: 1200000 }, { date: "Mar 18", value: 1215000 },
      { date: "Mar 25", value: 1210000 }, { date: "Apr 1", value: 1225000 },
      { date: "Apr 8", value: 1230000 }, { date: "Apr 11", value: 1238000 }
    ],
    "3M": [
      { date: "Jan 11", value: 1140000 }, { date: "Feb 11", value: 1170000 },
      { date: "Mar 11", value: 1200000 }, { date: "Apr 11", value: 1238000 }
    ],
    "6M": [
      { date: "Oct 11", value: 1070000 }, { date: "Nov 11", value: 1090000 },
      { date: "Dec 11", value: 1110000 }, { date: "Jan 11", value: 1140000 },
      { date: "Feb 11", value: 1170000 }, { date: "Mar 11", value: 1200000 },
      { date: "Apr 11", value: 1238000 }
    ],
    "1Y": [
      { date: "Apr 25", value: 1040000 }, { date: "Jun 25", value: 1060000 },
      { date: "Aug 25", value: 1050000 }, { date: "Oct 25", value: 1070000 },
      { date: "Dec 25", value: 1110000 }, { date: "Feb 26", value: 1170000 },
      { date: "Apr 26", value: 1238000 }
    ]
  },
  recentTransactions: [
    { date: "Apr 10, 2026", type: "Buy", security: "Apple Inc.", ticker: "AAPL", shares: 10, price: 188.50, amount: 1885 },
    { date: "Apr 8, 2026", type: "Dividend", security: "Vanguard Total Bond", ticker: "BND", shares: 0, price: 0, amount: 146.40 },
    { date: "Apr 5, 2026", type: "Sell", security: "Tesla Inc.", ticker: "TSLA", shares: 15, price: 175.20, amount: 2628 },
    { date: "Apr 2, 2026", type: "Buy", security: "Microsoft Corp.", ticker: "MSFT", shares: 5, price: 412.80, amount: 2064 },
    { date: "Mar 28, 2026", type: "Dividend", security: "SPDR S&P 500 ETF", ticker: "SPY", shares: 0, price: 0, amount: 207.44 }
  ]
}
