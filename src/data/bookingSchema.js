export const bookingStatuses = ['pending', 'reviewed', 'confirmed', 'completed', 'cancelled']

export const bookingSources = ['homepage', 'ai-sales-agent', 'growth-assessment', 'proposal-generator', 'packages', 'case-study', 'strategy', 'footer']

export const emptyBooking = {
  id: '',
  createdAt: '',
  status: 'pending',
  source: 'homepage',
  fullName: '',
  company: '',
  email: '',
  whatsapp: '',
  country: '',
  website: '',
  industry: '',
  companySize: '',
  monthlyRevenueRange: '',
  currentWebsiteOrSystem: '',
  primaryChallenge: '',
  serviceInterest: '',
  interestedPackage: '',
  preferredDate: '',
  preferredTime: '',
  timeZone: '',
  alternativeDate: '',
  alternativeTime: '',
  additionalNotes: '',
  growthScore: '',
  assessmentSummary: '',
  proposalSummary: '',
  aiSummary: '',
}

function createId() {
  return globalThis.crypto?.randomUUID?.() || `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function text(value) {
  return String(value ?? '').trim()
}

export function createBookingRecord(input = {}) {
  const now = new Date().toISOString()
  return {
    ...emptyBooking,
    ...Object.fromEntries(Object.keys(emptyBooking).map((key) => [key, text(input[key])])),
    id: text(input.id) || createId(),
    createdAt: text(input.createdAt) || now,
    status: bookingStatuses.includes(input.status) ? input.status : 'pending',
    source: bookingSources.includes(input.source) ? input.source : text(input.source) || 'homepage',
  }
}
