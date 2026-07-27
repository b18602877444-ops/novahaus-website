export const AI_SALES_PROPOSAL_PREFILL_KEY = 'novahaus_ai_sales_proposal_prefill_v1'

export function saveProposalPrefill(payload) {
  const prefill = { version: 1, source: 'ai-sales-agent', createdAt: new Date().toISOString(), ...payload }
  try { window.localStorage.setItem(AI_SALES_PROPOSAL_PREFILL_KEY, JSON.stringify(prefill)); return prefill } catch { return prefill }
}

export function readProposalPrefill() {
  try { return JSON.parse(window.localStorage.getItem(AI_SALES_PROPOSAL_PREFILL_KEY) || 'null') } catch { return null }
}

export function clearProposalPrefill() {
  try { window.localStorage.removeItem(AI_SALES_PROPOSAL_PREFILL_KEY) } catch { /* storage unavailable */ }
}
