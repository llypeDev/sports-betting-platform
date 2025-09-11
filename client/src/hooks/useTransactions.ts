import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Transaction, InsertTransactionStrict } from "@shared/schema";

// Mock data for development
const mockBankrollStats = {
  currentBalance: 2450,
  totalDeposits: 2000,
  totalWithdrawals: 350
};

export function useTransactions() {
  const isDevelopment = import.meta.env.DEV;
  
  const query = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: !isDevelopment,
  });

  if (isDevelopment) {
    return {
      data: [],
      isLoading: false,
      error: null
    };
  }

  return query;
}

export function useBankrollStats() {
  const isDevelopment = import.meta.env.DEV;
  
  const query = useQuery<{
    totalDeposits: number;
    totalWithdrawals: number;
    currentBalance: number;
  }>({
    queryKey: ["/api/stats/bankroll"],
    enabled: !isDevelopment,
  });

  if (isDevelopment) {
    return {
      data: mockBankrollStats,
      isLoading: false,
      error: null
    };
  }

  return query;
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