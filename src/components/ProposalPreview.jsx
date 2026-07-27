import BrandLogo from './BrandLogo.jsx'
import { createProposalSummary, formatInvestment } from '../lib/proposalGenerator.js'

function PreviewBlock({ title, children }) {
  return <section className="proposal-preview-block"><p className="proposal-preview-label">{title}</p><div>{children}</div></section>
}

function PreviewText({ value }) {
  return <p>{value?.trim() || 'To be confirmed with the client.'}</p>
}

function PreviewList({ items }) {
  return <ul>{items.filter(Boolean).map((item) => <li key={item}>{item}</li>)}</ul>
}

function ProposalPreview({ proposal }) {
  const { client, notes, content, scopeItems, phases, investment } = proposal
  const date = new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(proposal.createdDate))
  return <article className="proposal-preview" id="proposal-print-area">
    <header className="proposal-preview-cover">
      <BrandLogo className="proposal-preview-logo" />
      <p className="proposal-preview-kicker">Private proposal · Version {proposal.versionNumber}</p>
      <h1>Growth systems<br /><em>with intent.</em></h1>
      <div className="proposal-preview-cover-meta"><div><span>Prepared for</span><strong>{client.company || client.name || 'Named recipient'}</strong><small>{client.name || 'Client name to be confirmed'}</small></div><div><span>Prepared</span><strong>{date}</strong><small>Status: {proposal.status}</small></div></div>
    </header>
    <div className="proposal-preview-body">
      <PreviewBlock title="Executive Summary"><PreviewText value={content.executiveSummary} /></PreviewBlock>
      <PreviewBlock title="Current Situation"><PreviewText value={notes.currentSituation} /></PreviewBlock>
      <PreviewBlock title="Objectives"><PreviewText value={notes.businessObjectives || client.primaryGoal} /></PreviewBlock>
      <PreviewBlock title="Recommended Solution"><h2>{proposal.selectedProduct}</h2><PreviewText value={content.recommendedApproach} /></PreviewBlock>
      <PreviewBlock title="Scope of Work"><p>{content.scopeOfWork}</p><div className="proposal-preview-scope">{scopeItems.filter((item) => item.inclusion === 'Included').map((item) => <div key={item.id}><strong>{item.title}</strong><span>{item.category} · {item.phase} · {item.duration}</span><p>{item.description}</p></div>)}</div></PreviewBlock>
      <PreviewBlock title="Project Phases"><div className="proposal-preview-phases">{phases.map((phase, index) => <div key={phase.id}><span>0{index + 1}</span><strong>{phase.name}</strong><small>{phase.duration}</small><p>{phase.activities}</p><p>{phase.deliverables}</p></div>)}</div></PreviewBlock>
      <PreviewBlock title="Timeline"><PreviewText value={client.preferredTimeline || content.indicativeTimeline} /></PreviewBlock>
      <PreviewBlock title="Deliverables"><PreviewText value={content.deliverables} /></PreviewBlock>
      <PreviewBlock title="Investment"><p className="proposal-preview-investment">{formatInvestment(investment)}</p><p className="proposal-preview-note">{investment.note}</p><p className="proposal-preview-note">Payment terms: {investment.paymentTerms}</p></PreviewBlock>
      <PreviewBlock title="Client Responsibilities"><PreviewText value={content.clientResponsibilities} /></PreviewBlock>
      <PreviewBlock title="NOVAHAUS Responsibilities"><PreviewText value={content.novahausResponsibilities} /></PreviewBlock>
      <PreviewBlock title="Assumptions and Exclusions"><PreviewText value={content.exclusions} /></PreviewBlock>
      <PreviewBlock title="Next Steps"><PreviewText value={content.nextSteps} /></PreviewBlock>
      <PreviewBlock title="Acceptance"><p>Acceptance is confirmed when the final scope, investment, timing and responsibilities are agreed in writing.</p><div className="proposal-signature-grid"><span>Client signature</span><span>Date</span><span>NOVAHAUS signature</span><span>Date</span></div></PreviewBlock>
      <aside className="proposal-preview-disclaimer">This proposal is confidential and prepared exclusively for the named recipient. Scope, timeline and investment remain subject to final confirmation and signed agreement.</aside>
      <div className="proposal-preview-summary-hidden" aria-hidden="true">{createProposalSummary(proposal)}</div>
    </div>
  </article>
}

export default ProposalPreview
