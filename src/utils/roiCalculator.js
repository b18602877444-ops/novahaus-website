import { roiAssumptions } from '../data/roiCalculator.js'

function numberOr(value, fallback) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

export function calculateRoiScenario(input) {
  const monthlyLeads = Math.max(0, numberOr(input.monthlyLeads, 0))
  const salesTeamSize = Math.max(1, numberOr(input.salesTeamSize, 1))
  const conversionRate = Math.min(100, Math.max(0, numberOr(input.conversionRate, 0)))
  const averageDealValue = Math.max(0, numberOr(input.averageDealValue, 0))
  const sizeFactor = { solo: 0, small: 0.04, mid: 0.08, enterprise: 0.12 }[input.companySize] || 0
  const volumeFactor = Math.min(0.12, Math.log10(monthlyLeads + 1) * 0.025)
  const teamFactor = Math.min(0.1, salesTeamSize * 0.012)
  const automationCoverage = Math.min(0.62, roiAssumptions.baseAutomationCoverage + sizeFactor + volumeFactor + teamFactor)
  const timeSavedHours = (monthlyLeads * roiAssumptions.minutesPerLead * automationCoverage) / 60
  const responseImprovement = Math.round(automationCoverage * 100)
  const conversionLift = Math.min(roiAssumptions.conversionLiftCap, 0.01 + automationCoverage * 0.04)
  const conversionOpportunity = monthlyLeads * conversionLift
  const revenueOpportunity = conversionOpportunity * averageDealValue
  const recommendedPackage = input.companySize === 'enterprise' || monthlyLeads >= 750 || salesTeamSize >= 15
    ? 'Enterprise'
    : monthlyLeads >= 250 || salesTeamSize >= 5
      ? 'Growth'
      : 'Launch'

  return {
    timeSavedHours,
    responseImprovement,
    conversionOpportunity,
    revenueOpportunity,
    recommendedPackage,
    conversionLiftPoints: conversionLift * 100,
    automationCoverage: automationCoverage * 100,
  }
}
