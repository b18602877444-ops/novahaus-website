import { useEffect, useState } from 'react'

const experienceItems = [
  {
    number: '01',
    label: 'Conversation layer',
    title: 'AI Sales Agent',
    description: 'Have a guided conversation with NOVAHAUS AI and discover which AI growth solutions may fit your business.',
    points: ['Understand business needs', 'Identify pain points', 'Recommend relevant services', 'Guide the next step'],
    action: 'Talk to NOVAHAUS AI',
    type: 'agent',
  },
  {
    number: '02',
    label: 'Diagnostic layer',
    title: 'AI Growth Assessment',
    description: 'Answer a short set of questions and receive a structured view of your current growth opportunities.',
    points: ['Review business challenges', 'Identify digital growth gaps', 'Discover AI opportunities', 'Prepare for a strategy conversation'],
    action: 'Start Growth Assessment',
    href: '/growth-assessment/',
    type: 'assessment',
  },
  {
    number: '03',
    label: 'Planning layer',
    title: 'Proposal Generator',
    description: 'See how NOVAHAUS can transform business requirements into a clear and structured project proposal.',
    points: ['Organise project requirements', 'Select suitable solutions', 'Prepare scope and recommendations', 'Generate a proposal preview'],
    action: 'Explore Proposal Generator',
    href: '/proposal-builder/',
    type: 'proposal',
  },
]

function ExperienceIcon({ type }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '1.5' }
  if (type === 'assessment') return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><circle cx="16" cy="16" r="11" /><path d="M16 10v6l4 3M9 24l-2 3M23 24l2 3" /></svg>
  if (type === 'proposal') return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><path d="M9 5h10l5 5v17H9zM19 5v6h5M13 16h7M13 21h7" /></svg>
  return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><path d="M6 8.5A3.5 3.5 0 0 1 9.5 5h13A3.5 3.5 0 0 1 26 8.5v8a3.5 3.5 0 0 1-3.5 3.5H15l-5.5 5v-5.2A3.5 3.5 0 0 1 6 16.5v-8Z" /><path d="M12 12.5h.01M16 12.5h.01M20 12.5h.01" /></svg>
}

function InteractiveAIExperienceCenter() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = document.querySelector('.experience-center-section')
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const openSalesAgent = () => {
    window.dispatchEvent(new CustomEvent('novahaus:open-ai-sales'))
  }

  return <section id="experience-center" className={`section light-section experience-center-section ${visible ? 'is-visible' : ''}`} aria-labelledby="experience-center-title"><div className="page-shell"><div className="experience-center-heading"><span className="section-label"><span className="section-label-line" /><span>Interactive AI</span></span><h2 id="experience-center-title">Experience NOVAHAUS AI<br /><span>in action.</span></h2><p>Explore how AI can understand your business, identify growth opportunities and help prepare the next step.</p></div><div className="experience-center-grid">{experienceItems.map((item, index) => <article className="experience-card" key={item.number} style={{ '--experience-delay': `${index * 90}ms` }}><div className="experience-card-top"><span className="experience-card-number">{item.number}</span><span className="experience-card-label">{item.label}</span></div><div className="experience-card-icon"><ExperienceIcon type={item.type} /></div><h3>{item.title}</h3><p>{item.description}</p><ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>{item.href ? <a className="experience-card-action" href={item.href} aria-label={`${item.action} — ${item.title}`}>{item.action}<span aria-hidden="true">↗</span></a> : <button className="experience-card-action" type="button" onClick={openSalesAgent}>{item.action}<span aria-hidden="true">↗</span></button>}</article>)}</div><div className="experience-center-flow" aria-label="Ways to explore the NOVAHAUS AI experience"><div><span>01</span><strong>Talk to AI</strong></div><i aria-hidden="true">→</i><div><span>02</span><strong>Assess Your Growth</strong></div><i aria-hidden="true">→</i><div><span>03</span><strong>Prepare Your Proposal</strong></div></div><p className="experience-center-note">Start anywhere and explore the experience that is most relevant to your business.</p></div></section>
}

export default InteractiveAIExperienceCenter
