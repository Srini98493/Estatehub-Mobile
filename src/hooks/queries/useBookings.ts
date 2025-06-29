import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api/apiConfig';
import { API_ENDPOINTS } from '../../services/api/endpoints';

export interface Booking {
  area: string;
  city: string;
  price: string;
  state: string;
  expiry: string | null;
  status: string;
  userid: number;
  address: string;
  country: string;
  pincode: string;
  bedrooms: number;
  isactive: boolean;
  isbooked: boolean;
  landmark: string;
  latitude: string;
  amenities: string;
  bathrooms: number;
  createdby: number;
  longitude: string;
  updatedby: number;
  bookeddate: string;
  isapproved: boolean;
  propertyid: number;
  createddate: string;
  iscancelled: boolean;
  updateddate: string;
  cancelleddate: string | null;
  propertybookingid: number;
  reasonforcancellation: string;
  propertytitle: string;
  generallocation: string;
  propertycategory: number;
  propertydescription: string;
  attachments: Array<{
    isprimary: boolean;
    attachmentid: number;
    attachmenturl: string;
    attachmentname: string;
    attachmenttype: number;
  }>;
}

interface CancelBookingPayload {
  propertyId: number;
  bookingId: number;
  reasonForCancellation: string;
}

interface BookPropertyPayload {
  bookedDate: string;
  cancelledDate: string | null;
  isBooked: boolean;
  isCancelled: boolean;
  reasonForCancellation: string;
}

interface BookPropertyParams {
  propertyId: number | string;
  bookingData: BookPropertyPayload;
}

export const useBookings = () => {
  const queryClient = useQueryClient();

  const { data: bookings = [], ...queryRest } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PROPERTIES.BOOKINGS);
        return response.data?.t_propertybooking_get_by_id || [];
      } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }
    },
  });

  const bookPropertyMutation = useMutation({
    mutationFn: async ({ propertyId, bookingData }: BookPropertyParams) => {
      const response = await api.post(API_ENDPOINTS.PROPERTIES.book(propertyId), bookingData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async ({ propertyId, bookingId, reasonForCancellation }: CancelBookingPayload) => {
      const payload = {
        isBooked: false,
        isCancelled: true,
        reasonForCancellation,
        bookedDate: new Date().toISOString(),
        cancelledDate: new Date().toISOString(),
      };
      
      const response = await api.put(
        API_ENDPOINTS.PROPERTIES.cancelBooking(propertyId, bookingId),
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });

  const isBooked = (propertyId: number) => {
    return bookings.some((booking: Booking) => 
      booking.propertyid === propertyId && 
      booking.isbooked && 
      !booking.iscancelled
    );
  };

  return {
    bookings,
    isBooked,
    ...queryRest,
    bookProperty: bookPropertyMutation.mutateAsync,
    cancelBooking: cancelBookingMutation.mutateAsync,
    isBooking: bookPropertyMutation.isPending,
    isCancelling: cancelBookingMutation.isPending,
  };
}; 