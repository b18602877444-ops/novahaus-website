export const ASSESSMENT_EVENTS = ['assessment_started', 'assessment_step_completed', 'assessment_submitted', 'strategy_call_clicked', 'recommended_product_clicked']

export function trackAssessmentEvent(eventName, payload = {}) {
  if (!ASSESSMENT_EVENTS.includes(eventName)) return
  if (import.meta.env.DEV) console.info(`[NOVAHAUS] ${eventName}`, payload)
}
