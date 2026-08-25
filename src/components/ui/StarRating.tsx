import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  label: string;
  value?: number;
  onChange: (rating: number) => void;
  error?: string;
  required?: boolean;
}

const RATING_TEXT: Record<number, string> = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

export const StarRating: React.FC<StarRatingProps> = ({ label, value = 0, onChange, error, required }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <span className="text-xs font-medium text-purple-600 h-4">
          {(hoverRating > 0 ? RATING_TEXT[hoverRating] : value > 0 ? RATING_TEXT[value] : '')}
        </span>
      </div>
      <div className="flex gap-2 py-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none focus:ring-4 focus:ring-purple-200 rounded-full transition-transform hover:scale-110"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Rate ${star} out of 5`}
          >
            <Star
              className={`w-10 h-10 transition-colors duration-200 ${
                star <= (hoverRating || value)
                  ? 'fill-purple-500 text-purple-500'
                  : 'fill-gray-100 text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
