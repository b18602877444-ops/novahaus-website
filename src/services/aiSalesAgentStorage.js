import { initialSalesAgentWelcome } from '../utils/aiSalesAgent/conversationEngine.js'
import { aiSalesConsultantKnowledgeVersion } from '../data/aiSalesConsultantConfig.js'
import { buildLeadSummary } from '../data/leadSchema.js'
import { LEADS_STORAGE_KEY, saveLeadRecord, clearLeads } from './leadStorage.js'

export const AI_SALES_CONVERSATIONS_KEY = 'novahaus_ai_sales_conversations_v1'
export const AI_SALES_LEADS_KEY = LEADS_STORAGE_KEY
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
    const conversation = readCollection(AI_SALES_CONVERSATIONS_KEY, 'conversations').conversations.find((item) => item.id === activeId) || null
    if (!conversation) return null
    if (conversation.context?.commercialKnowledgeVersion !== aiSalesConsultantKnowledgeVersion) return null
    const firstMessage = conversation.messages?.[0]
    if (firstMessage?.role === 'agent' && firstMessage.content === 'Welcome to NOVAHAUS. Tell me what you are working on, and I will help clarify the most useful next step.') return { ...conversation, messages: [{ ...firstMessage, content: initialSalesAgentWelcome }, ...conversation.messages.slice(1)] }
    return conversation
  } catch { return null }
}

export function saveLead(lead) {
  const next = { ...lead, businessType: lead.businessType || lead.industry, challenge: lead.challenge || lead.painPoints?.[0] || lead.goals?.[0], interestedPackage: lead.interestedPackage || lead.package || '', aiSummary: lead.aiSummary || buildLeadSummary(lead) }
  return saveLeadRecord(next)
}

export function resetSalesAgentStorage() {
  try {
    window.localStorage.removeItem(AI_SALES_ACTIVE_CONVERSATION_KEY)
    window.localStorage.removeItem(AI_SALES_CONVERSATIONS_KEY)
    window.localStorage.removeItem('novahaus_ai_sales_leads_v1')
    clearLeads()
  } catch { /* storage unavailable */ }
}
