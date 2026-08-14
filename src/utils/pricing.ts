import { Course, ProgramPricing, ProgramTierLevel, PriceStatus } from '../types';

/**
 * Standard Indonesian Rupiah Currency Formatter
 * Formats: Rp 300.000, Rp 750.000, Rp 1.250.000
 */
export function formatRupiah(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rp 0';
  }
  const rounded = Math.round(amount);
  return `Rp ${rounded.toLocaleString('id-ID')}`;
}

/**
 * Determine Tier Level for a Course based on JP duration, complexity, or explicit tier
 */
export function getCourseTier(course: Partial<Course>): ProgramTierLevel {
  if (course.Pricing?.tier_level) {
    return course.Pricing.tier_level;
  }
  if (course.TierLevel) {
    return course.TierLevel;
  }
  
  const title = (course.Title || '').toLowerCase();
  const dur = (course.Duration || '').toLowerCase();
  
  if (title.includes('sertifikasi') || title.includes('bnsp') || title.includes('certification')) {
    return 'CERTIFICATION';
  }
  if (title.includes('bootcamp') || title.includes('intensif') || title.includes('intensive') || dur.includes('40') || dur.includes('45')) {
    return 'INTENSIVE';
  }
  if (title.includes('profesional') || title.includes('fullstack') || title.includes('toefl') || title.includes('ielts') || title.includes('cyber') || title.includes('cloud') || title.includes('ui/ux') || dur.includes('30') || dur.includes('35')) {
    return 'PROFESSIONAL';
  }
  if (title.includes('dasar') && (dur.includes('10') || dur.includes('12') || dur.includes('15') || title.includes('literacy') || title.includes('canva') || title.includes('speaking'))) {
    return 'BASIC';
  }
  return 'STANDARD';
}

export interface TierConfig {
  label: string;
  name: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  badgeColor?: string;
  priceRange: string;
  icon: string;
  description: string;
}

export const TIER_CONFIGS: Record<ProgramTierLevel, TierConfig> = {
  BASIC: {
    label: 'BASIC',
    name: 'Tingkat Dasar',
    color: 'emerald',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    badgeColor: 'text-emerald-700',
    priceRange: 'Rp 250.000 – Rp 500.000',
    icon: '🟢',
    description: 'Program pengenalan dan keterampilan dasar untuk pemula tanpa latar belakang teknis.'
  },
  STANDARD: {
    label: 'STANDARD',
    name: 'Keterampilan Praktis',
    color: 'blue',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-300',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    badgeColor: 'text-blue-700',
    priceRange: 'Rp 500.000 – Rp 1.000.000',
    icon: '🔵',
    description: 'Program keterampilan praktis siap pakai dengan materi aplikatif dan studi kasus nyata.'
  },
  PROFESSIONAL: {
    label: 'PROFESSIONAL',
    name: 'Tingkat Mahir & Portofolio',
    color: 'purple',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-300',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    badgeColor: 'text-purple-700',
    priceRange: 'Rp 1.000.000 – Rp 1.750.000',
    icon: '🟣',
    description: 'Program mendalam dengan proyek industri, studi kasus komprehensif, dan pembuatan portofolio kerja.'
  },
  INTENSIVE: {
    label: 'INTENSIVE',
    name: 'Bootcamp Intensif',
    color: 'amber',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-300',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    badgeColor: 'text-amber-700',
    priceRange: 'Rp 1.750.000 – Rp 3.000.000',
    icon: '🟠',
    description: 'Program intensif akselerasi dengan pendampingan mentor harian dan review tugas personal.'
  },
  CERTIFICATION: {
    label: 'CERTIFICATION',
    name: 'Sertifikasi Nasional & Lisensi',
    color: 'rose',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-300',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    badgeColor: 'text-rose-700',
    priceRange: 'Rp 1.500.000 – Rp 3.500.000+',
    icon: '🔴',
    description: 'Program persiapan asesmen kompetensi dengan uji kelulusan dan sertifikasi terstandar resmi.'
  }
};

export const STANDARD_INCLUSIONS = [
  'Materi Pembelajaran Lengkap & Modul PDF',
  'Akses Selamanya LMS Alpha Beta 24/7',
  'Evaluasi & Ujian Kompetensi Mandiri',
  'Pendampingan Instruktur & Diskusi Interaktif',
  'Sertifikat Resmi Kelulusan Berlisensi Kemnaker/Kemdikbud'
];

export interface DetailedPricingCalculation {
  tierLevel: ProgramTierLevel;
  tierConfig: TierConfig;
  normalPrice: number;
  effectivePrice: number;
  promoPrice: number;
  earlyBirdPrice: number;
  memberPrice: number;
  packagePrice: number;
  privatePrice: number;
  groupPrice: number;
  corporatePrice: number;
  savings: number;
  hasDiscount: boolean;
  isDiscounted: boolean;
  discountPercent: number;
  discountPercentage: number;
  appliedDiscount: string;
  effectivePriceFormatted: string;
  normalPriceFormatted: string;
  promoPriceFormatted: string;
  isPromoActive: boolean;
  isEarlyBirdActive: boolean;
  isExpired: boolean;
  priceStatus: PriceStatus;
  promoStart?: string;
  promoEnd?: string;
  inclusions: string[];
}

/**
 * Calculates current effective price with date and status checks
 * Considers August 2026 current application timeline
 */
export function calculateCoursePrice(
  course: Partial<Course>,
  currentDateIso: string = '2026-08-13'
): DetailedPricingCalculation {
  const tier = getCourseTier(course);
  const tierConfig = TIER_CONFIGS[tier] || TIER_CONFIGS.STANDARD;
  const pricing = course.Pricing;

  const normalPrice = pricing?.normal_price || course.Price || 500000;
  
  // Default values derived proportionally if not specified
  const promoPrice = pricing?.promo_price && pricing.promo_price > 0 
    ? pricing.promo_price 
    : Math.round(normalPrice * 0.8);
    
  const earlyBirdPrice = pricing?.early_bird_price && pricing.early_bird_price > 0
    ? pricing.early_bird_price
    : Math.round(normalPrice * 0.85);

  const memberPrice = pricing?.member_price && pricing.member_price > 0
    ? pricing.member_price
    : Math.round(normalPrice * 0.75);

  const packagePrice = pricing?.package_price && pricing.package_price > 0
    ? pricing.package_price
    : Math.round(normalPrice * 0.7);

  const privatePrice = pricing?.private_price && pricing.private_price > 0
    ? pricing.private_price
    : Math.round(normalPrice * 2.2);

  const groupPrice = pricing?.group_price && pricing.group_price > 0
    ? pricing.group_price
    : Math.round(normalPrice * 6);

  const corporatePrice = pricing?.corporate_price || pricing?.institution_price || Math.round(normalPrice * 8);

  const status = pricing?.price_status || 'ACTIVE';
  const promoStart = pricing?.promo_start || '2026-01-01';
  const promoEnd = pricing?.promo_end || '2026-12-31';

  // Check promo date validity
  const currentTimestamp = new Date(currentDateIso).getTime();
  const startTimestamp = new Date(promoStart).getTime();
  const endTimestamp = new Date(promoEnd).getTime() + (24 * 60 * 60 * 1000) - 1; // End of the day

  const isDateValid = currentTimestamp >= startTimestamp && currentTimestamp <= endTimestamp;
  const isExpired = currentTimestamp > endTimestamp;

  let effectivePrice = normalPrice;
  let isPromoActive = false;
  let isEarlyBirdActive = false;

  if (status === 'PROMO') {
    if (isDateValid && promoPrice < normalPrice) {
      effectivePrice = promoPrice;
      isPromoActive = true;
    } else {
      effectivePrice = normalPrice; // Fallback to normal price if expired
    }
  } else if (status === 'EARLY_BIRD') {
    if (isDateValid && earlyBirdPrice < normalPrice) {
      effectivePrice = earlyBirdPrice;
      isEarlyBirdActive = true;
    } else {
      effectivePrice = normalPrice;
    }
  } else if (status === 'ACTIVE') {
    // If active and promo price is configured lower than normal price and within promo period, allow promo view
    if (isDateValid && promoPrice < normalPrice) {
      effectivePrice = promoPrice;
      isPromoActive = true;
    } else {
      effectivePrice = normalPrice;
    }
  } else if (status === 'INACTIVE' || status === 'ARCHIVED') {
    effectivePrice = normalPrice;
  }

  const savings = Math.max(0, normalPrice - effectivePrice);
  const hasDiscount = savings > 0;
  const isDiscounted = hasDiscount;
  const discountPercent = normalPrice > 0 ? Math.round((savings / normalPrice) * 100) : 0;
  const discountPercentage = discountPercent;
  const appliedDiscount = hasDiscount 
    ? (isEarlyBirdActive ? 'Early Bird' : (isPromoActive ? 'Promo Spesial' : 'Diskon Aktif'))
    : '';

  const inclusions = course.Inclusions && course.Inclusions.length > 0
    ? course.Inclusions
    : (pricing?.inclusions || STANDARD_INCLUSIONS);

  return {
    tierLevel: tier,
    tierConfig,
    normalPrice,
    effectivePrice,
    promoPrice,
    earlyBirdPrice,
    memberPrice,
    packagePrice,
    privatePrice,
    groupPrice,
    corporatePrice,
    savings,
    hasDiscount,
    isDiscounted,
    discountPercent,
    discountPercentage,
    appliedDiscount,
    effectivePriceFormatted: formatRupiah(effectivePrice),
    normalPriceFormatted: formatRupiah(normalPrice),
    promoPriceFormatted: formatRupiah(promoPrice),
    isPromoActive,
    isEarlyBirdActive,
    isExpired,
    priceStatus: status,
    promoStart,
    promoEnd,
    inclusions
  };
}
