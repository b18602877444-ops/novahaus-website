export const leadStatuses = ['new', 'reviewed', 'qualified', 'archived']

export const emptyLead = {
  id: '',
  createdAt: '',
  name: '',
  company: '',
  email: '',
  whatsapp: '',
  country: '',
  businessType: '',
  interestedPackage: '',
  challenge: '',
  aiSummary: '',
  status: 'new',
}

function createId() {
  return globalThis.crypto?.randomUUID?.() || `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function text(value) {
  return String(value || '').trim()
}

export function createLeadRecord(input = {}) {
  const now = new Date().toISOString()
  const challenge = text(input.challenge || input.painPoints || input.goals)
  return {
    ...emptyLead,
    id: text(input.id) || createId(),
    createdAt: text(input.createdAt) || now,
    name: text(input.name),
    company: text(input.company),
    email: text(input.email),
    whatsapp: text(input.whatsapp),
    country: text(input.country),
    businessType: text(input.businessType || input.industry),
    interestedPackage: text(input.interestedPackage || input.package),
    challenge,
    aiSummary: text(input.aiSummary),
    status: leadStatuses.includes(input.status) ? input.status : 'new',
    updatedAt: now,
  }
}

export function buildLeadSummary(lead, recommendations = [], context = {}) {
  const recommendation = lead.interestedPackage || recommendations[0]?.title || 'Growth Assessment'
  const challenge = lead.challenge || 'To be clarified in the next conversation.'
  return [
    'Lead Summary',
    '',
    `Customer Type: ${context.customerType || lead.businessType || 'Not provided'}`,
    `Stage: ${context.projectStage || 'Not provided'}`,
    `Name: ${lead.name || 'Not provided'}`,
    `Company: ${lead.company || 'Not provided'}`,
    `Country: ${lead.country || 'Not provided'}`,
    `Business: ${lead.businessType || 'Not provided'}`,
    `Interested Package: ${recommendation}`,
    `Current Challenge: ${challenge}`,
    `Main Need: ${context.immediateNeed || context.requiredDeliverables || 'Not provided'}`,
    `Budget Range: ${context.budget || 'Not provided'}`,
    `Timeline: ${context.timeline || 'Not provided'}`,
    `Compliance Flags: ${context.complianceFlag || 'None stated'}`,
    '',
    'Next Recommendation:',
    recommendation,
    '- Strategy Call',
    'Requested Next Action: Strategy Call or initial non-binding Proposal',
  ].join('\n')
}
