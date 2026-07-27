export const contentCollections = {
  caseStudies: 'case-studies',
  blog: 'blog',
  resources: 'resources',
  testimonials: 'testimonials',
  faqs: 'faqs',
}

function assertCollection(collection) {
  if (!Object.values(contentCollections).includes(collection)) {
    throw new Error(`Unknown NOVAHAUS content collection: ${collection}`)
  }
}

/**
 * Fetch a collection from a future headless CMS or API.
 * The default endpoint is intentionally only a contract; no backend is required today.
 */
export async function loadContentCollection(collection, { endpoint = '/api/content', fetcher = fetch } = {}) {
  assertCollection(collection)
  const response = await fetcher(`${endpoint}/${collection}`)
  if (!response.ok) throw new Error(`Unable to load content collection: ${collection}`)
  return response.json()
}

/**
 * Create a small content client so future integrations can swap in a CMS endpoint
 * without changing page-level code.
 */
export function createContentClient(options = {}) {
  return Object.fromEntries(Object.values(contentCollections).map((collection) => [collection, () => loadContentCollection(collection, options)]))
}
