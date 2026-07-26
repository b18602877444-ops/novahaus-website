import { useEffect, useRef, useState } from 'react'

const steps = [
  {
    number: '01',
    title: 'Discover',
    description: 'Understand your business and goals.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Build the visual identity and website.',
  },
  {
    number: '03',
    title: 'Develop',
    description: 'Create a fast and responsive experience.',
  },
  {
    number: '04',
    title: 'Launch',
    description: 'Go live and continue improving.',
  },
]

const revealDelays = ['delay-0', 'delay-100', 'delay-200', 'delay-300']

function ProcessSection() {
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
    <section ref={sectionRef} id="process" className="section-padding min-h-[900px] bg-ink text-white lg:h-[900px]" aria-labelledby="process-title">
      <div className="section-shell flex h-full flex-col">
        <div className={`reveal-motion max-w-[660px] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
          <p className="section-kicker">Process / 05</p>
          <h2 id="process-title" className="section-title text-white">Our Process</h2>
          <p className="section-lead text-white/55">A clear process from idea to launch.</p>
        </div>

        <div className="relative mt-20 grid flex-1 grid-cols-1 gap-4 sm:mt-24 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4 lg:gap-0">
          <div className="pointer-events-none absolute left-0 right-0 top-0 hidden h-px bg-white/15 lg:block" aria-hidden="true" />

          {steps.map((step, index) => (
            <article key={step.number} className={`group card-hover relative flex min-h-[245px] flex-col justify-between border border-white/15 p-6 hover:border-champagne sm:min-h-[265px] sm:p-7 lg:border-b lg:border-t lg:border-r-0 lg:first:border-l lg:last:border-r ${revealDelays[index]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-champagne">Step {step.number}</span>
                <span className="text-5xl font-medium leading-none tracking-[-0.1em] text-white/15 transition duration-300 group-hover:scale-110 group-hover:text-champagne/65">{step.number}</span>
              </div>

              <div>
                <h3 className="text-2xl font-medium tracking-[-0.06em] text-white sm:text-[28px]">{step.title}</h3>
                <p className="mt-3 max-w-[190px] text-sm leading-6 text-white/50">{step.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={`reveal-motion mt-10 flex items-center justify-between border-t border-white/15 pt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35 sm:mt-12 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <span>Strategy · Craft · Momentum</span>
          <span>From 01 to live</span>
        </div>
      </div>
    </section>
  )
}

export default ProcessSection
