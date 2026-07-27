import { useEffect, useMemo, useState } from 'react'
import ProposalPreview from './ProposalPreview.jsx'
import { defaultPhases, proposalProducts } from '../data/proposalTemplates.js'
import { createProposalFromAssessment, createProposalFromSalesAgent, createProposalSummary, createEmptyProposal, applyProductTemplate } from '../lib/proposalGenerator.js'
import { ASSESSMENT_STORAGE_KEY } from '../services/assessmentSubmission.js'
import { clearProposalPrefill, readProposalPrefill } from '../services/aiSalesAgentProposal.js'
import { createProposalVersion, deleteProposal, duplicateProposal, listSavedProposals, loadProposal, saveProposal } from '../services/proposalStorage.js'
import { trackAssessmentEvent } from '../lib/analytics.js'

const fieldGroups = [
  ['Client Information', [['name', 'Client Name', 'text', true], ['company', 'Company', 'text', true], ['email', 'Contact Email', 'email', true], ['whatsapp', 'WhatsApp', 'tel', false], ['website', 'Website', 'url', false], ['country', 'Country', 'text', false], ['industry', 'Industry', 'text', false], ['businessStage', 'Business Stage', 'text', false], ['teamSize', 'Team Size', 'text', false], ['primaryGoal', 'Primary Goal', 'text', false], ['mainChallenges', 'Main Challenges', 'text', false], ['indicativeBudget', 'Indicative Budget', 'text', false], ['preferredTimeline', 'Preferred Timeline', 'text', false]]],
]

const noteFields = [['currentSituation', 'Current Situation'], ['businessObjectives', 'Business Objectives'], ['keyProblems', 'Key Problems'], ['opportunitiesIdentified', 'Opportunities Identified'], ['risksOrConstraints', 'Risks or Constraints'], ['decisionMakers', 'Decision Makers'], ['additionalNotes', 'Additional Notes']]
const contentFields = [['executiveSummary', 'Executive Summary'], ['recommendedApproach', 'Recommended Approach'], ['scopeOfWork', 'Scope of Work'], ['deliverables', 'Deliverables'], ['projectPhases', 'Project Phases'], ['indicativeTimeline', 'Indicative Timeline'], ['clientResponsibilities', 'Client Responsibilities'], ['novahausResponsibilities', 'NOVAHAUS Responsibilities'], ['exclusions', 'Exclusions'], ['nextSteps', 'Next Steps']]

function Field({ id, label, value, onChange, type = 'text', required = false, error }) {
  return <label className="proposal-field" htmlFor={`proposal-${id}`}><span>{label}{required && <b aria-hidden="true"> *</b>}</span><input id={`proposal-${id}`} name={id} type={type} value={value || ''} onChange={(event) => onChange(event.target.value)} required={required} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? `proposal-error-${id}` : undefined} />{error && <small id={`proposal-error-${id}`} className="proposal-field-error" role="alert">{error}</small>}</label>
}

function TextareaField({ id, label, value, onChange }) {
  return <label className="proposal-field proposal-textarea-field" htmlFor={`proposal-${id}`}><span>{label}</span><textarea id={`proposal-${id}`} value={value || ''} onChange={(event) => onChange(event.target.value)} rows={4} /></label>
}

function Section({ number, title, children, className = '' }) {
  return <section className={`proposal-builder-section ${className}`}><div className="proposal-builder-section-heading"><span>{number}</span><h2>{title}</h2></div>{children}</section>
}

function ProposalBuilder() {
  const [proposal, setProposal] = useState(() => createEmptyProposal())
  const [saved, setSaved] = useState(() => listSavedProposals())
  const [mode, setMode] = useState('builder')
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [dirty, setDirty] = useState(false)

  const summary = useMemo(() => createProposalSummary(proposal), [proposal])

  useEffect(() => {
    const prefill = readProposalPrefill()
    if (!prefill) return
    setProposal((current) => createProposalFromSalesAgent(current, prefill))
    setDirty(true)
    setNotice('AI Sales Agent context imported. Review the draft before saving.')
    clearProposalPrefill()
  }, [])
  const update = (next) => { setProposal(next); setDirty(true); setNotice('') }
  const updateClient = (key, value) => update({ ...proposal, client: { ...proposal.client, [key]: value } })
  const updateNotes = (key, value) => update({ ...proposal, notes: { ...proposal.notes, [key]: value } })
  const updateContent = (key, value) => update({ ...proposal, content: { ...proposal.content, [key]: value } })
  const updateInvestment = (key, value) => update({ ...proposal, investment: { ...proposal.investment, [key]: value } })

  const validate = () => {
    const next = {}
    if (!proposal.client.name.trim()) next.name = 'Client name is required.'
    if (!proposal.client.company.trim()) next.company = 'Company is required.'
    if (!proposal.client.email.trim()) next.email = 'Contact email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(proposal.client.email)) next.email = 'Enter a valid email address.'
    ;['projectFee', 'monthlyRetainer', 'setupFee'].forEach((key) => { if (proposal.investment[key] && Number.isNaN(Number(proposal.investment[key]))) next[key] = 'Use a number or leave this blank.' })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = () => {
    if (!validate()) { setNotice('Please complete the required fields before saving.'); return }
    const next = saveProposal(proposal)
    setProposal(next)
    setSaved(listSavedProposals())
    setDirty(false)
    setNotice('Draft saved in this browser.')
    trackAssessmentEvent(saved.some((item) => item.proposalId === next.proposalId) ? 'proposal_saved' : 'proposal_created', { proposalId: next.proposalId })
  }

  const importLatestAssessment = () => {
    if (dirty && !window.confirm('Importing the latest assessment may replace existing client fields. Continue?')) return
    try {
      const stored = JSON.parse(window.localStorage.getItem(ASSESSMENT_STORAGE_KEY) || '{}')
      const assessments = Array.isArray(stored.assessments) ? stored.assessments : []
      const latest = assessments[assessments.length - 1]
      if (!latest) { setNotice('No Growth Assessment is stored in this browser yet.'); return }
      update(createProposalFromAssessment(proposal, latest))
      trackAssessmentEvent('assessment_imported', { proposalId: proposal.proposalId })
      setNotice('Latest Growth Assessment imported. Review the fields before saving.')
    } catch { setNotice('The latest Growth Assessment could not be read from this browser.') }
  }

  const changeProduct = (value) => {
    if (dirty && !window.confirm('Changing the product will replace the current proposal template. Continue?')) return
    update(applyProductTemplate(proposal, value))
  }

  const addScope = () => update({ ...proposal, scopeItems: [...proposal.scopeItems, { id: `scope-${Date.now()}`, category: 'Strategy', title: 'New scope item', description: '', inclusion: 'Optional', phase: defaultPhases[0].name, duration: 'To be confirmed' }] })
  const updateScope = (id, key, value) => update({ ...proposal, scopeItems: proposal.scopeItems.map((item) => item.id === id ? { ...item, [key]: value } : item) })
  const moveScope = (index, direction) => { const next = [...proposal.scopeItems]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; update({ ...proposal, scopeItems: next }) }
  const removeScope = (id) => update({ ...proposal, scopeItems: proposal.scopeItems.filter((item) => item.id !== id) })
  const updatePhase = (id, key, value) => update({ ...proposal, phases: proposal.phases.map((phase) => phase.id === id ? { ...phase, [key]: value } : phase) })

  const loadRecord = (record) => { const next = loadProposal(record); if (!next) return; update(next); setDirty(false); setErrors({}); setNotice(`Loaded proposal ${record.proposalId} · version ${record.versionNumber}.`) }
  const duplicate = () => { const next = duplicateProposal(proposal); setProposal(next); setDirty(true); setErrors({}); setNotice('A duplicate proposal is ready to edit. Save it when ready.') }
  const newVersion = () => { const next = createProposalVersion(proposal); setProposal(next); setDirty(true); setErrors({}); setNotice(`Version ${next.versionNumber} is ready to edit.`); trackAssessmentEvent('proposal_version_created', { proposalId: next.proposalId, version: next.versionNumber }) }
  const remove = () => { if (!window.confirm('Delete this saved proposal version? This cannot be undone.')) return; deleteProposal(proposal.proposalId, proposal.versionNumber); setSaved(listSavedProposals()); setNotice('Saved proposal deleted from this browser.') }
  const copySummary = async () => { try { await navigator.clipboard.writeText(summary); setNotice('Proposal summary copied.'); trackAssessmentEvent('proposal_summary_copied', { proposalId: proposal.proposalId }) } catch { setNotice('Copy is unavailable in this browser. Select the summary text manually.') } }
  const downloadJson = () => { const blob = new Blob([JSON.stringify(proposal, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${proposal.client.company || 'novahaus-proposal'}-v${proposal.versionNumber}.json`; link.click(); URL.revokeObjectURL(url) }
  const printProposal = () => { trackAssessmentEvent('proposal_printed', { proposalId: proposal.proposalId }); window.print() }
  const changeStatus = (value) => { update({ ...proposal, status: value }); trackAssessmentEvent('proposal_status_changed', { proposalId: proposal.proposalId, status: value }) }

  return <div className="proposal-tool-shell">
    <div className="proposal-tool-toolbar"><div><span className="proposal-tool-eyebrow">NOVAHAUS Internal Proposal Tool</span><p>Private workspace · local browser storage only</p></div><div className="proposal-toolbar-actions"><button type="button" className={mode === 'builder' ? 'is-active' : ''} onClick={() => setMode('builder')}>Edit proposal</button><button type="button" className={mode === 'preview' ? 'is-active' : ''} onClick={() => setMode('preview')}>Preview</button></div></div>
    <div className="proposal-security-notice" role="note">Proposal data is currently stored only in this browser. Do not use this tool on a shared or public device.</div>
    {mode === 'preview' ? <div className="proposal-preview-wrap"><div className="proposal-preview-actions"><button type="button" className="proposal-button proposal-button-dark" onClick={printProposal}>Print / Save as PDF</button><button type="button" className="proposal-button" onClick={copySummary}>Copy Proposal Summary</button><button type="button" className="proposal-button" onClick={downloadJson}>Download Proposal Data as JSON</button></div><ProposalPreview proposal={proposal} /></div> : <div className="proposal-builder-layout">
      <div className="proposal-builder-main">
        <div className="proposal-builder-intro"><span>Internal use only</span><h1>Prepare the next<br /><em>useful conversation.</em></h1><p>Build a considered proposal from a Growth Assessment or start with a blank engagement. Nothing is sent from this tool.</p></div>
        {notice && <div className="proposal-notice" role="status" aria-live="polite">{notice}</div>}
        <Section number="01" title="Client information"><div className="proposal-form-grid">{fieldGroups.flatMap(([, fields]) => fields).map(([id, label, type, required]) => <Field key={id} id={id} label={label} type={type} required={required} value={proposal.client[id]} onChange={(value) => updateClient(id, value)} error={errors[id]} />)}</div><button type="button" className="proposal-button proposal-import-button" onClick={importLatestAssessment}>Import Latest Growth Assessment</button></Section>
        <Section number="02" title="Strategy notes"><div className="proposal-notes-grid">{noteFields.map(([id, label]) => <TextareaField key={id} id={id} label={label} value={proposal.notes[id]} onChange={(value) => updateNotes(id, value)} />)}</div></Section>
        <Section number="03" title="Recommended engagement"><div className="proposal-product-grid">{proposalProducts.map((product) => <label key={product.value} className={`proposal-product-option ${proposal.selectedProduct === product.value ? 'is-selected' : ''}`}><input type="radio" name="proposal-product" checked={proposal.selectedProduct === product.value} onChange={() => changeProduct(product.value)} /><span>{product.label}</span><small>{product.description}</small></label>)}</div><div className="proposal-template-grid">{contentFields.map(([id, label]) => <TextareaField key={id} id={id} label={label} value={proposal.content[id]} onChange={(value) => updateContent(id, value)} />)}</div></Section>
        <Section number="04" title="Scope builder"><div className="proposal-builder-list">{proposal.scopeItems.map((item, index) => <div className="proposal-scope-row" key={item.id}><div className="proposal-scope-row-heading"><strong>{item.category}</strong><span>Item {String(index + 1).padStart(2, '0')}</span><div><button type="button" aria-label={`Move ${item.title} up`} onClick={() => moveScope(index, -1)}>↑</button><button type="button" aria-label={`Move ${item.title} down`} onClick={() => moveScope(index, 1)}>↓</button><button type="button" aria-label={`Remove ${item.title}`} onClick={() => removeScope(item.id)}>×</button></div></div><div className="proposal-scope-grid"><Field id={`${item.id}-title`} label="Title" value={item.title} onChange={(value) => updateScope(item.id, 'title', value)} /><Field id={`${item.id}-duration`} label="Estimated duration" value={item.duration} onChange={(value) => updateScope(item.id, 'duration', value)} /><label className="proposal-field"><span>Category</span><select value={item.category} onChange={(event) => updateScope(item.id, 'category', event.target.value)}><option>Strategy</option><option>Digital Experience</option><option>AI & Automation</option><option>Growth Operations</option></select></label><label className="proposal-field"><span>Included / Optional</span><select value={item.inclusion} onChange={(event) => updateScope(item.id, 'inclusion', event.target.value)}><option>Included</option><option>Optional</option></select></label></div><TextareaField id={`${item.id}-description`} label="Description" value={item.description} onChange={(value) => updateScope(item.id, 'description', value)} /></div>)}</div><button type="button" className="proposal-button" onClick={addScope}>+ Add scope item</button></Section>
        <Section number="05" title="Timeline builder"><div className="proposal-phase-list">{proposal.phases.map((phase, index) => <div className="proposal-phase-row" key={phase.id}><div className="proposal-phase-index">0{index + 1}</div><div className="proposal-phase-fields"><Field id={`${phase.id}-name`} label="Phase name" value={phase.name} onChange={(value) => updatePhase(phase.id, 'name', value)} /><Field id={`${phase.id}-duration`} label="Duration" value={phase.duration} onChange={(value) => updatePhase(phase.id, 'duration', value)} /><TextareaField id={`${phase.id}-activities`} label="Activities" value={phase.activities} onChange={(value) => updatePhase(phase.id, 'activities', value)} /><TextareaField id={`${phase.id}-deliverables`} label="Deliverables" value={phase.deliverables} onChange={(value) => updatePhase(phase.id, 'deliverables', value)} /></div></div>)}</div></Section>
        <Section number="06" title="Investment"><div className="proposal-form-grid proposal-investment-grid"><label className="proposal-field"><span>Currency</span><select value={proposal.investment.currency} onChange={(event) => updateInvestment('currency', event.target.value)}>{['USD', 'MYR', 'SGD', 'EUR', 'GBP'].map((currency) => <option key={currency}>{currency}</option>)}</select></label>{[['projectFee', 'Project Fee'], ['monthlyRetainer', 'Monthly Retainer'], ['setupFee', 'Setup Fee'], ['optionalAddOns', 'Optional Add-ons']].map(([id, label]) => <Field key={id} id={id} label={label} type="number" value={proposal.investment[id]} onChange={(value) => updateInvestment(id, value)} error={errors[id]} />)}<TextareaField id="paymentTerms" label="Payment Terms" value={proposal.investment.paymentTerms} onChange={(value) => updateInvestment('paymentTerms', value)} /><Field id="validity" label="Proposal Validity" value={proposal.investment.validity} onChange={(value) => updateInvestment('validity', value)} /><TextareaField id="investment-note" label="Investment note" value={proposal.investment.note} onChange={(value) => updateInvestment('note', value)} /></div></Section>
        <Section number="07" title="Save and send internally" className="proposal-save-section"><div className="proposal-form-grid"><label className="proposal-field"><span>Status</span><select value={proposal.status} onChange={(event) => changeStatus(event.target.value)}>{['Draft', 'Ready for Review', 'Sent', 'Accepted', 'Declined', 'Archived'].map((status) => <option key={status}>{status}</option>)}</select></label></div><div className="proposal-action-row"><button type="button" className="proposal-button proposal-button-gold" onClick={handleSave}>Save Draft</button><button type="button" className="proposal-button" onClick={duplicate}>Duplicate Proposal</button><button type="button" className="proposal-button" onClick={newVersion}>Create New Version</button><button type="button" className="proposal-button proposal-button-danger" onClick={remove}>Delete Proposal</button></div></Section>
      </div>
      <aside className="proposal-builder-sidebar"><div className="proposal-summary-card"><span>Proposal Summary</span><h2>{proposal.client.company || 'Unnamed company'}</h2><p>{summary}</p><button type="button" className="proposal-button proposal-button-dark" onClick={copySummary}>Copy Summary</button></div><div className="proposal-saved-card"><span>Saved proposals</span>{saved.length === 0 ? <p>No saved proposals yet.</p> : <div className="proposal-saved-list">{saved.map((record) => <button type="button" key={`${record.proposalId}-${record.versionNumber}`} onClick={() => loadRecord(record)}><strong>{record.company || record.client?.name || 'Unnamed client'}</strong><small>{record.selectedProduct} · v{record.versionNumber}<br />{record.status}</small></button>)}</div>}</div></aside>
    </div>}
  </div>
}

export default ProposalBuilder
