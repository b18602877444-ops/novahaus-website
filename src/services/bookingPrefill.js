import { listLeads } from './leadStorage.js'
import { listSavedProposals } from './proposalStorage.js'
import { ASSESSMENT_STORAGE_KEY } from './assessmentSubmission.js'

function readJson(key, fallback) {
  try { return JSON.parse(window.localStorage.getItem(key) || '') || fallback } catch { return fallback }
}

function latestAssessment() {
  const stored = readJson(ASSESSMENT_STORAGE_KEY, {})
  const assessments = Array.isArray(stored.assessments) ? stored.assessments : []
  return assessments[assessments.length - 1] || null
}

function readLatestLead() {
  return listLeads()[0] || null
}

function readLatestProposal() {
  return listSavedProposals()[0] || null
}

function assessmentSummary(assessment) {
  if (!assessment) return ''
  const score = assessment.overallScore ? `Growth score: ${assessment.overallScore}/100.` : ''
  const product = assessment.recommendedProduct?.name || assessment.recommendedProduct || ''
  return [score, product ? `Recommended product: ${product}.` : ''].filter(Boolean).join(' ')
}

export function getBookingPrefill(source = 'homepage', packageName = '') {
  const lead = readLatestLead()
  const assessment = latestAssessment()
  const latestProposal = readLatestProposal()
  const proposal = latestProposal?.proposalData || latestProposal
  const assessmentProfile = assessment?.contact || assessment?.profile || assessment?.answers?.profile || {}
  const assessmentAnswers = assessment?.answers || {}
  const proposalClient = proposal?.client || {}

  if (source === 'ai-sales-agent' && lead) {
    return { fullName: lead.name, company: lead.company, email: lead.email, whatsapp: lead.whatsapp, country: lead.country, industry: lead.businessType || lead.industry, primaryChallenge: lead.challenge || lead.painPoints?.[0], interestedPackage: lead.interestedPackage, aiSummary: lead.aiSummary }
  }

  if (source === 'growth-assessment' && assessment) {
    return { fullName: assessmentProfile.name, company: assessmentProfile.company, email: assessmentProfile.email, whatsapp: assessmentProfile.whatsapp, country: assessmentProfile.country, website: assessmentProfile.website, industry: assessmentProfile.industry || assessmentAnswers.industry, companySize: assessmentAnswers.teamSize, primaryChallenge: Array.isArray(assessmentAnswers.challenges) ? assessmentAnswers.challenges.join(', ') : assessmentAnswers.challenges, serviceInterest: assessment.recommendedProduct?.name || '', interestedPackage: '', growthScore: assessment.overallScore, assessmentSummary: assessmentSummary(assessment) }
  }

  if (source === 'proposal-generator' && proposal) {
    return { fullName: proposalClient.name, company: proposalClient.company, email: proposalClient.email, whatsapp: proposalClient.whatsapp, country: proposalClient.country, website: proposalClient.website, industry: proposalClient.industry, companySize: proposalClient.teamSize, primaryChallenge: proposalClient.mainChallenges || proposal?.notes?.keyProblems, serviceInterest: proposal.selectedProduct, monthlyRevenueRange: proposalClient.indicativeBudget, additionalNotes: proposal?.notes?.additionalNotes, proposalSummary: proposal?.content?.executiveSummary || '' }
  }

  if (packageName) return { interestedPackage: packageName }
  return {}
}
