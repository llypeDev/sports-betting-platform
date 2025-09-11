import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // For development/demo purposes, simulate authenticated user
  const isDevelopment = import.meta.env.DEV;
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !isDevelopment, // Disable API call in development
  });

  // In development, simulate authenticated user
  if (isDevelopment) {
    return {
      user: { id: 1, name: "Demo User", email: "demo@example.com" },
      isAuthenticated: true,
      isLoading: false
    };
  }

  // If we get a 401, user is not authenticated
  const isAuthenticated = !!user && !error;

  return {
    user,
    isAuthenticated,
    isLoading: isLoading && !error // Don't show loading if there's an auth error
  };
}

