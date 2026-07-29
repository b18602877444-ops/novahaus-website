export const leadIntelligenceVersion = '2026-07-revenue-engine-001'

export const leadScoreLevels = [
  { id: 'high', label: 'High', stars: '★★★★★', min: 75, max: 100 },
  { id: 'medium', label: 'Medium', stars: '★★★★', min: 45, max: 74 },
  { id: 'low', label: 'Low', stars: '★★★', min: 0, max: 44 },
]

export const leadScoreFactors = [
  { id: 'customerType', label: 'Customer Type', maxPoints: 15, description: 'A defined customer type gives the founder useful context for the first review.' },
  { id: 'budget', label: 'Budget', maxPoints: 15, description: 'A stated budget range indicates readiness for a scope conversation without implying a quote.' },
  { id: 'timeline', label: 'Timeline', maxPoints: 15, description: 'A clear start or delivery window helps determine practical next steps.' },
  { id: 'projectStage', label: 'Project Stage', maxPoints: 10, description: 'A known stage shows where the business is in its decision journey.' },
  { id: 'recommendedOffer', label: 'Recommended Offer', maxPoints: 15, description: 'A current approved offer gives the conversation a concrete starting point.' },
  { id: 'responseCompleteness', label: 'Response Completeness', maxPoints: 30, description: 'The score rises as core discovery fields become clear.' },
  { id: 'complianceRisk', label: 'Compliance Risk', maxPoints: 20, description: 'Risk is a deduction and sends regulated or unclear requests to human review.' },
]

export const leadHandoffRules = {
  high: {
    priority: 'High',
    primary: { id: 'whatsapp', label: 'Continue on WhatsApp', ctaType: 'whatsapp', ctaTarget: null, enabled: true },
    alternatives: [{ id: 'booking', label: 'Book Strategy Call', ctaType: 'booking', ctaTarget: '/booking/' }],
  },
  medium: {
    priority: 'Medium',
    primary: { id: 'proposal', label: 'Prepare a Proposal', ctaType: 'proposal', ctaTarget: '/proposal-builder/', enabled: true },
    alternatives: [{ id: 'booking', label: 'Book Strategy Call', ctaType: 'booking', ctaTarget: '/booking/' }],
  },
  low: {
    priority: 'Low',
    primary: { id: 'explore', label: 'Continue Exploring', ctaType: 'explore', ctaTarget: '/', enabled: true },
    alternatives: [],
  },
}

export const founderDashboardFields = [
  'leadId',
  'createdTime',
  'source',
  'customerType',
  'priority',
  'recommendedOffer',
  'leadScore',
  'status',
]
