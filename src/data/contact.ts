/** Single source of truth for the school's public contact details. */
export const contact = {
  phoneNumber: "09046914150",
  phoneE164: "+2349046914150",
  whatsappNumber: "08079711645",
  /** Digits only, for the wa.me deep link. */
  whatsappDigits: "2348079711645",
  whatsappMessage: "Hello, I'd like to know more about the Path to Qur'anic Understanding program.",
  email: "azeezmunirudeen08@gmail.com",
  instagramUrl: "https://www.instagram.com/akeukanwomunirudeen",
  facebookUrl: "https://www.facebook.com/profile.php?id=61578712017601",
} as const;

export const phoneHref = `tel:${contact.phoneE164}`;

export const whatsappHref = `https://wa.me/${contact.whatsappDigits}?text=${encodeURIComponent(
  contact.whatsappMessage,
)}`;

export const emailHref = `mailto:${contact.email}`;
