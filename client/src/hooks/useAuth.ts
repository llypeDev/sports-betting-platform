import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  // If we get a 401, user is not authenticated
  const isAuthenticated = !!user && !error;

  return {
    user,
    isAuthenticated,
    isLoading: isLoading && !error // Don't show loading if there's an auth error
  };
}