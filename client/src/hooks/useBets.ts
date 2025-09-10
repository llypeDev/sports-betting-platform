import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Bet, InsertBetStrict } from "@shared/schema";

export function useBets() {
  return useQuery<Bet[]>({
    queryKey: ["/api/bets"],
  });
}

export function useBetStats() {
  return useQuery<{
    totalBets: number;
    totalWins: number;
    totalStaked: number;
    totalReturns: number;
    netProfit: number;
  }>({
    queryKey: ["/api/stats/bets"],
  });
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