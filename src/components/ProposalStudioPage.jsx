import { useMemo, useState } from 'react'
import BrandLogo from './BrandLogo.jsx'
import { generateProposalStudio } from '../data/proposalStudioTemplates.js'
import { readProposalStudioContext } from '../services/proposalStudioData.js'

function ArrowIcon() {
  return <span aria-hidden="true" className="proposal-studio-arrow">↗</span>
}

function SectionLabel({ number, children }) {
  return <div className="proposal-studio-section-label"><span>{number}</span><span>{children}</span></div>
}

function DataBadge({ children }) {
  return <span className="proposal-studio-data-badge"><span aria-hidden="true" />{children}</span>
}

function DeliveryScopeBlock({ label, items, limit = 5 }) {
  if (!items?.length) return null
  return <div className="proposal-studio-scope-block"><span>{label}</span><ul>{items.slice(0, limit).map((item) => <li key={item}>{item}</li>)}</ul></div>
}

export default function ProposalStudioPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const context = useMemo(() => readProposalStudioContext(), [refreshKey])
  const proposal = useMemo(() => generateProposalStudio(context), [context])

  return <div className="proposal-studio-page">
    <a className="skip-link" href="#proposal-studio-main">Skip to proposal</a>
    <header className="proposal-studio-header">
      <a href="/" aria-label="NOVAHAUS home"><BrandLogo className="proposal-studio-logo" /></a>
      <div className="proposal-studio-header-actions">
        <span className="proposal-studio-private-label">Private workspace</span>
        <a className="proposal-studio-header-cta" href="/booking/?source=proposal-studio">Book a Strategy Call <ArrowIcon /></a>
      </div>
    </header>

    <main id="proposal-studio-main" className="proposal-studio-main">
      <section className="proposal-studio-hero" aria-labelledby="proposal-studio-title">
        <div>
          <span className="proposal-studio-eyebrow">NOVAHAUS / Proposal Studio</span>
          <h1 id="proposal-studio-title">A clearer route<br /><em>from context to action.</em></h1>
        </div>
        <div className="proposal-studio-hero-copy">
          <p>Review a structured growth direction built from the business context already available in this browser.</p>
          <button className="proposal-studio-refresh" type="button" onClick={() => setRefreshKey((value) => value + 1)}>Update saved context</button>
        </div>
      </section>

      <section className="proposal-studio-context-bar" aria-label="Proposal context status">
        <div>
          <span className="proposal-studio-context-label">Generated for</span>
          <strong>{proposal.clientName}{proposal.company !== 'your business' ? ` / ${proposal.company}` : ''}</strong>
        </div>
        <div className="proposal-studio-context-sources">
          {proposal.sourceLabels.length ? proposal.sourceLabels.map((source) => <DataBadge key={source}>{source}</DataBadge>) : <DataBadge>Context to be completed</DataBadge>}
        </div>
      </section>

      <div className="proposal-studio-layout">
        <article className="proposal-studio-document" aria-label="Generated proposal">
          <div className="proposal-studio-document-head">
            <div><span className="proposal-studio-eyebrow">Growth direction / 01</span><h2>{proposal.company}</h2></div>
            <span className="proposal-studio-document-status">Working proposal</span>
          </div>

          <section className="proposal-studio-section">
            <SectionLabel number="01">Business Diagnosis</SectionLabel>
            <p className="proposal-studio-lead-copy">{proposal.diagnosis}</p>
          </section>

          <section className="proposal-studio-section">
            <SectionLabel number="02">Growth Opportunities</SectionLabel>
            <div className="proposal-studio-opportunities">{proposal.opportunities.map((item, index) => <div className="proposal-studio-opportunity" key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></div>)}</div>
          </section>

          <section className="proposal-studio-section proposal-studio-recommendation">
            <SectionLabel number="03">Recommended Department</SectionLabel>
            <div className="proposal-studio-package-head"><div><span className="proposal-studio-package-index">NOVAHAUS / department</span><h3>{proposal.recommendedPackage.name}</h3></div><span className="proposal-studio-package-dot" aria-hidden="true" /></div>
            <p>{proposal.recommendedPackage.label}</p>
            <div className="proposal-studio-package-investment"><div><span>Onboarding investment</span><strong>{proposal.recommendedPackage.onboardingFee}</strong></div><div><span>Monthly operations investment</span><strong>{proposal.recommendedPackage.monthlyPrice}</strong></div><div><span>Start date</span><strong>To be confirmed</strong></div><div><span>Minimum term</span><strong>To be confirmed in the signed agreement</strong></div></div>
            <span className="proposal-studio-mini-label">Standard monthly capacity, responsibilities and boundaries</span>
            <div className="proposal-studio-package-boundaries"><DeliveryScopeBlock label="Client responsibilities" items={proposal.recommendedPackage.clientResponsibilities} limit={proposal.recommendedPackage.clientResponsibilities.length} /><DeliveryScopeBlock label="Exclusions" items={proposal.recommendedPackage.exclusions} limit={proposal.recommendedPackage.exclusions.length} /><DeliveryScopeBlock label="Add-on or custom triggers" items={proposal.recommendedPackage.customQuoteTriggers} limit={proposal.recommendedPackage.customQuoteTriggers.length} /><DeliveryScopeBlock label="Approved add-ons" items={proposal.recommendedPackage.addOns} limit={proposal.recommendedPackage.addOns.length} /><DeliveryScopeBlock label="Third-party costs" items={[proposal.recommendedPackage.thirdPartyCosts]} /></div>
            <p className="proposal-studio-scope-notice">{proposal.recommendedPackage.finalQuoteNotice}</p>
            <ul>{proposal.recommendedPackage.deliverables.map((item) => <li key={item}><span aria-hidden="true">↗</span>{item}</li>)}</ul>
          </section>

          {proposal.deliveryScope && <section className="proposal-studio-section proposal-studio-delivery-scope">
            <SectionLabel number="03A">Delivery Scope</SectionLabel>
            <p className="proposal-studio-scope-intro">This service-specific view reuses the approved NOVAHAUS delivery boundary. It is a working proposal reference, not a binding final quote.</p>
            <div className="proposal-studio-scope-grid"><DeliveryScopeBlock label="Included" items={proposal.deliveryScope.includedDeliverables} /><DeliveryScopeBlock label="Client responsibility" items={proposal.deliveryScope.clientResponsibilities} /><DeliveryScopeBlock label="Optional / custom" items={proposal.deliveryScope.customScope} /><DeliveryScopeBlock label="Excluded" items={proposal.deliveryScope.outOfScope} /><DeliveryScopeBlock label="Third-party costs" items={proposal.deliveryScope.thirdPartyCosts} /></div>
            <p className="proposal-studio-scope-notice">{proposal.deliveryScope.finalQuoteNotice}</p>
          </section>}

          <section className="proposal-studio-section">
            <SectionLabel number="04">90-Day Growth Plan</SectionLabel>
            <div className="proposal-studio-plan">{proposal.plan90Days.map((item) => <div className="proposal-studio-plan-step" key={item.phase}><span>{item.phase}</span><h3>{item.title}</h3><p>{item.body}</p></div>)}</div>
          </section>

          <section className="proposal-studio-section proposal-studio-next-step">
            <SectionLabel number="05">Next Step</SectionLabel>
            <p className="proposal-studio-lead-copy">{proposal.nextStep}</p>
            <a className="proposal-studio-primary-cta" href="/booking/?source=proposal-studio">Book Strategy Call <ArrowIcon /></a>
          </section>
        </article>

        <aside className="proposal-studio-aside">
          <div className="proposal-studio-aside-card">
            <span className="proposal-studio-eyebrow">Context on file</span>
            <dl>
              <div><dt>Country</dt><dd>{proposal.contact.country || 'Not provided'}</dd></div>
              <div><dt>Business type</dt><dd>{proposal.contact.businessType || 'Not provided'}</dd></div>
              <div><dt>Timeline</dt><dd>{proposal.contact.timeline || 'To be discussed'}</dd></div>
            </dl>
            <p>{proposal.contextNote}</p>
          </div>
          <a className="proposal-studio-aside-link" href="/growth-assessment/">Add more context through the Growth Assessment <ArrowIcon /></a>
          <a className="proposal-studio-aside-link" href="/">Return to NOVAHAUS <ArrowIcon /></a>
        </aside>
      </div>
    </main>
  </div>
}
