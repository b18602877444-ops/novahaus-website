export const proposalProducts = [
  { value: 'AI Growth Launch', label: 'AI Growth Launch', description: 'Positioning, brand and digital foundations for a confident launch.', timeline: '6–10 weeks' },
  { value: 'AI Growth Automation', label: 'AI Growth Automation', description: 'Connected workflows that remove manual friction from growth operations.', timeline: '6–12 weeks' },
  { value: 'Growth Partnership', label: 'Growth Partnership', description: 'Ongoing optimisation and strategic support after launch.', timeline: 'Ongoing monthly engagement' },
  { value: 'Executive Strategy Advisory', label: 'Executive Strategy Advisory', description: 'Private strategic counsel for founders and leadership teams.', timeline: '2–4 weeks' },
  { value: 'Custom Engagement', label: 'Custom Engagement', description: 'A tailored engagement for a business with a specific growth constraint.', timeline: 'To be confirmed' },
]

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
    ['SEO', 'Create a foundation for discoverability around the business priorities.'],
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
  phase: category === 'Strategy' ? 'Phase 1 — Discovery & Strategy' : category === 'Digital Experience' ? 'Phase 2 — Design & Build' : category === 'AI & Automation' ? 'Phase 3 — Automation & Integration' : 'Phase 4 — Launch & Optimisation',
  duration: category === 'Strategy' ? '1–2 weeks' : '1–3 weeks',
})))

export const defaultPhases = [
  { id: 'phase-1', name: 'Phase 1 — Discovery & Strategy', duration: '1–2 weeks', activities: 'Business context, audience, positioning and priorities.', deliverables: 'Strategy direction, message framework and agreed roadmap.' },
  { id: 'phase-2', name: 'Phase 2 — Design & Build', duration: '2–4 weeks', activities: 'Visual direction, experience design and implementation.', deliverables: 'Approved digital experience and supporting brand assets.' },
  { id: 'phase-3', name: 'Phase 3 — Automation & Integration', duration: '1–3 weeks', activities: 'Workflow mapping, CRM connection and practical AI setup.', deliverables: 'Configured workflows, handover notes and team guidance.' },
  { id: 'phase-4', name: 'Phase 4 — Launch & Optimisation', duration: '1 week', activities: 'Quality control, launch and initial performance review.', deliverables: 'Launch-ready system and prioritised optimisation list.' },
]

const template = (summary, approach, scope, timeline) => ({
  executiveSummary: summary,
  recommendedApproach: approach,
  scopeOfWork: scope,
  deliverables: 'A focused set of strategic, digital and operational outputs agreed with the client before work begins.',
  projectPhases: 'The work moves from clarity to execution, with decisions made at each agreed milestone.',
  indicativeTimeline: timeline,
  clientResponsibilities: 'Provide timely access to relevant information, decision makers, feedback and approvals.',
  novahausResponsibilities: 'Lead the agreed strategy, design and implementation work with clear communication and documentation.',
  exclusions: 'Third-party software, advertising spend, taxes, external platform charges and work outside the confirmed scope are excluded unless stated otherwise.',
  nextSteps: 'Confirm the direction, align on scope and timing, then issue the final agreement for acceptance.',
})

export const proposalTemplates = {
  'AI Growth Launch': template(
    'A clear launch foundation for a business that needs its position, offer and digital presence to make sense quickly.',
    'Align the commercial story first, then express it through a focused brand and conversion-led digital experience.',
    'Positioning, messaging, website architecture, landing pages and an AI content foundation.',
    '6–10 weeks, subject to scope, feedback and approval cadence.',
  ),
  'AI Growth Automation': template(
    'A practical operating layer that turns repeatable growth work into connected workflows.',
    'Map the movement of a lead or customer through the business, then connect the tools and AI assistance that make the path easier to manage.',
    'CRM integration, lead workflow, AI assistants, internal processes and email automation.',
    '6–12 weeks, subject to systems access and integration complexity.',
  ),
  'Growth Partnership': template(
    'An ongoing partnership for businesses that need a strategic eye after launch and a disciplined rhythm of improvement.',
    'Review what is happening, decide what matters next and keep the system moving through measured optimisation.',
    'Monthly strategy, analytics, SEO, content, conversion improvement and growth consulting.',
    'Ongoing monthly engagement with priorities agreed each cycle.',
  ),
  'Executive Strategy Advisory': template(
    'Private strategic counsel for founders and leadership teams navigating a consequential next move.',
    'Create the clarity required for a focused decision across positioning, market direction, AI transformation and growth priorities.',
    'Business strategy, market positioning, AI transformation, growth roadmap and international expansion planning.',
    '2–4 weeks for the initial advisory engagement.',
  ),
  'Custom Engagement': template(
    'A tailored engagement built around the constraint, opportunity or transition that matters most right now.',
    'Define the decision, assemble only the capabilities required and create a practical path from current state to next useful outcome.',
    'A confirmed mix of strategy, digital experience, automation and growth operations.',
    'To be confirmed after discovery and scope alignment.',
  ),
}
