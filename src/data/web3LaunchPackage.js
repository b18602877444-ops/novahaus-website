/**
 * Approved one-time entry offer for legitimate Web3 project teams.
 * Keep this separate from the four recurring departments so pricing and
 * capacity remain single-sourced and easy to review.
 */
export const web3LaunchPackage = {
  id: 'web3-project-launch-package',
  name: 'Web3 Project Launch Package',
  positioning: 'A focused implementation package for legitimate Web3 projects preparing for launch, fundraising conversations, partnership outreach or a major campaign.',
  startingInvestment: 'Starting from USD 5,000',
  timeline: '3–6 weeks, subject to scope and client approvals.',
  deliverables: [
    'Project narrative and positioning workshop',
    'Narrative framework',
    'Standard whitepaper draft or structured rewrite, up to an agreed page limit',
    'Pitch Deck, up to 20 slides',
    'Project or campaign landing-page content',
    'FAQ and key-message document',
    'Initial 2-week content package: 6 community/social content pieces, 4 promotional graphics and 4 short-video scripts',
    'One partner/commercial Proposal template',
    'Two reasonable consolidated revision rounds',
  ],
  clientResponsibilities: [
    'Provide accurate project, team and product information',
    'Confirm factual claims before publication',
    'Arrange legal and regulatory review',
    'Provide brand/source materials and timely approvals',
    'Disclose regulated or high-risk topics before work begins',
  ],
  exclusions: [
    'Investment advice, token-price promotion or tokenomics financial modelling',
    'Legal drafting or regulated-offering advice',
    'Guaranteed fundraising, exchange listing, community growth or campaign performance',
    'Paid advertising, professional filming or community account management',
    'Platform-rule circumvention, full custom software or unlimited revisions',
  ],
  cta: { label: 'Plan Your Project Launch', href: '/booking/?source=web3-launch-package' },
  finalQuoteNotice: 'Final scope, investment and delivery capacity are confirmed after NOVAHAUS reviews the project stage, content volume, platforms, source materials, compliance risks and technical requirements.',
}

export function isWeb3Context(value = '') {
  const text = String(value)
  if (/not a web3 project|not web3/i.test(text) && !/crypto|rwa|token|blockchain|defi|dao|membership protocol/i.test(text)) return false
  return /web3|crypto|rwa|token|blockchain|defi|dao|community project|membership protocol/i.test(text)
}
