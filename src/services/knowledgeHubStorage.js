const FAVORITES_KEY = 'novahaus_knowledge_favorites_v1'
const RECENT_KEY = 'novahaus_knowledge_recent_v1'
const UPLOADS_KEY = 'novahaus_knowledge_uploads_v1'

function readJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || 'null')
    return value ?? fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function getKnowledgeFavorites() {
  return readJson(FAVORITES_KEY, [])
}

export function saveKnowledgeFavorites(ids) {
  return writeJson(FAVORITES_KEY, ids)
}

export function getKnowledgeRecent() {
  return readJson(RECENT_KEY, [])
}

export function saveKnowledgeRecent(ids) {
  return writeJson(RECENT_KEY, ids.slice(0, 6))
}

export function getKnowledgeUploads() {
  return readJson(UPLOADS_KEY, [])
}

export function saveKnowledgeUploads(items) {
  return writeJson(UPLOADS_KEY, items)
}

export const knowledgeHubStorageKeys = { FAVORITES_KEY, RECENT_KEY, UPLOADS_KEY }
