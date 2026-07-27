export const GROWTH_CATEGORIES = ['Strategy', 'Digital Presence', 'Automation', 'Growth Operations']

export const CAPABILITY_QUESTIONS = {
  Strategy: [
    'We have a clear market position.',
    'Our offer is easy for customers to understand.',
    'We know which customer segment we want to prioritise.',
  ],
  'Digital Presence': [
    'Our website clearly communicates our value.',
    'Our landing pages generate qualified enquiries.',
    'Our digital experience supports credibility and conversion.',
  ],
  Automation: [
    'Leads are captured and organised automatically.',
    'Follow-up processes are consistent.',
    'Repetitive internal work is automated.',
  ],
  'Growth Operations': [
    'We measure important growth metrics.',
    'We have a repeatable content and acquisition process.',
    'We continuously improve conversion and customer experience.',
  ],
}

export const PRODUCT_RECOMMENDATIONS = {
  Strategy: { name: 'Executive Strategy Advisory', engagement: 'Private strategy advisory', timeline: '2–4 weeks' },
  'Digital Presence': { name: 'AI Growth Launch', engagement: 'Focused launch and digital foundation', timeline: '6–10 weeks' },
  Automation: { name: 'AI Growth Automation', engagement: 'Connected AI workflow build', timeline: '6–12 weeks' },
  'Growth Operations': { name: 'Growth Partnership', engagement: 'Ongoing optimisation partnership', timeline: 'Ongoing monthly engagement' },
}

export const PRIMARY_GOAL_PRODUCTS = {
  'Launch a new business': 'AI Growth Launch',
  'Improve positioning': 'Executive Strategy Advisory',
  'Generate more qualified leads': 'AI Growth Automation',
  'Improve conversion': 'AI Growth Launch',
  'Implement AI automation': 'AI Growth Automation',
  'Build a CRM and follow-up system': 'AI Growth Automation',
  'Enter international markets': 'Executive Strategy Advisory',
  'Create a long-term growth system': 'Growth Partnership',
}

function normaliseAnswers(answers) {
  if (!Array.isArray(answers) || answers.length !== 3) throw new Error('Each growth category requires three answers.')
  const values = answers.map(Number)
  if (values.some((value) => !Number.isInteger(value) || value < 1 || value > 5)) throw new Error('Growth capability answers must be whole numbers from 1 to 5.')
  return values
}

export function calculateCategoryScore(answers) {
  const values = normaliseAnswers(answers)
  return Math.round(((values.reduce((sum, value) => sum + value, 0) - 3) / 12) * 100)
}

export function calculateCategoryScores(capabilityAnswers) {
  return Object.fromEntries(GROWTH_CATEGORIES.map((category) => [category, calculateCategoryScore(capabilityAnswers?.[category])]))
}

export function getLowestCategories(categoryScores) {
  const values = GROWTH_CATEGORIES.map((category) => categoryScores[category])
  const lowest = Math.min(...values)
  return GROWTH_CATEGORIES.filter((category) => categoryScores[category] === lowest)
}

export function getRecommendedProduct(categoryScores, primaryGoal = '') {
  const lowestCategories = getLowestCategories(categoryScores)
  const goalProduct = PRIMARY_GOAL_PRODUCTS[primaryGoal]
  const categoryProduct = lowestCategories.length > 1 ? null : PRODUCT_RECOMMENDATIONS[lowestCategories[0]].name
  const productName = lowestCategories.length > 1 ? (goalProduct || 'AI Growth Launch') : categoryProduct
  const category = GROWTH_CATEGORIES.find((item) => PRODUCT_RECOMMENDATIONS[item].name === productName) || 'Digital Presence'
  return { ...PRODUCT_RECOMMENDATIONS[category], category, lowestCategories }
}

export function buildDiagnosticReport({ capabilityAnswers, primaryGoal = '' }) {
  const categoryScores = calculateCategoryScores(capabilityAnswers)
  const overallScore = Math.round(GROWTH_CATEGORIES.reduce((sum, category) => sum + categoryScores[category], 0) / GROWTH_CATEGORIES.length)
  const lowestCategories = getLowestCategories(categoryScores)
  const recommendedProduct = getRecommendedProduct(categoryScores, primaryGoal)
  return { categoryScores, overallScore, lowestCategories, biggestOpportunity: lowestCategories.join(' / '), recommendedProduct, primaryGoal }
}
