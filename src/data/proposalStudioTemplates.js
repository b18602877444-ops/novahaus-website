import { corePackages } from './pricing.js'
import { getDeliveryScopeById } from './deliveryScope.js'
import { getPortfolioServiceById } from './servicePortfolio.js'

const packageAliases = { Starter: 'Launch', Growth: 'Growth', Enterprise: 'Enterprise' }
const packageTemplates = Object.fromEntries(corePackages.map((item) => [item.name, { label: item.label, deliverables: item.deliverables.slice(0, 6) }]))

export const proposalStudioTemplates = {
  diagnosis: {
    base: 'The current opportunity is to connect positioning, digital experience and operational follow-through into one clearer growth path.',
    withContext: 'The context shared so far gives NOVAHAUS a useful starting point for a more focused recommendation. The next step is to validate priorities, constraints and the sequence of work together.',
    withoutContext: 'This first view is a starting point. Add more business context through the Growth Assessment or a Strategy Call to make the recommendation more specific.',
  },
  opportunities: [
    { title: 'Clarify the offer', body: 'Make the value proposition easier to understand, remember and act on.' },
    { title: 'Strengthen the digital journey', body: 'Turn attention into qualified conversations with a more deliberate path from first impression to enquiry.' },
    { title: 'Remove operational friction', body: 'Identify repeatable tasks that can be connected, streamlined or supported by AI.' },
    { title: 'Create a measurable next stage', body: 'Set a practical sequence of improvements so the work can be reviewed and refined over time.' },
  ],
  plan90Days: [
    { phase: 'Days 01-30', title: 'Clarify', body: 'Align the offer, audience, message and highest-value growth constraint.' },
    { phase: 'Days 31-60', title: 'Build', body: 'Shape the key digital experience and priority systems around the agreed direction.' },
    { phase: 'Days 61-90', title: 'Improve', body: 'Launch, observe the signal and establish the next optimisation cycle.' },
  ],
}

function withContext(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export function generateProposalStudio(context) {
  const company = withContext(context.company, 'your business')
  const challenge = withContext(context.challenge, 'the next stage of growth needs a clearer system')
  const goal = withContext(context.goals, 'create a stronger foundation for qualified opportunities and efficient operations')
  const packageName = packageAliases[context.recommendedPackage] || context.recommendedPackage || 'Launch'
  const packageTemplate = packageTemplates[packageName] || packageTemplates.Launch
  const deliveryScope = context.recommendedServiceIds?.map((serviceId) => getDeliveryScopeById(serviceId) || getPortfolioServiceById(serviceId)).find(Boolean) || null

  return {
    clientName: withContext(context.name, 'Business leadership team'),
    company,
    diagnosis: `${company} is currently focused on ${challenge}. The immediate opportunity is to connect that need with a clearer route toward ${goal}. ${context.hasData ? proposalStudioTemplates.diagnosis.withContext : proposalStudioTemplates.diagnosis.withoutContext}`,
    opportunities: proposalStudioTemplates.opportunities,
    recommendedPackage: { name: packageName, ...packageTemplate },
    deliveryScope,
    plan90Days: proposalStudioTemplates.plan90Days,
    nextStep: 'Book a Strategy Call to review this starting point, confirm the highest-value priorities and decide what should happen first.',
    contextNote: context.hasData ? 'Built from the business context saved in this browser. Confirm priorities together before sharing externally.' : 'This is a directional starting point. Complete the Growth Assessment or share more context to make it specific to the business.',
    contact: {
      email: context.email,
      country: context.country,
      businessType: context.businessType,
      timeline: context.timeline,
    },
    sourceLabels: context.sourceLabels,
  }
}
