import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api/apiConfig';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { useAuthStore } from '@/store/useAuthStore';

export interface ServiceRequest {
  requestid: number;
  userid: number;
  propertyid: number;
  servicetype: number;
  servicetitle: string;
  description: string;
  status: string;
  requestedby: string;
  requesteddate: string;
  propertyname: string;
  attachments: Array<{
    attachmentid: number;
    attachmenturl: string;
    attachmentname: string;
    attachmenttype: number;
    isprimary: boolean;
  }>;
}

export const useServices = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  const { data: services = [], ...queryRest } = useQuery({
    queryKey: ['services', user?.userid],
    queryFn: async () => {
      try {
        const response = await api.get(API_ENDPOINTS.SERVICES.LIST);
        return response.data || [];
      } catch (error) {
        console.error('Error fetching services:', error);
        return [];
      }
    },
    enabled: !!user?.userid,
  });

  const createServiceMutation = useMutation({
    mutationFn: async (serviceData: Partial<ServiceRequest>) => {
      const response = await api.post(API_ENDPOINTS.SERVICES.CREATE, serviceData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    }
  });

  return {
    services,
    ...queryRest,
    createService: createServiceMutation.mutateAsync,
    isCreating: createServiceMutation.isPending,
  };
};

export const useServiceCategories = () => {
  return useQuery({
    queryKey: ['serviceCategories'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.SERVICES.CATEGORIES);
      return response.data;
    },
  });
};

export const useHomeLoanCategories = () => {
  return useQuery({
    queryKey: ['homeLoanCategories'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.SERVICES.HOME_LOAN_CATEGORIES);
      return response.data;
    },
  });
}; 