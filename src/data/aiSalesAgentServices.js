import { getDeliveryScopeById } from './deliveryScope.js'
import { getServicePortfolio } from './servicePortfolio.js'

const strategyCta = { ctaType: 'strategy-call', ctaLabel: 'Book Strategy Call', ctaTarget: '/booking/?source=ai-sales-agent' }

function fromDeliveryScope(serviceId, scopeId, title, extraKeywords = [], cta = strategyCta) {
  const scope = getDeliveryScopeById(scopeId)
  return { serviceId, title, description: scope?.shortDescription || '', keywords: [...(scope?.keywords || []), ...extraKeywords], ...cta }
}

export const aiSalesServices = [
  { serviceId: 'growth-assessment', title: 'Growth Assessment', description: 'A structured view of the business across strategy, digital presence, automation and growth operations.', keywords: ['assessment', 'diagnostic', 'score', 'where to start'], ctaType: 'assessment', ctaLabel: 'Take the Growth Assessment', ctaTarget: '/growth-assessment/' },
  { serviceId: 'proposal-generator', title: 'Proposal Generator', description: 'A considered scope and next-step document prepared around the context you have shared.', keywords: ['proposal', 'scope', 'quote', 'document'], ctaType: 'proposal', ctaLabel: 'Prepare a Proposal', ctaTarget: '/proposal-builder/' },
  fromDeliveryScope('website-development', 'ai-growth-website', 'Website Development', ['web site', 'digital presence']),
  fromDeliveryScope('ai-customer-service', 'ai-sales-agent', 'AI Customer Service', ['customer service', 'support', 'customer experience']),
  fromDeliveryScope('ai-sales-agent', 'ai-sales-agent', 'AI Sales Agent', ['sales', 'sales process']),
  fromDeliveryScope('business-automation', 'ai-workflow-automation', 'Business Automation', ['crm', 'operations', 'manual']),
  fromDeliveryScope('knowledge-hub', 'ai-knowledge-hub', 'Knowledge Hub', ['knowledge base', 'content system', 'documentation']),
  ...getServicePortfolio().filter((service) => service.categoryId !== 'ai-systems').map((service) => ({ serviceId: service.id, title: service.name, description: service.businessValue, keywords: [...service.keywords, ...service.deliverables.map((item) => item.toLowerCase())], ctaType: 'strategy-call', ctaLabel: 'Book Strategy Call', ctaTarget: `/booking/?source=ai-sales-agent&service=${service.id}` })),
]

export function findService(serviceId) {
  return aiSalesServices.find((service) => service.serviceId === serviceId) || null
}
