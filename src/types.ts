export interface CourseClass {
  title: string;
  subtitle?: string;
  points: string[];
}

export interface Workshop {
  id: string;
  title: string;
  subtitle?: string;
  city: 'Caracas' | 'Valencia' | 'Maracay' | 'Lechería' | 'Barinas' | 'Barquisimeto' | 'Corporativo';
  venue: string;
  badgeText: string;
  badgeColor: string;
  level: string;
  levelColor: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  showFullFlyerInModal?: boolean;
  highlightBanner?: string;
  startDate: string;
  dates: string;
  schedule: string;
  duration: string;
  academicHours?: string;
  priceStandard: string;
  priceCashOffer?: string;
  registrationFee?: string;
  reservationNote?: string;
  creditOption?: string;
  description: string;
  features: string[];
  requirements?: string[];
  whatsappMessageText?: string;
  syllabus: CourseClass[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image?: string;
}

export interface CorporateProgram {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  format: string;
  pricePerPerson: number;
  description: string;
  targetAudience: string;
  points: string[];
}
