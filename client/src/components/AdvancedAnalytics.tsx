import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts'
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  Clock,
  Calendar,
  DollarSign,
  Percent,
  BarChart3
} from "lucide-react"

// Mock data for advanced analytics
const mockKellyData = [
  { stake: 1, kelly: 0.05, expectedValue: 0.12, winProb: 0.65 },
  { stake: 2, kelly: 0.08, expectedValue: 0.15, winProb: 0.68 },
  { stake: 3, kelly: 0.12, expectedValue: 0.18, winProb: 0.72 },
  { stake: 4, kelly: 0.15, expectedValue: 0.22, winProb: 0.75 },
  { stake: 5, kelly: 0.18, expectedValue: 0.25, winProb: 0.78 }
]

const mockTimeAnalysis = [
  { time: '09:00', bets: 12, winRate: 75, profit: 245 },
  { time: '12:00', bets: 18, winRate: 67, profit: 180 },
  { time: '15:00', bets: 25, winRate: 72, profit: 320 },
  { time: '18:00', bets: 22, winRate: 68, profit: 285 },
  { time: '21:00', bets: 15, winRate: 73, profit: 195 }
]

const mockDayAnalysis = [
  { day: 'Mon', bets: 15, winRate: 73, profit: 285, variance: 0.15 },
  { day: 'Tue', bets: 18, winRate: 67, profit: 195, variance: 0.22 },
  { day: 'Wed', bets: 22, winRate: 75, profit: 385, variance: 0.18 },
  { day: 'Thu', bets: 20, winRate: 70, profit: 245, variance: 0.20 },
  { day: 'Fri', bets: 25, winRate: 68, profit: 325, variance: 0.25 },
  { day: 'Sat', bets: 30, winRate: 72, profit: 420, variance: 0.19 },
  { day: 'Sun', bets: 28, winRate: 74, profit: 395, variance: 0.17 }
]

const mockStakeAnalysis = [
  { stakeRange: '$10-25', bets: 45, winRate: 73, avgProfit: 12.5, roi: 18.2 },
  { stakeRange: '$26-50', bets: 38, winRate: 68, avgProfit: 22.8, roi: 15.4 },
  { stakeRange: '$51-100', bets: 25, winRate: 72, avgProfit: 45.2, roi: 16.8 },
  { stakeRange: '$101-200', bets: 18, winRate: 67, avgProfit: 85.5, roi: 14.2 },
  { stakeRange: '$200+', bets: 12, winRate: 75, avgProfit: 165.8, roi: 19.5 }
]

const mockCorrelationData = [
  { market1: 'Moneyline', market2: 'Over/Under', correlation: 0.15, significance: 'Low' },
  { market1: 'Spread', market2: 'Over/Under', correlation: 0.68, significance: 'High' },
  { market1: 'Moneyline', market2: 'Spread', correlation: 0.82, significance: 'Very High' },
  { market1: 'Player Props', market2: 'Team Total', correlation: 0.45, significance: 'Medium' },
  { market1: 'First Half', market2: 'Full Game', correlation: 0.72, significance: 'High' }
]

const mockPerformanceRadar = [
  { metric: 'Win Rate', value: 68, fullMark: 100 },
  { metric: 'ROI', value: 15.7, fullMark: 25 },
  { metric: 'Avg Odds', value: 1.87, fullMark: 3 },
  { metric: 'Consistency', value: 78, fullMark: 100 },
  { metric: 'Risk Management', value: 85, fullMark: 100 },
  { metric: 'Market Knowledge', value: 72, fullMark: 100 }
]

export default function AdvancedAnalytics() {
  const [kellyBankroll, setKellyBankroll] = useState(1000)
  const [kellyOdds, setKellyOdds] = useState(2.0)
  const [kellyWinProb, setKellyWinProb] = useState(0.55)
  
  // Kelly Criterion calculation
  const kellyFraction = ((kellyOdds - 1) * kellyWinProb - (1 - kellyWinProb)) / (kellyOdds - 1)
  const kellyStake = Math.max(0, kellyFraction * kellyBankroll)
  const expectedValue = (kellyWinProb * (kellyOdds - 1)) - (1 - kellyWinProb)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="kelly" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="kelly">Kelly Criterion</TabsTrigger>
          <TabsTrigger value="time">Time Analysis</TabsTrigger>
          <TabsTrigger value="correlation">Correlation</TabsTrigger>
          <TabsTrigger value="variance">Variance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="stakes">Stake Analysis</TabsTrigger>
        </TabsList>

        {/* Kelly Criterion Tab */}
        <TabsContent value="kelly" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Kelly Criterion Calculator
                </CardTitle>
                <CardDescription>
                  Calculate optimal bet size based on your edge and bankroll
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankroll">Bankroll ($)</Label>
                    <Input
                      id="bankroll"
                      type="number"
                      value={kellyBankroll}
                      onChange={(e) => setKellyBankroll(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="odds">Decimal Odds</Label>
                    <Input
                      id="odds"
                      type="number"
                      step="0.01"
                      value={kellyOdds}
                      onChange={(e) => setKellyOdds(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="winprob">Win Probability (%)</Label>
                  <Input
                    id="winprob"
                    type="number"
                    step="0.01"
                    value={kellyWinProb * 100}
                    onChange={(e) => setKellyWinProb(Number(e.target.value) / 100)}
                  />
                </div>
                
                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Kelly Fraction:</span>
                    <Badge variant={kellyFraction > 0 ? "default" : "destructive"}>
                      {(kellyFraction * 100).toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Recommended Stake:</span>
                    <span className="font-bold text-lg">
                      ${kellyStake.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Expected Value:</span>
                    <Badge variant={expectedValue > 0 ? "default" : "destructive"}>
                      {(expectedValue * 100).toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kelly Optimization Chart</CardTitle>
                <CardDescription>Expected value vs stake size</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockKellyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stake" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="expectedValue" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name="Expected Value"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="kelly" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Kelly %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Time Analysis Tab */}
        <TabsContent value="time" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Performance by Time of Day
                </CardTitle>
                <CardDescription>
                  Analyze your betting performance across different hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockTimeAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="winRate" 
                      fill="hsl(var(--chart-2))" 
                      name="Win Rate (%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Performance by Day of Week
                </CardTitle>
                <CardDescription>
                  Weekly patterns in your betting performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockDayAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="profit" 
                      fill="hsl(var(--primary))" 
                      name="Profit ($)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Correlation Analysis Tab */}
        <TabsContent value="correlation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Market Correlation Analysis
              </CardTitle>
              <CardDescription>
                Understand relationships between different betting markets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Market 1</th>
                      <th className="text-left p-2">Market 2</th>
                      <th className="text-right p-2">Correlation</th>
                      <th className="text-right p-2">Significance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCorrelationData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{item.market1}</td>
                        <td className="p-2">{item.market2}</td>
                        <td className="text-right p-2">
                          <span className={`font-medium ${
                            item.correlation > 0.6 ? "text-chart-2" : 
                            item.correlation > 0.3 ? "text-yellow-600" : "text-muted-foreground"
                          }`}>
                            {item.correlation.toFixed(2)}
                          </span>
                        </td>
                        <td className="text-right p-2">
                          <Badge 
                            variant={
                              item.significance === "Very High" ? "default" :
                              item.significance === "High" ? "secondary" :
                              item.significance === "Medium" ? "outline" : "destructive"
                            }
                          >
                            {item.significance}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variance Analysis Tab */}
        <TabsContent value="variance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Variance & Risk Analysis
              </CardTitle>
              <CardDescription>
                Analyze the volatility and risk in your betting patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={mockDayAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="winRate" name="Win Rate" />
                  <YAxis dataKey="variance" name="Variance" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter 
                    dataKey="variance" 
                    fill="hsl(var(--chart-3))"
                    name="Risk vs Performance"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Radar Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Performance Radar
              </CardTitle>
              <CardDescription>
                Multi-dimensional view of your betting performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={mockPerformanceRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stake Analysis Tab */}
        <TabsContent value="stakes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Stake Size Analysis
              </CardTitle>
              <CardDescription>
                Performance breakdown by bet size ranges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Stake Range</th>
                      <th className="text-right p-2">Bets</th>
                      <th className="text-right p-2">Win Rate</th>
                      <th className="text-right p-2">Avg Profit</th>
                      <th className="text-right p-2">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStakeAnalysis.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{item.stakeRange}</td>
                        <td className="text-right p-2">{item.bets}</td>
                        <td className="text-right p-2">{item.winRate}%</td>
                        <td className="text-right p-2">
                          <span className="text-chart-2 font-medium">
                            ${item.avgProfit}
                          </span>
                        </td>
                        <td className="text-right p-2">
                          <Badge 
                            variant={item.roi > 15 ? "default" : item.roi > 10 ? "secondary" : "outline"}
                          >
                            {item.roi}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

