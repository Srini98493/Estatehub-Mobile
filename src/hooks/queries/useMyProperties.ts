import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api/apiConfig';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { useAuthStore } from '@/store/useAuthStore';

export interface MyProperty {
  state: any;
  bathrooms: number;
  isapproved: any;
  amenities: any;
  propertyid: number;
  propertytitle: string;
  propertydescription?: string;
  propertytype: string;
  propertystatus?: string;
  propertyaddress?: string;
  price: number;
  currencytype: string;
  bedrooms: number;
  city: string;
  attachments: Array<{
    attachmentid: number;
    attachmenturl: string;
    attachmentname?: string;
  }>;
  bookingid?: number;
  bookingdate?: string;
  bookingstatus?: string;
}

export const useMyProperties = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  

  const { data: myProperties = [], ...queryRest } = useQuery({
    queryKey: ['properties', user?.userid],
    queryFn: async () => {
      try {
        const response = await api.post(API_ENDPOINTS.PROPERTIES.BY_USER, {
          userId: user?.userid,
          full: "1"
        });

        // Handle the case when no properties are found
        if (!response.data?.t_propertydetails_get_by_id) {
          return [];
        }

        return response.data.t_propertydetails_get_by_id.filter((property: any) => property?.userid === user?.userid);
      } catch (error) {
        console.error('Error fetching my properties:', error);
        return [];
      }
    },
    enabled: !!user?.userid, // Only fetch if user is logged in
  });

  return {
    myProperties,
    ...queryRest,
  };
}; 