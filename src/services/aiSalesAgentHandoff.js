const safeValue = (value, limit = 100) => String(value || '').trim().slice(0, limit)

export function buildBookingHandoffHref(context = {}) {
  const params = new URLSearchParams()
  params.set('source', 'ai-sales-consultant')
  const safeContext = {
    customerType: safeValue(context.customerType),
    recommendedOffer: safeValue(context.recommendedOffer),
    projectStage: safeValue(context.projectStage),
  }
  Object.entries(safeContext).forEach(([key, value]) => { if (value) params.set(key, value) })
  return `/booking/?${params.toString()}`
}

export function buildProposalDiscoveryContext(conversation = {}) {
  const context = conversation.context || {}
  const recommendation = conversation.recommendations?.[0]
  return {
    source: 'ai-sales-consultant',
    customerType: safeValue(context.customerType),
    projectStage: safeValue(context.projectStage),
    mainProblem: safeValue(context.immediateNeed),
    requiredDeliverables: safeValue(context.requiredDeliverables, 500),
    existingMaterials: safeValue(context.existingMaterials, 500),
    platforms: safeValue(context.platforms),
    languages: safeValue(context.languages),
    timeline: safeValue(context.timeline),
    budgetRange: safeValue(context.budget),
    complianceFlags: safeValue(context.complianceFlag),
    recommendedOffer: safeValue(recommendation?.title),
    approvedAddOnsDiscussed: [],
    unresolvedQuestions: [],
  }
}
