import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts'
import { TrendingUp, TrendingDown, Target, BarChart3, Calendar } from "lucide-react"

// Mock data - todo: remove mock functionality
const mockAnalytics = {
  overallStats: {
    totalBets: 148,
    winRate: 67.5,
    avgOdds: 1.87,
    totalStaked: 8750,
    totalReturns: 10125,
    netProfit: 1375,
    roi: 15.7,
    bestStreak: 8,
    worstStreak: 3
  }
}

const mockSportPerformance = [
  { sport: 'Football', bets: 45, wins: 32, profit: 425, roi: 18.2 },
  { sport: 'Basketball', bets: 38, wins: 24, profit: 280, roi: 12.5 },
  { sport: 'Tennis', bets: 32, wins: 19, profit: 195, roi: 14.8 },
  { sport: 'Baseball', bets: 20, wins: 11, profit: 85, roi: 8.5 },
  { sport: 'Soccer', bets: 13, wins: 9, profit: 125, roi: 22.1 }
]

const mockMonthlyPerformance = [
  { month: 'Aug', profit: 125, bets: 15, winRate: 73 },
  { month: 'Sep', profit: 280, bets: 22, winRate: 68 },
  { month: 'Oct', profit: 410, bets: 28, winRate: 71 },
  { month: 'Nov', profit: 320, bets: 35, winRate: 63 },
  { month: 'Dec', profit: 240, bets: 48, winRate: 65 }
]

const mockOddsDistribution = [
  { range: '1.00-1.49', count: 12, profit: 85 },
  { range: '1.50-1.99', count: 45, profit: 420 },
  { range: '2.00-2.49', count: 38, profit: 380 },
  { range: '2.50-2.99', count: 28, profit: 285 },
  { range: '3.00+', count: 25, profit: 205 }
]

const mockBookmakerPerformance = [
  { name: 'DraftKings', value: 28, profit: 385 },
  { name: 'FanDuel', value: 25, profit: 320 },
  { name: 'BetMGM', value: 20, profit: 240 },
  { name: 'Caesars', value: 18, profit: 195 },
  { name: 'Other', value: 9, profit: 235 }
]

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
]

export default function Analytics() {
  const [timeFilter, setTimeFilter] = useState("all")
  const [sportFilter, setSportFilter] = useState("all")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your betting performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-time-filter">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-win-rate-analytics">
              {mockAnalytics.overallStats.winRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {mockAnalytics.overallStats.totalBets - Math.floor(mockAnalytics.overallStats.totalBets * mockAnalytics.overallStats.winRate / 100)} losses from {mockAnalytics.overallStats.totalBets} bets
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2" data-testid="text-roi-analytics">
              {mockAnalytics.overallStats.roi}%
            </div>
            <p className="text-xs text-muted-foreground">
              ${mockAnalytics.overallStats.netProfit} profit on ${mockAnalytics.overallStats.totalStaked} staked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Odds</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-avg-odds">
              {mockAnalytics.overallStats.avgOdds}
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all bets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2" data-testid="text-best-streak">
              {mockAnalytics.overallStats.bestStreak}
            </div>
            <p className="text-xs text-muted-foreground">
              Consecutive wins
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Profit and win rate trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockMonthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stackId="1"
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  name="Profit ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sport Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Sport</CardTitle>
            <CardDescription>ROI and profit breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockSportPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sport" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="roi" 
                  fill="hsl(var(--chart-2))" 
                  name="ROI (%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Odds Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Odds Distribution</CardTitle>
            <CardDescription>Performance across different odds ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockOddsDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))" 
                  name="Bets"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="profit" 
                  fill="hsl(var(--chart-2))" 
                  name="Profit ($)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bookmaker Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Bookmaker Distribution</CardTitle>
            <CardDescription>Bet volume by sportsbook</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockBookmakerPerformance}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockBookmakerPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sport Performance Breakdown</CardTitle>
          <CardDescription>Detailed metrics by sport</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Sport</th>
                  <th className="text-right p-2">Bets</th>
                  <th className="text-right p-2">Wins</th>
                  <th className="text-right p-2">Win Rate</th>
                  <th className="text-right p-2">Profit</th>
                  <th className="text-right p-2">ROI</th>
                </tr>
              </thead>
              <tbody>
                {mockSportPerformance.map((sport, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium" data-testid={`cell-sport-${index}`}>
                      {sport.sport}
                    </td>
                    <td className="text-right p-2">{sport.bets}</td>
                    <td className="text-right p-2">{sport.wins}</td>
                    <td className="text-right p-2">
                      {((sport.wins / sport.bets) * 100).toFixed(1)}%
                    </td>
                    <td className="text-right p-2">
                      <span className={`font-medium ${
                        sport.profit > 0 ? "text-chart-2" : "text-destructive"
                      }`}>
                        ${sport.profit}
                      </span>
                    </td>
                    <td className="text-right p-2">
                      <Badge 
                        variant={sport.roi > 10 ? "default" : sport.roi > 0 ? "secondary" : "destructive"}
                        data-testid={`badge-roi-${index}`}
                      >
                        {sport.roi}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}