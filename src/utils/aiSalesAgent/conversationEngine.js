import { aiSalesAgentFaqs, aiSalesAgentWelcome } from '../../data/aiSalesAgentScript.js'
import { commercialKnowledge } from '../../data/commercialKnowledge.js'
import { discoveryOptions, aiSalesConsultantKnowledgeVersion, salesConsultantProgressTotal } from '../../data/aiSalesConsultantConfig.js'
import { isWeb3Context, web3LaunchPackage } from '../../data/web3LaunchPackage.js'

const normalise = (value = '') => String(value).trim().toLowerCase()
const includesAny = (text, terms) => terms.some((term) => text.includes(term))
const bookingCta = { ctaType: 'strategy-call', ctaLabel: 'Book Strategy Call', ctaTarget: '/booking/?source=ai-sales-consultant' }
const complianceTerms = ['investment advice', 'token price', 'token-price', 'guaranteed fundraising', 'fundraising guarantee', 'exchange listing', 'financial returns', 'medical claim', 'legal advice', 'tax advice', 'customs advice', 'regulated product', 'platform-rule', 'circumvent']
const objectionTerms = ['why not hire employees', 'why not use chatgpt', 'guarantee growth', 'guarantee fundraising', 'reduce the price', 'discount', 'more content for the same price', 'pay in usdt', 'real clients']

export const initialSalesAgentWelcome = aiSalesAgentWelcome.content

export function detectIntent(input) {
  const text = normalise(input)
  if (includesAny(text, ['generate an initial proposal', 'prepare a proposal', 'proposal', 'quote', 'quotation', 'scope'])) return 'proposal'
  if (includesAny(text, ['book', 'call', 'meeting', 'schedule', 'speak'])) return 'meeting'
  if (includesAny(text, ['price', 'pricing', 'cost', 'fee', 'budget', 'how much'])) return 'pricing'
  if (includesAny(text, ['automation', 'crm', 'workflow', 'follow-up', 'manual'])) return 'automation'
  if (includesAny(text, ['brand', 'positioning', 'message', 'identity'])) return 'brand'
  if (includesAny(text, ['website', 'landing page', 'conversion'])) return 'digital'
  return 'general'
}

function inferCustomerType(text) {
  if (isWeb3Context(text)) return 'Web3 / Crypto Project'
  if (includesAny(normalise(text), ['china', 'chinese', 'export', 'manufacturer', 'cross-border', 'international', 'overseas'])) return 'China-to-Global Business'
  if (includesAny(normalise(text), ['creator', 'founder', 'coach', 'influencer', 'personal brand', 'speaker'])) return 'Creator / Personal Brand'
  return 'Other Business'
}

function getUserText(conversation, input = '') {
  return [...conversation.messages.filter((message) => message.role === 'user').map((message) => message.content), input].join(' ')
}

function getDepartment(id) {
  return commercialKnowledge.monthlyDepartments.find((department) => department.id === id)
}

function getRelevantAddOn(text) {
  const matchers = [
    ['Company Profile', ['company profile']],
    ['Business PPT, 10-15 slides', ['business ppt', 'business presentation']],
    ['Advanced pitch deck, 20-30 slides', ['pitch deck']],
    ['Landing page', ['landing page']],
    ['Standard whitepaper', ['whitepaper']],
    ['AI Sales Agent setup', ['ai sales']],
    ['Knowledge Hub setup', ['knowledge hub']],
  ]
  const match = matchers.find(([, terms]) => includesAny(normalise(text), terms))
  return match ? commercialKnowledge.approvedAddOns.find((addOn) => addOn.name === match[0]) : null
}

function chooseOffer(conversation) {
  const text = normalise(getUserText(conversation))
  const context = conversation.context || {}
  if (context.complianceFlag === 'Yes' || context.complianceFlag === 'Unsure' || includesAny(text, complianceTerms)) return { type: 'custom' }

  const customerType = context.customerType || inferCustomerType(text)
  const stage = normalise(context.projectStage || '')
  const hasMonthlyNeed = includesAny(text, ['monthly', 'ongoing', 'recurring', 'operations', 'support'])
  const hasCommunityNeed = includesAny(text, ['community', 'ama', 'telegram', 'knowledge hub', 'membership', 'announcements', 'faq'])
  const hasContentNeed = includesAny(text, ['content', 'script', 'video', 'poster', 'caption', 'publishing', 'social'])
  const hasBrandNeed = includesAny(text, ['brand', 'positioning', 'founder', 'creator', 'personal', 'identity', 'profile'])
  const hasMultipleWorkstreams = ['content', 'commercial', 'sales', 'community', 'automation', 'crm', 'website', 'ai', 'proposal', 'brand'].filter((term) => text.includes(term)).length >= 4

  if (customerType === 'Web3 / Crypto Project') {
    if (hasCommunityNeed && (hasMonthlyNeed || includesAny(stage, ['community', 'ongoing', 'scaling']))) return { type: 'department', department: getDepartment('ai-community-operations-department') }
    if (hasMultipleWorkstreams || includesAny(stage, ['scaling', 'ongoing'])) return { type: 'department', department: getDepartment('ai-growth-operations-department') }
    if (includesAny(stage, ['launch', 'fundrais', 'partner']) || includesAny(text, ['narrative', 'whitepaper', 'pitch deck', 'launch assets']) || includesAny(text, ['nothing yet', 'basic materials'])) return { type: 'launch' }
    if (hasContentNeed && hasMonthlyNeed) return { type: 'department', department: getDepartment('ai-content-operations-department') }
    return { type: 'launch' }
  }

  if (customerType === 'Creator / Personal Brand') {
    if (hasMultipleWorkstreams && hasMonthlyNeed) return { type: 'department', department: getDepartment('ai-growth-operations-department') }
    return { type: 'department', department: getDepartment('ai-brand-operations-department') }
  }

  if (customerType === 'China-to-Global Business') {
    if (hasMultipleWorkstreams && hasMonthlyNeed) return { type: 'department', department: getDepartment('ai-growth-operations-department') }
    if (hasContentNeed && hasMonthlyNeed) return { type: 'department', department: getDepartment('ai-content-operations-department') }
    const addOn = getRelevantAddOn(text)
    if (addOn && !hasMonthlyNeed) return { type: 'addon', addOn }
    return { type: 'custom' }
  }

  if (hasCommunityNeed && hasMonthlyNeed) return { type: 'department', department: getDepartment('ai-community-operations-department') }
  if (hasBrandNeed && hasMonthlyNeed) return { type: 'department', department: getDepartment('ai-brand-operations-department') }
  if (hasMultipleWorkstreams && hasMonthlyNeed) return { type: 'department', department: getDepartment('ai-growth-operations-department') }
  if (hasContentNeed && hasMonthlyNeed) return { type: 'department', department: getDepartment('ai-content-operations-department') }
  const addOn = getRelevantAddOn(text)
  return addOn ? { type: 'addon', addOn } : { type: 'custom' }
}

function recommendationFromChoice(choice) {
  if (choice.type === 'launch') {
    return { serviceId: `package:${web3LaunchPackage.id}`, title: web3LaunchPackage.name, reason: 'Your project needs a structured narrative and launch-ready commercial assets before the next external conversation.', priority: 1, ...bookingCta, metadata: { startingInvestment: web3LaunchPackage.startingInvestment, timeline: web3LaunchPackage.timeline, commercialKnowledgeVersion: aiSalesConsultantKnowledgeVersion } }
  }
  if (choice.type === 'department') {
    const department = choice.department
    return { serviceId: `department:${department.id}`, title: department.name, reason: department.aiSalesSummary, priority: 1, ...bookingCta, metadata: { monthlyPrice: department.monthlyPrice, onboardingFee: department.onboardingFee, commercialKnowledgeVersion: aiSalesConsultantKnowledgeVersion } }
  }
  if (choice.type === 'addon') {
    return { serviceId: 'approved-add-on-review', title: 'Approved Add-on Review', reason: `${choice.addOn.name} is an approved one-time add-on at ${choice.addOn.price}. A human review is still needed to confirm the final scope.`, priority: 1, ...bookingCta, metadata: { addOn: choice.addOn.name, startingInvestment: choice.addOn.price, commercialKnowledgeVersion: aiSalesConsultantKnowledgeVersion } }
  }
  return { serviceId: 'custom-quote-human-review', title: 'Custom Quote / Human Strategy Review', reason: 'The requirement does not map cleanly to one standard offer yet, so a human needs to review the scope, capacity, timeline and technical or compliance requirements.', priority: 1, ...bookingCta, metadata: { commercialKnowledgeVersion: aiSalesConsultantKnowledgeVersion } }
}

function getRecommendations(conversation) {
  return [recommendationFromChoice(chooseOffer(conversation))]
}

function formatRecommendation(conversation) {
  const recommendation = getRecommendations(conversation)[0]
  const choice = chooseOffer(conversation)
  let details = ''
  if (choice.type === 'launch') details = `\n\nWhat it can include:\n${web3LaunchPackage.deliverables.slice(0, 4).map((item) => `- ${item}`).join('\n')}\n\nStarting investment:\n${web3LaunchPackage.startingInvestment}`
  if (choice.type === 'department') details = `\n\nWhat it can include:\n${choice.department.monthlyStandardCapacity.slice(0, 4).map((item) => `- ${item}`).join('\n')}\n\nStarting investment:\n${choice.department.monthlyPrice}`
  if (choice.type === 'addon') details = `\n\nStarting investment:\n${choice.addOn.price}`
  if (choice.type === 'custom') details = '\n\nStarting investment:\nCustom Quote after human review'
  return `Based on what you shared, the best starting point is:\n\n${recommendation.title}\n\nWhy it fits:\n- ${recommendation.reason}\n- The scope can be shaped around the materials, platforms and timing you described.\n- Capacity and boundaries can be confirmed before work begins.${details}\n\nImportant:\n${commercialKnowledge.finalQuoteNotice}\n\nWould you like to:\n- Generate an Initial Proposal\n- Book a Strategy Call\n- Compare with Another Department\n- Ask About Deliverables?`
}

function faqReply(input) {
  const text = normalise(input)
  return aiSalesAgentFaqs.find((faq) => faq.keywords.some((keyword) => text.includes(keyword)))?.answer || ''
}

function objectionReply(input) {
  const text = normalise(input)
  if (text.includes('why not hire employees')) return 'NOVAHAUS provides defined operating capacity without the fixed recruitment, management and coordination burden of building several separate roles. The right option depends on your internal needs, required volume and preferred level of control.'
  if (text.includes('why not use chatgpt')) return 'AI tools can help produce individual outputs. NOVAHAUS adds positioning, workflow design, consistency, review, delivery management and accountability across repeated business work.'
  if (includesAny(text, ['guarantee growth', 'guarantee fundraising', 'guaranteed fundraising'])) return 'No. NOVAHAUS does not guarantee followers, leads, sales, revenue, fundraising, listings, community growth or token performance. We provide defined operational deliverables and professional review.'
  if (includesAny(text, ['reduce the price', 'discount'])) return 'The displayed figures are starting investments based on defined capacity. Any adjusted quotation must be approved by a human after scope review; the AI cannot authorise discounts.'
  if (text.includes('more content for the same price')) return 'Each Department has defined monthly capacity. Additional quantities require an approved add-on quotation.'
  if (text.includes('pay in usdt')) return 'Prices are stated in USD. Where agreed in a signed invoice or agreement, USD may serve as the reference value for USDT settlement. Payment method, network fees and final terms require human confirmation.'
  if (text.includes('real clients')) return 'No. Demonstration projects are clearly labelled fictional examples created to show representative NOVAHAUS capabilities. They do not claim actual client results.'
  return ''
}

function needsComplianceReview(input) {
  return includesAny(normalise(input), complianceTerms)
}

function buildComplianceReply() {
  return 'This request requires human scope and compliance review before NOVAHAUS can confirm whether it is deliverable. NOVAHAUS does not provide professional advice in regulated fields or make guaranteed business, fundraising, investment or performance claims.'
}

function questionForStage(stage) {
  const questions = {
    'web3-stage': 'What stage is the project currently in?',
    'web3-needs': 'What do you need most right now? You can list more than one.',
    'web3-assets': 'What already exists today?',
    'web3-timing': 'What is the target date?',
    'web3-languages': 'Which languages are required?',
    'web3-compliance': 'Are there any token, investment, fundraising, medical, legal or regulated claims?',
    'china-product': 'What product or service is being taken overseas?',
    'china-market': 'Which international market is the priority?',
    'china-materials': 'What English commercial materials already exist?',
    'china-need': 'Is the immediate need positioning, content, sales materials or customer journey?',
    'china-deliverables': 'Which deliverables are needed?',
    'china-budget': 'What is the target timeline and budget range?',
    'creator-offering': 'What does the creator sell or promote?',
    'creator-platforms': 'Which platforms matter most?',
    'creator-assets': 'Which assets are needed, and is existing video footage available?',
    'creator-priority': 'Is the priority positioning, consistency, audience growth support or enquiry conversion?',
    'creator-budget': 'What is the monthly budget range?',
    'other-needs': 'Which area needs attention first?',
    'other-scope': 'What would a useful outcome or deliverable look like?',
  }
  return questions[stage] || 'Tell me a little more about the business and the decision in front of you.'
}

function quickRepliesForStage(stage) {
  const replies = {
    'web3-stage': discoveryOptions.web3Stage,
    'web3-needs': discoveryOptions.web3Needs.slice(0, 6),
    'web3-assets': discoveryOptions.web3Assets,
    'web3-timing': discoveryOptions.timing,
    'web3-languages': discoveryOptions.languages,
    'web3-compliance': discoveryOptions.compliance,
    'web3-budget': discoveryOptions.budget,
    'china-need': discoveryOptions.chinaNeed,
    'creator-platforms': discoveryOptions.creatorPlatforms,
    'creator-priority': discoveryOptions.creatorPriority,
    'creator-budget': discoveryOptions.budget,
    'other-needs': discoveryOptions.generalNeeds,
    'other-budget': discoveryOptions.budget,
  }
  return replies[stage] || []
}

function progressForStage(stage) {
  if (stage === 'customer-type') return 1
  if (stage.includes('recommendation') || stage === 'cta' || stage === 'lead-capture') return 7
  if (stage.includes('budget')) return 6
  if (stage.includes('compliance') || stage.includes('timeline') || stage.includes('languages')) return 5
  if (stage.includes('needs') || stage.includes('need') || stage.includes('priority')) return 3
  return 2
}

function snapshot(conversation) {
  return { messages: conversation.messages, currentStage: conversation.currentStage, quickReplies: conversation.quickReplies, leadDraft: conversation.leadDraft, context: conversation.context, recommendations: conversation.recommendations, qualification: conversation.qualification, progress: conversation.progress }
}

export function createInitialConversation(createId) {
  const now = new Date().toISOString()
  return { id: createId(), createdAt: now, updatedAt: now, status: 'active', messages: [{ id: createId(), role: 'agent', content: initialSalesAgentWelcome, timestamp: now, type: 'text', metadata: { stage: 'customer-type' } }], leadId: null, currentStage: 'customer-type', quickReplies: aiSalesAgentWelcome.quickReplies, progress: { current: 1, total: salesConsultantProgressTotal }, qualification: { score: 0, temperature: 'Cold Lead', signals: [], breakdown: [] }, recommendations: [], context: { source: 'ai-sales-consultant', commercialKnowledgeVersion: aiSalesConsultantKnowledgeVersion }, history: [] }
}

function branchAfterCustomerType(input, context) {
  const type = input.includes('Web3') || isWeb3Context(input) ? 'Web3 / Crypto Project' : input.includes('China') ? 'China-to-Global Business' : input.includes('Creator') || input.includes('Personal') ? 'Creator / Personal Brand' : 'Other Business'
  if (type === 'Web3 / Crypto Project') return { stage: 'web3-stage', message: 'What stage is the project currently in?', replies: discoveryOptions.web3Stage }
  if (type === 'China-to-Global Business') return { stage: 'china-product', message: 'What product or service is being taken overseas?', replies: [] }
  if (type === 'Creator / Personal Brand') return { stage: 'creator-offering', message: 'What does the creator sell or promote?', replies: [] }
  return { stage: 'other-needs', message: 'Which area needs attention first?', replies: discoveryOptions.generalNeeds }
}

function nextStageFor(stage, input, context) {
  const value = input.trim()
  const next = { stage, contextPatch: {}, message: questionForStage(stage), replies: quickRepliesForStage(stage) }
  if (stage === 'web3-stage') return { stage: 'web3-needs', contextPatch: { projectStage: value }, message: questionForStage('web3-needs'), replies: quickRepliesForStage('web3-needs') }
  if (stage === 'web3-needs') return { stage: 'web3-assets', contextPatch: { requiredDeliverables: value }, message: questionForStage('web3-assets'), replies: quickRepliesForStage('web3-assets') }
  if (stage === 'web3-assets') return { stage: 'web3-timing', contextPatch: { existingAssets: value }, message: questionForStage('web3-timing'), replies: quickRepliesForStage('web3-timing') }
  if (stage === 'web3-timing') return { stage: 'web3-languages', contextPatch: { timeline: value }, message: questionForStage('web3-languages'), replies: quickRepliesForStage('web3-languages') }
  if (stage === 'web3-languages') return { stage: 'web3-compliance', contextPatch: { languages: value }, message: questionForStage('web3-compliance'), replies: quickRepliesForStage('web3-compliance') }
  if (stage === 'web3-compliance') return { stage: 'web3-budget', contextPatch: { complianceFlag: value }, message: 'What is the estimated budget?', replies: discoveryOptions.budget }
  if (stage === 'web3-budget') return { stage: 'recommendation', contextPatch: { budget: value }, message: '', replies: ['Generate an Initial Proposal', 'Book a Strategy Call', 'Ask About Deliverables'] }
  if (stage === 'china-product') return { stage: 'china-market', contextPatch: { product: value }, message: questionForStage('china-market'), replies: [] }
  if (stage === 'china-market') return { stage: 'china-materials', contextPatch: { priorityMarket: value }, message: questionForStage('china-materials'), replies: [] }
  if (stage === 'china-materials') return { stage: 'china-need', contextPatch: { existingMaterials: value }, message: questionForStage('china-need'), replies: discoveryOptions.chinaNeed }
  if (stage === 'china-need') return { stage: 'china-deliverables', contextPatch: { immediateNeed: value }, message: questionForStage('china-deliverables'), replies: [] }
  if (stage === 'china-deliverables') return { stage: 'china-budget', contextPatch: { requiredDeliverables: value }, message: questionForStage('china-budget'), replies: discoveryOptions.budget }
  if (stage === 'china-budget') return { stage: 'recommendation', contextPatch: { budget: value }, message: '', replies: ['Generate an Initial Proposal', 'Book a Strategy Call', 'Ask About Deliverables'] }
  if (stage === 'creator-offering') return { stage: 'creator-platforms', contextPatch: { offering: value }, message: questionForStage('creator-platforms'), replies: discoveryOptions.creatorPlatforms }
  if (stage === 'creator-platforms') return { stage: 'creator-assets', contextPatch: { platforms: value }, message: questionForStage('creator-assets'), replies: [] }
  if (stage === 'creator-assets') return { stage: 'creator-priority', contextPatch: { requiredDeliverables: value }, message: questionForStage('creator-priority'), replies: discoveryOptions.creatorPriority }
  if (stage === 'creator-priority') return { stage: 'creator-budget', contextPatch: { immediateNeed: value }, message: questionForStage('creator-budget'), replies: discoveryOptions.budget }
  if (stage === 'creator-budget') return { stage: 'recommendation', contextPatch: { budget: value }, message: '', replies: ['Generate an Initial Proposal', 'Book a Strategy Call', 'Ask About Deliverables'] }
  if (stage === 'other-needs') return { stage: 'other-scope', contextPatch: { immediateNeed: value }, message: questionForStage('other-scope'), replies: [] }
  if (stage === 'other-scope') return { stage: 'other-budget', contextPatch: { requiredDeliverables: value }, message: 'What is the estimated budget?', replies: discoveryOptions.budget }
  if (stage === 'other-budget') return { stage: 'recommendation', contextPatch: { budget: value }, message: '', replies: ['Generate an Initial Proposal', 'Book a Strategy Call', 'Ask About Deliverables'] }
  return next
}

export function advanceConversation(conversation, input, createId) {
  const text = input.trim()
  const now = new Date().toISOString()
  const intent = detectIntent(text)
  const userMessage = { id: createId(), role: 'user', content: text, timestamp: now, type: 'text', metadata: { intent, stage: conversation.currentStage } }
  const messages = [...conversation.messages, userMessage]
  const history = [...(conversation.history || []), snapshot(conversation)]
  let stage = conversation.currentStage
  let contextPatch = {}
  let content = ''
  let quickReplies = []
  let recommendations = conversation.recommendations || []

  const objection = objectionReply(text)
  if (needsComplianceReview(text)) {
    content = `${objection ? `${objection}\n\n` : ''}${buildComplianceReply()}`
    stage = 'compliance-review'
    contextPatch = { complianceFlag: 'Yes', complianceReviewRequired: true }
    recommendations = [recommendationFromChoice({ type: 'custom' })]
    quickReplies = ['Book a Strategy Call', 'Return to discovery']
  } else if (objection) {
    content = `${objection}\n\nIf useful, I can continue with the scope and capacity that apply to your situation.`
    quickReplies = conversation.quickReplies?.length ? conversation.quickReplies : ['Ask About Deliverables', 'Book a Strategy Call']
  } else if (conversation.currentStage === 'customer-type') {
    const branch = branchAfterCustomerType(text, conversation.context)
    stage = branch.stage
    contextPatch = { customerType: branch.stage.startsWith('web3') ? 'Web3 / Crypto Project' : branch.stage.startsWith('china') ? 'China-to-Global Business' : branch.stage.startsWith('creator') ? 'Creator / Personal Brand' : 'Other Business' }
    content = branch.message
    quickReplies = branch.replies
  } else if (conversation.currentStage === 'recommendation') {
    if (intent === 'proposal' || includesAny(normalise(text), ['generate an initial proposal', 'prepare a proposal'])) {
      stage = 'lead-capture'
      content = 'I can prepare an initial, non-binding Proposal from this context. Before I save it, may I collect a few contact details so the handoff is useful?'
      quickReplies = []
    } else if (intent === 'meeting') {
      stage = 'cta'
      content = 'A Strategy Call is the clearest next step. I will pass only safe context such as your customer type, project stage and recommended offer into the booking flow.'
      quickReplies = []
    } else if (includesAny(normalise(text), ['compare', 'another department'])) {
      stage = 'recommendation'
      content = 'I can compare the recommended engagement with another current Department. Which area would you like to compare?'
      quickReplies = ['AI Content Operations Department', 'AI Brand Operations Department', 'AI Community Operations Department', 'AI Growth Operations Department']
    } else {
      content = formatRecommendation(conversation)
      quickReplies = ['Generate an Initial Proposal', 'Book a Strategy Call', 'Ask About Deliverables']
    }
  } else if (conversation.currentStage === 'lead-capture') {
    content = 'Use the short form below when you are ready. The information stays in this browser and is used to prepare the next handoff.'
  } else if (conversation.currentStage === 'compliance-review') {
    content = buildComplianceReply()
    quickReplies = ['Book a Strategy Call']
  } else if (conversation.currentStage === 'web3-compliance' && includesAny(normalise(text), ['yes', 'unsure'])) {
    content = buildComplianceReply()
    stage = 'compliance-review'
    contextPatch = { complianceFlag: text, complianceReviewRequired: true }
    recommendations = [recommendationFromChoice({ type: 'custom' })]
    quickReplies = ['Book a Strategy Call', 'Return to discovery']
  } else {
    const next = nextStageFor(conversation.currentStage, text, conversation.context)
    stage = next.stage
    contextPatch = next.contextPatch
    if (stage === 'recommendation') {
      const provisional = { ...conversation, messages, context: { ...conversation.context, ...contextPatch }, leadDraft: { ...(conversation.leadDraft || {}), ...contextPatch } }
      recommendations = getRecommendations(provisional)
      content = formatRecommendation(provisional)
    } else {
      content = next.message
    }
    quickReplies = next.replies
  }

  const next = { ...conversation, messages: [...messages, { id: createId(), role: 'agent', content, timestamp: now, type: stage === 'recommendation' ? 'service-recommendation' : 'text', metadata: { intent, stage, commercialKnowledgeVersion: aiSalesConsultantKnowledgeVersion } }], updatedAt: now, currentStage: stage, quickReplies, recommendations, context: { ...(conversation.context || {}), ...contextPatch }, leadDraft: { ...(conversation.leadDraft || {}), ...contextPatch }, progress: { current: progressForStage(stage), total: salesConsultantProgressTotal }, history }
  return { conversation: next, intent, leadPatch: { ...contextPatch, industry: next.context.customerType, budget: next.context.budget, timeline: next.context.timeline, goals: next.context.immediateNeed ? [next.context.immediateNeed] : [], painPoints: next.context.requiredDeliverables ? [next.context.requiredDeliverables] : [] }, recommendations, quickReplies }
}

export function goBackConversation(conversation) {
  const history = conversation.history || []
  const previous = history[history.length - 1]
  if (!previous) return conversation
  return { ...conversation, ...previous, history: history.slice(0, -1), updatedAt: new Date().toISOString() }
}

export function completeConversation(conversation, lead, createId) {
  const now = new Date().toISOString()
  const recommendations = conversation.recommendations?.length ? conversation.recommendations : getRecommendations(conversation)
  const content = `Based on what you shared, ${recommendations[0]?.title || 'a human strategy review'} is the most useful starting point. You can book a Strategy Call or prepare an initial, non-binding Proposal from this context.`
  return { ...conversation, status: 'completed', currentStage: 'cta', quickReplies: [], leadId: lead.id, updatedAt: now, recommendations, progress: { current: 7, total: salesConsultantProgressTotal }, messages: [...conversation.messages, { id: createId(), role: 'agent', content, timestamp: now, type: 'service-recommendation', metadata: { recommendations, commercialKnowledgeVersion: aiSalesConsultantKnowledgeVersion } }] }
}
