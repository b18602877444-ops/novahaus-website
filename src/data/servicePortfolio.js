import { getAllDeliveryScopes } from './deliveryScope.js'

const customQuotation = 'Custom quotation after assessment'
const defaultOutOfScope = ['Guaranteed rankings, leads, sales or revenue', 'Legal, financial or medical advice', 'Unlicensed or client-owned content not supplied for use']
const defaultResponsibilities = ['Provide accurate business context and source materials', 'Nominate one decision-maker for approvals', 'Provide timely access, feedback and required third-party accounts']

function createService({ id, name, overview, businessValue, deliverables, idealClient, timeline = 'Confirmed after discovery and scope review', standardScope = deliverables, customScope = ['Additional markets, formats, integrations or implementation depth'], outOfScope = defaultOutOfScope, clientResponsibilities = defaultResponsibilities, oneTimeFee = customQuotation, monthlyService = customQuotation, cta = 'Book a Strategy Call', deliveryScopeId = null, keywords = [] }) {
  return {
    id,
    name,
    shortDescription: businessValue,
    overview,
    businessValue,
    deliverables,
    includedDeliverables: deliverables,
    clientResponsibilities,
    standardScope,
    customScope,
    outOfScope,
    timeline,
    estimatedTimeline: timeline,
    oneTimeFee,
    implementationFeeReference: oneTimeFee,
    monthlyService,
    monthlyFeeReference: monthlyService,
    monthlyManagedService: monthlyService,
    supportIncluded: 'Support is confirmed in the selected commercial plan or monthly scope.',
    revisionPolicy: 'Revisions and changes are governed by the agreed scope, review cycles and commercial plan.',
    thirdPartyCosts: [],
    qualificationQuestions: ['What outcome matters most?', 'Who owns approval?', 'Which existing systems or assets are involved?'],
    riskFlags: [],
    finalQuoteNotice: customQuotation === oneTimeFee ? 'Final pricing and delivery timeline are confirmed after NOVAHAUS reviews the project scope, content, integrations, data requirements and implementation complexity.' : 'Final delivery details remain subject to the approved scope and commercial agreement.',
    cta,
    idealClient,
    deliveryScopeId,
    keywords: [name.toLowerCase(), ...keywords],
  }
}

const manualDefaults = {
  clientResponsibilities: ['Provide accurate business context and source materials', 'Nominate one decision-maker for approvals', 'Provide timely access, feedback and required third-party accounts'],
  customScope: ['Additional markets, formats, integrations or implementation depth'],
}

function createManualService({ id, name, overview, businessValue, deliverables, idealClient, timeline, keywords = [], clientResponsibilities = manualDefaults.clientResponsibilities, customScope = manualDefaults.customScope, standardScope = deliverables, monthlyService = customQuotation }) {
  return createService({ id, name, overview, businessValue, deliverables, idealClient, timeline, keywords, clientResponsibilities, customScope, standardScope, monthlyService })
}

const businessStrategy = [
  createManualService({ id: 'business-strategy-ai-business-consulting', name: 'AI Business Consulting', overview: 'A focused review of where AI can support the business without adding unnecessary complexity.', businessValue: 'Translate business priorities into practical AI decisions, boundaries and next steps.', deliverables: ['Business context review', 'AI opportunity map', 'Priority recommendations', 'Decision and risk notes'], idealClient: 'Founders and leadership teams deciding where AI belongs in the operating model.', timeline: '2-4 weeks, depending on discovery depth.', keywords: ['consulting', 'ai consulting', 'ai strategy'] }),
  createManualService({ id: 'business-strategy-business-model-design', name: 'Business Model Design', overview: 'Clarify how the offer creates value, reaches customers and supports a sustainable operating model.', businessValue: 'Make the commercial logic easier for the team and market to understand.', deliverables: ['Business model review', 'Offer architecture', 'Audience and channel mapping', 'Priority experiment plan'], idealClient: 'New ventures and established businesses refining an offer or entering a new market.', timeline: '2-4 weeks, depending on research and stakeholder input.', keywords: ['business model', 'offer'] }),
  createManualService({ id: 'business-strategy-digital-transformation', name: 'Digital Transformation', overview: 'A practical roadmap for improving the digital systems and customer journeys that matter most.', businessValue: 'Sequence change around business priorities instead of purchasing disconnected tools.', deliverables: ['Current-state review', 'Future-state direction', 'System and journey priorities', 'Phased transformation roadmap'], idealClient: 'Teams with several digital priorities that need a clear order of operations.', timeline: '3-6 weeks, depending on organisational complexity.', keywords: ['transformation', 'systems'] }),
  createManualService({ id: 'business-strategy-brand-positioning', name: 'Brand Positioning', overview: 'Define the position, promise and language the market needs to understand.', businessValue: 'Give the business a sharper commercial story that supports better decisions.', deliverables: ['Audience definition', 'Competitive context', 'Positioning statement', 'Messaging architecture'], idealClient: 'Businesses whose value is strong but difficult to explain or differentiate.', timeline: '2-4 weeks, depending on stakeholder alignment.', keywords: ['positioning', 'messaging', 'brand'] }),
  createManualService({ id: 'business-strategy-growth-strategy', name: 'Growth Strategy', overview: 'Identify the next practical growth priorities across offer, experience, systems and operations.', businessValue: 'Turn ambition into a focused sequence of actions that can be reviewed and improved.', deliverables: ['Growth diagnosis', 'Priority opportunity map', '90-day action plan', 'Measurement direction'], idealClient: 'Ambitious businesses with a clear goal but too many competing next steps.', timeline: '2-4 weeks, depending on available business context.', keywords: ['growth', 'roadmap'] }),
  createManualService({ id: 'business-strategy-ai-adoption-roadmap', name: 'AI Adoption Roadmap', overview: 'Plan responsible AI adoption around workflows, people, data and human review.', businessValue: 'Reduce guesswork and make AI adoption easier to govern and act on.', deliverables: ['Workflow opportunity review', 'Use-case prioritisation', 'Human-review model', 'Adoption roadmap'], idealClient: 'Teams moving from AI curiosity to a practical adoption plan.', timeline: '2-5 weeks, depending on workflow and data review.', keywords: ['adoption', 'ai roadmap', 'automation'] }),
]

const brandAssets = [
  ['company-profile', 'Company Profile', 'A clear company narrative and capability document for commercial conversations.', 'Help prospects, partners and stakeholders understand the business quickly.', ['Company story', 'Capability structure', 'Service narrative', 'Designed document']],
  ['business-ppt', 'Business PPT', 'A presentation system for explaining the business, offer and direction with confidence.', 'Give the team a reusable way to communicate important commercial context.', ['Presentation structure', 'Slide content direction', 'Master slide system', 'Export-ready deck']],
  ['pitch-deck', 'Pitch Deck', 'A concise presentation that frames the opportunity, offer and next conversation.', 'Make an important business case easier to follow and discuss.', ['Narrative structure', 'Key message development', 'Slide design', 'Presentation-ready files']],
  ['whitepaper', 'Whitepaper', 'An authoritative long-form document built around a useful business point of view.', 'Turn expertise into a structured asset for education and qualified conversations.', ['Topic framing', 'Editorial structure', 'Content design', 'Distribution-ready document']],
  ['business-plan', 'Business Plan', 'A structured business document that connects direction, offer, market and operating priorities.', 'Create a clearer reference for internal alignment and external discussion.', ['Business context structure', 'Offer and market sections', 'Operating priorities', 'Presentation-ready document']],
  ['sales-proposal', 'Sales Proposal', 'A professional proposal format that makes scope, value and next steps easier to review.', 'Improve commercial clarity without replacing legal review or approval.', ['Proposal structure', 'Scope presentation', 'Timeline section', 'Next-step CTA']],
  ['company-brochure', 'Company Brochure', 'A concise printed or digital introduction to the business and its capabilities.', 'Give the team a polished leave-behind for events, partners and prospects.', ['Content structure', 'Visual direction', 'Responsive or print layout', 'Export-ready brochure']],
  ['digital-business-card', 'Digital Business Card', 'A focused digital profile that makes a person and their next action easy to find.', 'Create a compact, credible touchpoint for networking and follow-up.', ['Profile structure', 'Contact actions', 'Brand styling', 'Responsive page']],
  ['event-poster', 'Event Poster', 'A clear event communication asset shaped around attention, information and action.', 'Help an event or offer stand out without sacrificing legibility.', ['Message hierarchy', 'Event information layout', 'Brand styling', 'Digital export']],
  ['marketing-materials', 'Marketing Materials', 'A coordinated set of commercial assets for a specific campaign, launch or sales moment.', 'Keep the message and visual language consistent across the touchpoints that matter.', ['Asset direction', 'Message adaptation', 'Format production', 'Usage guidance']],
].map(([id, name, overview, businessValue, deliverables]) => createManualService({ id: `brand-commercial-assets-${id}`, name, overview, businessValue, deliverables, idealClient: 'Businesses that need credible, reusable commercial materials around a clear offer.', timeline: '2-6 weeks, depending on content volume and formats.', keywords: ['commercial assets', 'document', 'presentation'] }))

const mediaContent = [
  ['product-demo-video', 'Product Demo Video', 'A structured product demonstration that shows the experience, use case and next step.', 'Make a product easier to understand through clear, purposeful visual explanation.', ['Demo narrative', 'Screen-recording plan', 'Edit direction', 'Platform-ready cut']],
  ['promotional-video', 'Promotional Video', 'A concise brand or offer film built around a specific commercial message.', 'Create a focused reason for the right audience to pay attention and continue.', ['Creative direction', 'Shot list', 'Voice-over or caption direction', 'Edited master']],
  ['social-media-video', 'Social Media Video', 'Short-form video content adapted to the rhythm and requirements of a selected platform.', 'Give the business a repeatable way to communicate useful ideas consistently.', ['Content angle', 'Short-form edit', 'Caption and CTA direction', 'Platform export']],
  ['founder-ip-content', 'Founder IP Content', 'A content system that turns founder expertise into a recognisable point of view.', 'Build authority through clear, repeatable ideas rather than generic posting.', ['Point-of-view themes', 'Episode formats', 'Recording prompts', 'Repurposing direction']],
  ['short-video-packages', 'Short Video Packages', 'A planned set of short videos built around one business theme or campaign.', 'Create production consistency while keeping every piece tied to a commercial purpose.', ['Content plan', 'Batch shot list', 'Editing notes', 'Publishing-ready files']],
  ['linkedin-content', 'LinkedIn Content', 'Professional content shaped for expertise, business clarity and thoughtful engagement.', 'Help the team communicate insight in a way that supports commercial trust.', ['Editorial themes', 'Post drafts', 'Visual direction', 'Publishing guidance']],
  ['xiaohongshu-content', 'Xiaohongshu Content', 'Content adapted for practical discovery, education and brand presence on Xiaohongshu.', 'Translate the business point of view into a platform-aware editorial system.', ['Content pillars', 'Post concepts', 'Visual and caption direction', 'Publishing guidance']],
  ['youtube-content', 'YouTube Content', 'Long- or short-form video direction built around a clear topic, audience and viewing journey.', 'Make useful expertise easier to discover, understand and revisit.', ['Episode concepts', 'Structure and script direction', 'Thumbnail guidance', 'Publishing checklist']],
  ['ai-content-planning', 'AI Content Planning', 'A practical content planning system that uses AI to support research, structure and repurposing.', 'Reduce planning friction while keeping human judgement and brand standards in control.', ['Content pillars', 'Prompt and workflow setup', 'Editorial calendar', 'Human-review rules']],
].map(([id, name, overview, businessValue, deliverables]) => createManualService({ id: `media-content-${id}`, name, overview, businessValue, deliverables, idealClient: 'Founders and teams that need a clearer, repeatable content presence around a real business point of view.', timeline: '2-6 weeks, depending on formats, volume and source material.', keywords: ['media', 'content', 'video'] }))

const aiSystemNames = [
  ['ai-growth-website', 'AI Growth Website'],
  ['ai-sales-agent', 'AI Sales Agent'],
  ['smart-booking-system', 'Smart Booking'],
  ['proposal-studio', 'Proposal Studio'],
  ['crm-dashboard', 'CRM Dashboard'],
  ['ai-knowledge-hub', 'Knowledge Hub'],
  ['ai-workflow-automation', 'Workflow Automation'],
]

const aiSystems = aiSystemNames.map(([deliveryScopeId, displayName]) => {
  const scope = getAllDeliveryScopes().find((item) => item.id === deliveryScopeId)
  return createService({
    id: `ai-systems-${deliveryScopeId}`,
    name: displayName,
    overview: scope.overview,
    businessValue: scope.shortDescription,
    deliverables: scope.includedDeliverables,
    clientResponsibilities: scope.clientResponsibilities,
    standardScope: scope.standardScope,
    customScope: scope.customScope,
    outOfScope: scope.outOfScope,
    timeline: scope.estimatedTimeline,
    oneTimeFee: scope.implementationFeeReference,
    monthlyService: scope.monthlyFeeReference,
    idealClient: scope.bestFor,
    deliveryScopeId,
    keywords: scope.keywords,
  })
})

const managedGrowth = [
  ['monthly-ai-optimization', 'Monthly AI Optimization', 'Ongoing review and improvement for the AI-enabled parts of the business.', 'Keep AI workflows, knowledge and customer experiences useful as the business changes.', ['Monthly review', 'Prompt and workflow optimisation', 'Issue and opportunity log', 'Improvement recommendations']],
  ['content-planning', 'Content Planning', 'A recurring editorial system built around business priorities and available expertise.', 'Make content decisions easier to maintain and connect them to commercial context.', ['Monthly content themes', 'Editorial calendar', 'Repurposing opportunities', 'Review cadence']],
  ['website-maintenance', 'Website Maintenance', 'Practical care for the website content, structure and small improvements after launch.', 'Protect the usefulness and clarity of the digital front door over time.', ['Content updates', 'Minor fixes', 'Quality checks', 'Improvement backlog']],
  ['crm-support', 'CRM Support', 'Ongoing support for pipeline structure, records, follow-up logic and team usage.', 'Keep the pipeline visible and the data structure aligned with the workflow.', ['Field and status support', 'Minor workflow changes', 'Data-structure review', 'Usage guidance']],
  ['knowledge-hub-updates', 'Knowledge Hub Updates', 'A managed cadence for keeping approved knowledge organised, current and useful.', 'Reduce content drift and improve the quality of future answers and reuse.', ['Content update process', 'Indexing review', 'FAQ maintenance', 'Quality review']],
  ['growth-consulting', 'Growth Consulting', 'A recurring strategic conversation around priorities, constraints and the next useful move.', 'Keep improvement connected to the business rather than isolated tasks.', ['Monthly strategy session', 'Priority review', 'Decision notes', 'Next-step recommendations']],
  ['ai-business-partner', 'AI Business Partner', 'A senior ongoing partnership for businesses building AI into how they operate and grow.', 'Provide continuity across strategy, systems and the decisions that connect them.', ['Strategic advisory', 'AI opportunity review', 'System prioritisation', 'Monthly operating rhythm']],
].map(([id, name, overview, businessValue, deliverables]) => createManualService({ id: `managed-growth-${id}`, name, overview, businessValue, deliverables, idealClient: 'Businesses that have a live system or clear priority and want continued strategic and operational support.', timeline: 'Ongoing monthly engagement, starting after a scope and cadence review.', monthlyService: 'Defined monthly capacity and scope confirmed after assessment.', keywords: ['managed growth', 'retainer', 'monthly', 'support'] }))

export const serviceCategories = [
  { id: 'business-strategy', number: '01', name: 'Business Strategy', description: 'Clarify the commercial direction before selecting the next system.', services: businessStrategy },
  { id: 'brand-commercial-assets', number: '02', name: 'Brand & Commercial Assets', description: 'Give the business the materials it needs to explain, sell and move.', services: brandAssets },
  { id: 'media-content', number: '03', name: 'Media & Content', description: 'Turn expertise and offers into a consistent, useful presence.', services: mediaContent },
  { id: 'ai-systems', number: '04', name: 'AI Systems', description: 'Connect digital experience, lead flow and practical automation.', services: aiSystems },
  { id: 'managed-growth', number: '05', name: 'Managed Growth', description: 'Keep the system useful through ongoing optimisation and partnership.', services: managedGrowth },
]

export const servicePortfolio = serviceCategories.flatMap((category) => category.services.map((service) => ({ ...service, categoryId: category.id, categoryName: category.name })))

export function getServicePortfolio() {
  return servicePortfolio
}

export function getPortfolioServiceById(id) {
  if (!id) return null
  const aliases = { 'website-development': 'ai-systems-ai-growth-website', 'ai-customer-service': 'ai-systems-ai-sales-agent', 'business-automation': 'ai-systems-ai-workflow-automation', 'knowledge-hub': 'ai-systems-ai-knowledge-hub', 'ai-growth-website': 'ai-systems-ai-growth-website', 'ai-sales-agent': 'ai-systems-ai-sales-agent', 'smart-booking-system': 'ai-systems-smart-booking-system', 'proposal-studio': 'ai-systems-proposal-studio', 'crm-dashboard': 'ai-systems-crm-dashboard', 'ai-knowledge-hub': 'ai-systems-ai-knowledge-hub', 'ai-workflow-automation': 'ai-systems-ai-workflow-automation' }
  return servicePortfolio.find((service) => service.id === (aliases[id] || id)) || null
}

export function getPortfolioServiceForText(text = '') {
  const value = String(text).toLowerCase()
  return servicePortfolio.map((service) => ({ service, matches: service.keywords.filter((keyword) => value.includes(keyword)).length })).filter(({ matches }) => matches > 0).sort((a, b) => b.matches - a.matches)[0]?.service || null
}

export const servicePortfolioPolicy = {
  positioning: 'Your AI Business Growth Partner',
  finalQuoteNotice: 'Final pricing and delivery timeline are confirmed after NOVAHAUS reviews the project scope, content, integrations, data requirements and implementation complexity.',
  excludedClaims: ['Guaranteed growth, leads, sales or revenue', 'Investment, financial, legal or medical advice', 'High-risk enterprise systems without specialist review'],
}
