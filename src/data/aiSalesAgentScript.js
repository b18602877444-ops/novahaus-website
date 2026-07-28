import { commercialKnowledge } from './commercialKnowledge.js'
import { aiSalesConsultantKnowledgeVersion, customerTypeOptions, discoveryOptions } from './aiSalesConsultantConfig.js'

export const aiSalesAgentWelcome = {
  content: "Welcome to NOVAHAUS.\n\nI can help identify the most suitable growth operations engagement for your project or business.\n\nFirst, which best describes you?",
  quickReplies: customerTypeOptions,
}

export const aiSalesAgentIndustries = [...customerTypeOptions]
export const aiSalesAgentBudgets = discoveryOptions.budget
export const aiSalesAgentTimelines = discoveryOptions.timing

export const aiSalesAgentFaqs = [
  {
    keywords: ['price', 'pricing', 'cost', 'fee', 'budget', 'how much'],
    answer: `NOVAHAUS works through one focused Web3 Project Launch Package, four Monthly Operations Departments and approved add-ons. Starting investments come from the current commercial catalog; final scope and investment require human review. ${commercialKnowledge.finalQuoteNotice}`,
  },
  {
    keywords: ['openai', 'model', 'api'],
    answer: 'This is a guided NOVAHAUS experience designed to clarify your needs first. An external AI model, CRM or email connection is not part of this version.',
  },
  {
    keywords: ['invest', 'investment advice', 'token', 'return', 'fundraising'],
    answer: 'NOVAHAUS does not provide investment advice, token sales, fundraising advice or return promises. We can support responsible narrative, commercial assets, community content and approved digital operating systems.',
  },
]

export const aiSalesAgentKnowledgeVersion = aiSalesConsultantKnowledgeVersion
