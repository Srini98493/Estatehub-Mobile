import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api/apiConfig';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { use } from 'i18next';
import { useAuthStore } from '@/store/useAuthStore';

interface SearchParams {
  propertyCategory: string;
  propertyType: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  minBedrooms: string;
  maxBedrooms: string;
  userId: number | null;
}

export const useSearchProperties = (searchParams: Partial<SearchParams>) => {

  const { user } = useAuthStore();
  console.log("user", user);
  
  return useQuery({
    queryKey: ['searchProperties', searchParams],
    queryFn: async () => {
      const userId = user?.userid;
      const updatedSearchParams = new URLSearchParams({
        propertyCategory: searchParams.propertyCategory || 'null',
        propertyType: searchParams.propertyType || 'null',
        city: searchParams.city || 'null',
        minPrice: searchParams.minPrice || 'null',
        maxPrice: searchParams.maxPrice || 'null',
        minArea: searchParams.minArea || 'null',
        minBedrooms: searchParams.minBedrooms || 'null',
        maxBedrooms: searchParams.maxBedrooms || 'null',
        userid: userId?.toString() || 'null'
      });

      const data = await api.get(`${API_ENDPOINTS.PROPERTIES.LIST}/search?${updatedSearchParams}`);
      console.log("API response", data?.[0]?.t_searchcriteria);
      
      return data?.data?.[0]?.t_searchcriteria || [];
    },
    enabled: !!searchParams.city, // Only run the query if city is provided
  });
}; 