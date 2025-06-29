import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api/apiConfig';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { useAuthStore } from '@/store/useAuthStore';

export interface HomeLoanRequest {
  areacode: ReactNode;
  contactno: ReactNode;
  email: ReactNode;
  loanid: number;
  userid: number;
  propertyid: number;
  loantype: number;
  loantitle: string;
  description: string;
  status: string;
  requestedby: string;
  createddate: string;
  propertyname: string;
  loancategoryname: string;
  postquery: string;
  attachments: Array<{
    attachmentid: number;
    attachmenturl: string;
    attachmentname: string;
    attachmenttype: number;
    isprimary: boolean;
  }>;
}

export const useHomeLoan = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  const { data: homeLoans = [], ...queryRest } = useQuery({
    queryKey: ['homeLoans', user?.userid],
    queryFn: async () => {
      try {
        const response = await api.get(API_ENDPOINTS.SERVICES.HOME_LOANS);
        return response.data || [];
      } catch (error) {
        console.error('Error fetching home loans:', error);
        return [];
      }
    },
    enabled: !!user?.userid,
  });

  const applyHomeLoanMutation = useMutation({
    mutationFn: async (loanData: Partial<HomeLoanRequest>) => {
      const response = await api.post(API_ENDPOINTS.SERVICES.HOME_LOANS, loanData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeLoans'] });
    }
  });

  return {
    homeLoans,
    ...queryRest,
    applyHomeLoan: applyHomeLoanMutation.mutateAsync,
    isApplying: applyHomeLoanMutation.isPending,
  };
}; 