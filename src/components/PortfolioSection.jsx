import { useEffect, useRef, useState } from 'react'

const projects = [
  {
    number: 'Project 01',
    title: 'AI Brand Studio',
    category: 'Brand / Website',
    description: 'A sharper digital identity for the next generation of AI builders.',
    type: 'ai',
  },
  {
    number: 'Project 02',
    title: 'Personal Brand',
    category: 'Identity / Website',
    description: 'A clear, confident platform for an expert building influence.',
    type: 'personal',
  },
  {
    number: 'Project 03',
    title: 'Business Website',
    category: 'Strategy / Digital',
    description: 'A focused digital experience designed to move the right people forward.',
    type: 'business',
  },
]

const textDelays = ['delay-0', 'delay-100', 'delay-200']
const imageDelays = ['delay-100', 'delay-200', 'delay-300']

function WindowDots() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-30" />
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-20" />
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-10" />
    </div>
  )
}

function AiMockup() {
  return (
    <div className="h-full bg-ink p-5 text-white sm:p-7">
      <div className="flex items-center justify-between text-[8px] uppercase tracking-[0.22em] text-white/45">
        <span>novahaus / 01</span>
        <WindowDots />
      </div>
      <div className="mt-10 grid grid-cols-[1fr_0.72fr] gap-5 sm:mt-12 sm:gap-8">
        <div>
          <div className="h-2 w-20 bg-white/80 sm:w-28" />
          <div className="mt-3 h-2 w-32 bg-champagne/80 sm:w-44" />
          <div className="mt-7 h-px w-full bg-white/15" />
          <div className="mt-5 flex gap-2">
            <span className="h-16 w-16 rounded-full border border-champagne/45 sm:h-20 sm:w-20" />
            <span className="h-16 w-16 rounded-full border border-white/20 sm:h-20 sm:w-20" />
          </div>
        </div>
        <div className="rounded-xl border border-white/15 p-3 sm:p-4">
          <div className="flex items-center justify-between text-[8px] uppercase tracking-[0.16em] text-white/45">
            <span>Signal</span>
            <span>92</span>
          </div>
          <div className="mt-7 h-20 rounded-full border border-champagne/45 p-3 sm:h-24">
            <div className="h-full rounded-full border border-white/15" />
          </div>
          <div className="mt-5 h-1 w-3/4 bg-white/20" />
          <div className="mt-2 h-1 w-1/2 bg-white/10" />
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-4 text-[8px] uppercase tracking-[0.18em] text-white/45 sm:mt-10">
        <span>Brand clarity</span>
        <span>AI leverage</span>
        <span>Digital motion</span>
      </div>
    </div>
  )
}

function PersonalMockup() {
  return (
    <div className="h-full bg-[#E9E4DA] p-5 text-ink sm:p-7">
      <div className="flex items-center justify-between text-[8px] uppercase tracking-[0.22em] text-ink/45">
        <span>Personal / 02</span>
        <WindowDots />
      </div>
      <div className="mt-9 grid grid-cols-[0.7fr_1.3fr] items-end gap-5 sm:mt-11 sm:gap-8">
        <div className="relative flex aspect-[0.8] items-center justify-center overflow-hidden bg-[#C4B8A5]">
          <div className="absolute -bottom-8 h-36 w-36 rounded-full bg-[#8F8373]/65 sm:h-44 sm:w-44" />
          <div className="absolute top-8 h-16 w-16 rounded-full border border-[#F7F4ED]/55 sm:h-20 sm:w-20" />
          <span className="relative text-[8px] uppercase tracking-[0.18em] text-[#F7F4ED]/80">P / 01</span>
        </div>
        <div className="pb-2">
          <div className="h-2 w-16 bg-ink/70 sm:w-24" />
          <div className="mt-4 max-w-[170px] text-3xl font-medium leading-[0.9] tracking-[-0.07em] sm:text-4xl">Make your work known.</div>
          <div className="mt-6 h-px w-full bg-ink/15" />
          <div className="mt-3 flex justify-between text-[8px] uppercase tracking-[0.16em] text-ink/45"><span>About</span><span>Work</span><span>Contact</span></div>
        </div>
      </div>
      <div className="mt-6 flex justify-between border-t border-ink/15 pt-4 text-[8px] uppercase tracking-[0.18em] text-ink/45 sm:mt-8"><span>Identity system</span><span>2025</span></div>
    </div>
  )
}

function BusinessMockup() {
  return (
    <div className="h-full bg-[#DDE1DA] p-5 text-ink sm:p-7">
      <div className="flex items-center justify-between text-[8px] uppercase tracking-[0.22em] text-ink/45">
        <span>Business / 03</span>
        <WindowDots />
      </div>
      <div className="mt-9 sm:mt-11">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="h-2 w-20 bg-ink/70 sm:w-28" />
            <div className="mt-4 max-w-[240px] text-3xl font-medium leading-[0.92] tracking-[-0.07em] sm:text-4xl">Designed for decisive growth.</div>
          </div>
          <span className="mb-1 text-[8px] uppercase tracking-[0.18em] text-ink/45">Scroll / 01</span>
        </div>
        <div className="mt-7 grid grid-cols-3 gap-2 sm:mt-9 sm:gap-3">
          <div className="h-20 border border-ink/15 bg-white/45 p-3 sm:h-24"><div className="h-full border-t border-ink/35 pt-2 text-[8px] uppercase tracking-[0.14em] text-ink/55">Strategy</div></div>
          <div className="h-20 border border-ink/15 bg-ink p-3 text-white sm:h-24"><div className="h-full border-t border-champagne/70 pt-2 text-[8px] uppercase tracking-[0.14em] text-white/65">Digital</div></div>
          <div className="h-20 border border-ink/15 bg-white/45 p-3 sm:h-24"><div className="h-full border-t border-ink/35 pt-2 text-[8px] uppercase tracking-[0.14em] text-ink/55">Impact</div></div>
        </div>
      </div>
      <div className="mt-6 flex justify-between border-t border-ink/15 pt-4 text-[8px] uppercase tracking-[0.18em] text-ink/45 sm:mt-8"><span>Digital experience</span><span>Build / 2025</span></div>
    </div>
  )
}

function ProjectMockup({ type }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-ink/10 shadow-card transition duration-300 ease-out group-hover:scale-[1.02]">
      {type === 'ai' && <AiMockup />}
      {type === 'personal' && <PersonalMockup />}
      {type === 'business' && <BusinessMockup />}
    </div>
  )
}

function PortfolioSection() {
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
    }, { threshold: 0.12 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="portfolio" className="section-padding min-h-[1000px] bg-canvas text-ink" aria-labelledby="portfolio-title">
      <div className="section-shell">
        <div className={`reveal-motion max-w-[700px] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
          <p className="section-kicker">Portfolio / 04</p>
          <h2 id="portfolio-title" className="section-title text-ink">Selected Work</h2>
          <p className="section-lead text-muted">A selection of concept projects created to demonstrate our capabilities.</p>
        </div>

        <div className="mt-16 space-y-5 sm:mt-20 sm:space-y-6">
          {projects.map((project, index) => (
            <article key={project.number} className="group grid min-h-[320px] grid-cols-1 gap-8 border-t border-ink/15 py-7 sm:py-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
              <div className={`reveal-motion flex h-full flex-col justify-between ${textDelays[index]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                <div>
                  <div className="flex flex-col items-start gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:flex-row sm:items-center sm:justify-between sm:tracking-[0.2em]">
                    <span>{project.number}</span>
                    <span className="text-champagne">Concept Project · {project.category}</span>
                  </div>
                  <h3 className="mt-7 text-3xl font-medium tracking-[-0.06em] text-ink sm:text-4xl">{project.title}</h3>
                  <p className="mt-4 max-w-[280px] text-sm leading-6 text-muted">{project.description}</p>
                </div>
                <a href="#contact" className="button-link group/link mt-8 w-fit opacity-100 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100" aria-label={`Discuss ${project.title} concept project`}>
                  <span>View Project</span>
                  <span className="transition-transform duration-300 group-hover/link:translate-x-2" aria-hidden="true">→</span>
                </a>
              </div>

              <div className={`reveal-motion h-[250px] ${imageDelays[index]} sm:h-[280px] lg:h-[300px] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <ProjectMockup type={project.type} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PortfolioSection
