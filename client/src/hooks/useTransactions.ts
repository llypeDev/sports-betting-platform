import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Transaction, InsertTransactionStrict } from "@shared/schema";

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });
}

export function useBankrollStats() {
  return useQuery<{
    totalDeposits: number;
    totalWithdrawals: number;
    currentBalance: number;
  }>({
    queryKey: ["/api/stats/bankroll"],
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (transaction: InsertTransactionStrict) => apiRequest("POST", "/api/transactions", transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/bankroll"] });
    },
  });
}