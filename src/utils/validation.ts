export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateWhatsApp = (number: string): boolean => {
  if (!number) return false;
  // 10 digits exactly, starts with 6, 7, 8, or 9
  const whatsappRegex = /^[6-9]\d{9}$/;
  return whatsappRegex.test(number.replace(/\D/g, ''));
};
