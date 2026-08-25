import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BrandHeader } from '../components/BrandHeader';
import { FormSection } from '../components/FormSection';
import { SuccessScreen } from '../components/SuccessScreen';
import { TextField } from '../components/ui/TextField';
import { SelectField } from '../components/ui/SelectField';
import { StarRating } from '../components/ui/StarRating';
import { RadioGroup } from '../components/ui/RadioGroup';
import { TextArea } from '../components/ui/TextArea';
import { validateEmail, validateWhatsApp } from '../utils/validation';
import { reviewService } from '../services/reviewService';
import { ReviewData, ValidationErrors } from '../types';

const EVENT_OPTIONS = [
  { label: 'Jamming Night 🎸', value: 'Jamming Night' },
  { label: 'Gossip & Gupshup ☕', value: 'Gossip & Gupshup' },
  { label: 'Social Meetup 🤝', value: 'Social Meetup' },
  { label: 'Open Mic 🎤', value: 'Open Mic' },
  { label: 'Games & Activities 🎲', value: 'Games & Activities' },
  { label: 'Networking Event 💼', value: 'Networking Event' },
  { label: 'Other', value: 'Other' }
];

const NEXT_EVENT_OPTIONS = [
  { label: 'Jamming Night 🎸', value: 'Jamming Night' },
  { label: 'Gossip & Gupshup ☕', value: 'Gossip & Gupshup' },
  { label: 'Networking 🤝', value: 'Networking' },
  { label: 'Open Mic 🎤', value: 'Open Mic' },
  { label: 'Games & Activities 🎲', value: 'Games & Activities' },
  { label: 'Outdoor Activities 🌄', value: 'Outdoor Activities' },
  { label: 'Workshops 🧠', value: 'Workshops' },
  { label: 'Something else', value: 'Something else' }
];

const INTERACTION_OPTIONS = [
  { label: 'Yes, definitely 🤝', value: 'Yes, definitely' },
  { label: 'Somewhat', value: 'Somewhat' },
  { label: 'Not really', value: 'Not really' },
  { label: 'No', value: 'No' }
];

const RETURN_INTENT_OPTIONS = [
  { label: 'Definitely! ❤️', value: 'Definitely!' },
  { label: 'Probably', value: 'Probably' },
  { label: 'Maybe', value: 'Maybe' },
  { label: 'Probably not', value: 'Probably not' },
  { label: 'No', value: 'No' }
];

const RECOMMENDATION_OPTIONS = [
  { label: 'Definitely ❤️', value: 'Definitely' },
  { label: 'Maybe', value: 'Maybe' },
  { label: 'No', value: 'No' }
];

const PERMISSION_OPTIONS = [
  { label: 'Yes ❤️', value: 'Yes' },
  { label: 'No', value: 'No' }
];

export const ReviewPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Partial<ReviewData>>({
    name: '',
    whatsappNumber: '',
    mailId: '',
    event: '',
    overallRating: 0,
    venueRating: 0,
    activitiesRating: 0,
    valueRating: 0,
    interaction: '',
    returnIntent: '',
    recommendation: '',
    liked: '',
    improvement: '',
    nextEvent: '',
    testimonial: '',
    testimonialPermission: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [urlEventName, setUrlEventName] = useState<string | null>(null);

  useEffect(() => {
    // Read event from URL on mount
    const params = new URLSearchParams(window.location.search);
    const eventParam = params.get('event');
    const dateParam = params.get('date');
    
    const initialData: Partial<ReviewData> = {};
    
    if (eventParam) {
      // Decode the URL param just to be safe
      const decodedEvent = decodeURIComponent(eventParam);
      // Try to find a matching option (ignoring emojis)
      const matchedOption = EVENT_OPTIONS.find(opt => 
        opt.value.toLowerCase() === decodedEvent.toLowerCase() || 
        opt.label.toLowerCase().includes(decodedEvent.toLowerCase())
      );
      
      const finalEvent = matchedOption ? matchedOption.value : decodedEvent;
      
      setUrlEventName(finalEvent);
      initialData.event = finalEvent;
    }
    
    if (dateParam) {
      initialData.eventDate = decodeURIComponent(dateParam);
    }
    
    if (Object.keys(initialData).length > 0) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, []);

  const handleChange = (field: keyof ReviewData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!formData.whatsappNumber || !validateWhatsApp(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'Please enter a valid 10-digit Indian WhatsApp number starting with 6-9.';
      isValid = false;
    }

    if (!formData.mailId || !validateEmail(formData.mailId)) {
      newErrors.mailId = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!formData.event) {
      newErrors.event = 'Please select the event you attended.';
      isValid = false;
    }

    if (!formData.overallRating || formData.overallRating === 0) {
      newErrors.overallRating = 'Please provide an overall rating.';
      isValid = false;
    }

    setErrors(newErrors);
    
    if (!isValid) {
      // Scroll to the first error
      const firstErrorElement = document.querySelector('.text-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await reviewService.submitReview(formData as ReviewData);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f8f5fb] px-4 py-8">
        <SuccessScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5fb] font-sans selection:bg-purple-200 selection:text-purple-900 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <BrandHeader />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {urlEventName 
              ? `How was your ${urlEventName} experience? 💜` 
              : 'Tell Us About Your Experience 💜'}
          </h2>
          <p className="text-gray-600 mb-1">
            Your feedback helps us create better events, better experiences and a stronger community.
          </p>
          <p className="text-sm text-gray-400 font-medium bg-gray-100 inline-block px-3 py-1 rounded-full mt-2">
            ⏱️ Takes less than 2 minutes
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Section 1 — Your Details">
            <TextField
              label="Name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            
            <TextField
              label="WhatsApp Number"
              type="tel"
              placeholder="10-digit WhatsApp number"
              required
              value={formData.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              error={errors.whatsappNumber}
            />

            <TextField
              label="Mail ID"
              type="email"
              placeholder="Enter your email address"
              required
              value={formData.mailId}
              onChange={(e) => handleChange('mailId', e.target.value)}
              error={errors.mailId}
            />

            <SelectField
              label="Which event did you attend?"
              required
              options={EVENT_OPTIONS}
              value={formData.event}
              onChange={(e) => handleChange('event', e.target.value)}
              error={errors.event}
            />
          </FormSection>

          <FormSection title="Section 2 — Your Experience">
            <StarRating
              label="Overall Experience"
              required
              value={formData.overallRating}
              onChange={(v) => handleChange('overallRating', v)}
              error={errors.overallRating}
            />
            
            <StarRating
              label="How was the venue?"
              value={formData.venueRating}
              onChange={(v) => handleChange('venueRating', v)}
            />
            
            <StarRating
              label="How were the activities?"
              value={formData.activitiesRating}
              onChange={(v) => handleChange('activitiesRating', v)}
            />
            
            <StarRating
              label="Value for money"
              value={formData.valueRating}
              onChange={(v) => handleChange('valueRating', v)}
            />
          </FormSection>

          <FormSection title="Section 3 — Community Experience">
            <RadioGroup
              label="Did you meet or interact with new people?"
              name="interaction"
              options={INTERACTION_OPTIONS}
              value={formData.interaction}
              onChange={(v) => handleChange('interaction', v)}
            />
            
            <RadioGroup
              label="Would you attend another Meet Mosaic event?"
              name="returnIntent"
              options={RETURN_INTENT_OPTIONS}
              value={formData.returnIntent}
              onChange={(v) => handleChange('returnIntent', v)}
            />
            
            <RadioGroup
              label="Would you recommend Meet Mosaic to your friends?"
              name="recommendation"
              options={RECOMMENDATION_OPTIONS}
              value={formData.recommendation}
              onChange={(v) => handleChange('recommendation', v)}
            />
          </FormSection>

          <FormSection title="Section 4 — Tell Us More">
            <TextArea
              label="What did you like the most?"
              placeholder="Tell us what made your experience special..."
              value={formData.liked}
              onChange={(e) => handleChange('liked', e.target.value)}
            />
            
            <TextArea
              label="What can we improve?"
              placeholder="Be honest — we genuinely want to improve."
              value={formData.improvement}
              onChange={(e) => handleChange('improvement', e.target.value)}
            />
            
            <SelectField
              label="What event would you like to see next?"
              options={NEXT_EVENT_OPTIONS}
              value={formData.nextEvent}
              onChange={(e) => handleChange('nextEvent', e.target.value)}
            />
            
            <TextArea
              label="In one sentence, how would you describe Meet Mosaic?"
              placeholder='Example: "I came alone and ended up making new friends!"'
              value={formData.testimonial}
              onChange={(e) => handleChange('testimonial', e.target.value)}
            />
            
            <RadioGroup
              label="Can we use your feedback as a Meet Mosaic testimonial?"
              name="testimonialPermission"
              options={PERMISSION_OPTIONS}
              value={formData.testimonialPermission}
              onChange={(v) => handleChange('testimonialPermission', v)}
            />
          </FormSection>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-xl shadow-purple-500/20 transition-all ${
              isSubmitting 
                ? 'bg-purple-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit My Feedback →'}
          </motion.button>
        </form>
      </div>
    </div>
  );
};
