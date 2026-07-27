export const PROPOSALS_STORAGE_KEY = 'novahaus_proposals_v1'

function readStore() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(PROPOSALS_STORAGE_KEY) || '{"version":1,"proposals":[]}')
    return { version: 1, proposals: Array.isArray(stored.proposals) ? stored.proposals : [] }
  } catch {
    return { version: 1, proposals: [] }
  }
}

function writeStore(store) {
  try { window.localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(store)); return true } catch { return false }
}

export function listSavedProposals() {
  return readStore().proposals.sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate))
}

export function saveProposal(proposal) {
  const store = readStore()
  const now = new Date().toISOString()
  const next = { ...proposal, updatedDate: now }
  const record = { proposalId: next.proposalId, versionNumber: next.versionNumber, status: next.status, createdDate: next.createdDate, updatedDate: now, client: next.client, company: next.client.company, selectedProduct: next.selectedProduct, proposalData: next }
  const index = store.proposals.findIndex((item) => item.proposalId === next.proposalId && item.versionNumber === next.versionNumber)
  if (index === -1) store.proposals.push(record); else store.proposals[index] = record
  writeStore(store)
  return next
}

export function loadProposal(record) { return record?.proposalData ? JSON.parse(JSON.stringify(record.proposalData)) : null }

export function deleteProposal(proposalId, versionNumber) {
  const store = readStore()
  const next = store.proposals.filter((item) => !(item.proposalId === proposalId && item.versionNumber === versionNumber))
  writeStore({ ...store, proposals: next })
}

export function duplicateProposal(proposal) {
  const copy = JSON.parse(JSON.stringify(proposal))
  copy.proposalId = `proposal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  copy.versionNumber = 1
  copy.status = 'Draft'
  copy.createdDate = new Date().toISOString()
  copy.updatedDate = copy.createdDate
  return copy
}

export function createProposalVersion(proposal) {
  const copy = JSON.parse(JSON.stringify(proposal))
  copy.versionNumber = Number(copy.versionNumber || 1) + 1
  copy.status = 'Draft'
  copy.createdDate = new Date().toISOString()
  copy.updatedDate = copy.createdDate
  return copy
}
