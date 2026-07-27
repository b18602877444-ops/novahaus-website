import { useMemo, useState } from 'react'
import { getAllDeliveryScopes } from '../data/deliveryScope.js'

const scopeSections = [
  ['standardScope', 'Standard implementation', 'STANDARD'],
  ['clientResponsibilities', 'Client responsibilities', 'CLIENT RESPONSIBILITY'],
  ['implementationProcess', 'Implementation process', 'STANDARD'],
  ['customScope', 'Custom scope conditions', 'CUSTOM'],
  ['outOfScope', 'Not included', 'OUT OF SCOPE'],
  ['optionalUpgrades', 'Optional upgrades', 'CUSTOM'],
  ['thirdPartyCosts', 'Third-party costs', 'CUSTOM'],
  ['qualificationQuestions', 'Questions to confirm scope', 'CUSTOM'],
  ['riskFlags', 'Review flags', 'CUSTOM'],
]

function ScopeBadge({ children, tone = 'standard' }) {
  return <span className={`delivery-scope-badge is-${tone}`}>{children}</span>
}

function ScopeList({ items = [] }) {
  return <ul className="delivery-scope-list">{items.map((item) => <li key={item}>{item}</li>)}</ul>
}

function ScopeDetail({ service, field, title, badge }) {
  const items = service[field]
  if (!items?.length) return null
  const tone = badge === 'OUT OF SCOPE' ? 'out' : badge === 'CLIENT RESPONSIBILITY' ? 'client' : badge === 'CUSTOM' ? 'custom' : 'standard'
  return <details className="delivery-scope-detail"><summary><span>{title}</span><ScopeBadge tone={tone}>{badge}</ScopeBadge><i aria-hidden="true" /></summary><ScopeList items={items} /></details>
}

function DeliveryScopePage({ InternalPage, SectionLabel, Reveal, ArrowIcon }) {
  const services = getAllDeliveryScopes()
  const requestedService = new URLSearchParams(window.location.search).get('service')
  const [selectedId, setSelectedId] = useState(() => services.some((item) => item.id === requestedService) ? requestedService : services[0].id)
  const service = useMemo(() => services.find((item) => item.id === selectedId) || services[0], [selectedId, services])

  return <InternalPage eyebrow="NOVAHAUS / Delivery Scope" title={<>Clear scope.<br /><em>Better decisions.</em></>} description="What NOVAHAUS delivers, what the client provides and what requires custom quotation — in one shared reference."><section className="delivery-scope-page" aria-label="NOVAHAUS Delivery Scope Center">
    <Reveal className="delivery-scope-intro"><SectionLabel number="01">The delivery boundary</SectionLabel><p>Every service begins with an agreed standard scope. Custom work, exclusions and third-party costs stay visible before a proposal is confirmed.</p><div className="delivery-scope-legend"><ScopeBadge>STANDARD</ScopeBadge><ScopeBadge tone="custom">CUSTOM</ScopeBadge><ScopeBadge tone="out">OUT OF SCOPE</ScopeBadge><ScopeBadge tone="client">CLIENT RESPONSIBILITY</ScopeBadge></div></Reveal>
    <section className="delivery-scope-selector" aria-labelledby="delivery-scope-selector-title"><Reveal><SectionLabel number="02">Choose a service</SectionLabel><h2 id="delivery-scope-selector-title">Find the scope<br /><em>behind the system.</em></h2></Reveal><div className="delivery-scope-tabs" role="tablist" aria-label="Delivery scope services">{services.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={service.id === item.id} className={service.id === item.id ? 'is-active' : ''} onClick={() => setSelectedId(item.id)}><span>{String(index + 1).padStart(2, '0')}</span>{item.name}</button>)}</div></section>
    <section className="delivery-scope-service" aria-labelledby="selected-delivery-scope-title"><Reveal className="delivery-scope-service-head"><div><SectionLabel number="03">Selected service</SectionLabel><h2 id="selected-delivery-scope-title">{service.name}</h2><p>{service.shortDescription}</p></div><div className="delivery-scope-price-reference"><span>Starting reference</span><strong>{service.implementationFeeReference}</strong><small>{service.monthlyFeeReference}</small></div></Reveal><div className="delivery-scope-overview-grid"><Reveal className="delivery-scope-overview-card"><span>Overview</span><p>{service.overview}</p></Reveal><Reveal className="delivery-scope-overview-card" delay={80}><span>Best for</span><p>{service.bestFor}</p></Reveal><Reveal className="delivery-scope-overview-card" delay={160}><span>Estimated timeline</span><p>{service.estimatedTimeline}</p></Reveal></div><div className="delivery-scope-detail-grid">{scopeSections.map(([field, title, badge], index) => <Reveal key={field} delay={index * 35}><ScopeDetail service={service} field={field} title={title} badge={badge} /></Reveal>)}</div><Reveal className="delivery-scope-policy-grid"><div><span>Revision policy</span><p>{service.revisionPolicy}</p></div><div><span>Support included</span><p>{service.supportIncluded}</p></div><div><span>Monthly managed service</span><p>{service.monthlyManagedService}</p></div></Reveal><Reveal className="delivery-scope-final-notice"><ScopeBadge tone="custom">FINAL SCOPE NOTICE</ScopeBadge><p>{service.finalQuoteNotice}</p><a href={`/booking/?source=delivery-scope&service=${service.id}`} className="button-dark">Book Strategy Call <ArrowIcon direction="right" /></a></Reveal></section>
    <Reveal className="delivery-scope-next"><SectionLabel number="04">A shared reference</SectionLabel><h2>The public scope,<br /><em>the proposal source.</em></h2><p>The same delivery boundaries support Commercial Center explanations, AI Sales answers and service-specific Proposal Studio drafts.</p><div><a href="/pricing/" className="text-link">View pricing <ArrowIcon direction="right" /></a><a href="/proposal/" className="text-link">Open Proposal Studio <ArrowIcon direction="right" /></a></div></Reveal>
  </section></InternalPage>
}

export default DeliveryScopePage
