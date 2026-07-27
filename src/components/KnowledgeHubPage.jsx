import { useEffect, useMemo, useState } from 'react'
import { knowledgeCategories, knowledgeContent, knowledgeFaqs, knowledgeRecommendedIds } from '../data/knowledgeHub.js'
import { getKnowledgeFavorites, getKnowledgeRecent, getKnowledgeUploads, saveKnowledgeFavorites, saveKnowledgeRecent, saveKnowledgeUploads } from '../services/knowledgeHubStorage.js'

const resourceFilters = [
  { label: 'All', value: 'all' },
  { label: 'Video', value: 'video' },
  { label: 'PDF', value: 'pdf' },
  { label: 'Docs & decks', value: 'documents' },
  { label: 'Links', value: 'link' },
]

function formatFileSize(bytes) {
  if (!bytes) return 'Local demo item'
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function typeFromFile(fileName = '') {
  const extension = fileName.split('.').pop()?.toLowerCase()
  if (['mp4', 'webm', 'mov'].includes(extension)) return { type: 'video', contentType: 'Video' }
  if (extension === 'pdf') return { type: 'pdf', contentType: 'PDF' }
  if (['doc', 'docx'].includes(extension)) return { type: 'docx', contentType: 'DOCX' }
  if (['ppt', 'pptx'].includes(extension)) return { type: 'ppt', contentType: 'PPT' }
  return { type: 'link', contentType: 'Link' }
}

function answerQuestion(question, items) {
  const normalized = question.toLowerCase()
  const matched = items.find((item) => item.tags?.some((tag) => normalized.includes(tag.toLowerCase())) || normalized.includes(item.category.toLowerCase()))
  if (normalized.includes('upload') || normalized.includes('file')) return 'For this local demo, upload metadata is stored in this browser. Use the Admin Upload page to add a PDF, DOCX, PPT, video or link. A secure backend and access model should be added before storing confidential material.'
  if (normalized.includes('assessment')) return 'Start with the Growth Assessment for a structured view of strategy, digital presence, automation and growth operations. It is a preliminary diagnostic, not a guaranteed result.'
  if (normalized.includes('sales') || normalized.includes('lead')) return 'The AI Sales Agent helps visitors explain their context, surface pain points and move toward a useful next step. Pair it with clear lead capture and human review.'
  if (matched) return `${matched.title}: ${matched.content}`
  return 'The local knowledge set points to a strategy-led approach: clarify the business decision, choose the smallest useful system and keep the next step visible. Try asking about AI, automation, positioning, websites or assessments.'
}

function ResourceIcon({ type }) {
  const label = type === 'video' ? '▶' : type === 'pdf' ? 'PDF' : type === 'link' ? '↗' : type.toUpperCase()
  return <span className={`knowledge-resource-icon knowledge-resource-icon-${type}`} aria-hidden="true">{label}</span>
}

function ResourceCard({ item, favorite, onFavorite, onOpen, compact = false }) {
  return <article className={`knowledge-resource-card ${compact ? 'is-compact' : ''}`}>
    <div className="knowledge-resource-visual"><span className="knowledge-resource-index">{item.featured ? 'Featured' : item.contentType}</span><ResourceIcon type={item.type} /><button type="button" className={`knowledge-favorite-button ${favorite ? 'is-active' : ''}`} aria-label={favorite ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`} aria-pressed={favorite} onClick={() => onFavorite(item.id)}>{favorite ? '★' : '☆'}</button></div>
    <div className="knowledge-resource-body"><div className="knowledge-resource-meta"><span>{item.category}</span><span>{item.duration || item.pages || 'Local resource'}</span></div><h3>{item.title}</h3><p>{item.summary}</p><button type="button" className="knowledge-text-button" onClick={() => onOpen(item)}>{item.type === 'link' && item.href ? 'Open resource' : 'View resource'} <span aria-hidden="true">↗</span></button></div>
  </article>
}

function KnowledgeHubPage({ Header, Footer, admin = false }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [resourceFilter, setResourceFilter] = useState('all')
  const [favorites, setFavorites] = useState([])
  const [recent, setRecent] = useState([])
  const [uploads, setUploads] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [qaHistory, setQaHistory] = useState([])
  const [notice, setNotice] = useState('')
  const [upload, setUpload] = useState({ title: '', category: 'AI Growth', description: '', link: '', file: null })

  useEffect(() => {
    setFavorites(getKnowledgeFavorites())
    setRecent(getKnowledgeRecent())
    setUploads(getKnowledgeUploads())
  }, [])

  const allItems = useMemo(() => [...knowledgeContent, ...uploads], [uploads])
  const itemById = useMemo(() => new Map(allItems.map((item) => [item.id, item])), [allItems])
  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return allItems.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category
      const matchesType = resourceFilter === 'all' || (resourceFilter === 'documents' ? ['docx', 'ppt'].includes(item.type) : item.type === resourceFilter)
      const searchable = [item.title, item.summary, item.category, item.content, ...(item.tags || [])].join(' ').toLowerCase()
      return matchesCategory && matchesType && (!normalized || searchable.includes(normalized))
    })
  }, [allItems, category, query, resourceFilter])

  const recentItems = recent.map((id) => itemById.get(id)).filter(Boolean)
  const favoriteItems = favorites.map((id) => itemById.get(id)).filter(Boolean)
  const recommendedItems = knowledgeRecommendedIds.map((id) => itemById.get(id)).filter(Boolean)
  const videos = filteredItems.filter((item) => item.type === 'video')
  const documents = filteredItems.filter((item) => ['pdf', 'docx', 'ppt'].includes(item.type))
  const links = filteredItems.filter((item) => item.type === 'link')

  const toggleFavorite = (id) => {
    const next = favorites.includes(id) ? favorites.filter((itemId) => itemId !== id) : [id, ...favorites]
    setFavorites(next)
    saveKnowledgeFavorites(next)
  }

  const openItem = (item) => {
    const nextRecent = [item.id, ...recent.filter((id) => id !== item.id)]
    setRecent(nextRecent.slice(0, 6))
    saveKnowledgeRecent(nextRecent)
    setSelectedItem(item)
  }

  const askQuestion = (event) => {
    event.preventDefault()
    const cleanQuestion = question.trim()
    if (!cleanQuestion) return
    const nextAnswer = answerQuestion(cleanQuestion, allItems)
    setAnswer(nextAnswer)
    setQaHistory((history) => [{ question: cleanQuestion, answer: nextAnswer }, ...history].slice(0, 3))
    setQuestion('')
  }

  const handleUpload = (event) => {
    event.preventDefault()
    const fileType = upload.file ? typeFromFile(upload.file.name) : { type: 'link', contentType: 'Link' }
    const title = upload.title.trim() || upload.file?.name || 'Untitled resource'
    if (!upload.file && !upload.link.trim()) {
      setNotice('Add a file or a link before saving the resource.')
      return
    }
    const item = { id: `upload-${Date.now()}`, type: upload.link.trim() ? 'link' : fileType.type, contentType: upload.link.trim() ? 'Link' : fileType.contentType, category: upload.category, title, summary: upload.description.trim() || 'Local resource added through the Knowledge Hub admin area.', pages: upload.file ? formatFileSize(upload.file.size) : 'External link', href: upload.link.trim() || undefined, fileName: upload.file?.name, tags: ['uploaded'], content: upload.description.trim() || `${title} is available as a locally registered Knowledge Hub resource.`, uploadedAt: new Date().toISOString() }
    const nextUploads = [item, ...uploads]
    setUploads(nextUploads)
    saveKnowledgeUploads(nextUploads)
    setUpload({ title: '', category: 'AI Growth', description: '', link: '', file: null })
    event.currentTarget.reset()
    setNotice('Resource added to this browser. A secure backend is required before production uploads.')
  }

  return <div className="knowledge-hub-page"><Header /><main id="main-content" className="knowledge-hub-main">
    {admin ? <section className="knowledge-admin-hero"><div><span className="knowledge-eyebrow">Knowledge Hub / Admin</span><h1>Keep the source<br /><em>close to the work.</em></h1><p>Register local demo resources for the Knowledge Hub. File metadata is stored in this browser only.</p></div><a className="knowledge-outline-button" href="/knowledge-hub/">View Knowledge Hub <span aria-hidden="true">↗</span></a></section> : <section className="knowledge-hub-hero"><div><span className="knowledge-eyebrow">NOVAHAUS / Knowledge Hub</span><h1>The knowledge behind<br /><em>the next move.</em></h1><p>A focused library of guidance, demos and working references for businesses building clearer brands, stronger digital journeys and practical AI systems.</p></div><div className="knowledge-hero-signal"><span>Local knowledge layer</span><strong>{allItems.length.toString().padStart(2, '0')}</strong><small>resources ready to explore</small></div></section>}
    {admin ? <section className="knowledge-admin-panel" aria-labelledby="knowledge-admin-title"><div><span className="knowledge-eyebrow">Admin upload</span><h2 id="knowledge-admin-title">Add a resource<br /><em>to the library.</em></h2><p>Supported: PDF, DOCX, PPT, video and links. This demo stores metadata locally and does not upload files to a server.</p></div><form className="knowledge-upload-form" onSubmit={handleUpload}><label>Title<input value={upload.title} onChange={(event) => setUpload({ ...upload, title: event.target.value })} placeholder="Resource title" /></label><label>Category<select value={upload.category} onChange={(event) => setUpload({ ...upload, category: event.target.value })}>{knowledgeCategories.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}</select></label><label>Description<textarea value={upload.description} onChange={(event) => setUpload({ ...upload, description: event.target.value })} placeholder="What will a client learn?" rows="4" /></label><label>Link (optional)<input type="url" value={upload.link} onChange={(event) => setUpload({ ...upload, link: event.target.value })} placeholder="https://..." /></label><label>File (optional)<input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.webm,.mov" onChange={(event) => setUpload({ ...upload, file: event.target.files?.[0] || null })} /></label><button className="knowledge-dark-button" type="submit">Save Resource <span aria-hidden="true">↗</span></button>{notice && <p className="knowledge-form-notice" role="status">{notice}</p>}</form></section> : <>
      <section className="knowledge-qa-card" aria-labelledby="knowledge-qa-title"><div><span className="knowledge-eyebrow">Ask NOVAHAUS AI</span><h2 id="knowledge-qa-title">Find the useful<br /><em>starting point.</em></h2><p>Ask a question about growth, AI, positioning, websites or operations. This V1 uses local demo content; no external AI API is connected.</p></div><form className="knowledge-qa-form" onSubmit={askQuestion}><label htmlFor="knowledge-question">Your question</label><div><input id="knowledge-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="How should we approach AI automation?" /><button className="knowledge-gold-button" type="submit">Ask <span aria-hidden="true">↗</span></button></div>{answer && <div className="knowledge-answer" role="status"><span>Local answer</span><p>{answer}</p></div>}</form></section>
      <section className="knowledge-library-section" aria-labelledby="knowledge-library-title"><div className="knowledge-section-heading"><div><span className="knowledge-eyebrow">Explore the library</span><h2 id="knowledge-library-title">Signals worth<br /><em>returning to.</em></h2></div><div className="knowledge-library-count"><strong>{filteredItems.length.toString().padStart(2, '0')}</strong><span>matching resources</span></div></div><div className="knowledge-controls"><label className="knowledge-search"><span className="knowledge-visually-hidden">Search knowledge hub</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the library..." /><span aria-hidden="true">⌕</span></label><div className="knowledge-filter-row" aria-label="Resource type filters">{resourceFilters.map((filter) => <button type="button" key={filter.value} className={resourceFilter === filter.value ? 'is-active' : ''} onClick={() => setResourceFilter(filter.value)}>{filter.label}</button>)}</div></div><div className="knowledge-category-row" aria-label="Knowledge categories">{knowledgeCategories.map((item) => <button type="button" key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>{filteredItems.length ? <div className="knowledge-resource-grid">{filteredItems.map((item) => <ResourceCard key={item.id} item={item} favorite={favorites.includes(item.id)} onFavorite={toggleFavorite} onOpen={openItem} />)}</div> : <div className="knowledge-empty-state"><span>00</span><h3>No matching resources.</h3><p>Try a broader search or choose another category.</p></div>}</section>
      <section className="knowledge-library-split"><div><div className="knowledge-subsection-heading"><span className="knowledge-eyebrow">Video library</span><h2>Watch the<br /><em>short version.</em></h2></div><div className="knowledge-mini-grid">{videos.slice(0, 2).map((item) => <ResourceCard key={item.id} item={item} compact favorite={favorites.includes(item.id)} onFavorite={toggleFavorite} onOpen={openItem} />)}</div></div><div><div className="knowledge-subsection-heading"><span className="knowledge-eyebrow">PDF & document library</span><h2>Keep the<br /><em>working reference.</em></h2></div><div className="knowledge-mini-grid">{documents.slice(0, 2).map((item) => <ResourceCard key={item.id} item={item} compact favorite={favorites.includes(item.id)} onFavorite={toggleFavorite} onOpen={openItem} />)}</div></div></section>
      <section className="knowledge-utility-grid"><div className="knowledge-utility-panel"><div className="knowledge-subsection-heading"><span className="knowledge-eyebrow">Recently viewed</span><h2>Pick up<br /><em>where you left off.</em></h2></div>{recentItems.length ? <div className="knowledge-list">{recentItems.slice(0, 4).map((item) => <button type="button" key={item.id} onClick={() => openItem(item)}><span>{item.contentType}</span><strong>{item.title}</strong><i aria-hidden="true">↗</i></button>)}</div> : <p className="knowledge-muted-copy">Open a resource and it will appear here for the next visit.</p>}</div><div className="knowledge-utility-panel"><div className="knowledge-subsection-heading"><span className="knowledge-eyebrow">Recommended content</span><h2>Start with<br /><em>the essentials.</em></h2></div><div className="knowledge-list">{recommendedItems.map((item) => <button type="button" key={item.id} onClick={() => openItem(item)}><span>{item.contentType}</span><strong>{item.title}</strong><i aria-hidden="true">↗</i></button>)}</div></div></section>
      <section className="knowledge-favorites-section"><div className="knowledge-subsection-heading"><span className="knowledge-eyebrow">Favorites</span><h2>Keep what<br /><em>matters close.</em></h2></div>{favoriteItems.length ? <div className="knowledge-mini-grid knowledge-favorites-grid">{favoriteItems.map((item) => <ResourceCard key={item.id} item={item} compact favorite onFavorite={toggleFavorite} onOpen={openItem} />)}</div> : <p className="knowledge-muted-copy">Save a resource with the star to build a personal shortlist.</p>}</section>
      <section className="knowledge-faq-section" aria-labelledby="knowledge-faq-title"><div className="knowledge-subsection-heading"><span className="knowledge-eyebrow">FAQ</span><h2 id="knowledge-faq-title">Good questions<br /><em>before you begin.</em></h2></div><div className="knowledge-faq-list">{knowledgeFaqs.map((item) => <details key={item.question}><summary>{item.question}<span className="knowledge-faq-plus" /></summary><p>{item.answer}</p></details>)}</div></section>
      <section className="knowledge-admin-link"><div><span className="knowledge-eyebrow">For the NOVAHAUS team</span><h2>Have a new reference<br /><em>to add?</em></h2></div><a className="knowledge-outline-button" href="/knowledge-hub/admin/">Open Admin Upload <span aria-hidden="true">↗</span></a></section>
    </>}
    {selectedItem && <div className="knowledge-modal-backdrop" role="presentation" onClick={() => setSelectedItem(null)}><div className="knowledge-modal" role="dialog" aria-modal="true" aria-labelledby="knowledge-modal-title" onClick={(event) => event.stopPropagation()}><button type="button" className="knowledge-modal-close" aria-label="Close resource preview" onClick={() => setSelectedItem(null)}>×</button><ResourceIcon type={selectedItem.type} /><span className="knowledge-eyebrow">{selectedItem.category} / {selectedItem.contentType}</span><h2 id="knowledge-modal-title">{selectedItem.title}</h2><p>{selectedItem.content}</p><div className="knowledge-modal-meta"><span>{selectedItem.duration || selectedItem.pages || 'Local demo resource'}</span>{selectedItem.fileName && <span>{selectedItem.fileName}</span>}</div>{selectedItem.href ? <a className="knowledge-dark-button" href={selectedItem.href}>Open resource <span aria-hidden="true">↗</span></a> : <button className="knowledge-dark-button" type="button" onClick={() => setSelectedItem(null)}>Close preview <span aria-hidden="true">↗</span></button>}</div></div>}
  </main><Footer /></div>
}

export default KnowledgeHubPage
