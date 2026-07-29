import { listBookings } from './bookingStorage.js'
import { listLeads } from './leadStorage.js'
import { ASSESSMENT_STORAGE_KEY } from './assessmentSubmission.js'
import { getDeliveryScopeById, getDeliveryScopeForText } from '../data/deliveryScope.js'
import { getPortfolioServiceById, getPortfolioServiceForText } from '../data/servicePortfolio.js'
import { getGrowthOperationsPlan } from '../data/growthOperationsPlans.js'
import { readProposalPrefill } from './aiSalesAgentProposal.js'
import { isWeb3Context, web3LaunchPackage } from '../data/web3LaunchPackage.js'
import { commercialKnowledge, commercialKnowledgeVersion } from '../data/commercialKnowledge.js'

function readLatestAssessment() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(ASSESSMENT_STORAGE_KEY) || '{}')
    const records = Array.isArray(stored.assessments) ? stored.assessments : []
    return [...records].sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0))[0] || null
  } catch {
    return null
  }
}

function firstValue(...values) {
  return values.find((value) => typeof value === 'string' && value.trim())?.trim() || ''
}

function listValue(value) {
  return Array.isArray(value) ? value.filter(Boolean).join(', ') : ''
}

function inferPlanId(...values) {
  const source = values.join(' ').toLowerCase()
  if (isWeb3Context(source)) return web3LaunchPackage.id
  const direct = commercialKnowledge.monthlyDepartments.find((plan) => source.includes(plan.name.toLowerCase()) || source.includes(plan.id) || source.includes(plan.offerId))
  if (direct) return direct.id
  if (/community|membership|knowledge hub|web3/.test(source)) return 'ai-community-operations-department'
  if (/creator|founder|personal brand|influencer/.test(source)) return 'ai-brand-operations-department'
  if (/international|global|export|cross-border|manufacturer/.test(source)) return 'ai-growth-operations-department'
  return 'ai-content-operations-department'
}

function assessmentContact(assessment) {
  return assessment?.contact && typeof assessment.contact === 'object' ? assessment.contact : {}
}

export function readProposalStudioContext() {
  const lead = listLeads()[0] || null
  const booking = listBookings()[0] || null
  const assessment = readLatestAssessment()
  const proposalPrefill = readProposalPrefill()
  const prefillLead = proposalPrefill?.lead && typeof proposalPrefill.lead === 'object' ? proposalPrefill.lead : {}
  const assessmentProfile = assessmentContact(assessment)
  const assessmentAnswers = assessment?.answers && typeof assessment.answers === 'object' ? assessment.answers : {}
  const assessmentProduct = typeof assessment?.recommendedProduct === 'string' ? assessment.recommendedProduct : assessment?.recommendedProduct?.name
  const leadIntelligence = lead?.dealBrief ? { score: lead.leadScore, priority: lead.leadPriority, stars: lead.leadStars, dealBrief: lead.dealBrief, founderDashboardData: lead.founderDashboardData, version: lead.leadIntelligenceVersion } : proposalPrefill?.leadIntelligence || assessment?.leadIntelligence || null
  const leadServiceIds = [...(Array.isArray(lead?.recommendedServices) ? lead.recommendedServices : []), ...(Array.isArray(proposalPrefill?.recommendedServices) ? proposalPrefill.recommendedServices.map((item) => item.serviceId).filter(Boolean) : [])]
  const serviceText = [booking?.serviceInterest, assessmentProduct, lead?.interestedPackage, proposalPrefill?.recommendedProduct].filter(Boolean).join(' ')
  const scopedServices = [...leadServiceIds.map((serviceId) => getDeliveryScopeById(serviceId) || getPortfolioServiceById(serviceId)).filter(Boolean), getDeliveryScopeForText(serviceText), getPortfolioServiceForText(serviceText)].filter(Boolean)
  const recommendedServiceIds = [...new Map(scopedServices.map((service) => [service.id, service])).values()].map((service) => service.id)

  const context = {
    name: firstValue(booking?.fullName, lead?.name, prefillLead.name, assessmentProfile.name, assessmentProfile.fullName),
    company: firstValue(booking?.company, lead?.company, prefillLead.company, assessmentProfile.company),
    email: firstValue(booking?.email, lead?.email, prefillLead.email, assessmentProfile.email),
    whatsapp: firstValue(booking?.whatsapp, lead?.whatsapp, prefillLead.whatsapp),
    country: firstValue(booking?.country, lead?.country, prefillLead.country, assessmentProfile.country),
    businessType: firstValue(booking?.industry, lead?.businessType, prefillLead.businessType, assessmentAnswers.customerGroup, assessmentAnswers.businessType, assessmentProfile.businessType),
    challenge: firstValue(booking?.primaryChallenge, lead?.challenge, prefillLead.challenge, assessmentAnswers.biggestChallenge, assessmentAnswers.primaryChallenge, assessmentAnswers.challenge, listValue(assessmentAnswers.challenges)),
    goals: firstValue(booking?.additionalNotes, lead?.aiSummary, prefillLead.aiSummary, proposalPrefill?.conversationSummary, assessmentAnswers.businessGoal, assessmentAnswers.goals, assessmentAnswers.goal, assessmentAnswers.primaryGoal),
    timeline: firstValue(booking?.preferredDate, assessmentAnswers.timeline, prefillLead.timeline),
    budget: firstValue(booking?.monthlyRevenueRange, lead?.budget, prefillLead.budget, assessmentAnswers.budget, assessmentAnswers.projectRange),
    recommendedPlanId: inferPlanId(booking?.interestedPackage, lead?.interestedPackage, assessmentProduct, proposalPrefill?.recommendedProduct),
    recommendedServiceIds,
    leadIntelligence,
    dealBrief: leadIntelligence?.dealBrief || null,
    hasLead: Boolean(lead),
    hasBooking: Boolean(booking),
    hasAssessment: Boolean(assessment),
  }

  return {
    ...context,
    recommendedPackage: context.recommendedPlanId === commercialKnowledge.launchPackage.id ? commercialKnowledge.launchPackage.name : getGrowthOperationsPlan(context.recommendedPlanId).name,
    commercialKnowledgeVersion,
    hasData: context.hasLead || context.hasBooking || context.hasAssessment || Boolean(proposalPrefill),
    sourceLabels: [
      context.hasAssessment && 'Growth Assessment',
      context.hasLead && 'Lead Capture',
      context.hasBooking && 'Booking',
      proposalPrefill && 'AI Sales Agent',
    ].filter(Boolean),
  }
}
