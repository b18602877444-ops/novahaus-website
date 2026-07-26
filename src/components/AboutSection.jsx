import { useEffect, useRef, useState } from 'react'
import BrandLogo from './BrandLogo.jsx'

const capabilities = [
  { number: '01', label: 'Brand Strategy' },
  { number: '02', label: 'Website Design' },
  { number: '03', label: 'Visual Identity' },
  { number: '04', label: 'AI Automation' },
  { number: '05', label: 'Content System' },
]

const advantages = [
  { number: '01', title: 'Strategy First', description: 'Every project starts with positioning.' },
  { number: '02', title: 'Built for Growth', description: 'Designed to convert visitors into customers.' },
  { number: '03', title: 'AI Powered', description: 'Automate repetitive work and save time.' },
]

function AboutCapabilityCard() {
  return (
    <div className="relative mx-auto aspect-[1.12] w-full max-w-[650px] animate-float">
      <div className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_55%_45%,rgba(200,169,107,0.15),transparent_62%)] blur-3xl" />

      <div className="relative h-full overflow-hidden rounded-[2.5rem] border border-ink/10 bg-white/70 p-3 shadow-card backdrop-blur-xl sm:p-4">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-ink p-6 text-white sm:p-8">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-champagne/15 blur-3xl" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(250,250,248,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(250,250,248,0.15)_1px,transparent_1px)] [background-size:32px_32px]" />

          <div className="relative flex items-center justify-between border-b border-white/15 pb-5">
            <div>
              <BrandLogo reversed className="h-5 w-auto sm:h-6" />
              <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-white/40">Digital brand architecture</p>
            </div>
            <span className="rounded-full border border-champagne/50 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-champagne">System / 05</span>
          </div>

          <div className="relative grid flex-1 grid-cols-[1fr_0.9fr] gap-5 py-7 sm:gap-8 sm:py-9">
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/45">One complete system</p>
                <h3 className="mt-4 max-w-[240px] text-3xl font-medium leading-[0.94] tracking-[-0.07em] text-white sm:text-4xl">Make every signal count.</h3>
              </div>

              <div className="space-y-3">
                {capabilities.slice(0, 3).map((capability) => (
                  <div key={capability.label} className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <span className="text-[9px] font-semibold tracking-[0.14em] text-champagne">{capability.number}</span>
                    <span className="text-xs tracking-[-0.02em] text-white/75">{capability.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute h-36 w-36 rounded-full border border-champagne/35 sm:h-48 sm:w-48" />
              <div className="absolute h-24 w-24 rounded-full border border-white/15 sm:h-32 sm:w-32" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-champagne text-ink shadow-[0_0_70px_rgba(200,169,107,0.38)] sm:h-24 sm:w-24">
                <span className="text-2xl font-semibold tracking-[-0.08em]">N / X</span>
              </div>
              <span className="absolute bottom-[18%] right-[3%] text-[8px] uppercase tracking-[0.18em] text-white/40">Clarity</span>
              <span className="absolute left-[3%] top-[20%] text-[8px] uppercase tracking-[0.18em] text-white/40">Momentum</span>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-3 border-t border-white/15 pt-5 sm:grid-cols-5">
            {capabilities.map((capability, index) => (
              <div key={capability.label} className={`text-[8px] uppercase tracking-[0.14em] ${index > 2 ? 'text-white/55' : 'text-white/35'}`}>
                <span className="mr-1.5 text-champagne">{capability.number}</span>
                {capability.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AboutSection() {
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
    }, { threshold: 0.18 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="section-padding min-h-[900px] bg-canvas text-ink lg:h-[900px]" aria-labelledby="about-title">
      <div className="section-shell flex h-full flex-col justify-between">
        <div className="grid items-center gap-16 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
          <div className={`reveal-motion max-w-[560px] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <p className="section-kicker">About NOVAHAUS / 06</p>
            <h2 id="about-title" className="section-title text-ink">Why NOVAHAUS</h2>
            <p className="section-lead mt-7 whitespace-pre-line text-ink">{"We don't just design websites.\nWe build digital brands that create trust, attract customers and grow businesses."}</p>
            <div className="mt-8 space-y-5 text-base leading-7 text-muted sm:text-[17px] sm:leading-8">
              <p>Modern brands need more than beautiful design.</p>
              <p>We combine strategy, branding, website design and AI automation into one complete system.</p>
              <p>Every project is built for clarity, speed and long-term growth.</p>
            </div>
            <a href="#contact" className="button-link group mt-9">
              <span>Let&apos;s Talk</span>
              <span className="transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true">→</span>
            </a>
          </div>

          <div className={`reveal-motion ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            <AboutCapabilityCard />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 border-t border-ink/15 pt-7 sm:grid-cols-3 sm:gap-6 lg:mt-10">
          {advantages.map((advantage) => (
            <div key={advantage.number} className={`reveal-motion ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-champagne">
                <span>{advantage.number}</span>
                <span className="h-px w-10 bg-ink/15 sm:w-16" />
              </div>
              <h3 className="mt-5 text-xl font-medium tracking-[-0.045em] text-ink">{advantage.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
