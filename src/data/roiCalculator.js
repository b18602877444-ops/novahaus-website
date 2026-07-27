export const roiIndustries = ['Professional Services', 'FinTech', 'Web3 / RWA', 'Education & Personal Brand', 'SaaS / AI', 'Real Estate', 'Other']

export const roiCompanySizes = [
  { value: 'solo', label: '1–5 people' },
  { value: 'small', label: '6–25 people' },
  { value: 'mid', label: '26–100 people' },
  { value: 'enterprise', label: '101+ people' },
]

export const roiDefaults = {
  industry: 'Professional Services',
  companySize: 'small',
  monthlyLeads: 100,
  salesTeamSize: 3,
  conversionRate: 4,
  averageDealValue: 5000,
}

export const roiAssumptions = {
  minutesPerLead: 12,
  baseAutomationCoverage: 0.28,
  conversionLiftCap: 0.05,
}
