import {
  approvedGrowthOperationsAddOns,
  growthOperationsClientResponsibilities,
  growthOperationsFinalQuoteNotice,
  growthOperationsPlans,
  growthOperationsStandardExclusions,
} from './growthOperationsPlans.js'
import { web3LaunchPackage } from './web3LaunchPackage.js'
import { leadIntelligenceVersion, leadHandoffRules, leadScoreFactors, leadScoreLevels } from './leadIntelligence.js'
import { leadDeliveryVersion, leadMagnetCatalog } from './leadMagnetCatalog.js'

export const commercialKnowledgeVersion = '2026-07-ai-sales-consultant-v1'

export const commercialKnowledge = {
  version: commercialKnowledgeVersion,
  leadDeliveryVersion,
  leadMagnets: leadMagnetCatalog.resources,
  chinaToGlobal: {
    title: 'China-to-Global Growth Operations',
    positioning: 'One coordinated Growth Operations Team for Chinese businesses entering international markets.',
    heroDescription: 'NOVAHAUS helps Chinese businesses move into international markets with clear positioning, coordinated production, professional review and ongoing operations — without building the full overseas function first.',
    traditionalApproach: [
      'Hire an overseas team before the operating model is clear',
      'Manage separate vendors for brand, content and commercial materials',
      'Coordinate work across time zones and handoffs',
      'Navigate language and market-context gaps alone',
      'Carry the full operating cost before the rhythm is proven',
    ],
    novaHausApproach: [
      'One coordinated Growth Operations Team',
      'One shared brief, review rhythm and delivery owner',
      'Clear English-language positioning and commercial assets',
      'Structured production with professional human review',
      'Defined operations capacity that can expand with the business',
    ],
    capabilities: [
      { title: 'Brand', description: 'Position the business so international audiences can understand its value quickly.' },
      { title: 'Narrative', description: 'Turn complex products, expertise and market ambition into a clear story.' },
      { title: 'Website', description: 'Create an English-language digital presence designed for the next conversation.' },
      { title: 'Commercial Assets', description: 'Prepare company profiles, decks, proposals and sales materials for global use.' },
      { title: 'LinkedIn', description: 'Build a consistent professional presence for founders and business teams.' },
      { title: 'Content', description: 'Plan and produce a dependable rhythm across the channels that matter.' },
      { title: 'Proposal', description: 'Make international enquiries easier to qualify, scope and move forward.' },
      { title: 'Ongoing Operations', description: 'Keep the work coordinated after launch through defined monthly capacity.' },
    ],
    demonstration: {
      label: 'Illustrative demonstration scenario',
      title: 'A simpler route into the next market.',
      description: 'In this anonymous scenario, a Chinese industrial business preparing for overseas expansion needs a credible English presence, commercial materials and a steady content rhythm. Instead of building an overseas department first, the business works with NOVAHAUS through one shared brief and one coordinated delivery rhythm.',
      steps: [
        'Clarify the overseas positioning and narrative.',
        'Prepare the website, company profile, business deck and proposal materials.',
        'Establish LinkedIn and content production priorities.',
        'Continue through a defined review and monthly operations rhythm.',
      ],
      outcome: 'The demonstration outcome is reduced operating complexity: fewer handoffs, clearer ownership and one connected route from market story to ongoing delivery. It is a service-model illustration, not a real client result.',
    },
  },
  positioning: {
    category: 'Your Growth Operations Team',
    strategy: 'Brand Broad. Market Focus. Web3 First. Global Next.',
    heroEyebrow: 'GROWTH OPERATIONS',
    heroHeadline: 'Your Growth Operations Team.',
    heroParagraph: 'NOVAHAUS brings strategy, coordinated production, professional review and ongoing operations into one accountable team — so your business can move with more clarity and less coordination burden.',
    marketFocus: 'Currently deepest in Web3 and crypto project operations. Also serving China-to-global teams and personal brands.',
    trustLine: 'Strategy-led. Professionally managed. Human-reviewed.',
  },
  customerGroups: [
    {
      id: 'web3-crypto-project-teams',
      title: 'Web3 & Crypto Project Teams',
      assessmentLabel: 'Project & Community Operators',
      label: 'Our Deepest Current Focus',
      description: 'For legitimate infrastructure, membership and community projects that need a credible narrative, launch assets and consistent communications without unsupported financial claims.',
      needs: ['Project narrative', 'Whitepaper', 'Pitch Deck', 'Community announcements', 'AMA campaigns', 'Promotional graphics', 'Short-video scripts', 'Partner Proposal', 'Monthly content operations'],
      complianceNote: 'NOVAHAUS does not provide investment advice, fundraising guarantees, token-price promotion or guaranteed community growth.',
    },
    {
      id: 'china-to-global-teams',
      title: 'China-to-Global Teams',
      assessmentLabel: 'China-to-Global SME Operators',
      label: 'Expanding Market Focus',
      description: 'For teams entering international markets that need clear English-language positioning, commercial materials and a dependable content operating rhythm.',
      needs: ['English Company Profile', 'International business PPT', 'Product brochure', 'Landing-page content', 'Multilingual promotional assets', 'AI Sales support', 'Proposal and lead-flow materials'],
    },
    {
      id: 'creators-personal-brands',
      title: 'Creators & Personal Brands',
      assessmentLabel: 'Creator & Personal Brand Operators',
      label: 'Founder-Led Growth',
      description: 'For experts and founders turning a point of view into a coherent brand, media presence and repeatable content system.',
      needs: ['Brand narrative', 'Content planning', 'Short-video scripts', 'Edited short-form videos', 'Posters and covers', 'Platform-specific captions', 'Landing-page updates', 'AI enquiry support'],
    },
  ],
  capabilities: [
    { number: 'A', title: 'Narrative & Whitepaper', description: 'Turn complex ideas into a clear story people can understand and use.', items: ['Project positioning', 'Narrative framework', 'Standard whitepaper drafts', 'Existing whitepaper updates', 'FAQ and message consistency', 'Human review checkpoints'] },
    { number: 'B', title: 'Pitch & Commercial Assets', description: 'Give sales, partnership and market conversations the material they need.', items: ['Pitch Decks', 'Company and Project Profiles', 'Partner Proposals', 'Business PPTs', 'Landing-page copy', 'Campaign materials'] },
    { number: 'C', title: 'Community & Social Content', description: 'Maintain a consistent, credible rhythm across the channels that matter.', items: ['Community announcements', 'Educational content', 'AMA campaign packages', 'Promotional posters', 'Short-video scripts', 'Platform-specific copy', 'Knowledge-base updates'] },
    { number: 'D', title: 'Supporting Digital Systems', description: 'Connect practical digital systems to the work without presenting tools as the product.', items: ['AI Sales Agent', 'Booking flow', 'Lightweight CRM', 'Proposal Studio', 'Knowledge Hub', 'Approved workflow automation', 'Website and landing-page implementation'], note: 'Supporting digital systems are engagement components, not standalone primary products.' },
  ],
  monthlyDepartments: growthOperationsPlans,
  launchPackage: web3LaunchPackage,
  approvedAddOns: approvedGrowthOperationsAddOns,
  clientResponsibilities: growthOperationsClientResponsibilities,
  standardExclusions: growthOperationsStandardExclusions,
  finalQuoteNotice: growthOperationsFinalQuoteNotice,
  leadIntelligence: {
    version: leadIntelligenceVersion,
    scoreLevels: leadScoreLevels,
    scoreFactors: leadScoreFactors,
    handoffRules: leadHandoffRules,
    principle: 'Lead scores organise follow-up priority. They are not a guarantee of fit, revenue or business outcomes.',
  },
  humanReviewPrinciple: 'Structured workflows support delivery. Professional review remains where accuracy, reputation and compliance matter.',
  complianceBoundaries: ['No investment advice', 'No token sales or fundraising advice', 'No legal, tax, medical or financial advice', 'Client confirms factual and regulated claims before publication'],
  nonGuaranteeStatements: ['No guaranteed leads, sales, revenue, fundraising, listings, token performance or community growth.', 'Final scope, capacity and investment are confirmed after human review.'],
  operatingComparison: {
    traditional: ['Multiple hires or vendors', 'Fragmented communication', 'Inconsistent narrative and brand', 'Variable production speed', 'High coordination burden', 'Separate tools and workflows'],
    novaHaus: ['One coordinated operations team', 'Defined monthly capacity', 'Shared narrative and brand direction', 'Coordinated professional production', 'Human review before delivery', 'Clear add-on pricing for additional volume'],
    note: 'Actual cost differences depend on team structure, location, content volume and internal management requirements.',
  },
  deliveryProcess: [
    { number: '01', title: 'Diagnose', description: 'Review stage, audience, materials, platforms, risks and monthly output.' },
    { number: '02', title: 'Define', description: 'Confirm engagement, deliverables, capacity, responsibilities, review process and investment.' },
    { number: '03', title: 'Produce', description: 'Plan and produce approved work through AI-assisted workflows and professional human review.' },
    { number: '04', title: 'Operate', description: 'Continue through agreed planning, delivery and review cycles.' },
  ],
  deliveryFramework: [
    {
      number: '01',
      title: 'Discovery',
      whatHappens: 'We understand the business, target market, current materials, operating pressure and the next decision that matters.',
      clientReceives: 'A clear discovery summary and the questions that need to be resolved before scope is set.',
      novaHausResponsible: 'Lead the conversation, identify dependencies and surface risks early.',
      clientConfirms: 'Business priorities, source information, decision makers and the immediate operating need.',
    },
    {
      number: '02',
      title: 'Strategy',
      whatHappens: 'We turn the context into a practical direction for narrative, assets, channels, delivery and review.',
      clientReceives: 'A recommended route, priorities and a proposed order of work.',
      novaHausResponsible: 'Shape the direction, explain trade-offs and define what should happen first.',
      clientConfirms: 'Positioning, audience, priorities, success criteria and the boundaries of the engagement.',
    },
    {
      number: '03',
      title: 'Team Assignment',
      whatHappens: 'The right NOVAHAUS operating capacity is assigned to the agreed work and communication rhythm.',
      clientReceives: 'Named responsibilities, delivery cadence, required inputs and review checkpoints.',
      novaHausResponsible: 'Coordinate the operating team, workflow, schedule and handoffs.',
      clientConfirms: 'Access, content owners, approval route, communication channel and availability for review.',
    },
    {
      number: '04',
      title: 'Production & Operations',
      whatHappens: 'Agreed work is planned, produced, organised and delivered through a visible operating rhythm.',
      clientReceives: 'The approved deliverables, status updates and clear requests for decisions or source material.',
      novaHausResponsible: 'Produce to scope, coordinate dependencies, maintain quality and flag changes early.',
      clientConfirms: 'Accuracy, priorities, factual claims and approval of each review-ready output.',
    },
    {
      number: '05',
      title: 'Founder Review',
      whatHappens: 'Important outputs receive a final commercial, reputation and context review before release or handoff.',
      clientReceives: 'A review-ready package with open decisions, assumptions and the final approval request.',
      novaHausResponsible: 'Apply professional review, explain unresolved points and prepare the final delivery state.',
      clientConfirms: 'Final facts, claims, brand direction, compliance responsibility and release approval.',
    },
    {
      number: '06',
      title: 'Continuous Optimisation',
      whatHappens: 'The operating rhythm continues through measured priorities, useful refinements and the next agreed cycle.',
      clientReceives: 'A forward plan, improvement priorities and a clear view of what the next cycle will contain.',
      novaHausResponsible: 'Review what is working, recommend practical adjustments and keep delivery aligned to the business.',
      clientConfirms: 'The next priority, available capacity, new inputs and any change to scope or timing.',
    },
  ],
  terminology: {
    preferred: ['Departments', 'Monthly Operations', 'Investment', 'Supporting Systems', 'Implementation Projects', 'Approved Add-ons', 'Demonstration Projects', 'Book Strategy Call'],
    deprecated: ['Launch / Growth / Enterprise packages', 'Compare Plans', 'Software Packages', 'Managed Software Products', 'AI Growth & Digital Systems as the primary category'],
  },
  ctas: {
    bookStrategyCall: { label: 'Book Strategy Call', href: '/booking/?source=homepage-cta' },
    assessment: { label: 'Take the Business Growth Assessment', href: '/growth-assessment/' },
  },
}

export function getCommercialDepartment(id) {
  return commercialKnowledge.monthlyDepartments.find((plan) => plan.id === id || plan.offerId === id) || commercialKnowledge.monthlyDepartments[0]
}
