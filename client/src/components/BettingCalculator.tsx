import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Calculator, 
  DollarSign, 
  Percent, 
  TrendingUp,
  Target,
  AlertCircle,
  Info
} from "lucide-react"

export default function BettingCalculator() {
  // Single Bet Calculator
  const [singleStake, setSingleStake] = useState(100)
  const [singleOdds, setSingleOdds] = useState(2.0)
  
  // Accumulator Calculator
  const [accumulatorBets, setAccumulatorBets] = useState([
    { odds: 1.8, selection: "Team A to Win" },
    { odds: 2.1, selection: "Over 2.5 Goals" },
    { odds: 1.9, selection: "Both Teams to Score" }
  ])
  const [accumulatorStake, setAccumulatorStake] = useState(50)
  
  // Arbitrage Calculator
  const [arbOdds1, setArbOdds1] = useState(2.1)
  const [arbOdds2, setArbOdds2] = useState(2.0)
  const [arbTotalStake, setArbTotalStake] = useState(1000)
  
  // Dutching Calculator
  const [dutchingOdds, setDutchingOdds] = useState([2.5, 3.2, 4.0])
  const [dutchingStake, setDutchingStake] = useState(100)
  
  // Each Way Calculator
  const [ewStake, setEwStake] = useState(10)
  const [ewOdds, setEwOdds] = useState(8.0)
  const [ewPlaceTerms, setEwPlaceTerms] = useState(0.25) // 1/4 odds
  const [ewPlaces, setEwPlaces] = useState(3)

  // Single Bet Calculations
  const singlePotentialWin = singleStake * singleOdds
  const singleProfit = singlePotentialWin - singleStake
  
  // Accumulator Calculations
  const accumulatorTotalOdds = accumulatorBets.reduce((total, bet) => total * bet.odds, 1)
  const accumulatorPotentialWin = accumulatorStake * accumulatorTotalOdds
  const accumulatorProfit = accumulatorPotentialWin - accumulatorStake
  
  // Arbitrage Calculations
  const arbImpliedProb1 = 1 / arbOdds1
  const arbImpliedProb2 = 1 / arbOdds2
  const arbTotalImplied = arbImpliedProb1 + arbImpliedProb2
  const arbOpportunity = arbTotalImplied < 1
  const arbStake1 = arbTotalStake * arbImpliedProb1 / arbTotalImplied
  const arbStake2 = arbTotalStake * arbImpliedProb2 / arbTotalImplied
  const arbProfit = arbOpportunity ? arbTotalStake * (1 - arbTotalImplied) : 0
  
  // Dutching Calculations
  const dutchingTotalImplied = dutchingOdds.reduce((sum, odds) => sum + (1 / odds), 0)
  const dutchingStakes = dutchingOdds.map(odds => dutchingStake * (1 / odds) / dutchingTotalImplied)
  const dutchingPayout = dutchingStake / dutchingTotalImplied
  const dutchingProfit = dutchingPayout - dutchingStake
  
  // Each Way Calculations
  const ewWinReturn = ewStake * ewOdds
  const ewPlaceOdds = 1 + ((ewOdds - 1) * ewPlaceTerms)
  const ewPlaceReturn = ewStake * ewPlaceOdds
  const ewTotalStake = ewStake * 2 // Win + Place
  const ewWinProfit = ewWinReturn + ewPlaceReturn - ewTotalStake
  const ewPlaceOnlyProfit = ewPlaceReturn - ewTotalStake

  const addAccumulatorBet = () => {
    setAccumulatorBets([...accumulatorBets, { odds: 2.0, selection: "New Selection" }])
  }

  const updateAccumulatorBet = (index: number, field: string, value: any) => {
    const updated = [...accumulatorBets]
    updated[index] = { ...updated[index], [field]: value }
    setAccumulatorBets(updated)
  }

  const removeAccumulatorBet = (index: number) => {
    setAccumulatorBets(accumulatorBets.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calculator className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Betting Calculator</h2>
      </div>
      
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="single">Single Bet</TabsTrigger>
          <TabsTrigger value="accumulator">Accumulator</TabsTrigger>
          <TabsTrigger value="arbitrage">Arbitrage</TabsTrigger>
          <TabsTrigger value="dutching">Dutching</TabsTrigger>
          <TabsTrigger value="eachway">Each Way</TabsTrigger>
        </TabsList>

        {/* Single Bet Calculator */}
        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Single Bet Calculator
              </CardTitle>
              <CardDescription>
                Calculate potential returns for a single bet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="single-stake">Stake ($)</Label>
                  <Input
                    id="single-stake"
                    type="number"
                    value={singleStake}
                    onChange={(e) => setSingleStake(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="single-odds">Decimal Odds</Label>
                  <Input
                    id="single-odds"
                    type="number"
                    step="0.01"
                    value={singleOdds}
                    onChange={(e) => setSingleOdds(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Potential Win:</span>
                  <span className="text-lg font-bold">${singlePotentialWin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Profit:</span>
                  <span className="text-lg font-bold text-chart-2">
                    ${singleProfit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Return on Investment:</span>
                  <Badge variant="default">
                    {((singleProfit / singleStake) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accumulator Calculator */}
        <TabsContent value="accumulator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Accumulator Calculator
              </CardTitle>
              <CardDescription>
                Calculate returns for multiple combined bets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="acc-stake">Total Stake ($)</Label>
                <Input
                  id="acc-stake"
                  type="number"
                  value={accumulatorStake}
                  onChange={(e) => setAccumulatorStake(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Selections</Label>
                  <Button onClick={addAccumulatorBet} size="sm">
                    Add Selection
                  </Button>
                </div>
                
                {accumulatorBets.map((bet, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Selection"
                      value={bet.selection}
                      onChange={(e) => updateAccumulatorBet(index, 'selection', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={bet.odds}
                      onChange={(e) => updateAccumulatorBet(index, 'odds', Number(e.target.value))}
                      className="w-24"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeAccumulatorBet(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Combined Odds:</span>
                  <span className="font-bold">{accumulatorTotalOdds.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Potential Win:</span>
                  <span className="text-lg font-bold">${accumulatorPotentialWin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Profit:</span>
                  <span className="text-lg font-bold text-chart-2">
                    ${accumulatorProfit.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Arbitrage Calculator */}
        <TabsContent value="arbitrage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Arbitrage Calculator
              </CardTitle>
              <CardDescription>
                Find risk-free betting opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="arb-odds1">Odds 1</Label>
                  <Input
                    id="arb-odds1"
                    type="number"
                    step="0.01"
                    value={arbOdds1}
                    onChange={(e) => setArbOdds1(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arb-odds2">Odds 2</Label>
                  <Input
                    id="arb-odds2"
                    type="number"
                    step="0.01"
                    value={arbOdds2}
                    onChange={(e) => setArbOdds2(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arb-stake">Total Stake ($)</Label>
                  <Input
                    id="arb-stake"
                    type="number"
                    value={arbTotalStake}
                    onChange={(e) => setArbTotalStake(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                {arbOpportunity ? (
                  <Info className="h-4 w-4 text-chart-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
                <span className="text-sm">
                  {arbOpportunity 
                    ? "Arbitrage opportunity detected!" 
                    : "No arbitrage opportunity available"
                  }
                </span>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Stake on Outcome 1:</span>
                  <span className="font-bold">${arbStake1.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Stake on Outcome 2:</span>
                  <span className="font-bold">${arbStake2.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Guaranteed Profit:</span>
                  <span className={`text-lg font-bold ${arbOpportunity ? 'text-chart-2' : 'text-destructive'}`}>
                    ${arbProfit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Profit Margin:</span>
                  <Badge variant={arbOpportunity ? "default" : "destructive"}>
                    {((arbProfit / arbTotalStake) * 100).toFixed(2)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dutching Calculator */}
        <TabsContent value="dutching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Dutching Calculator
              </CardTitle>
              <CardDescription>
                Distribute stakes across multiple selections for equal profit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dutch-stake">Total Stake ($)</Label>
                <Input
                  id="dutch-stake"
                  type="number"
                  value={dutchingStake}
                  onChange={(e) => setDutchingStake(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Selection Odds</Label>
                {dutchingOdds.map((odds, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-sm w-20">Selection {index + 1}:</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={odds}
                      onChange={(e) => {
                        const newOdds = [...dutchingOdds]
                        newOdds[index] = Number(e.target.value)
                        setDutchingOdds(newOdds)
                      }}
                      className="w-24"
                    />
                    <span className="text-sm font-medium">
                      Stake: ${dutchingStakes[index]?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Payout (any winner):</span>
                  <span className="text-lg font-bold">${dutchingPayout.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Profit:</span>
                  <span className={`text-lg font-bold ${dutchingProfit > 0 ? 'text-chart-2' : 'text-destructive'}`}>
                    ${dutchingProfit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">ROI:</span>
                  <Badge variant={dutchingProfit > 0 ? "default" : "destructive"}>
                    {((dutchingProfit / dutchingStake) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Each Way Calculator */}
        <TabsContent value="eachway" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Each Way Calculator
              </CardTitle>
              <CardDescription>
                Calculate returns for each way bets (win + place)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ew-stake">Each Way Stake ($)</Label>
                  <Input
                    id="ew-stake"
                    type="number"
                    value={ewStake}
                    onChange={(e) => setEwStake(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ew-odds">Win Odds</Label>
                  <Input
                    id="ew-odds"
                    type="number"
                    step="0.01"
                    value={ewOdds}
                    onChange={(e) => setEwOdds(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ew-terms">Place Terms (fraction)</Label>
                  <Input
                    id="ew-terms"
                    type="number"
                    step="0.01"
                    value={ewPlaceTerms}
                    onChange={(e) => setEwPlaceTerms(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ew-places">Places Paid</Label>
                  <Input
                    id="ew-places"
                    type="number"
                    value={ewPlaces}
                    onChange={(e) => setEwPlaces(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Stake:</span>
                  <span className="font-bold">${ewTotalStake.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Place Odds:</span>
                  <span className="font-bold">{ewPlaceOdds.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Win + Place Profit:</span>
                  <span className="text-lg font-bold text-chart-2">
                    ${ewWinProfit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Place Only Profit:</span>
                  <span className={`text-lg font-bold ${ewPlaceOnlyProfit > 0 ? 'text-chart-2' : 'text-destructive'}`}>
                    ${ewPlaceOnlyProfit.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

