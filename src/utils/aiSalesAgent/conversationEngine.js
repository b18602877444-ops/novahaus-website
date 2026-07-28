import { aiSalesAgentFaqs } from '../../data/aiSalesAgentScript.js'
import { aiSalesServices } from '../../data/aiSalesAgentServices.js'
import { growthOperationsOffers, priorityCustomerGroups } from '../../data/growthOperationsOffers.js'
import { getGrowthOperationsPlanForOffer } from '../../data/growthOperationsPlans.js'
import { getPortfolioServiceForText } from '../../data/servicePortfolio.js'
import { isWeb3Context, web3LaunchPackage } from '../../data/web3LaunchPackage.js'

const normalise = (value = '') => value.trim().toLowerCase()
const includesAny = (text, terms) => terms.some((term) => text.includes(term))
const leadIntentTerms = ['proposal', 'website', 'quotation', 'quote', 'package', 'book', 'strategy', 'ai', 'automation', 'crm', 'lead', 'business']
const highRiskTerms = ['medical data', 'medical diagnosis', 'patient', 'legal advice', 'law firm', 'investment advice', 'securities', 'banking core', 'sensitive personal data', 'regulated', 'token price', 'return promise', 'guaranteed member', 'guaranteed sales', 'guaranteed followers', 'viral', 'customs', 'tax advice', 'platform policy', 'circumvent']
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
  if (includesAny(text, ['web3', 'rwa', 'membership', 'community', 'association', 'member'])) return priorityCustomerGroups[0]
  if (includesAny(text, ['creator', 'founder', 'coach', 'influencer', 'personal brand', 'speaker'])) return priorityCustomerGroups[1]
  if (includesAny(text, ['china', 'chinese', 'export', 'manufacturer', 'cross-border', 'international', 'overseas', 'global'])) return priorityCustomerGroups[2]
  return ''
}

function inferGrowthOffer(text) {
  const signals = [
    { offer: growthOperationsOffers[0], terms: ['content', 'video', 'social', 'linkedin', 'youtube', 'tiktok', 'xiaohongshu', 'poster', 'publishing', 'creator'] },
    { offer: growthOperationsOffers[1], terms: ['community', 'membership', 'telegram', 'faq', 'knowledge hub', 'onboarding', 'member support', 'education'] },
    { offer: growthOperationsOffers[2], terms: ['creator', 'founder', 'personal brand', 'speaker', 'identity', 'brand', 'positioning'] },
    { offer: growthOperationsOffers[3], terms: ['china', 'chinese', 'export', 'manufacturer', 'cross-border', 'international', 'overseas', 'global', 'market expansion'] },
  ]
  const industry = inferIndustry(text)
  const ranked = signals.map(({ offer, terms }) => ({ offer, matches: terms.filter((term) => text.includes(term)).length + (industry && offer.idealCustomerGroups.includes(industry) ? 3 : 0) })).sort((a, b) => b.matches - a.matches)
  return ranked[0]?.matches ? ranked[0].offer : growthOperationsOffers[0]
}

function reasonForService(serviceId) {
  const reasons = {
    'growth-assessment': 'A structured assessment will make the strongest opportunity easier to prioritise.',
    'proposal-generator': 'You are ready to turn the context into a considered scope and next-step document.',
    'website-development': 'Your digital presence is one of the clearest places to improve understanding and conversion.',
    'ai-customer-service': 'A guided customer experience can make useful answers and next steps easier to find.',
    'ai-sales-agent': 'A structured sales conversation can help your team qualify demand without adding friction.',
    'business-automation': 'Connected workflows can reduce repetitive follow-up and operational drag.',
    'knowledge-hub': 'A clear source of truth can make answers, content and internal decisions easier to reuse.',
  }
  if (reasons[serviceId]) return reasons[serviceId]
  const service = aiSalesServices.find((item) => item.serviceId === serviceId)
  return service ? `${service.title} is relevant because it matches the priority you described.` : reasons['growth-assessment']
}

function getRecommendations(conversation) {
  const text = conversation.messages.filter((message) => message.role === 'user').map((message) => message.content).join(' ').toLowerCase()
  const offer = inferGrowthOffer(text)
  const utilityServiceIds = new Set(['growth-assessment', 'proposal-generator'])
  const ranked = aiSalesServices.map((service) => ({ service, matches: service.keywords.filter((keyword) => text.includes(keyword)).length })).filter(({ service, matches }) => utilityServiceIds.has(service.serviceId) && matches > 0).sort((a, b) => b.matches - a.matches)
  const serviceRecommendations = (ranked.length ? ranked.slice(0, 2) : [{ service: aiSalesServices.find((service) => service.serviceId === 'growth-assessment'), matches: 1 }]).map(({ service }, index) => ({ serviceId: service.serviceId, title: service.title, reason: reasonForService(service.serviceId), priority: index + 2, ctaType: service.ctaType, ctaLabel: service.ctaLabel, ctaTarget: service.ctaTarget }))
  const plan = getGrowthOperationsPlanForOffer(offer.id)
  const offerRecommendation = { serviceId: `department:${plan.id}`, title: plan.name, reason: `${plan.aiSalesSummary} Monthly investment: ${plan.monthlyPrice}.`, priority: 1, ctaType: 'strategy-call', ctaLabel: plan.cta.label, ctaTarget: plan.cta.href, metadata: { planId: plan.id, monthlyPrice: plan.monthlyPrice, onboardingFee: plan.onboardingFee } }
  if (isWeb3Context(text)) {
    const launchRecommendation = { serviceId: `package:${web3LaunchPackage.id}`, title: web3LaunchPackage.name, reason: `${web3LaunchPackage.positioning} Starting investment: ${web3LaunchPackage.startingInvestment}.`, priority: 1, ctaType: 'strategy-call', ctaLabel: web3LaunchPackage.cta.label, ctaTarget: web3LaunchPackage.cta.href, metadata: { startingInvestment: web3LaunchPackage.startingInvestment, timeline: web3LaunchPackage.timeline } }
    return [launchRecommendation, offerRecommendation, ...serviceRecommendations]
  }
  return [offerRecommendation, ...serviceRecommendations]
}

function web3DiscoveryReply(input) {
  if (!isWeb3Context(input)) return ''
  return 'For a legitimate Web3 or crypto project, NOVAHAUS starts with narrative clarity and responsible source materials. I can help you think through the launch package, a monthly department or a human strategy review — not investment advice or token promotion.'
}

function monthlyPlanReply(input) {
  const text = normalise(input)
  if (!includesAny(text, ['monthly', 'managed service', 'managed support', 'content operations', 'brand operations', 'community operations', 'growth operations'])) return ''
  const offer = inferGrowthOffer(text)
  const plan = getGrowthOperationsPlanForOffer(offer.id)
  const planLines = plan.monthlyStandardCapacity.map((item) => `- ${item}`).join('\n')
  const addOnLines = plan.customQuoteTriggers.map((item) => `- ${item}`).join('\n')
  const excludedLines = plan.exclusions.slice(0, 6).map((item) => `- ${item}`).join('\n')
  const approvedAddOnLines = plan.addOns.slice(0, 5).map((item) => `- ${item.name}: ${item.price}`).join('\n')
  return `${plan.name} is ${plan.monthlyPrice}, with onboarding ${plan.onboardingFee}.\n\nIt is designed for ${plan.bestFor.toLowerCase()}\n\nStandard monthly capacity:\n${planLines}\n\nExcluded from the standard department:\n${excludedLines}\n\nAdd-on or custom-quote triggers:\n${addOnLines}\n\nApproved add-on examples:\n${approvedAddOnLines}\n\n${plan.finalQuoteNotice}`
}

function faqReply(input) {
  const match = aiSalesAgentFaqs.find((faq) => faq.keywords.some((keyword) => normalise(input).includes(keyword)))
  return match?.answer || ''
}

function shortList(items = [], limit = 4) {
  return items.slice(0, limit).map((item) => `- ${item}`).join('\n')
}

function deliveryScopeReply(input) {
  const scope = getPortfolioServiceForText(input)
  if (!scope) return ''
  const text = normalise(input)
  if (includesAny(text, ['medical', 'legal advice', 'investment advice', 'banking core', 'regulated', 'sensitive personal'])) return `This request may involve a higher-risk or regulated workflow. ${scope.name} can be discussed at a high level, but a human strategy call and specialist review are required before any delivery recommendation.`
  if (includesAny(text, ['price', 'pricing', 'cost', 'fee', 'budget', 'how much'])) return `${scope.name} is ${scope.implementationFeeReference} for implementation and ${scope.monthlyFeeReference} for the managed-service reference. ${scope.finalQuoteNotice}`
  if (includesAny(text, ['timeline', 'how long', 'when', 'launch'])) return `${scope.name} has an estimated timeline of ${scope.estimatedTimeline}\n\n${scope.finalQuoteNotice}`
  if (includesAny(text, ['client provide', 'responsibility', 'need from', 'content', 'access'])) return `${scope.name} needs the client to provide:\n${shortList(scope.clientResponsibilities)}\n\n${scope.finalQuoteNotice}`
  if (includesAny(text, ['custom', 'integration', 'api', 'login', 'payment', 'database'])) return `${scope.name} can include custom work such as:\n${shortList(scope.customScope)}\n\nThose requirements need a technical assessment before they are quoted.`
  if (includesAny(text, ['exclude', 'not included', 'out of scope', 'guarantee'])) return `The standard boundary for ${scope.name} does not include:\n${shortList(scope.outOfScope)}\n\nNOVAHAUS does not promise guaranteed business outcomes.`
  if (includesAny(text, ['revision', 'support', 'monthly', 'managed'])) return `${scope.name}: ${scope.revisionPolicy}\n\nMonthly support covers ${scope.monthlyManagedService.toLowerCase()}`
  return `${scope.name} is ${scope.shortDescription}\n\nStandard scope includes:\n${shortList(scope.standardScope)}\n\n${scope.finalQuoteNotice}`
}

function highRiskRequest(input) {
  return includesAny(normalise(input), highRiskTerms)
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
  const knowledgeReply = deliveryScopeReply(input)
  const responseKnowledge = monthlyPlanReply(input) || web3DiscoveryReply(input) || knowledgeReply || faq || (highRiskRequest(input) ? 'This may involve sensitive or regulated information. A human strategy call is the right next step before any recommendation is made.' : '')
  let stage = conversation.currentStage
  let content = responseKnowledge
  let quickReplies = []
  const leadPatch = {}
  const prompt = (question) => `${responseKnowledge ? `${responseKnowledge}\n\n` : ''}${question}`

  if (conversation.currentStage === 'business-type') {
    leadPatch.industry = inferIndustry(text)
    if (isWeb3Context(text)) {
      stage = 'web3-project-context'
      leadPatch.industry = 'Web3 & Crypto Project Teams'
      content = prompt('What stage is the project at, and are you preparing a launch, partnership conversation or major campaign?')
      quickReplies = ['Pre-launch', 'Preparing partnerships', 'Community is active', 'Major campaign planned']
    } else {
      stage = 'existing-system'
      content = prompt('Do you already have a website or system in place?')
      quickReplies = ['Yes, we have a website', 'We have several tools', 'Not yet', 'We need to replace the current system']
    }
  } else if (conversation.currentStage === 'web3-project-context') {
    leadPatch.projectStage = input.trim()
    stage = 'existing-system'
    content = prompt('Do you already have an approved whitepaper, pitch deck or key-message document? Which communities or platforms matter most, what languages are needed and when is the next launch milestone?')
    quickReplies = ['Whitepaper exists', 'Pitch deck exists', 'Both need work', 'Starting from source materials']
  } else if (conversation.currentStage === 'existing-system') {
    leadPatch.existingSystem = input.trim()
    stage = 'pain-points'
    content = prompt('What is the main business problem you want to solve?')
    quickReplies = ['Unclear positioning', 'Low-quality leads', 'Manual operations', 'Weak digital presence']
  } else if (conversation.currentStage === 'pain-points') {
    leadPatch.painPoints = [input.trim()]
    stage = 'goals'
    content = prompt('What would be meaningfully different for the business if this improved?')
    quickReplies = ['More qualified enquiries', 'A clearer market position', 'Less manual work', 'A stronger digital presence']
  } else if (conversation.currentStage === 'goals') {
    leadPatch.goals = [input.trim()]
    stage = 'functions'
    content = prompt('Which functions do you need most: website, booking, lead capture, CRM, proposal, knowledge or automation?')
    quickReplies = ['Website and booking', 'Lead capture and CRM', 'Proposal and knowledge', 'Automation']
  } else if (conversation.currentStage === 'functions') {
    leadPatch.neededFunctions = input.trim()
    stage = 'team-size'
    content = prompt('How many team members will use the system?')
    quickReplies = ['Just me', '2-5 people', '6-20 people', 'More than 20']
  } else if (conversation.currentStage === 'team-size') {
    leadPatch.teamSize = input.trim()
    stage = 'monthly-volume'
    content = prompt('Roughly how many monthly enquiries or customers do you handle?')
    quickReplies = ['Under 20', '20-100', '100-500', 'More than 500']
  } else if (conversation.currentStage === 'monthly-volume') {
    leadPatch.monthlyVolume = input.trim()
    stage = 'integrations'
    content = prompt('Do you need login, payment, database or third-party integrations?')
    quickReplies = ['No integrations yet', 'CRM or calendar', 'Payment or login', 'Several custom integrations']
  } else if (conversation.currentStage === 'integrations') {
    leadPatch.integrationNeeds = input.trim()
    stage = 'sensitive-data'
    content = prompt('Does the project involve medical, legal, financial or sensitive personal data?')
    quickReplies = ['No', 'Possibly', 'Yes, sensitive data is involved']
  } else if (conversation.currentStage === 'sensitive-data') {
    leadPatch.sensitiveData = input.trim()
    stage = 'timeline'
    content = prompt('What is your target launch date or timing?')
    quickReplies = ['Immediately', 'Within 30 days', 'Within 3 months', 'Still exploring']
  } else if (conversation.currentStage === 'timeline') {
    leadPatch.timeline = input.trim()
    stage = 'budget'
    content = prompt('What is your estimated budget range? A rough range is enough.')
    quickReplies = ['Not decided yet', 'Under USD 5,000', 'USD 5,000-15,000', 'USD 15,000+', 'Prefer to discuss']
  } else if (conversation.currentStage === 'budget') {
    leadPatch.budget = input.trim()
    if (hasCommercialIntent(conversation, input) || conversation.leadDraft?.sensitiveData) {
      stage = 'lead-capture'
      content = prompt('The context is useful. Before I prepare the next recommendation, may I ask for a few details so I can keep the next step relevant?')
    } else {
      stage = 'cta'
      content = prompt('That gives me a useful direction. Choose the next step that feels useful.')
    }
  } else if (conversation.currentStage === 'lead-capture') {
    content = responseKnowledge || 'Once your details are saved, I can recommend the most relevant NOVAHAUS path and show the right next action.'
  } else if (conversation.currentStage === 'recommendation' || conversation.currentStage === 'cta') {
    if (!conversation.leadId && hasCommercialIntent(conversation, input)) {
      stage = 'lead-capture'
      content = 'That sounds like a useful next step. Before I prepare a recommendation, may I ask for a few details so it is grounded in your business?'
    } else {
      content = responseKnowledge || (intent === 'pricing' ? 'The right scope depends on the problem and systems involved. A Strategy Call is the clearest way to shape a considered proposal.' : intent === 'proposal' ? 'I can prepare a proposal draft from this conversation. It will remain a working document until the scope is reviewed together.' : 'The context is clear enough to move forward. Choose the next action that feels useful.')
      stage = 'cta'
    }
  } else {
    stage = 'pain-points'
    content = responseKnowledge || 'Tell me a little more about the business and the decision you are trying to make.'
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
