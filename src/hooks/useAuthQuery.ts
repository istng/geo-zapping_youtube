import { useQuery } from '@tanstack/react-query';

export function useAuthQuery() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: () => {
      const token = localStorage.getItem('auth_token');
      return !!token;
    }
  });
}
