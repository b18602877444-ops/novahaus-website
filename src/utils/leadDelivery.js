import { web3ProjectLaunchReadinessChecklist } from '../data/leadMagnetCatalog.js'

const text = (value) => String(value || '').trim()

function getContext(conversation = {}, lead = {}) {
  return { ...(conversation.context || {}), ...(conversation.leadDraft || {}), ...lead }
}

function isWeb3Customer(context) {
  return /web3|crypto/i.test(text(context.customerType || context.businessType || context.industry))
}

function isWarmOrHot({ intelligence = {}, qualification = {} } = {}) {
  return ['High', 'Medium'].includes(text(intelligence.level)) || ['Warm Lead', 'Hot Lead'].includes(text(qualification.temperature))
}

function hasRequiredContact(lead = {}, context = {}) {
  return Boolean(text(lead.name || context.name) && text(lead.company || context.company || context.companyOrProject) && text(lead.email || context.email))
}

export function isLeadMagnetDiscoveryComplete(conversation = {}) {
  return ['recommendation', 'lead-capture', 'cta', 'completed'].includes(text(conversation.currentStage))
}

export function shouldRecommendWeb3LeadMagnet({ conversation = {}, lead = {}, intelligence, qualification } = {}) {
  const context = getContext(conversation, lead)
  return isWeb3Customer(context) && isLeadMagnetDiscoveryComplete(conversation) && isWarmOrHot({ intelligence, qualification })
}

export function buildLeadDeliveryState({ conversation = {}, lead = {}, intelligence, qualification } = {}) {
  const context = getContext(conversation, lead)
  const eligible = shouldRecommendWeb3LeadMagnet({ conversation, lead, intelligence, qualification })
  const contactReady = hasRequiredContact(lead, context)
  const requested = eligible || Boolean(lead.resourceRequested || conversation.leadDelivery?.resourceRequested)
  const delivered = Boolean(lead.resourceDelivered || conversation.leadDelivery?.resourceDelivered)
  const pending = requested && !delivered
  return {
    resourceId: web3ProjectLaunchReadinessChecklist.resourceId,
    resourceName: web3ProjectLaunchReadinessChecklist.name,
    resourceRequested: requested,
    resourceDelivered: delivered,
    resourcePending: pending,
    qualificationRequired: web3ProjectLaunchReadinessChecklist.qualification,
    requiredLeadFields: web3ProjectLaunchReadinessChecklist.requiredLeadFields,
    contactReady,
    deliveryEligible: eligible && contactReady,
    deliveryStatus: !requested ? 'not-requested' : !contactReady ? 'pending-contact' : delivered ? 'delivered' : 'pending-qualified-delivery',
    deliveryMode: web3ProjectLaunchReadinessChecklist.delivery.mode,
    publicUrl: web3ProjectLaunchReadinessChecklist.delivery.publicUrl,
    anonymousAccess: web3ProjectLaunchReadinessChecklist.delivery.anonymousAccess,
    futureHooks: web3ProjectLaunchReadinessChecklist.futureHooks,
    version: '2026-07-web3-lead-delivery-v1',
  }
}
