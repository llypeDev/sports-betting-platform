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
  BarChart3,
  Zap,
  Trophy,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { Link } from "wouter"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { useBets, useBetStats } from "@/hooks/useBets"
import { useBankrollStats } from "@/hooks/useTransactions"
import { format } from "date-fns"

export default function EnhancedDashboard() {
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
      balance: runningBalance,
      profit: Number(bet.profit || 0)
    }
  }).reverse() : [];

  // Mock data for enhanced features
  const todayStats = {
    bets: 3,
    profit: 125.50,
    winRate: 66.7
  }

  const weeklyGoal = {
    target: 500,
    current: 325,
    percentage: 65
  }

  const hotStreaks = [
    { type: "Win Streak", count: 5, active: true },
    { type: "Profit Days", count: 7, active: true },
    { type: "ROI Above 15%", count: 12, active: false }
  ]

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header with enhanced styling */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-gradient">Dashboard</h1>
          <p className="text-muted-foreground text-lg">Sua visão geral de performance em apostas</p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="btn-gradient shadow-lg hover:shadow-xl transition-all duration-300" data-testid="button-add-bet">
            <Link href="/add-bet">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Aposta
            </Link>
          </Button>
          <Button variant="outline" asChild className="border-gradient hover:shadow-md transition-all duration-300" data-testid="button-view-history">
            <Link href="/history">
              <History className="h-4 w-4 mr-2" />
              Ver Histórico
            </Link>
          </Button>
        </div>
      </div>

      {/* Today's Performance */}
      <Card className="card-gradient animate-slide-in border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Performance de Hoje</CardTitle>
            </div>
            <Badge variant="outline" className="bg-primary/10">
              <Clock className="h-3 w-3 mr-1" />
              Ao Vivo
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{todayStats.bets}</div>
              <div className="text-sm text-muted-foreground">Apostas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-2 flex items-center justify-center gap-1">
                <ArrowUpRight className="h-4 w-4" />
                ${todayStats.profit}
              </div>
              <div className="text-sm text-muted-foreground">Lucro</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{todayStats.winRate}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Acerto</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="card-gradient hover:animate-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-28 shimmer" />
            ) : (
              <div className="text-2xl font-bold" data-testid="text-total-balance">
                ${(bankrollStats?.currentBalance ?? 0).toLocaleString()}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              +2.5% desde ontem
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-gradient hover:animate-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
            <div className="p-2 bg-chart-2/10 rounded-full">
              <TrendingUp className="h-4 w-4 text-chart-2" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-28 shimmer" />
            ) : (
              <div className="text-2xl font-bold text-chart-2 flex items-center gap-1" data-testid="text-total-profit">
                <ArrowUpRight className="h-4 w-4" />
                {betStats ? `${betStats.netProfit > 0 ? "+" : ""}$${Math.abs(betStats.netProfit).toLocaleString()}` : "—"}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              +15.2% este mês
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient hover:animate-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
            <div className="p-2 bg-yellow-500/10 rounded-full">
              <Target className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20 shimmer" />
            ) : (
              <div className="text-2xl font-bold" data-testid="text-win-rate">
                {winRate.toFixed(1)}%
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Acima da média
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient hover:animate-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Apostas</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16 shimmer" />
            ) : (
              <div className="text-2xl font-bold" data-testid="text-total-bets">
                {betStats?.totalBets ?? 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              +8 esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient hover:animate-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-full">
              <Zap className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16 shimmer" />
            ) : (
              <div className="text-2xl font-bold text-chart-2" data-testid="text-roi">
                {roi.toFixed(1)}%
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Excelente performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goal Progress */}
      <Card className="card-gradient animate-scale-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <CardTitle>Meta Semanal</CardTitle>
            </div>
            <Badge variant="secondary">{weeklyGoal.percentage}% completo</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progresso: ${weeklyGoal.current}</span>
              <span>Meta: ${weeklyGoal.target}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-chart-2 to-primary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${weeklyGoal.percentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Faltam ${weeklyGoal.target - weeklyGoal.current} para atingir sua meta
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Hot Streaks */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Sequências Ativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hotStreaks.map((streak, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                streak.active 
                  ? 'border-chart-2 bg-chart-2/5 animate-pulse' 
                  : 'border-muted bg-muted/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{streak.type}</div>
                    <div className="text-2xl font-bold">{streak.count}</div>
                  </div>
                  <div className={`p-2 rounded-full ${
                    streak.active ? 'bg-chart-2 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {streak.active ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Chart and Recent Bets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Balance Chart */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Tendência do Saldo
            </CardTitle>
            <CardDescription>Evolução da sua banca nos últimos dias</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full shimmer" />
                <Skeleton className="h-8 w-full shimmer" />
                <Skeleton className="h-64 w-full shimmer" />
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Saldo']} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fill="url(#balanceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum histórico ainda. Adicione apostas para ver sua tendência!</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Recent Bets */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Apostas Recentes
            </CardTitle>
            <CardDescription>Sua atividade mais recente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border animate-pulse">
                    <Skeleton className="h-5 w-48 mb-2 shimmer" />
                    <Skeleton className="h-4 w-64 mb-1 shimmer" />
                    <Skeleton className="h-3 w-40 shimmer" />
                  </div>
                ))}
              </div>
            ) : !bets || bets.length === 0 ? (
              <div className="text-center py-8">
                <PlusCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <div className="text-sm text-muted-foreground">
                  Nenhuma aposta ainda. <Link href="/add-bet"><span className="text-primary cursor-pointer hover:underline font-medium">Adicione sua primeira aposta</span></Link> para ver atividade aqui.
                </div>
              </div>
            ) : (
              bets.slice(0, 5).map((bet) => (
                <div key={bet.id} className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-all duration-300 hover:border-primary/50">
                  <div className="space-y-1 flex-1">
                    <div className="font-medium" data-testid={`text-bet-event-${bet.id}`}>
                      {bet.event}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {bet.sport} • {bet.market} • {bet.selection}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>@{Number(bet.odds).toFixed(2)}</span>
                      <span>•</span>
                      <span>${Number(bet.stake).toFixed(2)} stake</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge 
                      variant={bet.result === "Won" ? "default" : bet.result === "Lost" ? "destructive" : "secondary"}
                      data-testid={`badge-result-${bet.id}`}
                      className="animate-scale-in"
                    >
                      {bet.result || "Pendente"}
                    </Badge>
                    <div className={`text-sm font-medium flex items-center gap-1 ${
                      Number(bet.profit || 0) > 0 ? "text-chart-2" : "text-destructive"
                    }`}>
                      {Number(bet.profit || 0) > 0 ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
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

