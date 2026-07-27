const packageTemplates = {
  Starter: {
    label: 'A focused foundation for a clearer market position.',
    deliverables: ['Positioning and message direction', 'Conversion-ready website structure', 'Lead capture foundations', 'A practical first automation roadmap'],
  },
  Growth: {
    label: 'A connected system for teams ready to improve how growth works.',
    deliverables: ['Growth strategy and conversion priorities', 'Website and lead journey improvements', 'CRM and AI workflow opportunities', 'Measurement plan for the next stage'],
  },
  Enterprise: {
    label: 'A tailored operating system for complex growth and transformation work.',
    deliverables: ['Leadership-level growth diagnosis', 'Multi-channel digital experience plan', 'Automation and integration architecture', 'Ongoing optimisation direction'],
  },
}

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
  const packageName = context.recommendedPackage || 'Starter'
  const packageTemplate = packageTemplates[packageName] || packageTemplates.Starter

  return {
    clientName: withContext(context.name, 'Business leadership team'),
    company,
    diagnosis: `${company} is currently focused on ${challenge}. The immediate opportunity is to connect that need with a clearer route toward ${goal}. ${context.hasData ? proposalStudioTemplates.diagnosis.withContext : proposalStudioTemplates.diagnosis.withoutContext}`,
    opportunities: proposalStudioTemplates.opportunities,
    recommendedPackage: { name: packageName, ...packageTemplate },
    plan90Days: proposalStudioTemplates.plan90Days,
    nextStep: 'Book a Strategy Call to review this starting point, confirm the highest-value priorities and decide what should happen first.',
    contextNote: context.hasData ? 'Template-generated from information available in this browser. Review the context together before sharing externally.' : 'Template-generated as a general starting point. Complete an assessment or share your context to make it more specific.',
    contact: {
      email: context.email,
      country: context.country,
      businessType: context.businessType,
      timeline: context.timeline,
    },
    sourceLabels: context.sourceLabels,
  }
}
