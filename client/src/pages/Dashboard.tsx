import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  PlusCircle,
  History,
  BarChart3
} from "lucide-react"
import { Link } from "wouter"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useBets, useBetStats } from "@/hooks/useBets"
import { useBankrollStats } from "@/hooks/useTransactions"
import { format } from "date-fns"


export default function Dashboard() {
  const { data: bets, isLoading: betsLoading } = useBets();
  const { data: betStats, isLoading: betStatsLoading } = useBetStats();
  const { data: bankrollStats, isLoading: bankrollLoading } = useBankrollStats();
  
  const isLoading = betsLoading || betStatsLoading || bankrollLoading;
  const winRate = betStats && betStats.totalBets ? ((betStats.totalWins / betStats.totalBets) * 100) : 0;
  const roi = betStats && betStats.totalStaked ? ((betStats.netProfit / betStats.totalStaked) * 100) : 0;
  
  // Generate chart data from recent transactions and bets
  const recentBets = bets?.slice(0, 5) || [];
  const chartData = recentBets.length > 0 ? recentBets.map((bet, index) => {
    const previousBets = recentBets.slice(index + 1);
    const runningBalance = (bankrollStats?.currentBalance || 0) - previousBets.reduce((sum, b) => sum + Number(b.profit || 0), 0);
    return {
      date: format(new Date(bet.date), 'MMM d'),
      balance: runningBalance
    }
  }).reverse() : [];
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your betting performance overview</p>
        </div>
        <div className="flex gap-2">
          <Button asChild data-testid="button-add-bet">
            <Link href="/add-bet">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Bet
            </Link>
          </Button>
          <Button variant="outline" asChild data-testid="button-view-history">
            <Link href="/history">
              <History className="h-4 w-4 mr-2" />
              View History
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              <div className="text-2xl font-bold" data-testid="text-total-balance">
                ${(bankrollStats?.currentBalance ?? 0).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              <div className="text-2xl font-bold text-chart-2" data-testid="text-total-profit">
                {betStats ? `${betStats.netProfit > 0 ? "+" : ""}$${Math.abs(betStats.netProfit).toLocaleString()}` : "—"}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold" data-testid="text-win-rate">
                {winRate.toFixed(1)}%
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bets</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold" data-testid="text-total-bets">
                {betStats?.totalBets ?? 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold text-chart-2" data-testid="text-roi">
                {roi.toFixed(1)}%
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chart and Recent Bets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Balance Trend</CardTitle>
            <CardDescription>Your bankroll over the last 10 days</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Balance']} />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>No betting history yet. Add bets to see your balance trend!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bets */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bets</CardTitle>
            <CardDescription>Your latest betting activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-64 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                ))}
              </div>
            ) : !bets || bets.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">
                No recent bets yet. <Link href="/add-bet"><span className="text-primary cursor-pointer hover:underline">Add your first bet</span></Link> to see activity here.
              </div>
            ) : (
              bets.slice(0, 5).map((bet) => (
                <div key={bet.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <div className="font-medium" data-testid={`text-bet-event-${bet.id}`}>
                      {bet.event}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {bet.sport} • {bet.market} • {bet.selection}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      @{Number(bet.odds).toFixed(2)} • ${Number(bet.stake).toFixed(2)} stake
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={bet.result === "Won" ? "default" : bet.result === "Lost" ? "destructive" : "secondary"}
                      data-testid={`badge-result-${bet.id}`}
                    >
                      {bet.result || "Pending"}
                    </Badge>
                    <div className={`text-sm font-medium mt-1 ${
                      Number(bet.profit || 0) > 0 ? "text-chart-2" : "text-destructive"
                    }`}>
                      {Number(bet.profit || 0) > 0 ? "+" : ""}${Number(bet.profit || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}