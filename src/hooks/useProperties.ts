import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { api } from '@/services/api/apiConfig';
import { useAuthStore } from '@/store/useAuthStore';

// Define the Property type based on what's used in the codebase
interface Property {
  propertyid: number;
  propertytitle: string;
  propertydescription?: string;
  propertytype: string;
  propertystatus?: string;
  propertyaddress?: string;
  status?: string;
  // Add other properties as needed
}

// Hook for fetching most viewed properties (used in Home screen)
export const useMostViewedProperties = () => {
  return useQuery({
    queryKey: ['mostViewedProperties'],
    queryFn: async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PROPERTIES.MOST_VIEWED);
        return response.data.data || [];
      } catch (error) {
        console.error('Error fetching most viewed properties:', error);
        return [];
      }
    }
  });
};

// Hook for fetching property details (used in PropertyDetails screen)
export const usePropertyDetail = (propertyId: string, p0?: { staleTime: number; refetchOnWindowFocus: boolean; }) => {
  const user = useAuthStore.getState().user;
  const userId = user?.userid || 0;

  return useQuery({
    queryKey: ['propertyDetail', propertyId],
    queryFn: async () => {
      try {
        const response = await api.get(
          API_ENDPOINTS.PROPERTIES.getDetail(propertyId, userId)
        );
        console.log('Property Detail:', response?.data?.t_propertydetails_get_by_id);
        return response?.data?.t_propertydetails_get_by_id[0] || null;
      } catch (error) {
        console.error('Error fetching property detail:', error);
        return null;
      }
    },
    enabled: !!propertyId
  });
};

// Hook for fetching properties pending approval (used in ApproveProperties screen)
export const useApprovalProperties = () => {
  return useQuery({
    queryKey: ['approvalProperties'],
    queryFn: async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PROPERTIES.PENDING);
        return response.data.data || [];
      } catch (error) {
        console.error('Error fetching approval properties:', error);
        return [];
      }
    }
  });
};

// New hook for fetching approved properties
export const useApprovedProperties = () => {
  return useQuery({
    queryKey: ['approvedProperties'],
    queryFn: async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PROPERTIES.LIST);
        // Filter for only approved properties if needed
        const approvedProperties = response.data.data.filter(
          (property: Property) => property.status === 'approved'
        ) || [];
        return approvedProperties;
      } catch (error) {
        console.error('Error fetching approved properties:', error);
        return [];
      }
    }
  });
}; 