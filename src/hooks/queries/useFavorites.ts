import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api/apiConfig';
import { API_ENDPOINTS } from '../../services/api/endpoints';

export interface PropertyDetails {
  attachments: any;
  area: string;
  city: string;
  price: number;
  state: string;
  expiry: string | null;
  status: string;
  userid: number;
  address: string;
  country: string;
  pincode: string;
  bedrooms: number;
  isactive: boolean;
  landmark: string;
  latitude: string;
  amenities: string;
  bathrooms: number;
  longitude: string;
  isapproved: boolean;
  propertyid: number;
  isarchieved: boolean;
  currencytype: string;
  propertytype: number;
  availabledate: string;
  propertytitle: string;
  generallocation: string;
  propertycategory: number;
  propertydescription: string;
}

export interface Favorite {
  favouriteid: number;
  propertyid: number;
  userid: number;
  rating: number;
  comment: string;
  createddate: string;
  updateddate: string;
  property_details: PropertyDetails;
}

interface FavoritePayload {
  rating: number;
  comment: string;
}

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const { data: favorites = [], ...queryRest } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PROPERTIES.FAVORITES);
        return response.data as Favorite[];
      } catch (error) {
        console.error("Error fetching favorites:", error);
        throw error;
      }
    },
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      const payload: FavoritePayload = {
        rating: 0,
        comment: ""
      };
      const response = await api.post(API_ENDPOINTS.PROPERTIES.addFavorite(propertyId), payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      // Also invalidate property details if they show favorite status
      queryClient.invalidateQueries({ queryKey: ['property'] });
    }
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      const response = await api.delete(API_ENDPOINTS.PROPERTIES.removeFavorite(propertyId));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      // Also invalidate property details if they show favorite status
      queryClient.invalidateQueries({ queryKey: ['property'] });
    }
  });

  const isFavorite = (propertyId: number) => {
    return favorites.some(fav => fav.propertyid === propertyId);
  };

  return {
    favorites,
    isFavorite,
    ...queryRest,
    addFavorite: addFavoriteMutation.mutateAsync,
    removeFavorite: removeFavoriteMutation.mutateAsync,
    isAddingFavorite: addFavoriteMutation.isPending,
    isRemovingFavorite: removeFavoriteMutation.isPending,
  };
}; 