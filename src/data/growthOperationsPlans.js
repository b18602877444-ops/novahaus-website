/**
 * NOVAHAUS Monthly Operations Catalog V2.
 *
 * This is the single source of truth for the four departments, their
 * capacity, investments, responsibilities, exclusions, add-ons and proposal
 * language. Customer-facing components should read this file rather than
 * repeating plan quantities or prices.
 */
export const growthOperationsClientResponsibilities = [
  'Accurate company and product information',
  'Approved claims and source materials',
  'Logos and brand assets',
  'Product images or usable video footage',
  'Required account access when applicable',
  'A designated decision-maker',
  'Timely feedback and approval',
  'Legal and regulatory confirmation for published claims',
]

export const growthOperationsStandardExclusions = [
  'Advertising spend',
  'Influencer or creator fees',
  'Professional filming crews',
  'Actors, studios or locations',
  'Licensed media purchases',
  'Translation by certified translators',
  'Legal, tax, customs, medical or financial advice',
  'Full-time human customer support',
  'Live-stream hosting',
  'Unlimited revisions',
  'Unlimited content',
  'Direct platform-account operation',
  'Third-party subscriptions, APIs or hosting',
  'New custom software outside the approved scope',
]

export const approvedGrowthOperationsAddOns = [
  { name: 'Promotional poster or graphic', price: 'From USD 150' },
  { name: 'Additional short-video script', price: 'From USD 120' },
  { name: 'Additional edited short-form video using supplied assets', price: 'From USD 400' },
  { name: 'Business PPT, 10-15 slides', price: 'From USD 800' },
  { name: 'Advanced pitch deck, 20-30 slides', price: 'From USD 1,500' },
  { name: 'Company Profile', price: 'From USD 1,200' },
  { name: 'Standard whitepaper', price: 'From USD 2,500' },
  { name: 'Business plan', price: 'From USD 2,000' },
  { name: 'Digital business card', price: 'From USD 300' },
  { name: 'Landing page', price: 'From USD 1,200' },
  { name: 'AI Sales Agent setup', price: 'From USD 2,500' },
  { name: 'Knowledge Hub setup', price: 'From USD 3,500' },
  { name: 'Lightweight CRM setup', price: 'From USD 3,000' },
  { name: 'Workflow automation', price: 'From USD 1,500 per approved workflow' },
  { name: 'Full website, custom platform or advanced integration', price: 'Custom Quote' },
]

export const growthOperationsFinalQuoteNotice = 'Final scope, monthly capacity and investment are confirmed after NOVAHAUS reviews your content requirements, operational volume, platforms, compliance risks and technical integrations.'

const commonPlanFields = {
  clientResponsibilities: growthOperationsClientResponsibilities,
  exclusions: growthOperationsStandardExclusions,
  addOns: approvedGrowthOperationsAddOns,
  finalQuoteNotice: growthOperationsFinalQuoteNotice,
  terms: {
    unusedCapacity: 'Unused monthly capacity does not roll over unless the signed agreement says otherwise.',
    approvals: 'Delivery depends on timely client materials and approvals.',
    additionalQuantities: 'Additional quantities require written approval and an add-on quotation.',
    thirdPartyCosts: 'Third-party expenses are separate unless explicitly included.',
  },
}

export const growthOperationsPlans = [
  {
    ...commonPlanFields,
    id: 'ai-content-operations-department',
    offerId: 'ai-content-operations',
    name: 'Content Operations Team',
    monthlyPrice: 'Starting from USD 1,500 / month',
    onboardingFee: 'Starting from USD 1,000',
    bestFor: 'Project teams, creators and SMEs that require consistent promotional content.',
    monthlyStandardCapacity: [
      '1 monthly content strategy and planning session',
      '4 weekly content plans',
      '12 social-media content pieces or captions',
      '8 short-video scripts',
      '4 edited short-form videos using client-supplied or approved assets',
      '8 promotional posters or social graphics',
      '1 monthly performance and content review',
      '1 monthly operations meeting',
      'Up to 2 reasonable revision rounds per monthly production batch',
    ],
    deliveryRules: [
      'Videos use client-supplied, licensed or approved materials.',
      'Professional filming, actors, studios, advanced animation and 3D work are excluded.',
      'Platform publishing is excluded unless separately approved.',
      'Unused capacity does not automatically roll over.',
      'Additional quantities require an approved add-on quotation.',
    ],
    customQuoteTriggers: ['Professional filming, actors, studios, advanced animation or 3D work', 'Platform publishing or direct account operation', 'Additional quantities beyond the standard capacity'],
    aiSalesSummary: 'The Content Operations Team provides a defined monthly content rhythm for project teams, creators and SMEs that need consistent, approved promotional content with coordinated planning and review.',
    proposalSummary: 'A defined monthly content operations function covering planning, platform-ready content, scripts, approved asset editing, promotional graphics and review.',
    cta: { label: 'Book Strategy Call', href: '/booking/?source=growth-operations&plan=ai-content-operations-department' },
  },
  {
    ...commonPlanFields,
    id: 'ai-brand-operations-department',
    offerId: 'ai-brand-operations',
    name: 'Brand Operations Team',
    monthlyPrice: 'Starting from USD 2,500 / month',
    onboardingFee: 'Starting from USD 2,000',
    bestFor: 'Founders, influencers, coaches, speakers, product sellers and personal brands.',
    monthlyStandardCapacity: [
      'Ongoing brand and narrative optimisation',
      '12 content or short-video scripts',
      '6 edited short-form videos using client-supplied or approved assets',
      '12 brand graphics, posters, covers or thumbnails',
      'Platform content planning for LinkedIn, Xiaohongshu, TikTok and YouTube',
      'Up to 16 platform-specific captions or content adaptations',
      '1 landing-page or profile content update',
      '1 Company Profile, media-kit or Proposal light update',
      '1 monthly brand-performance review',
      '1 monthly operations meeting',
      'Up to 2 reasonable revision rounds per monthly production batch',
    ],
    deliveryRules: [
      'No guaranteed viral content, followers, engagement or sales.',
      'Medical-aesthetic, financial or regulated claims require client verification and human review.',
      'Account login, direct account operation and paid media are excluded unless separately contracted.',
    ],
    customQuoteTriggers: ['Direct account operation or paid media', 'Medical-aesthetic, financial or regulated claims requiring specialist review', 'Additional quantities beyond the standard capacity'],
    aiSalesSummary: 'The Brand Operations Team supports founders and personal brands with defined monthly narrative, content, profile and commercial-asset capacity without promising virality or sales.',
    proposalSummary: 'A defined monthly brand operations function covering narrative optimisation, platform content, approved asset editing, profile updates and a brand-performance review.',
    cta: { label: 'Book Strategy Call', href: '/booking/?source=growth-operations&plan=ai-brand-operations-department' },
  },
  {
    ...commonPlanFields,
    id: 'ai-community-operations-department',
    offerId: 'ai-community-operations',
    name: 'Community Operations Team',
    monthlyPrice: 'Starting from USD 3,000 / month',
    onboardingFee: 'Starting from USD 2,500',
    bestFor: 'Legitimate project teams, associations, membership platforms and online communities.',
    monthlyStandardCapacity: [
      '12 community announcements, educational posts or narrative updates',
      '8 event or project promotional posters',
      'Up to 4 AMA, campaign or community-event content packages',
      'FAQ review and light updates',
      'Knowledge Hub maintenance with up to 30 structured content updates',
      'Telegram or community AI knowledge updates where technically supported',
      '1 Proposal or partner-material light update',
      '1 whitepaper light-update batch of up to 5 existing pages',
      '1 monthly community operations report',
      '1 monthly operations meeting',
      'Up to 2 reasonable revision rounds per monthly production batch',
    ],
    deliveryRules: [
      'No investment guarantees.',
      'No token-price promotion.',
      'No financial advice.',
      'No guaranteed member recruitment.',
      'No fake partnerships, engagement or metrics.',
      'Human moderation, 24/7 customer service and community account management are excluded.',
      'Bot development, APIs, private databases and complex permissions require a technical quotation.',
    ],
    customQuoteTriggers: ['Bot development, APIs, private databases or complex permissions', 'Human moderation, 24/7 customer service or community account management', 'Additional quantities beyond the standard capacity'],
    aiSalesSummary: 'The Community Operations Team provides defined monthly content, knowledge and community-support capacity for legitimate communities without financial promises or account-management claims.',
    proposalSummary: 'A defined monthly community operations function covering announcements, educational content, Knowledge Hub updates, approved AI knowledge maintenance and reporting.',
    cta: { label: 'Book Strategy Call', href: '/booking/?source=growth-operations&plan=ai-community-operations-department' },
  },
  {
    ...commonPlanFields,
    id: 'ai-growth-operations-department',
    offerId: 'ai-global-growth-operations',
    name: 'Growth Operations Team',
    label: 'Recommended for Project Teams',
    monthlyPrice: 'Starting from USD 5,000 / month',
    onboardingFee: 'Starting from USD 4,000',
    bestFor: 'Established project teams and businesses that need a broader, coordinated growth operations function.',
    monthlyStandardCapacity: [
      '1 monthly growth strategy and operating plan',
      '16 social-media content pieces or captions',
      '12 short-video scripts',
      '6 edited short-form videos using client-supplied or approved assets',
      '12 promotional graphics, posters, covers or thumbnails',
      'Up to 2 light updates across PPT, Proposal, Company Profile or brochure assets',
      'Website or landing-page content updates within the existing structure',
      'FAQ and Knowledge Hub maintenance',
      'Commercial conversation knowledge review',
      'CRM and lead-flow review',
      '1 monthly campaign content package',
      'Weekly progress summary',
      '1 monthly growth operations report',
      '1 monthly strategy meeting',
      'Up to 8 hours of agreed lightweight technical or operational improvement work',
      'Priority business-hours support',
      'Up to 2 reasonable revision rounds per monthly production batch',
    ],
    deliveryRules: [
      'This department does not automatically include the full quantities of all three lower departments.',
      'It is a coordinated flagship service with the exact capacity listed above.',
      'It is not unlimited.',
    ],
    customQuoteTriggers: [
      'Full new websites',
      'New custom applications',
      'Large whitepapers',
      'Professional filming, actors or studios',
      'Advanced animation or 3D',
      'High-volume video production',
      'Paid advertising',
      '24/7 human moderation',
      'Dedicated full-time personnel',
      'Complex third-party integrations',
      'Regulated or high-risk projects',
    ],
    aiSalesSummary: 'The Growth Operations Team is a coordinated flagship service for established teams that need defined content, commercial-asset, supporting-system and customer-journey capacity without describing the work as unlimited.',
    proposalSummary: 'A coordinated monthly growth operations function with defined content, commercial-asset, AI Sales, Knowledge Hub, CRM review and lightweight operations capacity.',
    cta: { label: 'Book Strategy Call', href: '/booking/?source=growth-operations&plan=ai-growth-operations-department' },
  },
]

export function getGrowthOperationsPlan(id) {
  return growthOperationsPlans.find((plan) => plan.id === id) || growthOperationsPlans[0]
}

export function getGrowthOperationsPlanForOffer(offerId) {
  return growthOperationsPlans.find((plan) => plan.offerId === offerId) || growthOperationsPlans[0]
}
