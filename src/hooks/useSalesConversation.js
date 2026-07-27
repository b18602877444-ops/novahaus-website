import { useCallback, useEffect, useRef, useState } from 'react'
import { aiSalesAgentBudgets, aiSalesAgentIndustries, aiSalesAgentTimelines } from '../data/aiSalesAgentScript.js'
import { advanceConversation, completeConversation, createInitialConversation } from '../utils/aiSalesAgent/conversationEngine.js'
import { calculateLeadQualification } from '../utils/aiSalesAgent/qualification.js'
import { createSalesAgentId, loadActiveConversation, resetSalesAgentStorage, saveConversation, saveLead } from '../services/aiSalesAgentStorage.js'

const emptyLead = { id: '', name: '', company: '', email: '', whatsapp: '', industry: '', country: '', budget: '', timeline: '', goals: [], painPoints: [], leadScore: 0, leadTemperature: 'Cold Lead', recommendedServices: [], source: 'ai-sales-agent', createdAt: '', updatedAt: '' }

function getConversationText(conversation) {
  return conversation.messages.filter((message) => message.role === 'user').map((message) => message.content).join(' ')
}

function normaliseLeadInput(input, draft = {}) {
  return { ...emptyLead, ...draft, ...input, goals: Array.isArray(input.goals) ? input.goals.filter(Boolean) : String(input.goals || '').split(',').map((item) => item.trim()).filter(Boolean), painPoints: Array.isArray(input.painPoints) ? input.painPoints.filter(Boolean) : String(input.painPoints || '').split(',').map((item) => item.trim()).filter(Boolean), source: 'ai-sales-agent' }
}

export function useSalesConversation() {
  const [conversation, setConversation] = useState(() => loadActiveConversation() || createInitialConversation(() => createSalesAgentId('message')))
  const [lead, setLead] = useState(() => ({ ...emptyLead }))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const conversationRef = useRef(conversation)

  useEffect(() => { conversationRef.current = conversation; saveConversation(conversation) }, [conversation])

  const sendMessage = useCallback((input) => {
    const value = input.trim()
    if (!value || isLoading) return
    setError('')
    setIsLoading(true)
    const base = conversationRef.current
    window.setTimeout(() => {
      try {
        const result = advanceConversation(base, value, () => createSalesAgentId('message'))
        const nextLead = normaliseLeadInput(result.leadPatch, base.leadDraft)
        const qualification = calculateLeadQualification({ conversationText: getConversationText(result.conversation), lead: nextLead, existingSignals: base.qualification?.signals || [] })
        const next = { ...result.conversation, qualification, leadDraft: nextLead }
        conversationRef.current = next
        setConversation(next)
      } catch {
        setError('The conversation could not continue. Please try again.')
      } finally { setIsLoading(false) }
    }, 320)
  }, [isLoading])

  const submitLead = useCallback((input) => {
    const base = conversationRef.current
    const draft = normaliseLeadInput(input, base.leadDraft)
    const leadWithId = { ...draft, id: draft.id || createSalesAgentId('lead') }
    const qualification = calculateLeadQualification({ conversationText: getConversationText(base), lead: leadWithId, existingSignals: base.qualification?.signals || [] })
    const completed = completeConversation({ ...base, leadDraft: leadWithId, qualification }, leadWithId, () => createSalesAgentId('message'))
    const nextLead = { ...leadWithId, leadScore: qualification.score, leadTemperature: qualification.temperature, recommendedServices: completed.recommendations.map((item) => item.serviceId), conversationId: completed.id }
    const next = { ...completed, qualification, leadDraft: nextLead }
    saveLead(nextLead)
    saveConversation(next)
    conversationRef.current = next
    setLead(nextLead)
    setConversation(next)
    setError('')
  }, [])

  const createProposalPayload = useCallback(() => ({
    conversationId: conversationRef.current.id,
    leadId: lead.id || conversationRef.current.leadId,
    lead: lead.id ? lead : normaliseLeadInput(conversationRef.current.leadDraft),
    recommendedProduct: conversationRef.current.recommendations?.[0]?.title || '',
    recommendedServices: conversationRef.current.recommendations || [],
    conversationSummary: getConversationText(conversationRef.current),
  }), [lead])

  const reset = useCallback(() => {
    resetSalesAgentStorage()
    const next = createInitialConversation(() => createSalesAgentId('message'))
    conversationRef.current = next
    setConversation(next)
    setLead({ ...emptyLead })
    setError('')
    setIsLoading(false)
  }, [])

  return { conversation, lead, isLoading, error, sendMessage, submitLead, createProposalPayload, reset, budgetOptions: aiSalesAgentBudgets, industryOptions: aiSalesAgentIndustries, timelineOptions: aiSalesAgentTimelines }
}
