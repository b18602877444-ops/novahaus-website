import {
  approvedGrowthOperationsAddOns,
  growthOperationsClientResponsibilities,
  growthOperationsFinalQuoteNotice,
  growthOperationsPlans,
  growthOperationsStandardExclusions,
} from './growthOperationsPlans.js'
import { web3LaunchPackage } from './web3LaunchPackage.js'

export const commercialKnowledgeVersion = '2026-07-ai-sales-consultant-v1'

export const commercialKnowledge = {
  version: commercialKnowledgeVersion,
  positioning: {
    category: 'Your AI Growth Operations Team',
    strategy: 'Brand Broad. Market Focus. Web3 First. Global Next.',
    heroEyebrow: 'AI GROWTH OPERATIONS',
    heroHeadline: 'Your AI Growth Operations Team.',
    heroParagraph: 'We plan, produce and operate the narrative, content, commercial assets and supporting digital systems your business needs — without you building and managing a full in-house team.',
    marketFocus: 'Currently deepest in Web3 and crypto project operations. Also serving China-to-global teams and personal brands.',
    trustLine: 'Strategy-led. AI-executed. Human-reviewed.',
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
  humanReviewPrinciple: 'AI accelerates research and production. Human review remains where accuracy, reputation and compliance matter.',
  complianceBoundaries: ['No investment advice', 'No token sales or fundraising advice', 'No legal, tax, medical or financial advice', 'Client confirms factual and regulated claims before publication'],
  nonGuaranteeStatements: ['No guaranteed leads, sales, revenue, fundraising, listings, token performance or community growth.', 'Final scope, capacity and investment are confirmed after human review.'],
  operatingComparison: {
    traditional: ['Multiple hires or vendors', 'Fragmented communication', 'Inconsistent narrative and brand', 'Variable production speed', 'High coordination burden', 'Separate tools and workflows'],
    novaHaus: ['One coordinated operations partner', 'Defined monthly capacity', 'Shared narrative and brand direction', 'AI-assisted production', 'Human review before delivery', 'Clear add-on pricing for additional volume'],
    note: 'Actual cost differences depend on team structure, location, content volume and internal management requirements.',
  },
  deliveryProcess: [
    { number: '01', title: 'Diagnose', description: 'Review stage, audience, materials, platforms, risks and monthly output.' },
    { number: '02', title: 'Define', description: 'Confirm engagement, deliverables, capacity, responsibilities, review process and investment.' },
    { number: '03', title: 'Produce', description: 'Plan and produce approved work through AI-assisted workflows and professional human review.' },
    { number: '04', title: 'Operate', description: 'Continue through agreed planning, delivery and review cycles.' },
  ],
  terminology: {
    preferred: ['Departments', 'Monthly Operations', 'Investment', 'Supporting Systems', 'Implementation Projects', 'Approved Add-ons', 'Demonstration Projects', 'Book Strategy Call'],
    deprecated: ['Launch / Growth / Enterprise packages', 'Compare Plans', 'Software Packages', 'Managed Software Products', 'AI Growth & Digital Systems as the primary category'],
  },
  ctas: {
    bookStrategyCall: { label: 'Book Strategy Call', href: '/booking/?source=homepage-cta' },
    assessment: { label: 'Take the AI Growth Operations Assessment', href: '/growth-assessment/' },
  },
}

export function getCommercialDepartment(id) {
  return commercialKnowledge.monthlyDepartments.find((plan) => plan.id === id || plan.offerId === id) || commercialKnowledge.monthlyDepartments[0]
}
