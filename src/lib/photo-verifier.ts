// CivicLenZ — Official Photo Source Verification & Audit Engine

export type PhotoVerificationStatus = 
  | 'VERIFIED_GOV'        // Official Government Portal (.gov, .mil, official city/county domain)
  | 'VERIFIED_WIKIMEDIA'  // Official Public Domain Wikipedia Commons Headshot
  | 'VERIFIED_CAMPAIGN'   // Verified Official Candidate Campaign Site
  | 'PENDING_VERIFICATION'// Photo missing or unverified
  | 'REJECTED_UNTRUSTED'; // Fake/stock photo rejected

export interface PhotoVerificationResult {
  isOfficial: boolean;
  status: PhotoVerificationStatus;
  domain?: string;
  sourceLabel: string;
  badgeClass: string;
  cleanUrl?: string;
}

// Trusted domains for official elected official & candidate headshots
const GOV_DOMAINS = [
  '.gov',
  '.mil',
  'browardsheriff.org',
  'pbso.org',
  'miamidade.gov',
  'miamibeachfl.gov',
  'fortlauderdale.gov',
  'hialeahfl.gov',
  'pbcgov.org',
  'broward.org',
  'flsenate.gov',
  'myfloridahouse.gov',
  'house.gov',
  'senate.gov',
  'whitehouse.gov'
];

const WIKIMEDIA_DOMAINS = [
  'upload.wikimedia.org',
  'commons.wikimedia.org',
  'wikipedia.org'
];

const UNTRUSTED_PATTERNS = [
  'pravatar.cc',
  'ui-avatars.com',
  'unsplash.com',
  'pexels.com',
  'shutterstock.com',
  'placeholder',
  'via.placeholder'
];

/**
 * Audits a photo URL against authoritative government & campaign source standards.
 */
export function verifyPhotoSource(url?: string): PhotoVerificationResult {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return {
      isOfficial: false,
      status: 'PENDING_VERIFICATION',
      sourceLabel: 'Photo Pending Official Verification',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300'
    };
  }

  const lowerUrl = url.toLowerCase().trim();

  // 1. Reject untrusted/fake photo generators immediately
  if (UNTRUSTED_PATTERNS.some(pattern => lowerUrl.includes(pattern))) {
    return {
      isOfficial: false,
      status: 'REJECTED_UNTRUSTED',
      sourceLabel: 'Stock Photo Rejected',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300'
    };
  }

  let hostname = '';
  try {
    const parsed = new URL(url);
    hostname = parsed.hostname.toLowerCase();
  } catch (e) {
    // Relative URLs or data URIs
    if (url.startsWith('data:') || url.startsWith('/')) {
      return {
        isOfficial: true,
        status: 'VERIFIED_GOV',
        sourceLabel: 'Verified System Image',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        cleanUrl: url
      };
    }
    return {
      isOfficial: false,
      status: 'PENDING_VERIFICATION',
      sourceLabel: 'Invalid Photo URL',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300'
    };
  }

  // 2. Check Official Government Domain
  if (GOV_DOMAINS.some(domain => hostname.endsWith(domain) || hostname.includes(domain))) {
    return {
      isOfficial: true,
      status: 'VERIFIED_GOV',
      domain: hostname,
      sourceLabel: `Official Government Source (${hostname})`,
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      cleanUrl: url
    };
  }

  // 3. Check Wikimedia Commons Public Domain Official Portrait
  if (WIKIMEDIA_DOMAINS.some(domain => hostname.includes(domain))) {
    return {
      isOfficial: true,
      status: 'VERIFIED_WIKIMEDIA',
      domain: hostname,
      sourceLabel: 'Official Wikipedia Commons Portrait',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      cleanUrl: url
    };
  }

  // 4. Check Official Candidate Campaign Domain
  if (hostname.length > 3 && !hostname.includes('facebook') && !hostname.includes('twitter') && !hostname.includes('instagram')) {
    return {
      isOfficial: true,
      status: 'VERIFIED_CAMPAIGN',
      domain: hostname,
      sourceLabel: `Official Campaign Source (${hostname})`,
      badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      cleanUrl: url
    };
  }

  return {
    isOfficial: false,
    status: 'PENDING_VERIFICATION',
    sourceLabel: 'Unverified Photo Source',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300'
  };
}

/**
 * Recalculates profile completion percentage based on official data + photo verification.
 * An official profile WITHOUT a verified official photo is capped at 85%.
 */
export function calculateVerifiedCompletionScore(baseScore: number, photoUrl?: string): number {
  const verification = verifyPhotoSource(photoUrl);
  if (!verification.isOfficial) {
    // Cap completion at 85% until an official photo is verified
    return Math.min(baseScore, 85);
  }
  return baseScore;
}
