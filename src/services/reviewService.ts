import { ReviewData } from '../types';

const STORAGE_KEY = 'meet_mosaic_reviews';

export const reviewService = {
  submitReview: async (reviewData: ReviewData): Promise<{ success: boolean; id: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const existingReviewsJson = localStorage.getItem(STORAGE_KEY);
      const existingReviews: ReviewData[] = existingReviewsJson ? JSON.parse(existingReviewsJson) : [];

      const newReview: ReviewData = {
        ...reviewData,
        id: crypto.randomUUID(),
        submittedAt: new Date().toISOString(),
      };

      existingReviews.push(newReview);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingReviews));

      return { success: true, id: newReview.id as string };
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw new Error('Failed to submit review. Please try again later.');
    }
  },

  getReviews: async (): Promise<ReviewData[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const existingReviewsJson = localStorage.getItem(STORAGE_KEY);
      return existingReviewsJson ? JSON.parse(existingReviewsJson) : [];
    } catch (error) {
      console.error('Failed to get reviews:', error);
      return [];
    }
  }
};
