import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../services/authService';
import { useNavigate } from '@tanstack/react-router';
export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      // Update the auth state immediately
      await queryClient.setQueryData(['auth'], true);
      // Force a refetch to ensure state is fresh
      await queryClient.invalidateQueries({ queryKey: ['auth'] });
      navigate({ to: '/' });
    }
  });
}
