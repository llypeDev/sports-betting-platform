import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Bet, InsertBetStrict } from "@shared/schema";

// Mock data for development
const mockBets = [
  {
    id: 1,
    event: "Lakers vs Warriors",
    sport: "Basketball",
    market: "Moneyline",
    selection: "Lakers",
    odds: 2.1,
    stake: 100,
    result: "Won",
    profit: 110,
    date: new Date().toISOString()
  },
  {
    id: 2,
    event: "Chiefs vs Bills",
    sport: "Football",
    market: "Spread",
    selection: "Chiefs -3.5",
    odds: 1.9,
    stake: 150,
    result: "Lost",
    profit: -150,
    date: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    event: "Real Madrid vs Barcelona",
    sport: "Soccer",
    market: "Over/Under",
    selection: "Over 2.5",
    odds: 1.8,
    stake: 200,
    result: "Won",
    profit: 160,
    date: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 4,
    event: "Celtics vs Heat",
    sport: "Basketball",
    market: "Total Points",
    selection: "Under 215.5",
    odds: 2.0,
    stake: 75,
    result: "Pending",
    profit: 0,
    date: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 5,
    event: "Cowboys vs Giants",
    sport: "Football",
    market: "Moneyline",
    selection: "Cowboys",
    odds: 1.7,
    stake: 120,
    result: "Won",
    profit: 84,
    date: new Date(Date.now() - 345600000).toISOString()
  }
];

const mockBetStats = {
  totalBets: 5,
  totalWins: 3,
  totalStaked: 645,
  totalReturns: 849,
  netProfit: 204
};

export function useBets() {
  const isDevelopment = import.meta.env.DEV;
  
  const query = useQuery<Bet[]>({
    queryKey: ["/api/bets"],
    enabled: !isDevelopment,
  });

  if (isDevelopment) {
    return {
      data: mockBets as any,
      isLoading: false,
      error: null
    };
  }

  return query;
}

export function useBetStats() {
  const isDevelopment = import.meta.env.DEV;
  
  const query = useQuery<{
    totalBets: number;
    totalWins: number;
    totalStaked: number;
    totalReturns: number;
    netProfit: number;
  }>({
    queryKey: ["/api/stats/bets"],
    enabled: !isDevelopment,
  });

  if (isDevelopment) {
    return {
      data: mockBetStats,
      isLoading: false,
      error: null
    };
  }

  return query;
}

export function useCreateBet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bet: InsertBetStrict) => apiRequest("POST", "/api/bets", bet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/bets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/bankroll"] });
    },
  });
}

export function useUpdateBet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<InsertBetStrict> }) =>
      apiRequest("PUT", `/api/bets/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/bets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/bankroll"] });
    },
  });
}

export function useDeleteBet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/bets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/bets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/bankroll"] });
    },
  });
}