import { useEffect, useRef, useState } from 'react'

const services = [
  {
    number: '01',
    type: 'strategy',
    title: 'Brand Strategy',
    description: 'Clarify your positioning and messaging.',
  },
  {
    number: '02',
    type: 'website',
    title: 'Website Design',
    description: 'Modern websites built for conversion.',
  },
  {
    number: '03',
    type: 'identity',
    title: 'Visual Identity',
    description: 'Create a memorable brand system.',
  },
  {
    number: '04',
    type: 'ai',
    title: 'AI Automation',
    description: 'Use AI to streamline daily work.',
  },
  {
    number: '05',
    type: 'content',
    title: 'Content System',
    description: 'Create content that scales.',
  },
  {
    number: '06',
    type: 'growth',
    title: 'Growth Support',
    description: 'Continuous optimization after launch.',
  },
]

const revealDelays = ['[animation-delay:0ms]', '[animation-delay:80ms]', '[animation-delay:160ms]', '[animation-delay:240ms]', '[animation-delay:320ms]', '[animation-delay:400ms]']

function ServiceIcon({ type }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.35,
  }

  if (type === 'strategy') {
    return (
      <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 32 32" {...common}>
        <circle cx="16" cy="16" r="9" />
        <circle cx="16" cy="16" r="3" />
        <path d="M16 3v4M16 25v4M3 16h4M25 16h4" />
      </svg>
    )
  }

  if (type === 'website') {
    return (
      <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 32 32" {...common}>
        <rect x="4" y="6" width="24" height="20" rx="2" />
        <path d="M4 12h24M8 9h.01M11 9h.01M14 9h.01" />
        <path d="M10 18h5M10 22h9" />
      </svg>
    )
  }

  if (type === 'identity') {
    return (
      <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 32 32" {...common}>
        <path d="m16 4 11 12-11 12L5 16 16 4Z" />
        <path d="m16 10 5.5 6-5.5 6-5.5-6 5.5-6Z" />
      </svg>
    )
  }

  if (type === 'ai') {
    return (
      <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 32 32" {...common}>
        <circle cx="8" cy="16" r="3" />
        <circle cx="24" cy="8" r="3" />
        <circle cx="24" cy="24" r="3" />
        <path d="m10.7 14.7 10.6-5.4M10.7 17.3l10.6 5.4" />
      </svg>
    )
  }

  if (type === 'content') {
    return (
      <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 32 32" {...common}>
        <rect x="6" y="5" width="20" height="22" rx="2" />
        <path d="M11 11h10M11 16h10M11 21h6" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 32 32" {...common}>
      <path d="M6 24 13 17l5 4 8-11" />
      <path d="M20 10h6v6" />
      <circle cx="6" cy="24" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ServicesSection() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.2 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="services" className="section-padding min-h-[900px] bg-white text-ink lg:h-[900px]" aria-labelledby="services-title">
      <div className="section-shell flex h-full flex-col">
        <div className="max-w-[680px]">
          <p className="section-kicker">Services / 03</p>
          <h2 id="services-title" className="section-title text-ink">What We Build</h2>
          <p className="section-lead text-muted">Everything you need to build a modern digital brand.</p>
        </div>

        <div className="mt-16 grid flex-1 grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {services.map((service, index) => (
            <article key={service.title} className={`group card-hover relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 bg-white p-7 sm:min-h-[232px] sm:p-8 ${isVisible ? `animate-rise-in opacity-100 ${revealDelays[index]}` : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-start justify-between">
                <div className="text-ink transition duration-300 group-hover:scale-105 group-hover:text-champagne">
                  <ServiceIcon type={service.type} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30">{service.number}</span>
              </div>

              <div className="mt-8 flex items-end justify-between gap-5">
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.045em] text-ink sm:text-[22px]">{service.title}</h3>
                  <p className="mt-3 max-w-[230px] text-sm leading-6 text-muted">{service.description}</p>
                </div>
                <span className="mb-0.5 shrink-0 text-xl text-ink transition duration-300 group-hover:translate-x-2 group-hover:text-champagne" aria-hidden="true">→</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
