import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Filter, Download, Eye } from "lucide-react"

// Mock data - todo: remove mock functionality
const mockBets = [
  {
    id: 1,
    date: "2024-12-10",
    sport: "Football",
    league: "NFL",
    event: "Chiefs vs Bills",
    market: "Point Spread",
    selection: "Chiefs -3.5",
    bookmaker: "DraftKings",
    odds: 1.91,
    stake: 100,
    result: "Won",
    profit: 91,
    betType: "Single"
  },
  {
    id: 2,
    date: "2024-12-09",
    sport: "Basketball",
    league: "NBA",
    event: "Lakers vs Warriors",
    market: "Total Points",
    selection: "Over 225.5",
    bookmaker: "FanDuel",
    odds: 1.85,
    stake: 50,
    result: "Lost",
    profit: -50,
    betType: "Single"
  },
  {
    id: 3,
    date: "2024-12-08",
    sport: "Tennis",
    league: "ATP",
    event: "Djokovic vs Nadal",
    market: "Match Winner",
    selection: "Djokovic",
    bookmaker: "Bet365",
    odds: 1.75,
    stake: 75,
    result: "Won",
    profit: 56.25,
    betType: "Single"
  },
  {
    id: 4,
    date: "2024-12-07",
    sport: "Football",
    league: "Premier League",
    event: "Manchester City vs Liverpool",
    market: "Both Teams to Score",
    selection: "Yes",
    bookmaker: "BetMGM",
    odds: 1.65,
    stake: 80,
    result: "Won",
    profit: 52,
    betType: "Single"
  },
  {
    id: 5,
    date: "2024-12-06",
    sport: "Basketball",
    league: "NBA",
    event: "Celtics vs Heat",
    market: "Player Props",
    selection: "Tatum Over 25.5 pts",
    bookmaker: "Caesars",
    odds: 2.10,
    stake: 60,
    result: "Lost",
    profit: -60,
    betType: "Single"
  }
]

export default function BetHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sportFilter, setSportFilter] = useState("all")
  const [resultFilter, setResultFilter] = useState("all")
  const [selectedBet, setSelectedBet] = useState<number | null>(null)

  const filteredBets = mockBets.filter(bet => {
    const matchesSearch = bet.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bet.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bet.selection.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = sportFilter === "all" || bet.sport === sportFilter
    const matchesResult = resultFilter === "all" || bet.result === resultFilter
    
    return matchesSearch && matchesSport && matchesResult
  })

  const totalProfit = filteredBets.reduce((sum, bet) => sum + bet.profit, 0)
  const winCount = filteredBets.filter(bet => bet.result === "Won").length
  const winRate = filteredBets.length > 0 ? ((winCount / filteredBets.length) * 100).toFixed(1) : "0.0"

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bet History</h1>
          <p className="text-muted-foreground">Track and analyze all your betting activity</p>
        </div>
        <Button variant="outline" data-testid="button-export">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-bets-history">
              {filteredBets.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-win-rate-history">
              {winRate}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              totalProfit >= 0 ? "text-chart-2" : "text-destructive"
            }`} data-testid="text-total-profit-history">
              {totalProfit >= 0 ? "+" : ""}${totalProfit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Refine your bet history view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events, sports, or selections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
            
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger className="w-full md:w-[200px]" data-testid="select-sport-filter">
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                <SelectItem value="Football">Football</SelectItem>
                <SelectItem value="Basketball">Basketball</SelectItem>
                <SelectItem value="Tennis">Tennis</SelectItem>
                <SelectItem value="Baseball">Baseball</SelectItem>
              </SelectContent>
            </Select>

            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger className="w-full md:w-[200px]" data-testid="select-result-filter">
                <SelectValue placeholder="All Results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
                <SelectItem value="Push">Push</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bet Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bet Details</CardTitle>
          <CardDescription>Complete history of your betting activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Selection</TableHead>
                  <TableHead>Odds</TableHead>
                  <TableHead>Stake</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>P&L</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBets.map((bet) => (
                  <TableRow key={bet.id}>
                    <TableCell className="font-medium" data-testid={`cell-date-${bet.id}`}>
                      {new Date(bet.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{bet.sport}</div>
                        <div className="text-xs text-muted-foreground">{bet.league}</div>
                      </div>
                    </TableCell>
                    <TableCell data-testid={`cell-event-${bet.id}`}>
                      <div>
                        <div className="font-medium">{bet.event}</div>
                        <div className="text-xs text-muted-foreground">{bet.bookmaker}</div>
                      </div>
                    </TableCell>
                    <TableCell data-testid={`cell-selection-${bet.id}`}>
                      <div>
                        <div className="font-medium">{bet.selection}</div>
                        <div className="text-xs text-muted-foreground">{bet.market}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{bet.odds}</TableCell>
                    <TableCell className="font-mono">${bet.stake}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={bet.result === "Won" ? "default" : bet.result === "Lost" ? "destructive" : "secondary"}
                        data-testid={`badge-result-${bet.id}`}
                      >
                        {bet.result}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-mono font-medium ${
                        bet.profit > 0 ? "text-chart-2" : bet.profit < 0 ? "text-destructive" : "text-muted-foreground"
                      }`}>
                        {bet.profit > 0 ? "+" : ""}${bet.profit}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedBet(selectedBet === bet.id ? null : bet.id)}
                        data-testid={`button-view-${bet.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredBets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No bets match your current filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}