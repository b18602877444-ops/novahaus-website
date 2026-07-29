import { growthOperationsOffers } from '../data/growthOperationsOffers.js'
import { isWeb3Context, web3LaunchPackage } from '../data/web3LaunchPackage.js'
import { commercialKnowledge } from '../data/commercialKnowledge.js'

export const priorityCustomerGroups = commercialKnowledge.customerGroups.map((group) => group.assessmentLabel)

export const ASSESSMENT_QUESTIONS = [
  { id: 'customerGroup', label: 'Customer group', prompt: 'Which operating context is closest to your business?', options: [...priorityCustomerGroups, 'Not sure yet'] },
  { id: 'companySize', label: 'Company size', prompt: 'Where is the business today?', options: ['Pre-launch', '1–5 people', '6–20 people', '21–50 people', '51+ people'] },
  { id: 'currentWebsite', label: 'Current website', prompt: 'How would you describe the current website?', options: ['No website', 'Basic website', 'Active website', 'Conversion-focused website', 'Not sure yet'] },
  { id: 'monthlyEnquiries', label: 'Monthly enquiries', prompt: 'How many enquiries does the business usually receive each month?', options: ['0–10', '11–50', '51–200', '200+', 'Not sure yet'] },
  { id: 'biggestChallenge', label: 'Biggest business challenge', prompt: 'Which challenge is closest to the one you want to address first?', options: ['Unclear positioning', 'Weak digital presence', 'Low-quality enquiries', 'Manual follow-up', 'Customer support load', 'Inconsistent content', 'International expansion', 'AI adoption'] },
  { id: 'salesProcess', label: 'Sales process', prompt: 'How is the sales process handled today?', options: ['Founder-led', 'Manual team process', 'CRM-supported', 'Mostly automated', 'No defined process'] },
  { id: 'customerSupport', label: 'Community and customer support', prompt: 'How are customer or community questions handled today?', options: ['Email or WhatsApp', 'FAQ or Knowledge Hub', 'Member onboarding', 'Community announcements', 'AI-assisted', 'No consistent process'] },
  { id: 'marketingChannels', label: 'Content rhythm and channels', prompt: 'Which content rhythm and channels matter to the business?', options: ['Daily content', '2–4 times per week', 'Weekly content', 'Occasional content', 'Website', 'LinkedIn', 'YouTube', 'TikTok', 'Xiaohongshu', 'Email', 'Events', 'Referrals'], multi: true },
  { id: 'teamSize', label: 'Team size', prompt: 'How many people would be involved in the work or approvals?', options: ['1–5', '6–20', '21–50', '51+'] },
  { id: 'currentAIUsage', label: 'Current AI usage', prompt: 'How is the business using AI today?', options: ['Not yet', 'Exploring options', 'Individual tools', 'Connected workflows', 'Governed AI system'] },
  { id: 'businessGoal', label: 'Business goal', prompt: 'What would make the next stage more useful?', options: ['Launch or reposition', 'Improve conversion', 'Build AI systems', 'Organise operations', 'Enter international markets', 'Create a long-term growth system'] },
  { id: 'web3ProjectStage', label: 'Web3 project stage', prompt: 'If this is a Web3 or crypto project, what stage and next milestone are you preparing for?', options: ['Not a Web3 project', 'Pre-launch', 'Preparing a partnership conversation', 'Active community', 'Major campaign planned', 'Not sure yet'] },
  { id: 'web3NarrativeStatus', label: 'Narrative and claim review', prompt: 'What is the current status of the whitepaper, pitch deck and financial or regulatory claims?', options: ['Not applicable', 'Source materials exist', 'Whitepaper needs work', 'Pitch deck needs work', 'Claims need specialist review', 'Starting from scratch'] },
  { id: 'budgetRange', label: 'Budget range', prompt: 'Which investment context is closest for planning purposes?', options: ['Early-stage scope', 'Focused implementation', 'Connected growth system', 'Bespoke transformation', 'Not sure yet'] },
]

const scoringRules = {
  'ai-content-operations': ['Creator & Personal Brand Operators', 'Daily content', '2–4 times per week', 'Weekly content', 'Occasional content', 'Inconsistent content', 'TikTok', 'YouTube', 'LinkedIn', 'Xiaohongshu', 'Promotional content'],
  'ai-community-operations': ['Project & Community Operators', 'FAQ or Knowledge Hub', 'Member onboarding', 'Community announcements', 'Customer support load', 'Membership', 'Web3 & RWA'],
  'ai-brand-operations': ['Creator & Personal Brand Operators', 'Founder-led', 'Unclear positioning', 'Weak digital presence', 'Launch or reposition', 'Personal Brand'],
  'ai-global-growth-operations': ['China-to-Global SME Operators', 'International expansion', 'Enter international markets', '51+ people', '21–50 people', 'Business PPT', 'Global'],
}

function normaliseValues(answers) {
  return Object.values(answers).flatMap((value) => Array.isArray(value) ? value : [value]).filter(Boolean).map((value) => String(value).toLowerCase())
}

export function recommendGrowthOffer(answers) {
  const values = normaliseValues(answers)
  const scores = Object.fromEntries(commercialKnowledge.monthlyDepartments.map((plan) => [plan.offerId, 0]))

  Object.entries(scoringRules).forEach(([offerId, signals]) => {
    signals.forEach((signal) => { if (values.some((value) => value.includes(signal.toLowerCase()))) scores[offerId] += signal.length > 15 ? 4 : 2 })
  })

  if (answers.customerGroup === 'Project & Community Operators') scores['ai-community-operations'] += 8
  if (answers.customerGroup === 'Creator & Personal Brand Operators') scores['ai-brand-operations'] += 8
  if (answers.customerGroup === 'China-to-Global SME Operators') scores['ai-global-growth-operations'] += 8
  if (answers.businessGoal === 'Enter international markets') scores['ai-global-growth-operations'] += 8
  if (answers.businessGoal === 'Create a long-term growth system') scores['ai-content-operations'] += 2
  if (answers.budgetRange === 'Bespoke transformation') scores['ai-global-growth-operations'] += 3

  const ranked = growthOperationsOffers.map((offer, index) => ({ offer, score: scores[offer.id], index })).sort((a, b) => b.score - a.score || a.index - b.index)
  const web3Offer = {
    id: web3LaunchPackage.id,
    name: web3LaunchPackage.name,
    shortDescription: web3LaunchPackage.positioning,
    bestFor: 'Legitimate Web3 infrastructure, membership and community projects preparing a launch or partnership conversation.',
    estimatedTimeline: web3LaunchPackage.timeline,
    monthlyPrice: 'One-time implementation',
    onboardingFee: web3LaunchPackage.startingInvestment,
    monthlyStandardCapacity: web3LaunchPackage.deliverables,
    clientResponsibilities: web3LaunchPackage.clientResponsibilities,
    exclusions: web3LaunchPackage.exclusions,
    customQuoteTriggers: ['Additional pages, quantities or integrations beyond the approved package scope'],
    cta: web3LaunchPackage.cta,
    finalQuoteNotice: web3LaunchPackage.finalQuoteNotice,
    aiSalesSummary: web3LaunchPackage.positioning,
  }
  const isWeb3 = isWeb3Context(values.join(' '))
  const selected = isWeb3 ? web3Offer : ranked[0].offer
  const matchedSignals = (scoringRules[selected.id] || []).filter((signal) => values.some((value) => value.includes(signal.toLowerCase()))).slice(0, 3)
  const reason = matchedSignals.length > 0
    ? `Your answers point most strongly to ${matchedSignals.join(', ')}.`
    : 'Your answers suggest starting with a structured review of the operating context before selecting a larger scope.'

  return { offer: selected, offerType: isWeb3 ? 'launch-package' : 'monthly-department', scores, reason: isWeb3 ? 'Your answers point to a Web3 project context, so the focused launch package is the clearest first review.' : reason, matchedSignals, riskFlags: selected.riskFlags || web3LaunchPackage.exclusions }
}

export function buildAssessmentSummary(answers, recommendation) {
  const lines = [
    `Customer group: ${answers.customerGroup || 'Not provided'}`,
    `Company size: ${answers.companySize || 'Not provided'}`,
    `Current website: ${answers.currentWebsite || 'Not provided'}`,
    `Web3 project stage: ${answers.web3ProjectStage || 'Not provided'}`,
    `Narrative and claim review: ${answers.web3NarrativeStatus || 'Not provided'}`,
    `Monthly enquiries: ${answers.monthlyEnquiries || 'Not provided'}`,
    `Biggest challenge: ${answers.biggestChallenge || 'Not provided'}`,
    `Sales process: ${answers.salesProcess || 'Not provided'}`,
    `Community and customer support: ${answers.customerSupport || 'Not provided'}`,
    `Content rhythm and channels: ${Array.isArray(answers.marketingChannels) ? answers.marketingChannels.join(', ') || 'Not provided' : answers.marketingChannels || 'Not provided'}`,
    `Team size: ${answers.teamSize || 'Not provided'}`,
    `Current AI usage: ${answers.currentAIUsage || 'Not provided'}`,
    `Business goal: ${answers.businessGoal || 'Not provided'}`,
    `Budget context: ${answers.budgetRange || 'Not provided'}`,
    `Recommended department: ${recommendation.offer.name}`,
  ]
  return lines.join('\n')
}
