export interface ReviewData {
  id?: string;
  name?: string;
  whatsappNumber: string;
  mailId: string;
  event: string;
  eventDate?: string;
  overallRating: number;
  venueRating?: number;
  activitiesRating?: number;
  valueRating?: number;
  interaction?: string;
  returnIntent?: string;
  recommendation?: string;
  liked?: string;
  improvement?: string;
  nextEvent?: string;
  testimonial?: string;
  testimonialPermission?: string;
  submittedAt?: string;
}

export interface ValidationErrors {
  name?: string;
  whatsappNumber?: string;
  mailId?: string;
  event?: string;
  overallRating?: string;
}
