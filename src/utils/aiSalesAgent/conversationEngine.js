import { aiSalesAgentFaqs } from '../../data/aiSalesAgentScript.js'
import { aiSalesServices } from '../../data/aiSalesAgentServices.js'

const normalise = (value = '') => value.trim().toLowerCase()
const includesAny = (text, terms) => terms.some((term) => text.includes(term))
const leadIntentTerms = ['proposal', 'website', 'quotation', 'quote', 'package', 'book', 'strategy', 'ai', 'automation', 'crm', 'lead', 'business']
export const initialSalesAgentWelcome = "Welcome to NOVAHAUS.\nI'd love to understand your business and recommend the most suitable AI growth solution."

export function detectIntent(input) {
  const text = normalise(input)
  if (includesAny(text, ['proposal', 'quote', 'quotation', 'scope'])) return 'proposal'
  if (includesAny(text, ['book', 'call', 'meeting', 'schedule', 'speak'])) return 'meeting'
  if (includesAny(text, ['price', 'pricing', 'cost', 'fee', 'budget', 'how much'])) return 'pricing'
  if (includesAny(text, ['website', 'landing page', 'conversion'])) return 'website'
  if (includesAny(text, ['automation', 'crm', 'workflow', 'follow-up', 'manual'])) return 'automation'
  if (includesAny(text, ['brand', 'positioning', 'message', 'identity'])) return 'brand'
  if (includesAny(text, ['web3', 'rwa', 'fintech', 'ai startup', 'education', 'professional'])) return 'industry'
  return 'general'
}

function inferIndustry(text) {
  if (includesAny(text, ['web3', 'rwa'])) return 'Web3 & RWA'
  if (includesAny(text, ['fintech', 'finance'])) return 'FinTech'
  if (includesAny(text, ['ai startup', 'ai company'])) return 'AI Startup'
  if (includesAny(text, ['education', 'course', 'personal brand', 'creator'])) return 'Education & Personal Brand'
  if (includesAny(text, ['professional service', 'consulting', 'advisor', 'lawyer'])) return 'Professional Services'
  return ''
}

function getRecommendations(conversation) {
  const text = conversation.messages.filter((message) => message.role === 'user').map((message) => message.content).join(' ').toLowerCase()
  const ranked = aiSalesServices.map((service) => ({ service, matches: service.keywords.filter((keyword) => text.includes(keyword)).length })).filter(({ matches }) => matches > 0).sort((a, b) => b.matches - a.matches)
  const selected = ranked.length ? ranked.slice(0, 3) : [{ service: aiSalesServices.find((service) => service.serviceId === 'growth-assessment'), matches: 1 }]
  return selected.map(({ service }, index) => ({ serviceId: service.serviceId, title: service.title, reason: reasonForService(service.serviceId), priority: index + 1, ctaType: service.ctaType, ctaLabel: service.ctaLabel, ctaTarget: service.ctaTarget }))
}

function reasonForService(serviceId) {
  const reasons = {
    'growth-assessment': 'A structured assessment will make the strongest opportunity easier to prioritise.',
    'proposal-generator': 'You are ready to turn the context into a considered scope and next-step document.',
    'website-development': 'Your digital presence is one of the clearest places to improve understanding and conversion.',
    'ai-customer-service': 'A guided customer experience can make useful answers and next steps easier to find.',
    'ai-sales-agent': 'A structured sales conversation can help your team qualify demand without adding friction.',
    'business-automation': 'Connected CRM and workflow automation can reduce repetitive follow-up and operational drag.',
    'knowledge-hub': 'A clear source of truth can make answers, content and internal decisions easier to reuse.',
  }
  return reasons[serviceId] || reasons['growth-assessment']
}

function faqReply(input) {
  const match = aiSalesAgentFaqs.find((faq) => faq.keywords.some((keyword) => normalise(input).includes(keyword)))
  return match?.answer || ''
}

function hasCommercialIntent(conversation, input = '') {
  const text = [...conversation.messages.filter((message) => message.role === 'user').map((message) => message.content), input].join(' ').toLowerCase()
  return includesAny(text, leadIntentTerms)
}

export function createInitialConversation(createId) {
  const now = new Date().toISOString()
  return { id: createId(), createdAt: now, updatedAt: now, status: 'active', messages: [{ id: createId(), role: 'agent', content: initialSalesAgentWelcome, timestamp: now, type: 'text', metadata: { stage: 'business-type' } }], leadId: null, currentStage: 'business-type', quickReplies: ['Launching a new business', 'Improving an existing website', 'Automating operations', 'Expanding internationally', 'I am not sure yet'], qualification: { score: 0, temperature: 'Cold Lead', signals: [], breakdown: [] }, recommendations: [], context: { source: 'ai-sales-agent', assessmentId: null } }
}

export function advanceConversation(conversation, input, createId) {
  const text = normalise(input)
  const intent = detectIntent(input)
  const now = new Date().toISOString()
  const userMessage = { id: createId(), role: 'user', content: input.trim(), timestamp: now, type: 'text', metadata: { intent, stage: conversation.currentStage } }
  const messages = [...conversation.messages, userMessage]
  const faq = faqReply(input)
  let stage = conversation.currentStage
  let content = faq
  let quickReplies = []
  const leadPatch = {}

  if (conversation.currentStage === 'business-type') {
    leadPatch.industry = inferIndustry(text)
    stage = 'pain-points'
    content = faq || 'Where is the business feeling the most friction right now—positioning, digital experience, lead flow, internal operations or something else?'
    quickReplies = ['Unclear positioning', 'Low-quality leads', 'Manual operations', 'Weak digital presence']
  } else if (conversation.currentStage === 'pain-points') {
    leadPatch.painPoints = [input.trim()]
    stage = 'goals'
    content = faq || 'That is useful context. If this improved, what would be meaningfully different for the business over the next three months?'
    quickReplies = ['More qualified enquiries', 'A clearer market position', 'Less manual work', 'A stronger digital presence']
  } else if (conversation.currentStage === 'goals') {
    leadPatch.goals = [input.trim()]
    stage = 'budget-timeline'
    content = faq || 'What level of investment and timing are you considering? A rough range is enough to shape the right next step.'
    quickReplies = ['Not decided yet', 'Within 30 days', 'Within 3 months', 'Prefer to discuss']
  } else if (conversation.currentStage === 'budget-timeline') {
    leadPatch.budget = input.trim()
    leadPatch.timeline = input.trim()
    if (hasCommercialIntent(conversation, input)) {
      stage = 'lead-capture'
      content = faq || 'The context is useful. Before I prepare the next recommendation, may I ask for a few details so I can keep the next step relevant?'
    } else {
      stage = 'cta'
      content = faq || 'That gives me a useful direction. If a tailored recommendation would help, share a little more context and I’ll keep the next step grounded in the business.'
    }
  } else if (conversation.currentStage === 'lead-capture') {
    content = faq || 'Once your details are saved, I can recommend the most relevant NOVAHAUS path and show the right next action.'
  } else if (conversation.currentStage === 'recommendation' || conversation.currentStage === 'cta') {
    if (!conversation.leadId && hasCommercialIntent(conversation, input)) {
      stage = 'lead-capture'
      content = 'That sounds like a useful next step. Before I prepare a recommendation, may I ask for a few details so it is grounded in your business?'
    } else {
      content = faq || (intent === 'pricing' ? 'The right scope depends on the problem and systems involved. A Strategy Call is the clearest way to shape a considered proposal.' : intent === 'proposal' ? 'I can prepare a proposal draft from this conversation. It will remain a working document until the scope is reviewed together.' : 'The context is clear enough to move forward. Choose the next action that feels useful.')
      stage = 'cta'
    }
  } else {
    stage = 'pain-points'
    content = faq || 'Tell me a little more about the business and the decision you are trying to make.'
  }

  const next = { ...conversation, messages: [...messages, { id: createId(), role: 'agent', content, timestamp: now, type: 'text', metadata: { intent, stage } }], updatedAt: now, currentStage: stage, quickReplies, leadDraft: { ...(conversation.leadDraft || {}), ...leadPatch } }
  if (stage === 'lead-capture' && conversation.leadId) next.currentStage = 'recommendation'
  if (stage === 'cta') next.recommendations = getRecommendations(next)
  return { conversation: next, intent, leadPatch, recommendations: next.recommendations || [], quickReplies }
}

export function completeConversation(conversation, lead, createId) {
  const now = new Date().toISOString()
  const recommendations = getRecommendations(conversation)
  const content = `Based on what you shared, ${recommendations[0]?.title || 'a Growth Assessment'} is the most useful starting point. You can book a Strategy Call or prepare a proposal draft from this context.`
  return { ...conversation, status: 'completed', currentStage: 'cta', quickReplies: [], leadId: lead.id, updatedAt: now, recommendations, messages: [...conversation.messages, { id: createId(), role: 'agent', content, timestamp: now, type: 'service-recommendation', metadata: { recommendations } }] }
}
