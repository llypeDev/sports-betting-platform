import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Check } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useCreateBet } from "@/hooks/useBets"
import { insertBetSchemaStrict } from "@shared/schema"
import { useLocation } from "wouter"
import { z } from "zod"

// Use the strict schema for form validation
const betSchema = insertBetSchemaStrict

type BetFormData = z.infer<typeof betSchema>

const sports = [
  "Football", "Basketball", "Tennis", "Baseball", "Soccer", 
  "Hockey", "Golf", "Boxing", "MMA", "Cricket"
]

const bookmakers = [
  "DraftKings", "FanDuel", "BetMGM", "Caesars", "Bet365", 
  "PointsBet", "Barstool", "WynnBET", "BetRivers", "Other"
]

const betTypes = ["Single", "Parlay", "Teaser", "Prop", "System", "Round Robin"]

const markets = [
  "Moneyline", "Point Spread", "Total Points (Over/Under)", 
  "Player Props", "Team Props", "First Half", "Live Betting"
]

export default function AddBet() {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const { toast } = useToast()
  const [, setLocation] = useLocation()
  const createBetMutation = useCreateBet()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<BetFormData>({
    resolver: zodResolver(betSchema),
    defaultValues: {
      date: new Date(),
      sport: "",
      league: "",
      event: "",
      market: "",
      selection: "",
      bookmaker: "",
      odds: 0,
      stake: 0,
      betType: "",
      result: "Pending",
      notes: "",
    }
  })

  const selectedDate = watch("date")
  const selectedOdds = watch("odds")
  const selectedStake = watch("stake")

  const calculatePayout = () => {
    if (selectedOdds && selectedStake && selectedOdds > 0 && selectedStake > 0) {
      return (selectedStake * selectedOdds).toFixed(2)
    }
    return "0.00"
  }

  const calculateProfit = () => {
    if (selectedOdds && selectedStake && selectedOdds > 0 && selectedStake > 0) {
      return (selectedStake * (selectedOdds - 1)).toFixed(2)
    }
    return "0.00"
  }

  const onSubmit = async (data: BetFormData) => {
    try {
      // Data is already properly typed and validated by the strict schema
      await createBetMutation.mutateAsync(data)
      
      toast({
        title: "Bet Added Successfully",
        description: `Your ${data.betType.toLowerCase()} bet on ${data.event} has been recorded.`,
      })
      
      reset()
      setLocation("/")
    } catch (error) {
      console.error('Failed to create bet:', error)
      toast({
        title: "Error",
        description: "Failed to add bet. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Bet</h1>
        <p className="text-muted-foreground">Record a new betting slip with all the details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Information about the sporting event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                          data-testid="button-select-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setValue("date", date || new Date())
                            setCalendarOpen(false)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sport">Sport</Label>
                    <Select onValueChange={(value) => setValue("sport", value)}>
                      <SelectTrigger data-testid="select-sport">
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {sports.map((sport) => (
                          <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.sport && (
                      <p className="text-sm text-destructive">{errors.sport.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="league">League (Optional)</Label>
                  <Input 
                    {...register("league")}
                    placeholder="e.g., NBA, Premier League, ATP"
                    data-testid="input-league"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event">Event/Game</Label>
                  <Input 
                    {...register("event")}
                    placeholder="e.g., Lakers vs Warriors, Manchester City vs Liverpool"
                    data-testid="input-event"
                  />
                  {errors.event && (
                    <p className="text-sm text-destructive">{errors.event.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bet Details */}
            <Card>
              <CardHeader>
                <CardTitle>Bet Details</CardTitle>
                <CardDescription>Specific information about your wager</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="market">Market</Label>
                    <Select onValueChange={(value) => setValue("market", value)}>
                      <SelectTrigger data-testid="select-market">
                        <SelectValue placeholder="Select market" />
                      </SelectTrigger>
                      <SelectContent>
                        {markets.map((market) => (
                          <SelectItem key={market} value={market}>{market}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.market && (
                      <p className="text-sm text-destructive">{errors.market.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="betType">Bet Type</Label>
                    <Select onValueChange={(value) => setValue("betType", value)}>
                      <SelectTrigger data-testid="select-bet-type">
                        <SelectValue placeholder="Select bet type" />
                      </SelectTrigger>
                      <SelectContent>
                        {betTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.betType && (
                      <p className="text-sm text-destructive">{errors.betType.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selection">Selection</Label>
                  <Input 
                    {...register("selection")}
                    placeholder="e.g., Lakers -5.5, Over 220.5 points, Djokovic to win"
                    data-testid="input-selection"
                  />
                  {errors.selection && (
                    <p className="text-sm text-destructive">{errors.selection.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="odds">Odds</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      {...register("odds", { valueAsNumber: true })}
                      placeholder="2.00"
                      data-testid="input-odds"
                    />
                    {errors.odds && (
                      <p className="text-sm text-destructive">{errors.odds.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stake">Stake ($)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      {...register("stake", { valueAsNumber: true })}
                      placeholder="100.00"
                      data-testid="input-stake"
                    />
                    {errors.stake && (
                      <p className="text-sm text-destructive">{errors.stake.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bookmaker">Bookmaker</Label>
                    <Select onValueChange={(value) => setValue("bookmaker", value)}>
                      <SelectTrigger data-testid="select-bookmaker">
                        <SelectValue placeholder="Select bookmaker" />
                      </SelectTrigger>
                      <SelectContent>
                        {bookmakers.map((bookmaker) => (
                          <SelectItem key={bookmaker} value={bookmaker}>{bookmaker}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bookmaker && (
                      <p className="text-sm text-destructive">{errors.bookmaker.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea 
                    {...register("notes")}
                    placeholder="Any additional notes about this bet..."
                    className="min-h-[100px]"
                    data-testid="textarea-notes"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bet Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bet Summary</CardTitle>
                <CardDescription>Calculated payout information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stake:</span>
                  <span className="font-mono" data-testid="text-stake-summary">
                    ${selectedStake || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Odds:</span>
                  <span className="font-mono" data-testid="text-odds-summary">
                    {selectedOdds || "0.00"}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Potential Payout:</span>
                    <span className="font-mono text-chart-2" data-testid="text-potential-payout">
                      ${calculatePayout()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Potential Profit:</span>
                    <span className="font-mono" data-testid="text-potential-profit">
                      ${calculateProfit()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                data-testid="button-submit-bet"
              >
                <Check className="mr-2 h-4 w-4" />
                Add Bet
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => reset()}
                data-testid="button-clear-form"
              >
                Clear Form
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}