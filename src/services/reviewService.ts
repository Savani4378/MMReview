import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ReviewData } from '../types';

const COLLECTION_NAME = 'reviews';

export const reviewService = {
  submitReview: async (reviewData: ReviewData): Promise<{ success: boolean; id: string }> => {
    try {
      const dataToSave = {
        ...reviewData,
        submittedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), dataToSave);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw new Error('Failed to submit review. Please try again later.');
    }
  },

  getReviews: async (): Promise<ReviewData[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const reviews: ReviewData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to ISO string if needed
          submittedAt: data.submittedAt?.toDate?.()?.toISOString() || data.submittedAt
        } as ReviewData);
      });
      
      return reviews;
    } catch (error) {
      console.error('Failed to get reviews:', error);
      return [];
    }
  },
  
  deleteReview: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Failed to delete review:', error);
      throw error;
    }
  }
};
