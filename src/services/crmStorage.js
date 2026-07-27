import { listBookings } from './bookingStorage.js'
import { listLeads } from './leadStorage.js'

export const CRM_STORAGE_KEY = 'novahaus_crm_records'

export const crmViews = [
  { id: 'all', label: 'Lead List' },
  { id: 'qualified', label: 'Qualified Leads' },
  { id: 'discovery', label: 'Discovery Calls' },
  { id: 'proposal', label: 'Proposal Sent' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'won', label: 'Won Clients' },
  { id: 'lost', label: 'Lost Clients' },
  { id: 'health', label: 'Client Health' },
]

export const crmStatuses = ['lead', 'qualified', 'discovery', 'proposal', 'negotiation', 'won', 'lost']
export const crmHealthStatuses = ['new', 'healthy', 'needs-attention', 'at-risk']

const emptyRecord = {
  id: '',
  sourceType: 'manual',
  sourceId: '',
  createdAt: '',
  updatedAt: '',
  company: '',
  contact: '',
  country: '',
  industry: '',
  source: 'manual',
  status: 'lead',
  package: '',
  value: '',
  nextFollowUp: '',
  notes: '',
  health: 'new',
}

function text(value) {
  return String(value ?? '').trim()
}

function createId(prefix = 'crm') {
  return globalThis.crypto?.randomUUID?.() || `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function readLocalRecords() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CRM_STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeLocalRecords(records) {
  try {
    window.localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(records))
    return true
  } catch {
    return false
  }
}

function normaliseRecord(input = {}, current = {}) {
  const now = new Date().toISOString()
  return {
    ...emptyRecord,
    ...current,
    ...input,
    id: text(input.id || current.id) || createId(),
    sourceType: text(input.sourceType || current.sourceType) || 'manual',
    sourceId: text(input.sourceId || current.sourceId),
    createdAt: text(input.createdAt || current.createdAt) || now,
    updatedAt: now,
    company: text(input.company ?? current.company),
    contact: text(input.contact ?? current.contact),
    country: text(input.country ?? current.country),
    industry: text(input.industry ?? current.industry),
    source: text(input.source ?? current.source) || 'manual',
    status: crmStatuses.includes(input.status) ? input.status : crmStatuses.includes(current.status) ? current.status : 'lead',
    package: text(input.package ?? current.package),
    value: text(input.value ?? current.value),
    nextFollowUp: text(input.nextFollowUp ?? current.nextFollowUp),
    notes: text(input.notes ?? current.notes),
    health: crmHealthStatuses.includes(input.health) ? input.health : crmHealthStatuses.includes(current.health) ? current.health : 'new',
  }
}

function bookingToRecord(booking) {
  return normaliseRecord({
    id: `booking-${booking.id}`,
    sourceType: 'booking',
    sourceId: booking.id,
    createdAt: booking.createdAt,
    company: booking.company,
    contact: booking.fullName,
    country: booking.country,
    industry: booking.industry,
    source: booking.source || 'booking',
    status: booking.status === 'completed' ? 'proposal' : booking.status === 'confirmed' ? 'discovery' : booking.status === 'reviewed' ? 'qualified' : booking.status === 'cancelled' ? 'lost' : 'lead',
    package: booking.interestedPackage || booking.serviceInterest,
    value: booking.monthlyRevenueRange,
    nextFollowUp: booking.preferredDate,
    notes: booking.additionalNotes || booking.primaryChallenge,
    health: booking.status === 'cancelled' ? 'at-risk' : booking.status === 'completed' ? 'healthy' : 'new',
  })
}

function leadToRecord(lead) {
  return normaliseRecord({
    id: `lead-${lead.id}`,
    sourceType: 'lead',
    sourceId: lead.id,
    createdAt: lead.createdAt,
    company: lead.company,
    contact: lead.name,
    country: lead.country,
    industry: lead.businessType,
    source: lead.source || 'AI Sales Agent',
    status: lead.status === 'qualified' ? 'qualified' : lead.status === 'archived' ? 'lost' : 'lead',
    package: lead.interestedPackage,
    notes: lead.challenge || lead.aiSummary,
    health: lead.status === 'qualified' ? 'healthy' : 'new',
  })
}

export function syncCrmSources() {
  const localRecords = readLocalRecords()
  const sourceRecords = [...listBookings().map(bookingToRecord), ...listLeads().map(leadToRecord)]
  const merged = [...localRecords]
  sourceRecords.forEach((sourceRecord) => {
    const index = merged.findIndex((record) => record.sourceType === sourceRecord.sourceType && record.sourceId === sourceRecord.sourceId)
    if (index === -1) merged.push(sourceRecord)
    else merged[index] = { ...sourceRecord, ...merged[index], sourceType: sourceRecord.sourceType, sourceId: sourceRecord.sourceId }
  })
  writeLocalRecords(merged)
  return merged
}

export function listCrmRecords() {
  return syncCrmSources().sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
}

export function saveCrmRecord(input) {
  const records = readLocalRecords()
  const current = records.find((record) => record.id === input.id)
  const record = normaliseRecord(input, current)
  const index = records.findIndex((item) => item.id === record.id)
  if (index === -1) records.push(record)
  else records[index] = record
  return writeLocalRecords(records) ? record : null
}

export function updateCrmRecord(id, patch) {
  const current = listCrmRecords().find((record) => record.id === id)
  return current ? saveCrmRecord({ ...current, ...patch, id }) : null
}

export function deleteCrmRecord(id) {
  const records = readLocalRecords().filter((record) => record.id !== id)
  writeLocalRecords(records)
  return records
}

