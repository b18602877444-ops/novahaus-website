export const ASSESSMENT_STORAGE_KEY = 'novahaus_growth_assessments_v1'

function createId() {
  return globalThis.crypto?.randomUUID?.() || `assessment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function saveAssessmentLocally(payload) {
  const record = { id: createId(), version: 1, submittedAt: new Date().toISOString(), ...payload }
  try {
    const stored = JSON.parse(window.localStorage.getItem(ASSESSMENT_STORAGE_KEY) || '{"version":1,"assessments":[]}')
    const assessments = Array.isArray(stored.assessments) ? stored.assessments : []
    window.localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify({ version: 1, assessments: [...assessments, record] }))
  } catch {
    // Storage may be unavailable in private browsing. The assessment still completes locally in memory.
  }
  return record
}

function unconfiguredAdapter(provider) {
  return Promise.resolve({ configured: false, provider, message: `${provider} integration is not configured.` })
}

export const submitToHubSpot = (payload) => unconfiguredAdapter('HubSpot', payload)
export const submitToGoHighLevel = (payload) => unconfiguredAdapter('GoHighLevel', payload)
export const submitToSalesforce = (payload) => unconfiguredAdapter('Salesforce', payload)
export const submitToNotion = (payload) => unconfiguredAdapter('Notion', payload)
export const sendEmailNotification = (payload) => unconfiguredAdapter('Email notification', payload)

export const assessmentSubmissionAdapters = { hubspot: submitToHubSpot, goHighLevel: submitToGoHighLevel, salesforce: submitToSalesforce, notion: submitToNotion, email: sendEmailNotification }
