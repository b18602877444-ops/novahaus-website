import { commercialKnowledge } from '../data/commercialKnowledge.js'
import { leadHandoffRules, leadIntelligenceVersion, leadScoreFactors, leadScoreLevels } from '../data/leadIntelligence.js'
import { buildLeadDeliveryState } from './leadDelivery.js'

const text = (value) => String(value || '').trim()
const list = (value) => Array.isArray(value) ? value.filter(Boolean).map(text) : text(value) ? [text(value)] : []

function hasValue(...values) {
  return values.some((value) => Array.isArray(value) ? value.length > 0 : Boolean(text(value)))
}

function getContext(conversation = {}, lead = {}) {
  return { ...(conversation.context || {}), ...(conversation.leadDraft || {}), ...lead }
}

function getRecommendation(conversation = {}, recommendation) {
  return recommendation || conversation.recommendations?.[0] || null
}

function getComplianceRisk(context, conversationText = '') {
  const flag = text(context.complianceFlag).toLowerCase()
  const reviewRequired = context.complianceReviewRequired || flag === 'yes' || flag === 'unsure'
  const riskyLanguage = /investment advice|token price|guaranteed fundraising|fundraising guarantee|exchange listing|financial returns|medical claim|legal advice|tax advice|regulated product|circumvent/i.test(conversationText)
  if (reviewRequired || riskyLanguage) return { level: 'high', penalty: 20, notes: ['Human compliance and scope review is required before any engagement is confirmed.'] }
  if (flag === 'no') return { level: 'low', penalty: 0, notes: [] }
  return { level: 'unconfirmed', penalty: 5, notes: ['Compliance context has not been fully confirmed yet.'] }
}

function responseCompleteness(context, lead) {
  const checks = [
    ['customerType', hasValue(context.customerType, lead.businessType)],
    ['projectStage', hasValue(context.projectStage)],
    ['budget', hasValue(context.budget, lead.budget)],
    ['timeline', hasValue(context.timeline, lead.timeline)],
    ['need', hasValue(context.immediateNeed, context.requiredDeliverables, lead.challenge, lead.goals, lead.painPoints)],
    ['contact', hasValue(lead.name, lead.company, lead.email)],
  ]
  const complete = checks.filter(([, value]) => value).map(([id]) => id)
  return { complete, total: checks.length, points: Math.round((complete.length / checks.length) * 30) }
}

function scoreFactor(id, points, detail) {
  const definitions = commercialKnowledge.leadIntelligence?.scoreFactors || leadScoreFactors
  const definition = definitions.find((factor) => factor.id === id)
  return { id, label: definition?.label || id, points, maxPoints: definition?.maxPoints || points, detail }
}

function classify(score) {
  const levels = commercialKnowledge.leadIntelligence?.scoreLevels || leadScoreLevels
  return levels.find((level) => score >= level.min && score <= level.max) || levels[levels.length - 1]
}

function collectDeliverables(context, recommendation) {
  const fromRecommendation = list(recommendation?.metadata?.requiredDeliverables)
  if (fromRecommendation.length) return fromRecommendation
  const fromContext = list(context.requiredDeliverables)
  if (fromContext.length) return fromContext
  return ['Final scope to be confirmed during human review.']
}

function buildSummary({ customerType, projectStage, budget, timeline, recommendedOffer, context, risk }) {
  const need = text(context.immediateNeed || context.requiredDeliverables || context.goals) || 'The primary business need is still being clarified.'
  return `${customerType || 'This business'} is at the ${projectStage || 'discovery'} stage and is exploring ${recommendedOffer || 'a human strategy review'}. The stated focus is ${need}. ${budget || timeline ? `The current commercial context is ${budget || 'an unconfirmed budget'} with ${timeline || 'an unconfirmed timeline'}. ` : ''}${risk.notes.length ? 'Human review is required before scope or compliance-sensitive work is confirmed.' : 'Scope, capacity and final investment still require human review.'}`
}

export function calculateLeadScore({ conversation = {}, lead = {}, recommendation } = {}) {
  const context = getContext(conversation, lead)
  const selectedRecommendation = getRecommendation(conversation, recommendation)
  const conversationText = (conversation.messages || []).filter((message) => message.role === 'user').map((message) => message.content).join(' ')
  const risk = getComplianceRisk(context, conversationText)
  const completeness = responseCompleteness(context, lead)
  const factorResults = [
    scoreFactor('customerType', hasValue(context.customerType, lead.businessType) ? 15 : 0, hasValue(context.customerType, lead.businessType) ? 'Customer type identified.' : 'Customer type not identified.'),
    scoreFactor('budget', hasValue(context.budget, lead.budget) ? 15 : 0, hasValue(context.budget, lead.budget) ? 'Budget range stated.' : 'Budget range not stated.'),
    scoreFactor('timeline', hasValue(context.timeline, lead.timeline) ? 15 : 0, hasValue(context.timeline, lead.timeline) ? 'Timeline stated.' : 'Timeline not stated.'),
    scoreFactor('projectStage', hasValue(context.projectStage) ? 10 : 0, hasValue(context.projectStage) ? 'Project stage identified.' : 'Project stage not identified.'),
    scoreFactor('recommendedOffer', selectedRecommendation ? 15 : 0, selectedRecommendation ? 'A current approved recommendation is available.' : 'No approved recommendation yet.'),
    scoreFactor('responseCompleteness', completeness.points, `${completeness.complete.length} of ${completeness.total} core fields are clear.`),
    scoreFactor('complianceRisk', -risk.penalty, risk.level === 'low' ? 'No compliance concern stated.' : risk.level === 'high' ? 'Requires human review.' : 'Not fully confirmed.'),
  ]
  const score = Math.max(0, Math.min(100, factorResults.reduce((total, factor) => total + factor.points, 0)))
  const level = classify(score)
  return { score, level: level.label, priority: level.label, stars: level.stars, factors: factorResults, responseCompleteness: completeness, complianceRisk: risk, version: commercialKnowledge.leadIntelligence?.version || leadIntelligenceVersion }
}

export function buildFounderDashboardData({ conversation = {}, lead = {}, intelligence, recommendation } = {}) {
  const selectedRecommendation = getRecommendation(conversation, recommendation)
  const leadDelivery = intelligence?.leadDelivery || buildLeadDeliveryState({ conversation, lead, intelligence })
  return {
    leadId: text(lead.id) || text(conversation.leadId) || text(conversation.id),
    createdTime: text(lead.createdAt) || text(conversation.createdAt) || new Date().toISOString(),
    source: text(lead.source) || text(conversation.context?.source) || 'ai-sales-agent',
    customerType: text(conversation.context?.customerType) || text(lead.businessType) || 'Not provided',
    priority: intelligence.priority,
    recommendedOffer: text(selectedRecommendation?.title) || 'Human strategy review',
    leadScore: intelligence.score,
    status: text(lead.status) || 'new',
    resourceRequested: Boolean(leadDelivery.resourceRequested),
    resourceDelivered: Boolean(leadDelivery.resourceDelivered),
    resourcePending: Boolean(leadDelivery.resourcePending),
  }
}

export function buildDealBrief({ conversation = {}, lead = {}, intelligence, recommendation } = {}) {
  const context = getContext(conversation, lead)
  const selectedRecommendation = getRecommendation(conversation, recommendation)
  const customerType = text(context.customerType) || text(lead.businessType) || 'Not provided'
  const projectStage = text(context.projectStage) || 'Not provided'
  const budget = text(context.budget) || text(lead.budget) || 'Not provided'
  const timeline = text(context.timeline) || text(lead.timeline) || 'Not provided'
  const recommendedOffer = text(selectedRecommendation?.title) || text(lead.interestedPackage) || 'Human strategy review'
  const riskNotes = [...(intelligence.complianceRisk?.notes || [])]
  if (!hasValue(context.immediateNeed, context.requiredDeliverables, lead.challenge, lead.goals, lead.painPoints)) riskNotes.push('Primary challenge or deliverables require clarification.')
  const suggestedNextAction = intelligence.level === 'High'
    ? 'Founder review, then prepare a WhatsApp handoff when the integration is approved.'
    : intelligence.level === 'Medium'
      ? 'Offer a Proposal draft or Book Strategy Call after confirming scope.'
      : 'Continue discovery and let the visitor explore the relevant NOVAHAUS capabilities.'
  const handoffRules = commercialKnowledge.leadIntelligence?.handoffRules || leadHandoffRules
  const handoff = handoffRules[intelligence.level.toLowerCase()] || handoffRules.low
  return {
    customerType,
    projectStage,
    budget,
    timeline,
    recommendedOffer,
    requiredDeliverables: collectDeliverables(context, selectedRecommendation),
    riskNotes: riskNotes.length ? riskNotes : ['No additional risk stated; final scope remains subject to human review.'],
    aiSummary: buildSummary({ customerType, projectStage, budget, timeline, recommendedOffer, context, risk: intelligence.complianceRisk }),
    founderTalkingPoints: [
      `Confirm the ${customerType.toLowerCase()} context and the decision-maker's immediate priority.`,
      `Validate whether ${recommendedOffer} is the right starting point before discussing custom scope.`,
      'Confirm deliverables, responsibilities, timeline, third-party costs and human-review checkpoints.',
    ],
    suggestedNextAction,
    leadScore: { score: intelligence.score, stars: intelligence.stars, level: intelligence.level, factors: intelligence.factors },
    handoff,
  }
}

export function buildLeadIntelligence({ conversation = {}, lead = {}, recommendation } = {}) {
  const selectedRecommendation = getRecommendation(conversation, recommendation)
  const intelligence = calculateLeadScore({ conversation, lead, recommendation: selectedRecommendation })
  const leadDelivery = buildLeadDeliveryState({ conversation, lead, intelligence, qualification: conversation.qualification })
  intelligence.leadDelivery = leadDelivery
  const dealBrief = buildDealBrief({ conversation, lead, intelligence, recommendation: selectedRecommendation })
  const founderDashboardData = buildFounderDashboardData({ conversation, lead, intelligence, recommendation: selectedRecommendation })
  return { ...intelligence, leadDelivery, dealBrief, founderDashboardData, recommendedOffer: dealBrief.recommendedOffer }
}

export function formatDealBrief(intelligence) {
  if (!intelligence?.dealBrief) return ''
  const brief = intelligence.dealBrief
  return [
    'Lead Intelligence',
    '',
    `Lead Score: ${intelligence.stars} ${intelligence.level} (${intelligence.score}/100)`,
    `Customer Type: ${brief.customerType}`,
    `Project Stage: ${brief.projectStage}`,
    `Budget: ${brief.budget}`,
    `Timeline: ${brief.timeline}`,
    `Recommended Offer: ${brief.recommendedOffer}`,
    `Required Deliverables: ${brief.requiredDeliverables.join(', ')}`,
    `Risk Notes: ${brief.riskNotes.join(' ')}`,
    '',
    `AI Summary: ${brief.aiSummary}`,
    '',
    'Founder Talking Points:',
    ...brief.founderTalkingPoints.map((point) => `- ${point}`),
    '',
    `Suggested Next Action: ${brief.suggestedNextAction}`,
  ].join('\n')
}
