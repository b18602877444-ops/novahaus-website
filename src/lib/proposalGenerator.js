import { defaultPhases, defaultScopeItems, proposalProducts, proposalTemplates } from '../data/proposalTemplates.js'

export function createProposalId() {
  return globalThis.crypto?.randomUUID?.() || `proposal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function getProductDefinition(value) {
  return proposalProducts.find((product) => product.value === value) || proposalProducts[0]
}

export function getProductTemplate(value) {
  return proposalTemplates[value] || proposalTemplates['AI Growth Launch']
}

export function createEmptyProposal() {
  const selectedProduct = proposalProducts[0].value
  return {
    proposalId: createProposalId(),
    versionNumber: 1,
    status: 'Draft',
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    client: { name: '', company: '', email: '', whatsapp: '', website: '', country: '', industry: '', businessStage: '', teamSize: '', primaryGoal: '', mainChallenges: '', indicativeBudget: '', preferredTimeline: '' },
    notes: { currentSituation: '', businessObjectives: '', keyProblems: '', opportunitiesIdentified: '', risksOrConstraints: '', decisionMakers: '', additionalNotes: '' },
    selectedProduct,
    content: { ...getProductTemplate(selectedProduct) },
    scopeItems: defaultScopeItems.map((item) => ({ ...item })),
    phases: defaultPhases.map((phase) => ({ ...phase })),
    investment: { currency: 'USD', projectFee: '', monthlyRetainer: '', setupFee: '', optionalAddOns: '', paymentTerms: '50% on acceptance\n30% at agreed milestone\n20% before final launch', validity: '14 days', note: 'All fees exclude third-party software, advertising spend, taxes and external platform charges unless stated otherwise.' },
  }
}

export function applyProductTemplate(proposal, product) {
  const definition = getProductDefinition(product)
  return { ...proposal, selectedProduct: definition.value, content: { ...getProductTemplate(definition.value) }, client: { ...proposal.client, preferredTimeline: proposal.client.preferredTimeline || definition.timeline } }
}

export function createProposalFromAssessment(proposal, assessment) {
  if (!assessment) return proposal
  const recommendation = assessment.recommendation?.product || assessment.recommendedProduct || assessment.product
  const recommendedName = typeof recommendation === 'string' ? recommendation : recommendation?.name
  const resolvedProduct = proposalProducts.some((product) => product.value === recommendedName) ? recommendedName : proposal.selectedProduct
  const profile = assessment.contact || assessment.profile || assessment.client || assessment.answers?.profile || {}
  const answers = assessment.answers || {}
  const challenges = Array.isArray(answers.challenges) ? answers.challenges.join(', ') : answers.challenges || ''
  return {
    ...applyProductTemplate(proposal, resolvedProduct),
    client: {
      ...proposal.client,
      name: profile.name || assessment.name || proposal.client.name,
      company: profile.company || assessment.company || proposal.client.company,
      email: profile.email || assessment.email || proposal.client.email,
      whatsapp: profile.whatsapp || assessment.whatsapp || proposal.client.whatsapp,
      website: profile.website || assessment.website || proposal.client.website,
      country: profile.country || assessment.country || proposal.client.country,
      industry: answers.industry || assessment.industry || proposal.client.industry,
      businessStage: answers.businessStage || assessment.businessStage || proposal.client.businessStage,
      teamSize: answers.teamSize || assessment.teamSize || proposal.client.teamSize,
      primaryGoal: answers.primaryGoal || assessment.primaryGoal || proposal.client.primaryGoal,
      mainChallenges: challenges || assessment.mainChallenges || proposal.client.mainChallenges,
      indicativeBudget: answers.projectRange || assessment.projectRange || proposal.client.indicativeBudget,
      preferredTimeline: answers.timeline || assessment.timeline || proposal.client.preferredTimeline,
    },
    notes: { ...proposal.notes, keyProblems: challenges || proposal.notes.keyProblems, additionalNotes: 'Imported from the latest NOVAHAUS Growth Assessment.' },
  }
}

function display(value) { return value?.trim() || 'To be confirmed with the client.' }

export function formatInvestment(investment) {
  const rows = [['Project fee', investment.projectFee], ['Monthly retainer', investment.monthlyRetainer], ['Setup fee', investment.setupFee], ['Optional add-ons', investment.optionalAddOns]]
  return rows.filter(([, value]) => value !== '').map(([label, value]) => `${label}: ${investment.currency} ${value}`).join(' · ') || 'Custom proposal — investment to be confirmed.'
}

export function createProposalSummary(proposal) {
  const scope = proposal.scopeItems.filter((item) => item.inclusion === 'Included').map((item) => item.title).slice(0, 5).join(', ')
  return [
    `Client: ${display(proposal.client.name)}${proposal.client.company ? ` / ${proposal.client.company}` : ''}`,
    `Main challenge: ${display(proposal.notes.keyProblems || proposal.client.mainChallenges)}`,
    `Recommended product: ${proposal.selectedProduct}`,
    `Scope summary: ${scope || 'To be confirmed.'}`,
    `Timeline: ${display(proposal.client.preferredTimeline || proposal.content.indicativeTimeline)}`,
    `Investment: ${formatInvestment(proposal.investment)}`,
    `Next step: ${display(proposal.content.nextSteps)}`,
  ].join('\n')
}
