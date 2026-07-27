export const AI_SALES_CONVERSATIONS_KEY = 'novahaus_ai_sales_conversations_v1'
export const AI_SALES_LEADS_KEY = 'novahaus_ai_sales_leads_v1'
export const AI_SALES_ACTIVE_CONVERSATION_KEY = 'novahaus_ai_sales_active_conversation_v1'

function createId(prefix) {
  return globalThis.crypto?.randomUUID?.() || `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function readCollection(key, collection) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || `{"version":1,"${collection}":[]}`)
    return { version: 1, [collection]: Array.isArray(parsed[collection]) ? parsed[collection] : [] }
  } catch {
    return { version: 1, [collection]: [] }
  }
}

function writeCollection(key, collection, items) {
  try { window.localStorage.setItem(key, JSON.stringify({ version: 1, [collection]: items })); return true } catch { return false }
}

export function createSalesAgentId(prefix = 'sales-agent') { return createId(prefix) }

export function saveConversation(conversation) {
  const store = readCollection(AI_SALES_CONVERSATIONS_KEY, 'conversations')
  const next = { ...conversation, updatedAt: new Date().toISOString() }
  const index = store.conversations.findIndex((item) => item.id === next.id)
  if (index === -1) store.conversations.push(next); else store.conversations[index] = next
  writeCollection(AI_SALES_CONVERSATIONS_KEY, 'conversations', store.conversations)
  try { window.localStorage.setItem(AI_SALES_ACTIVE_CONVERSATION_KEY, next.id) } catch { /* storage unavailable */ }
  return next
}

export function loadActiveConversation() {
  try {
    const activeId = window.localStorage.getItem(AI_SALES_ACTIVE_CONVERSATION_KEY)
    if (!activeId) return null
    return readCollection(AI_SALES_CONVERSATIONS_KEY, 'conversations').conversations.find((conversation) => conversation.id === activeId) || null
  } catch { return null }
}

export function saveLead(lead) {
  const store = readCollection(AI_SALES_LEADS_KEY, 'leads')
  const now = new Date().toISOString()
  const next = { ...lead, updatedAt: now, createdAt: lead.createdAt || now }
  const index = store.leads.findIndex((item) => item.id === next.id)
  if (index === -1) store.leads.push(next); else store.leads[index] = next
  writeCollection(AI_SALES_LEADS_KEY, 'leads', store.leads)
  return next
}

export function resetSalesAgentStorage() {
  try {
    window.localStorage.removeItem(AI_SALES_ACTIVE_CONVERSATION_KEY)
    window.localStorage.removeItem(AI_SALES_CONVERSATIONS_KEY)
    window.localStorage.removeItem(AI_SALES_LEADS_KEY)
  } catch { /* storage unavailable */ }
}
