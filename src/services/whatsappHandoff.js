import { updateLead } from './leadStorage.js'

export const WHATSAPP_PHONE = '60109426431'
export const WHATSAPP_HANDOFFS_STORAGE_KEY = 'novahaus_whatsapp_handoffs_v1'

const sensitivePatterns = [
  /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/gi,
  /(?:\+?\d[\d\s().-]{6,}\d)/g,
]

const compliancePatterns = /investment|token\s*price|fundrais|financial\s*return|medical|legal|tax|regulated|guarantee|guaranteed/i

function safeValue(value, fallback = 'Not provided', limit = 180) {
  let result = String(value || '').replace(/[\r\n]+/g, ' ').trim().slice(0, limit)
  sensitivePatterns.forEach((pattern) => { result = result.replace(pattern, '[redacted]') })
  if (compliancePatterns.test(result)) return '[human review required]'
  return result || fallback
}

function readHandoffs() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(WHATSAPP_HANDOFFS_STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeHandoffs(items) {
  try {
    window.localStorage.setItem(WHATSAPP_HANDOFFS_STORAGE_KEY, JSON.stringify(items))
    return true
  } catch {
    return false
  }
}

export function buildWhatsAppMessage(dealBrief = {}) {
  return [
    'Hello NOVAHAUS,',
    '',
    'I completed the AI Sales consultation.',
    '',
    `Customer type: ${safeValue(dealBrief.customerType)}`,
    '',
    `Project stage: ${safeValue(dealBrief.projectStage)}`,
    '',
    `Main need: ${safeValue(dealBrief.mainNeed || dealBrief.mainPainPoints?.[0])}`,
    '',
    `Recommended starting point: ${safeValue(dealBrief.recommendedOffer)}`,
    '',
    `Budget range: ${safeValue(dealBrief.budget)}`,
    '',
    `Timeline: ${safeValue(dealBrief.timeline)}`,
    '',
    'I would like to discuss the next step.',
  ].join('\n')
}

export function buildWhatsAppUrl(dealBrief = {}) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(buildWhatsAppMessage(dealBrief))}`
}

export function getLeadHandoff({ conversation = {}, lead = {}, intelligence = null } = {}) {
  const resolvedIntelligence = intelligence || conversation.leadIntelligence || {}
  const level = String(resolvedIntelligence.level || resolvedIntelligence.priority || 'Low').toLowerCase()
  const complianceRisk = resolvedIntelligence.complianceRisk?.level === 'high' || conversation.context?.complianceReviewRequired
  const brief = resolvedIntelligence.dealBrief || {}
  const qualified = Boolean(conversation.recommendations?.length || brief.recommendedOffer)
  const isHigh = level === 'high'
  const isMedium = level === 'medium'
  const showWhatsApp = qualified && isHigh
  const status = complianceRisk ? 'founder_review_required' : qualified ? 'qualified' : 'not_qualified'

  return {
    level: resolvedIntelligence.level || 'Low',
    score: Number(resolvedIntelligence.score) || 0,
    qualified,
    showWhatsApp,
    whatsappHref: showWhatsApp ? buildWhatsAppUrl(brief) : '',
    complianceReviewRequired: Boolean(complianceRisk),
    handoffStatus: status,
    notice: qualified ? 'A human founder will review the final scope, timing, compliance requirements and quotation.' : '',
    complianceNotice: complianceRisk ? 'This request requires human compliance and scope review before any engagement is confirmed.' : '',
    showProposal: qualified && (isHigh || isMedium),
    showBooking: qualified && (isHigh || isMedium),
    showReviewDeliverables: qualified && (isHigh || isMedium),
  }
}

export function createWhatsAppHandoffRecord({ lead = {}, conversation = {}, intelligence = {}, status = 'qualified' } = {}) {
  const dealBrief = intelligence.dealBrief || {}
  const timestamp = new Date().toISOString()
  return {
    id: `whatsapp-handoff-${Date.now()}`,
    leadId: lead.id || conversation.leadId || '',
    source: 'ai-sales-consultant',
    customerType: dealBrief.customerType || 'Not provided',
    projectStage: dealBrief.projectStage || 'Not provided',
    mainPainPoints: Array.isArray(dealBrief.mainPainPoints) ? dealBrief.mainPainPoints : [],
    requiredDeliverables: Array.isArray(dealBrief.requiredDeliverables) ? dealBrief.requiredDeliverables : [],
    budgetRange: dealBrief.budget || 'Not provided',
    timeline: dealBrief.timeline || 'Not provided',
    languages: dealBrief.languages || 'Not provided',
    recommendedOffer: dealBrief.recommendedOffer || 'Human strategy review',
    leadScore: Number(intelligence.score) || 0,
    priority: intelligence.priority || 'Low',
    complianceFlags: Array.isArray(dealBrief.complianceFlags) ? dealBrief.complianceFlags : [],
    objections: Array.isArray(dealBrief.objections) ? dealBrief.objections : [],
    founderTalkingPoints: Array.isArray(dealBrief.founderTalkingPoints) ? dealBrief.founderTalkingPoints : [],
    suggestedNextAction: dealBrief.suggestedNextAction || 'Founder review',
    handoffTimestamp: timestamp,
    handoffStatus: status,
    createdAt: timestamp,
  }
}

export function saveWhatsAppHandoff(record) {
  const items = readHandoffs()
  const index = items.findIndex((item) => item.leadId && item.leadId === record.leadId)
  if (index === -1) items.push(record); else items[index] = { ...items[index], ...record }
  writeHandoffs(items)
  return record
}

export function listWhatsAppHandoffs() {
  return readHandoffs().sort((a, b) => new Date(b.handoffTimestamp || 0) - new Date(a.handoffTimestamp || 0))
}

export function updateWhatsAppHandoffStatus(leadId, status) {
  const items = readHandoffs()
  const index = items.findIndex((item) => item.leadId === leadId)
  if (index === -1) return null
  const updated = { ...items[index], handoffStatus: status, updatedAt: new Date().toISOString() }
  items[index] = updated
  writeHandoffs(items)
  return updated
}

export function getWhatsAppHandoffMetrics() {
  const handoffs = listWhatsAppHandoffs()
  return {
    whatsappHandoffCount: handoffs.length,
    highLeadsAwaitingContact: handoffs.filter((item) => item.priority === 'High' && item.handoffStatus === 'qualified').length,
    whatsappOpened: handoffs.filter((item) => item.handoffStatus === 'whatsapp_opened').length,
    founderFollowUpStatus: handoffs.map((item) => ({ leadId: item.leadId, status: item.handoffStatus })),
  }
}

export function markLeadHandoff(lead, intelligence, status) {
  if (!lead?.id) return null
  const timestamp = new Date().toISOString()
  const existing = lead.whatsappHandoff || {}
  const dealBrief = { ...(lead.dealBrief || intelligence?.dealBrief || {}), handoffTimestamp: timestamp, handoffStatus: status }
  const founderDashboardData = { ...(lead.founderDashboardData || intelligence?.founderDashboardData || {}), whatsappHandoffStatus: status, whatsappHandoffTimestamp: timestamp, founderFollowUpStatus: status }
  const updatedLead = updateLead(lead.id, { whatsappHandoff: { ...existing, status, timestamp }, dealBrief, founderDashboardData })
  if (updatedLead) {
    const existingHandoff = listWhatsAppHandoffs().find((item) => item.leadId === lead.id)
    if (existingHandoff) updateWhatsAppHandoffStatus(lead.id, status)
  }
  return updatedLead
}
