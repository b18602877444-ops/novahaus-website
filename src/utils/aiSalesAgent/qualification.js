export const qualificationRules = [
  { id: 'clear-need', label: 'Clear project need', points: 15, keywords: ['need', 'build', 'launch', 'improve', 'fix', 'develop', 'create'] },
  { id: 'clear-pain', label: 'Clear pain point', points: 15, keywords: ['problem', 'challenge', 'manual', 'unclear', 'low conversion', 'not working', 'slow'] },
  { id: 'clear-goal', label: 'Clear goal', points: 10, keywords: ['goal', 'grow', 'scale', 'convert', 'generate', 'expand', 'increase'] },
  { id: 'explicit-budget', label: 'Explicit budget', points: 15, keywords: ['budget', 'usd', '$', '5,000', '10,000', '15,000', '30,000'] },
  { id: 'start-time', label: 'Start timeline', points: 15, keywords: ['immediately', 'asap', 'this month', '30 days', 'next month', 'within 3 months', 'soon'] },
  { id: 'contact-details', label: 'Contact details provided', points: 20, keywords: [] },
  { id: 'price-interest', label: 'Pricing interest', points: 10, keywords: ['price', 'pricing', 'cost', 'fee', 'how much'] },
  { id: 'meeting-interest', label: 'Meeting interest', points: 15, keywords: ['book', 'call', 'meeting', 'speak', 'schedule', 'consultation'] },
  { id: 'proposal-interest', label: 'Proposal interest', points: 10, keywords: ['proposal', 'scope', 'quote', 'quotation'] },
]

export const leadTemperatures = [
  { label: 'Cold Lead', min: 0, max: 29 },
  { label: 'Warm Lead', min: 30, max: 64 },
  { label: 'Hot Lead', min: 65, max: 100 },
]

export function classifyLead(score) {
  return leadTemperatures.find((temperature) => score >= temperature.min && score <= temperature.max)?.label || 'Cold Lead'
}

function hasKeyword(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword))
}

export function calculateLeadQualification({ conversationText = '', lead = {}, existingSignals = [] } = {}) {
  const text = conversationText.toLowerCase()
  const signals = new Set(existingSignals)
  const nextSignals = qualificationRules.filter((rule) => {
    if (signals.has(rule.id)) return false
    if (rule.id === 'contact-details') return Boolean(lead.name?.trim() && lead.company?.trim() && lead.email?.trim())
    return hasKeyword(text, rule.keywords)
  }).map((rule) => rule.id)
  nextSignals.forEach((signal) => signals.add(signal))
  const score = Math.min(100, qualificationRules.filter((rule) => signals.has(rule.id)).reduce((total, rule) => total + rule.points, 0))
  return { score, temperature: classifyLead(score), signals: [...signals], breakdown: qualificationRules.filter((rule) => signals.has(rule.id)).map(({ id, label, points }) => ({ id, label, points })) }
}
