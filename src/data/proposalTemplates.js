import { growthOperationsPlans } from './growthOperationsPlans.js'

export const proposalProducts = growthOperationsPlans.map((plan) => ({
  value: plan.name,
  label: plan.name,
  description: plan.proposalSummary,
  timeline: 'Onboarding timing is confirmed after content requirements, operational volume, platforms, compliance risks and integrations are reviewed.',
}))

const sharedScope = {
  Strategy: [
    ['Business positioning', 'Clarify the business position, audience and commercial point of view.'],
    ['Offer architecture', 'Structure the offer so the right customer can understand the next step.'],
    ['Messaging', 'Create a practical message system for the website and sales conversations.'],
    ['Growth roadmap', 'Translate the current situation into a sequenced set of useful moves.'],
  ],
  'Digital Experience': [
    ['Website', 'Design and build the core digital experience around conversion and clarity.'],
    ['Landing pages', 'Create focused entry points for priority offers or campaigns.'],
    ['Conversion architecture', 'Shape page hierarchy, calls to action and enquiry paths.'],
    ['Analytics setup', 'Define the measurement points needed to understand performance.'],
  ],
  'AI & Automation': [
    ['CRM integration', 'Connect enquiry and customer data to the operating workflow.'],
    ['Lead workflow', 'Map follow-up steps so qualified opportunities do not disappear.'],
    ['AI assistants', 'Identify practical assistant use cases that save the team time.'],
    ['Email automation', 'Prepare useful, consent-aware sequences for the right moments.'],
    ['Internal workflow automation', 'Reduce repeatable manual work across the operating layer.'],
  ],
  'Growth Operations': [
    ['Content system', 'Design a repeatable content structure the team can maintain.'],
    ['Conversion optimisation', 'Improve the points where attention should become action.'],
    ['Reporting', 'Create a simple reporting rhythm for decisions, not vanity metrics.'],
    ['Monthly strategy support', 'Provide ongoing direction as the market and business develop.'],
  ],
}

export const defaultScopeItems = Object.entries(sharedScope).flatMap(([category, items]) => items.map(([title, description], index) => ({
  id: `scope-${category.toLowerCase().replace(/[^a-z]+/g, '-')}-${index + 1}`,
  category,
  title,
  description,
  inclusion: 'Included',
  phase: category === 'Strategy' ? 'Phase 1 - Discovery & Strategy' : category === 'Digital Experience' ? 'Phase 2 - Design & Build' : category === 'AI & Automation' ? 'Phase 3 - Automation & Integration' : 'Phase 4 - Launch & Optimisation',
  duration: category === 'Strategy' ? '1-2 weeks' : '1-3 weeks',
})))

export const defaultPhases = [
  { id: 'phase-1', name: 'Phase 1 - Discovery & Strategy', duration: '1-2 weeks', activities: 'Business context, audience, positioning and priorities.', deliverables: 'Strategy direction, message framework and agreed roadmap.' },
  { id: 'phase-2', name: 'Phase 2 - Design & Build', duration: '2-4 weeks', activities: 'Visual direction, experience design and implementation.', deliverables: 'Approved digital experience and supporting commercial assets.' },
  { id: 'phase-3', name: 'Phase 3 - Automation & Integration', duration: '1-3 weeks', activities: 'Workflow mapping, CRM connection and practical AI setup.', deliverables: 'Configured workflows, handover notes and team guidance.' },
  { id: 'phase-4', name: 'Phase 4 - Launch & Optimisation', duration: '1 week', activities: 'Quality control, launch and initial performance review.', deliverables: 'Launch-ready system and prioritised optimisation list.' },
]

function template(plan) {
  return {
    executiveSummary: plan.proposalSummary,
    recommendedApproach: plan.aiSalesSummary,
    scopeOfWork: plan.monthlyStandardCapacity.join(', '),
    deliverables: plan.monthlyStandardCapacity.join(', '),
    projectPhases: 'The work moves from discovery to the first implementation phase, with decisions made at each agreed milestone.',
    indicativeTimeline: 'Onboarding timing is confirmed after content requirements, operational volume, platforms, compliance risks and integrations are reviewed.',
    clientResponsibilities: plan.clientResponsibilities.join(' '),
    novahausResponsibilities: 'Lead the agreed strategy, design and implementation work with clear communication and documentation.',
    exclusions: plan.exclusions.join(' '),
    nextSteps: `${plan.finalQuoteNotice} Book a Strategy Call to validate the operating context and prepare the final proposal.`,
  }
}

export const proposalTemplates = Object.fromEntries(growthOperationsPlans.map((plan) => [plan.name, template(plan)]))
