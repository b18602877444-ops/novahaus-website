export const leadDeliveryVersion = '2026-07-web3-lead-delivery-v1'

export const web3ProjectLaunchReadinessChecklist = {
  resourceId: 'web3-project-launch-readiness-checklist-v1',
  name: 'Web3 Project Launch Readiness Checklist',
  status: 'Production Ready',
  qualification: 'Warm Lead or Hot Lead',
  audience: 'Web3 founders, project operators and community leads',
  recommendationMessage: 'Based on your current project stage, I can also provide our Web3 Project Launch Readiness Checklist to help you evaluate your launch preparation.',
  requiredLeadFields: ['fullName', 'companyOrProject', 'email'],
  optionalLeadFields: ['whatsapp'],
  delivery: {
    mode: 'qualified-lead-handoff',
    publicUrl: null,
    anonymousAccess: false,
    status: 'integration-only',
  },
  futureHooks: {
    proposal: { status: 'planned', target: '/proposal-builder/' },
    strategyCall: { status: 'planned', target: '/booking/' },
    followUp: { status: 'interface-only', target: null },
  },
}

export const leadMagnetCatalog = {
  version: leadDeliveryVersion,
  resources: [web3ProjectLaunchReadinessChecklist],
}

export function getLeadMagnet(resourceId) {
  return leadMagnetCatalog.resources.find((resource) => resource.resourceId === resourceId) || null
}
