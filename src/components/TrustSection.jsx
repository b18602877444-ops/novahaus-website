import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 'AI-Powered', label: 'Workflow' },
  { value: 'Strategy', label: 'to Launch' },
  { value: 'Responsive', label: 'by Default' },
  { value: 'Built for', label: 'Growth' },
]

const logos = ['BRAND ONE', 'BRAND TWO', 'BRAND THREE', 'BRAND FOUR', 'BRAND FIVE']
const logoDelays = ['delay-0', 'delay-100', 'delay-200', 'delay-300', 'delay-300']

function StatCard({ stat, isVisible }) {
  return (
    <div className={`reveal-motion border-t border-ink/15 pt-5 sm:pt-6 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
      <p className="max-w-[220px] text-[clamp(1.75rem,3vw,3.25rem)] font-medium leading-[0.95] tracking-[-0.075em] text-ink">{stat.value}</p>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{stat.label}</p>
    </div>
  )
}

function TrustSection() {
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
    }, { threshold: 0.25 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="trust" className="section-padding relative min-h-[700px] overflow-hidden bg-[#F1F0EC] text-ink" aria-labelledby="trust-title">
      <div className="section-shell">
        <div className={`reveal-motion max-w-[680px] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
          <p className="section-kicker">The signal is real</p>
          <h2 id="trust-title" className="section-title text-ink">Trusted by ambitious founders.</h2>
          <p className="section-lead text-muted">We help brands launch faster, look better and grow smarter.</p>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-24 sm:grid-cols-4 sm:gap-8 lg:mt-28">
          {stats.map((stat) => <StatCard key={stat.label} stat={stat} isVisible={isVisible} />)}
        </div>

        <div className="mt-24 border-t border-ink/15 pt-6 sm:mt-28 sm:pt-8">
          <p className={`reveal-motion text-[10px] font-semibold uppercase tracking-[0.24em] text-muted ${isVisible ? 'opacity-100' : 'opacity-0'}`}>Selected by teams building what comes next</p>
          <div className="mt-8 grid grid-cols-2 gap-y-7 sm:grid-cols-5 sm:gap-6">
            {logos.map((logo, index) => (
              <div key={logo} className={`reveal-motion flex items-center text-[12px] font-semibold tracking-[0.12em] text-ink/35 hover:text-ink ${logoDelays[index]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustSection
