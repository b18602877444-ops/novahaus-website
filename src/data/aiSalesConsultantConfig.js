import { commercialKnowledge } from './commercialKnowledge.js'

export const aiSalesConsultantKnowledgeVersion = '2026-07-ai-sales-consultant-v1'

export const customerTypeOptions = [
  'Web3 / Crypto Project',
  'China-to-Global Business',
  'Creator / Personal Brand',
  'Other Business',
]

export const discoveryOptions = {
  web3Stage: ['Preparing to Launch', 'Preparing for Fundraising or Partnerships', 'Growing the Community', 'Scaling Ongoing Operations', 'Existing Project Needs Repositioning'],
  web3Needs: ['Project Narrative', 'Whitepaper', 'Pitch Deck', 'Partner Proposal', 'Community Content', 'AMA Campaign', 'Promotional Graphics', 'Short-Video Scripts', 'Landing Page', 'Ongoing Monthly Content Operations', 'Supporting AI or Sales Systems'],
  web3Assets: ['Nothing yet', 'Basic materials only', 'Existing whitepaper', 'Existing Pitch Deck', 'Existing website', 'Existing community', 'Existing content team'],
  timing: ['Within 2 weeks', 'Within 1 month', 'Within 1–3 months', 'Ongoing monthly support', 'Not confirmed'],
  languages: ['English', 'Chinese', 'English and Chinese', 'Other'],
  compliance: ['Yes', 'No', 'Unsure'],
  budget: ['Below USD 1,500', 'USD 1,500–3,000', 'USD 3,000–5,000', 'USD 5,000–10,000', 'Above USD 10,000', 'Not confirmed'],
  chinaNeed: ['Positioning', 'Content', 'Sales materials', 'Customer journey', 'Not sure yet'],
  creatorPlatforms: ['LinkedIn', 'TikTok', 'YouTube', 'Xiaohongshu', 'Several platforms'],
  creatorPriority: ['Positioning', 'Publishing consistency', 'Audience growth support', 'Enquiry conversion'],
  generalNeeds: ['Brand and commercial assets', 'Content operations', 'Community support', 'AI systems', 'Not sure yet'],
}

export const approvedOfferNames = [
  commercialKnowledge.launchPackage.name,
  ...commercialKnowledge.monthlyDepartments.map((department) => department.name),
]

export const salesConsultantProgressTotal = 7
