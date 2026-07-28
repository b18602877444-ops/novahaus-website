import { growthOperationsPlans } from './growthOperationsPlans.js'

// Compatibility view for older assessment and proposal consumers.
// Commercial truth remains in growthOperationsPlans.js.
export const priorityCustomerGroups = [
  'Project & Community Operators',
  'Creator & Personal Brand Operators',
  'China-to-Global SME Operators',
]

const groupByPlan = {
  'ai-content-operations-department': ['Creator & Personal Brand Operators', 'Project & Community Operators', 'China-to-Global SME Operators'],
  'ai-brand-operations-department': ['Creator & Personal Brand Operators'],
  'ai-community-operations-department': ['Project & Community Operators'],
  'ai-growth-operations-department': ['Project & Community Operators', 'China-to-Global SME Operators'],
}

const riskFlagsByPlan = {
  'ai-content-operations-department': ['Unapproved claims or regulated content', 'Requests for guaranteed audience or sales outcomes'],
  'ai-brand-operations-department': ['Unverified professional, medical or financial claims', 'Requests for guaranteed followers or sales'],
  'ai-community-operations-department': ['Financial promotion or investment advice', 'Requests for guaranteed member recruitment'],
  'ai-growth-operations-department': ['Regulated or high-risk projects', 'Requests for unlimited work or guaranteed outcomes'],
}

export const growthOperationsOffers = growthOperationsPlans.map((plan) => ({
  id: plan.offerId,
  name: plan.name,
  shortDescription: plan.bestFor,
  idealCustomerGroups: groupByPlan[plan.id] || priorityCustomerGroups,
  customerProblems: ['The business needs a clearer operating rhythm and defined monthly capacity.', 'Internal content, brand, community or growth work is difficult to maintain consistently.'],
  recurringDeliverables: plan.monthlyStandardCapacity,
  implementationDeliverables: [`${plan.name} onboarding and operating setup`, 'Priority, access and approval plan', 'Initial scope and review cadence'],
  clientResponsibilities: plan.clientResponsibilities,
  standardScope: plan.monthlyStandardCapacity,
  customQuoteTriggers: plan.customQuoteTriggers,
  outOfScope: plan.exclusions,
  pricingReference: { implementation: plan.onboardingFee, monthlyService: plan.monthlyPrice, source: 'src/data/growthOperationsPlans.js' },
  monthlyServiceReference: { source: 'src/data/growthOperationsPlans.js', planId: plan.id },
  estimatedTimeline: 'Onboarding timing is confirmed after content requirements, operational volume, platforms, compliance risks and integrations are reviewed.',
  qualificationQuestions: ['What monthly capacity is needed?', 'Which materials and approvals are available?', 'Which platforms and integrations are required?', 'Which claims or topics require specialist review?'],
  riskFlags: riskFlagsByPlan[plan.id] || [],
  aiSalesSummary: plan.aiSalesSummary,
  proposalSummary: plan.proposalSummary,
  primaryCTA: plan.cta,
  implementationServiceIds: [],
  recurringServiceIds: [],
}))

export function getGrowthOperationsOffer(id) {
  return growthOperationsOffers.find((offer) => offer.id === id) || growthOperationsOffers[0]
}

export function getOfferServiceNames(offer) {
  return offer?.recurringDeliverables || []
}
