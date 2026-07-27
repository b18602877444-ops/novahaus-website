import { createLeadRecord, emptyLead } from '../data/leadSchema.js'

export const LEADS_STORAGE_KEY = 'novahaus_leads'

function readLeads() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LEADS_STORAGE_KEY) || '[]')
    const leads = Array.isArray(parsed) ? parsed : parsed?.leads
    return Array.isArray(leads) ? leads : []
  } catch {
    return []
  }
}

function writeLeads(leads) {
  try {
    window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads))
    return true
  } catch {
    return false
  }
}

export function listLeads() {
  return readLeads().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
}

export function getLead(id) {
  return listLeads().find((lead) => lead.id === id) || null
}

export function saveLeadRecord(input) {
  const record = createLeadRecord(input)
  const leads = readLeads()
  const index = leads.findIndex((lead) => lead.id === record.id)
  if (index === -1) leads.push(record); else leads[index] = { ...leads[index], ...record, updatedAt: new Date().toISOString() }
  writeLeads(leads)
  return index === -1 ? record : leads[index]
}

export function updateLead(id, patch) {
  const current = getLead(id)
  return current ? saveLeadRecord({ ...current, ...patch, id }) : null
}

export function deleteLead(id) {
  const leads = readLeads().filter((lead) => lead.id !== id)
  writeLeads(leads)
  return leads
}

export function clearLeads() {
  try { window.localStorage.removeItem(LEADS_STORAGE_KEY) } catch { /* storage unavailable */ }
}

export { emptyLead }
