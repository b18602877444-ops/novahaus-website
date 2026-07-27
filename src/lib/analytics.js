export const ASSESSMENT_EVENTS = ['assessment_started', 'assessment_step_completed', 'assessment_submitted', 'strategy_call_clicked', 'recommended_product_clicked', 'proposal_created', 'assessment_imported', 'proposal_saved', 'proposal_version_created', 'proposal_printed', 'proposal_summary_copied', 'proposal_status_changed']

export function trackAssessmentEvent(eventName, payload = {}) {
  if (!ASSESSMENT_EVENTS.includes(eventName)) return
  if (import.meta.env.DEV) console.info(`[NOVAHAUS] ${eventName}`, payload)
}
