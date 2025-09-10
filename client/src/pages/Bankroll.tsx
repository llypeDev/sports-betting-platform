import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Minus, ArrowUpCircle, ArrowDownCircle, DollarSign, TrendingUp, Wallet } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useToast } from "@/hooks/use-toast"

const transactionSchema = z.object({
  type: z.enum(["deposit", "withdrawal"]),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
})

type TransactionFormData = z.infer<typeof transactionSchema>

// Mock data - todo: remove mock functionality
const mockTransactions = [
  {
    id: 1,
    type: "deposit",
    amount: 1000,
    description: "Initial bankroll deposit",
    date: "2024-12-01",
    balance: 1000
  },
  {
    id: 2,
    type: "deposit",
    amount: 500,
    description: "Additional funds",
    date: "2024-12-03",
    balance: 1500
  },
  {
    id: 3,
    type: "withdrawal",
    amount: 200,
    description: "Partial withdrawal",
    date: "2024-12-05",
    balance: 1300
  },
  {
    id: 4,
    type: "deposit",
    amount: 300,
    description: "Weekly deposit",
    date: "2024-12-08",
    balance: 1600
  }
]

const mockBankrollChart = [
  { date: 'Dec 1', balance: 1000, deposits: 1000, winnings: 0 },
  { date: 'Dec 2', balance: 1050, deposits: 1000, winnings: 50 },
  { date: 'Dec 3', balance: 1550, deposits: 1500, winnings: 50 },
  { date: 'Dec 4', balance: 1600, deposits: 1500, winnings: 100 },
  { date: 'Dec 5', balance: 1400, deposits: 1300, winnings: 100 },
  { date: 'Dec 6', balance: 1450, deposits: 1300, winnings: 150 },
  { date: 'Dec 7', balance: 1500, deposits: 1300, winnings: 200 },
  { date: 'Dec 8', balance: 1800, deposits: 1600, winnings: 200 },
  { date: 'Dec 9', balance: 1850, deposits: 1600, winnings: 250 },
  { date: 'Dec 10', balance: 1900, deposits: 1600, winnings: 300 },
]

const mockStats = {
  currentBalance: 1900,
  totalDeposits: 1600,
  totalWithdrawals: 200,
  totalWinnings: 300,
  netDeposits: 1400,
  roi: 21.4
}

const pieData = [
  { name: 'Net Deposits', value: mockStats.netDeposits, color: 'hsl(var(--primary))' },
  { name: 'Winnings', value: mockStats.totalWinnings, color: 'hsl(var(--chart-2))' },
]

export default function Bankroll() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      amount: 0,
    }
  })

  const transactionType = watch("type")

  const onSubmit = (data: TransactionFormData) => {
    console.log('Transaction added:', data) // todo: remove mock functionality
    toast({
      title: "Transaction Added",
      description: `${data.type === "deposit" ? "Deposit" : "Withdrawal"} of $${data.amount} has been recorded.`,
    })
    reset()
    setDialogOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bankroll Management</h1>
          <p className="text-muted-foreground">Track deposits, withdrawals, and balance history</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-transaction">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select onValueChange={(value: "deposit" | "withdrawal") => setValue("type", value)}>
                  <SelectTrigger data-testid="select-transaction-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input 
                  type="number"
                  step="0.01"
                  {...register("amount", { valueAsNumber: true })}
                  placeholder="100.00"
                  data-testid="input-amount"
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  type="date"
                  {...register("date")}
                  data-testid="input-date"
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  {...register("description")}
                  placeholder="e.g., Initial deposit, Weekly withdrawal..."
                  data-testid="textarea-description"
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="flex-1"
                  data-testid="button-submit-transaction"
                >
                  {transactionType === "deposit" ? (
                    <ArrowUpCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4 mr-2" />
                  )}
                  Add {transactionType === "deposit" ? "Deposit" : "Withdrawal"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-current-balance">
              ${mockStats.currentBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2" data-testid="text-total-deposits">
              ${mockStats.totalDeposits.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="text-total-withdrawals">
              ${mockStats.totalWithdrawals.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2" data-testid="text-roi">
              {mockStats.roi}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Bankroll History</CardTitle>
            <CardDescription>Track your balance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockBankrollChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Total Balance"
                />
                <Line 
                  type="monotone" 
                  dataKey="deposits" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="Deposits"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Balance Composition */}
        <Card>
          <CardHeader>
            <CardTitle>Balance Composition</CardTitle>
            <CardDescription>Breakdown of your current balance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name}: ${entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Complete record of deposits and withdrawals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.slice().reverse().map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium" data-testid={`cell-date-${transaction.id}`}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={transaction.type === "deposit" ? "default" : "secondary"}
                        data-testid={`badge-type-${transaction.id}`}
                      >
                        {transaction.type === "deposit" ? (
                          <ArrowUpCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownCircle className="h-3 w-3 mr-1" />
                        )}
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell data-testid={`cell-description-${transaction.id}`}>
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <span className={`font-mono font-medium ${
                        transaction.type === "deposit" ? "text-chart-2" : "text-destructive"
                      }`}>
                        {transaction.type === "deposit" ? "+" : "-"}${transaction.amount}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono font-medium" data-testid={`cell-balance-${transaction.id}`}>
                      ${transaction.balance.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}