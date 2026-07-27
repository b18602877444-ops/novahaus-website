import { useEffect, useMemo, useState } from 'react'
import BrandLogo from '../BrandLogo.jsx'
import { crmHealthStatuses, crmStatuses, crmViews, deleteCrmRecord, listCrmRecords, saveCrmRecord, updateCrmRecord } from '../../services/crmStorage.js'

const blankRecord = { company: '', contact: '', country: '', industry: '', source: 'manual', status: 'lead', package: '', value: '', nextFollowUp: '', notes: '', health: 'new' }

function formatDate(value) {
  if (!value) return 'Not set'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date)
}

function labelFor(value) {
  return value.replaceAll('-', ' ')
}

function StatCard({ label, value, detail }) {
  return <div className="crm-stat-card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
}

function RecordForm({ record, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({ ...blankRecord, ...record }))
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event) => { event.preventDefault(); if (!form.company.trim() && !form.contact.trim()) return; onSave(form) }
  return <form className="crm-record-form" onSubmit={submit} aria-label={record ? 'Edit CRM record' : 'Add CRM record'}><div className="crm-form-heading"><div><span className="crm-eyebrow">Local record</span><h2>{record ? 'Edit record' : 'Add a client record'}</h2></div><button className="crm-icon-button" type="button" onClick={onCancel} aria-label="Close record form">×</button></div><div className="crm-form-grid"><label><span>Company</span><input value={form.company} onChange={(event) => update('company', event.target.value)} placeholder="Company name" /></label><label><span>Contact</span><input value={form.contact} onChange={(event) => update('contact', event.target.value)} placeholder="Contact name" /></label><label><span>Country</span><input value={form.country} onChange={(event) => update('country', event.target.value)} placeholder="Country or market" /></label><label><span>Industry</span><input value={form.industry} onChange={(event) => update('industry', event.target.value)} placeholder="Industry" /></label><label><span>Source</span><input value={form.source} onChange={(event) => update('source', event.target.value)} placeholder="Referral, booking, event..." /></label><label><span>Package</span><input value={form.package} onChange={(event) => update('package', event.target.value)} placeholder="Package or service" /></label><label><span>Status</span><select value={form.status} onChange={(event) => update('status', event.target.value)}>{crmStatuses.map((item) => <option key={item} value={item}>{labelFor(item)}</option>)}</select></label><label><span>Health</span><select value={form.health} onChange={(event) => update('health', event.target.value)}>{crmHealthStatuses.map((item) => <option key={item} value={item}>{labelFor(item)}</option>)}</select></label><label><span>Value</span><input value={form.value} onChange={(event) => update('value', event.target.value)} placeholder="USD range or note" /></label><label><span>Next Follow-up</span><input type="date" value={form.nextFollowUp} onChange={(event) => update('nextFollowUp', event.target.value)} /></label><label className="crm-form-wide"><span>Notes</span><textarea value={form.notes} onChange={(event) => update('notes', event.target.value)} rows="4" placeholder="Context, challenge or next action" /></label></div><div className="crm-form-actions"><button className="crm-secondary-button" type="button" onClick={onCancel}>Cancel</button><button className="crm-primary-button" type="submit">Save record <span aria-hidden="true">↗</span></button></div></form>
}

function RecordCard({ record, onSelect, onStatusChange }) {
  return <article className="crm-record-card"><button className="crm-record-main" type="button" onClick={() => onSelect(record)}><div className="crm-record-top"><div><span className="crm-record-company">{record.company || 'Company not provided'}</span><strong>{record.contact || 'Contact not provided'}</strong></div><span className={`crm-badge crm-badge-${record.status}`}>{labelFor(record.status)}</span></div><div className="crm-record-grid"><div><span>Country</span><strong>{record.country || '—'}</strong></div><div><span>Industry</span><strong>{record.industry || '—'}</strong></div><div><span>Source</span><strong>{record.source || '—'}</strong></div><div><span>Package</span><strong>{record.package || '—'}</strong></div><div><span>Value</span><strong>{record.value || '—'}</strong></div><div><span>Next follow-up</span><strong>{formatDate(record.nextFollowUp)}</strong></div></div><p className="crm-record-notes">{record.notes || 'No notes recorded.'}</p></button><div className="crm-record-footer"><label><span>Move to</span><select value={record.status} onChange={(event) => onStatusChange(record.id, event.target.value)} aria-label={`Change status for ${record.company || record.contact || 'record'}`}>{crmStatuses.map((item) => <option key={item} value={item}>{labelFor(item)}</option>)}</select></label><span className={`crm-health crm-health-${record.health}`}>{labelFor(record.health)}</span></div></article>
}

function CRMPage() {
  const [records, setRecords] = useState(() => listCrmRecords())
  const [view, setView] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [formOpen, setFormOpen] = useState(false)

  const refresh = () => setRecords(listCrmRecords())
  useEffect(() => {
    const handleRefresh = () => refresh()
    window.addEventListener('storage', handleRefresh)
    window.addEventListener('focus', handleRefresh)
    return () => { window.removeEventListener('storage', handleRefresh); window.removeEventListener('focus', handleRefresh) }
  }, [])

  const filteredRecords = useMemo(() => records.filter((record) => {
    const haystack = `${record.company} ${record.contact} ${record.country} ${record.industry} ${record.source} ${record.package} ${record.notes}`.toLowerCase()
    const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase())
    const matchesView = view === 'all' || view === 'health' ? true : record.status === view
    return matchesQuery && matchesView
  }), [records, query, view])

  const stats = useMemo(() => ({ total: records.length, active: records.filter((record) => !['won', 'lost'].includes(record.status)).length, followUps: records.filter((record) => record.nextFollowUp).length, healthy: records.filter((record) => record.health === 'healthy').length }), [records])
  const viewLabel = crmViews.find((item) => item.id === view)?.label || 'Lead List'
  const displayRecords = view === 'health' ? filteredRecords.filter((record) => record.health !== 'new' || record.status === 'won') : filteredRecords

  const handleSave = (input) => { saveCrmRecord(input); setFormOpen(false); setSelected(null); refresh() }
  const handleStatusChange = (id, status) => { updateCrmRecord(id, { status, health: status === 'won' ? 'healthy' : status === 'lost' ? 'at-risk' : undefined }); refresh() }
  const handleDelete = (record) => { if (!window.confirm(`Delete ${record.company || record.contact || 'this record'} from this browser?`)) return; deleteCrmRecord(record.id); setSelected(null); refresh() }

  return <div className="crm-page"><header className="crm-header"><a href="/" aria-label="NOVAHAUS home"><BrandLogo className="crm-logo" /></a><span>Local CRM Workspace</span><div className="crm-header-actions"><a href="/bookings/">Booking requests ↗</a><a href="/">Return to NOVAHAUS ↗</a></div></header><main className="crm-main"><div className="crm-intro"><div><span className="crm-eyebrow">NOVAHAUS / Revenue workspace</span><h1>Keep the next<br /><em>move visible.</em></h1><p>One local workspace for leads, conversations, proposals and client health. Data remains in this browser and is not sent to an external database.</p></div><button className="crm-primary-button crm-intro-action" type="button" onClick={() => { setSelected(null); setFormOpen(true) }}>Add client record <span aria-hidden="true">↗</span></button></div><section className="crm-stats" aria-label="CRM summary"><StatCard label="Total records" value={stats.total} detail="All local sources" /><StatCard label="Active pipeline" value={stats.active} detail="Before won or lost" /><StatCard label="Follow-ups" value={stats.followUps} detail="Next action recorded" /><StatCard label="Healthy" value={stats.healthy} detail="Client health view" /></section><section className="crm-workspace" aria-label="CRM dashboard"><aside className="crm-sidebar"><span className="crm-eyebrow">Views</span><nav aria-label="CRM views">{crmViews.map((item) => <button className={view === item.id ? 'is-active' : ''} type="button" key={item.id} onClick={() => setView(item.id)}><span>{item.label}</span><strong>{item.id === 'all' ? records.length : item.id === 'health' ? records.filter((record) => record.health !== 'new' || record.status === 'won').length : records.filter((record) => record.status === item.id).length}</strong></button>)}</nav><p className="crm-sidebar-note">Booking and AI Sales Agent records are imported from their existing local storage when this workspace opens.</p></aside><div className="crm-content"><div className="crm-content-head"><div><span className="crm-eyebrow">Current view</span><h2>{viewLabel}</h2></div><div className="crm-toolbar"><label><span className="crm-sr-only">Search CRM</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records..." /></label><button className="crm-secondary-button" type="button" onClick={refresh}>Refresh</button></div></div>{formOpen && <RecordForm record={selected} onSave={handleSave} onCancel={() => { setFormOpen(false); setSelected(null) }} />}{!formOpen && <>{displayRecords.length ? <div className="crm-record-list">{displayRecords.map((record) => <RecordCard key={record.id} record={record} onSelect={(item) => { setSelected(item); setFormOpen(true) }} onStatusChange={handleStatusChange} />)}</div> : <div className="crm-empty"><span>01</span><h3>No records in this view.</h3><p>Import a Booking or AI Sales Agent record, or add a client manually to begin.</p><button className="crm-primary-button" type="button" onClick={() => setFormOpen(true)}>Add client record <span aria-hidden="true">↗</span></button></div>}</>}</div></section></main></div>
}

export default CRMPage
