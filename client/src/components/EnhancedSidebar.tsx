import { 
  BarChart3, 
  TrendingUp, 
  PlusCircle, 
  History, 
  Wallet,
  Settings,
  Home,
  Calculator,
  Zap,
  Trophy,
  Bell
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ThemeToggle"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    badge: null
  },
  {
    title: "Nova Aposta",
    url: "/add-bet",
    icon: PlusCircle,
    badge: null
  },
  {
    title: "Histórico",
    url: "/history",
    icon: History,
    badge: null
  },
  {
    title: "Banca",
    url: "/bankroll",
    icon: Wallet,
    badge: null
  },
  {
    title: "Analytics",
    url: "/analytics", 
    icon: BarChart3,
    badge: "Novo"
  },
]

const quickActions = [
  {
    title: "Calculadora",
    icon: Calculator,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    title: "Insights IA",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10"
  },
  {
    title: "Metas",
    icon: Trophy,
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  }
]

export function EnhancedSidebar() {
  const [location] = useLocation()

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary to-purple-600 rounded-xl shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl text-gradient">BetTracker</span>
            <div className="text-xs text-muted-foreground">Pro Analytics</div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`group relative overflow-hidden transition-all duration-300 hover:shadow-md ${
                      location === item.url 
                        ? 'bg-primary text-primary-foreground shadow-lg border-primary/20' 
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    <Link 
                      href={item.url}
                      data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}
                      className="flex items-center gap-3 p-3 rounded-lg"
                    >
                      <div className={`p-1.5 rounded-md transition-colors ${
                        location === item.url 
                          ? 'bg-white/20' 
                          : 'bg-transparent group-hover:bg-primary/10'
                      }`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="ml-auto text-xs bg-chart-2 text-white animate-pulse"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Ações Rápidas
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-all duration-300 hover:shadow-md group"
                >
                  <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
                    <action.icon className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <span className="text-sm font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Performance Summary */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Performance Hoje
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-chart-2/10 border border-chart-2/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lucro</span>
                  <span className="text-sm font-bold text-chart-2">+$125</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Taxa</span>
                  <span className="text-sm font-bold text-primary">67%</span>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <div className="space-y-3">
          {/* Notifications */}
          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-all duration-300 w-full">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Bell className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">Notificações</div>
              <div className="text-xs text-muted-foreground">3 novas</div>
            </div>
            <Badge variant="destructive" className="text-xs">3</Badge>
          </button>

          {/* Theme and Logout */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="flex-1 hover:bg-destructive/10 hover:text-destructive transition-colors"
              data-testid="button-logout"
            >
              <a href="/api/logout">Sair</a>
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

