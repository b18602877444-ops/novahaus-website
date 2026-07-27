import { useMemo, useState } from 'react'
import BrandLogo from '../BrandLogo.jsx'
import { leadStatuses } from '../../data/leadSchema.js'
import { deleteLead, listLeads, updateLead } from '../../services/leadStorage.js'

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function LeadDetail({ lead, onBack, onChange }) {
  return <section className="lead-review-detail" aria-labelledby="lead-detail-title"><button className="lead-review-back" type="button" onClick={onBack}>← All leads</button><div className="lead-review-detail-head"><div><span className="leads-eyebrow">Lead detail</span><h2 id="lead-detail-title">{lead.name || 'Unnamed lead'}</h2><p>{lead.company || 'Company not provided'} · {lead.email || 'Email not provided'}</p></div><select value={lead.status} aria-label="Lead status" onChange={(event) => onChange(updateLead(lead.id, { status: event.target.value }))}>{leadStatuses.map((status) => <option key={status}>{status}</option>)}</select></div><div className="lead-review-detail-grid"><div><span>Name</span><strong>{lead.name || '—'}</strong></div><div><span>Company</span><strong>{lead.company || '—'}</strong></div><div><span>Country</span><strong>{lead.country || '—'}</strong></div><div><span>Business type</span><strong>{lead.businessType || '—'}</strong></div><div><span>Interested package</span><strong>{lead.interestedPackage || '—'}</strong></div><div><span>WhatsApp</span><strong>{lead.whatsapp || '—'}</strong></div></div><div className="lead-review-summary"><span>AI Summary</span><pre>{lead.aiSummary || 'Summary will appear after the conversation is completed.'}</pre></div><div className="lead-review-detail-actions"><button className="lead-review-danger" type="button" onClick={() => { deleteLead(lead.id); onChange(null); onBack() }}>Delete local lead</button></div></section>
}

function LeadsPage() {
  const [leads, setLeads] = useState(() => listLeads())
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [selectedId, setSelectedId] = useState('')
  const selectedLead = leads.find((lead) => lead.id === selectedId)
  const filteredLeads = useMemo(() => leads.filter((lead) => {
    const haystack = `${lead.name} ${lead.company} ${lead.email} ${lead.country} ${lead.interestedPackage}`.toLowerCase()
    return (!query.trim() || haystack.includes(query.trim().toLowerCase())) && (status === 'all' || lead.status === status)
  }), [leads, query, status])

  const refreshLead = (nextLead) => {
    setLeads(listLeads())
    if (nextLead) setSelectedId(nextLead.id)
  }

  return <div className="leads-review-page"><header className="leads-review-header"><a href="/" aria-label="NOVAHAUS home"><BrandLogo className="leads-review-logo" /></a><span>Internal Lead Review</span><a href="/ai-sales-agent/" className="leads-review-agent-link">Open AI Sales Agent ↗</a></header><main className="leads-review-main"><div className="leads-review-intro"><span className="leads-eyebrow">Local workspace / {leads.length} lead{leads.length === 1 ? '' : 's'}</span><h1>Leads ready<br /><em>for a useful next step.</em></h1><p>Review conversations captured by NOVAHAUS AI. This page reads only from this browser&apos;s local storage.</p></div>{selectedLead ? <LeadDetail lead={selectedLead} onBack={() => setSelectedId('')} onChange={refreshLead} /> : <section className="lead-review-list" aria-labelledby="lead-list-title"><div className="lead-review-toolbar"><h2 id="lead-list-title">Lead list</h2><div><label className="lead-review-search"><span className="leads-sr-only">Search leads</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, company..." /></label><label className="lead-review-filter"><span className="leads-sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{leadStatuses.map((item) => <option key={item}>{item}</option>)}</select></label></div></div>{filteredLeads.length ? <div className="lead-review-table-wrap"><table className="lead-review-table"><thead><tr><th>Name</th><th>Company</th><th>Country</th><th>Package</th><th>Status</th><th>Created</th><th><span className="leads-sr-only">Open</span></th></tr></thead><tbody>{filteredLeads.map((lead) => <tr key={lead.id} onClick={() => setSelectedId(lead.id)}><td><strong>{lead.name || 'Unnamed lead'}</strong><small>{lead.email}</small></td><td>{lead.company || '—'}</td><td>{lead.country || '—'}</td><td>{lead.interestedPackage || '—'}</td><td><span className={`lead-status lead-status-${lead.status}`}>{lead.status}</span></td><td>{formatDate(lead.createdAt)}</td><td><button type="button" aria-label={`Open lead ${lead.name || lead.id}`} onClick={(event) => { event.stopPropagation(); setSelectedId(lead.id) }}>View ↗</button></td></tr>)}</tbody></table></div> : <div className="lead-review-empty"><span>01</span><h3>No leads match this view.</h3><p>Complete the AI Sales Agent conversation to create a locally stored lead.</p><a href="/ai-sales-agent/" className="button-dark">Open AI Sales Agent ↗</a></div>}</section>}</main></div>
}

export default LeadsPage
