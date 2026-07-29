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
  budget: '',
  timeline: '',
  projectStage: '',
  languages: '',
  goals: [],
  painPoints: [],
  complianceFlags: [],
  objections: [],
  recommendedServices: [],
  source: 'ai-sales-agent',
  conversationId: '',
  aiSummary: '',
  leadScore: 0,
  leadPriority: 'Low',
  leadStars: '★★★',
  leadTemperature: 'Cold Lead',
  leadIntelligenceVersion: '',
  dealBrief: null,
  founderDashboardData: null,
  whatsappHandoff: null,
  handoffStatus: '',
  resourceRequested: false,
  resourceDelivered: false,
  resourcePending: false,
  leadDelivery: null,
  status: 'new',
}

function createId() {
  return globalThis.crypto?.randomUUID?.() || `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function text(value) {
  return String(value || '').trim()
}

function array(value) {
  return Array.isArray(value) ? value.filter(Boolean).map(text) : []
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
    budget: text(input.budget),
    timeline: text(input.timeline),
    projectStage: text(input.projectStage),
    languages: text(input.languages),
    goals: array(input.goals),
    painPoints: array(input.painPoints),
    complianceFlags: array(input.complianceFlags),
    objections: array(input.objections),
    recommendedServices: array(input.recommendedServices),
    source: text(input.source) || emptyLead.source,
    conversationId: text(input.conversationId),
    aiSummary: text(input.aiSummary),
    leadScore: Number.isFinite(Number(input.leadScore)) ? Number(input.leadScore) : 0,
    leadPriority: text(input.leadPriority) || emptyLead.leadPriority,
    leadStars: text(input.leadStars) || emptyLead.leadStars,
    leadTemperature: text(input.leadTemperature) || emptyLead.leadTemperature,
    leadIntelligenceVersion: text(input.leadIntelligenceVersion),
    dealBrief: input.dealBrief && typeof input.dealBrief === 'object' ? input.dealBrief : null,
    founderDashboardData: input.founderDashboardData && typeof input.founderDashboardData === 'object' ? input.founderDashboardData : null,
    whatsappHandoff: input.whatsappHandoff && typeof input.whatsappHandoff === 'object' ? input.whatsappHandoff : null,
    handoffStatus: text(input.handoffStatus),
    resourceRequested: Boolean(input.resourceRequested),
    resourceDelivered: Boolean(input.resourceDelivered),
    resourcePending: Boolean(input.resourcePending),
    leadDelivery: input.leadDelivery && typeof input.leadDelivery === 'object' ? input.leadDelivery : null,
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
