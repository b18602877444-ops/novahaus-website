import { getServicePortfolio } from './servicePortfolio.js'

const strategyCta = { ctaType: 'strategy-call', ctaLabel: 'Book Strategy Call', ctaTarget: '/booking/?source=ai-sales-agent' }

function fromPortfolioService(service, cta = strategyCta) {
  return {
    serviceId: service.id,
    title: service.name,
    description: service.businessValue,
    keywords: [...service.keywords, service.categoryName.toLowerCase(), ...service.deliverables.map((item) => item.toLowerCase())],
    ...cta,
  }
}

export const aiSalesServices = [
  { serviceId: 'growth-assessment', title: 'Growth Assessment', description: 'A structured view of the business across strategy, digital presence, automation and growth operations.', keywords: ['assessment', 'diagnostic', 'score', 'where to start'], ctaType: 'assessment', ctaLabel: 'Take the Growth Assessment', ctaTarget: '/growth-assessment/' },
  { serviceId: 'proposal-generator', title: 'Proposal Generator', description: 'A considered scope and next-step document prepared around the context you have shared.', keywords: ['proposal', 'scope', 'quote', 'document'], ctaType: 'proposal', ctaLabel: 'Prepare a Proposal', ctaTarget: '/proposal-builder/' },
  ...getServicePortfolio().map((service) => fromPortfolioService(service, { ...strategyCta, ctaTarget: `/booking/?source=ai-sales-agent&service=${service.id}` })),
]

export function findService(serviceId) {
  const legacyAliases = {
    'website-development': 'ai-systems-ai-growth-website',
    'ai-customer-service': 'ai-systems-ai-sales-agent',
    'business-automation': 'ai-systems-ai-workflow-automation',
    'knowledge-hub': 'ai-systems-ai-knowledge-hub',
    'ai-growth-website': 'ai-systems-ai-growth-website',
    'ai-sales-agent': 'ai-systems-ai-sales-agent',
    'smart-booking-system': 'ai-systems-smart-booking-system',
    'proposal-studio': 'ai-systems-proposal-studio',
    'crm-dashboard': 'ai-systems-crm-dashboard',
    'ai-knowledge-hub': 'ai-systems-ai-knowledge-hub',
    'ai-workflow-automation': 'ai-systems-ai-workflow-automation',
  }
  return aiSalesServices.find((service) => service.serviceId === (legacyAliases[serviceId] || serviceId)) || null
}
