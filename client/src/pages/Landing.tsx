import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BarChart3, Target, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">BetTracker</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              asChild 
              data-testid="button-login"
            >
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Sports Betting
            <span className="text-primary block">Management Platform</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track your bankroll, analyze performance, and optimize your betting strategy 
            with comprehensive tools designed for serious sports bettors.
          </p>
          <Button 
            size="lg" 
            asChild
            data-testid="button-get-started"
          >
            <a href="/api/login">Get Started Free</a>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Manage Your Bets
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Detailed performance metrics, ROI tracking, and profit/loss analysis
                  across all your betting activities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-chart-2" />
                </div>
                <CardTitle>Bankroll Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Professional bankroll tracking with deposit/withdrawal management
                  and balance monitoring.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-chart-4" />
                </div>
                <CardTitle>Bet Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive bet registration with detailed categorization,
                  odds tracking, and result management.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-5/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-chart-5" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your betting data is secure and private with industry-standard
                  encryption and data protection.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Betting?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of professional bettors who trust BetTracker to manage their success.
          </p>
          <Button 
            size="lg" 
            asChild
            data-testid="button-start-tracking"
          >
            <a href="/api/login">Start Tracking Now</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 BetTracker. Professional sports betting management platform.</p>
        </div>
      </footer>
    </div>
  )
}