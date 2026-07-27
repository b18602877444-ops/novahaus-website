import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import BrandLogo from './components/BrandLogo.jsx'

const heroEase = [0.22, 1, 0.36, 1]
const cardSpring = { type: 'spring', stiffness: 300, damping: 25, mass: 0.75 }
const revealMotion = { duration: 0.65, ease: heroEase }

const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const serviceItems = [
  { number: '01', title: 'AI Automation', description: 'Turn the repeatable parts of the business into a system your team can trust.', icon: 'automation' },
  { number: '02', title: 'AI Website', description: 'A high-conviction digital front door, shaped around how people decide.', icon: 'website' },
  { number: '03', title: 'Brand Strategy', description: 'Positioning with enough edge to be remembered and enough clarity to travel.', icon: 'strategy' },
  { number: '04', title: 'AI Consulting', description: 'Find the few AI moves that improve the business now—not in a slide deck.', icon: 'consulting' },
]

const solutionItems = [
  { eyebrow: 'For founders', title: 'Make the first impression count.', description: 'A sharper position, a clear offer and a digital presence that earns the next conversation.', tags: ['Positioning', 'Launch system'] },
  { eyebrow: 'For creators', title: 'Make your point of view impossible to miss.', description: 'An identity and content system that gives expertise a distinct, memorable shape.', tags: ['Identity', 'Content'] },
  { eyebrow: 'For modern teams', title: 'Give the business a cleaner operating layer.', description: 'Connect brand, digital experience and practical AI workflows without adding noise.', tags: ['Digital', 'Automation'] },
]

const workItems = [
  { number: '01', kicker: 'Concept project', industry: 'Brand Identity', title: 'Signal / Brand Operating System', description: 'A precise identity direction for an AI-native product with a lot to clarify.', className: 'project-signal' },
  { number: '02', kicker: 'Concept project', industry: 'Digital Experience', title: 'Northstar / Founder Platform', description: 'An editorial digital experience for a founder whose expertise deserves room.', className: 'project-northstar' },
  { number: '03', kicker: 'Concept project', industry: 'AI Product', title: 'Vector / Intelligent Interface', description: 'A calm product language for tools that make complex work feel obvious.', className: 'project-forma' },
  { number: '04', kicker: 'Concept project', industry: 'Luxury Branding', title: 'Aurelia / Quiet Distinction', description: 'A restrained luxury system built around material, rhythm and confidence.', className: 'project-vertex' },
  { number: '05', kicker: 'Concept project', industry: 'Architecture', title: 'Monument / Spatial Identity', description: 'A considered identity for a practice where every line has a reason.', className: 'project-morrow' },
  { number: '06', kicker: 'Concept project', industry: 'Future Mobility', title: 'Motion / Beyond the Road', description: 'A forward-looking system for movement, designed to feel human at speed.', className: 'project-coda' },
]

const principles = [
  { number: '01', title: 'AI First', description: 'Start with leverage: remove friction before adding more people, tools or process.', icon: 'ai' },
  { number: '02', title: 'Premium Design', description: 'Make every touchpoint feel considered, legible and worth returning to.', icon: 'design' },
  { number: '03', title: 'Fast Delivery', description: 'Keep decisions close, feedback useful and momentum visible from day one.', icon: 'speed' },
  { number: '04', title: 'Long-term Partner', description: 'Leave behind a system that stays useful after the launch moment passes.', icon: 'partner' },
]

const processItems = [
  { number: '01', title: 'Listen', description: 'Find the signal inside the ambition.' },
  { number: '02', title: 'Sharpen', description: 'Turn it into a position people remember.' },
  { number: '03', title: 'Launch', description: 'Put the system to work in the real world.' },
]

const clientProfiles = ['Founder-led services', 'AI-native products', 'Personal brands', 'Modern teams']

const faqs = [
  { question: 'What does a typical engagement include?', answer: 'Most engagements combine positioning, a focused identity and a conversion-led website. The scope follows the next meaningful business milestone, not a preset package.' },
  { question: 'Is this a fit for an early-stage company?', answer: 'Yes. The work is designed for founders and small teams that need a clear story, a credible presence and a practical route to market.' },
  { question: 'Can AI workflows sit inside the engagement?', answer: 'Yes. Repetitive, high-friction work is mapped first, then shaped into practical AI-assisted systems around the tools and team already in place.' },
  { question: 'How long does an engagement take?', answer: 'A focused brand and website engagement usually takes several weeks. Timing depends on the decision pace, inputs and number of moving parts.' },
  { question: 'What happens after launch?', answer: 'A refinement retainer keeps the system useful: improving the experience, content rhythm and workflows as real-world signals arrive.' },
]

function ArrowIcon({ direction = 'up' }) {
  const path = direction === 'right' ? 'M3 12.5 12 3.5m0 0H5.5M12 3.5V10' : 'M3.5 12.5 12 4m0 0H5.5M12 4v6.5'
  return (
    <svg aria-hidden="true" className="arrow-icon" viewBox="0 0 16 16" fill="none">
      <path d={path} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
    </svg>
  )
}

function BrandMark({ className = '', loading = 'lazy' }) {
  return <img aria-hidden="true" className={`brand-mark-asset ${className}`} src="/novahaus-mark.png?v=c2" alt="" width="383" height="601" loading={loading} decoding="async" />
}

function Reveal({ children, className = '', delay = 0 }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>{children}</div>
}

function MagneticLink({ children, href, variant = 'dark', className = '', onClick, delay = 0, reduceMotion = false }) {
  const ref = useRef(null)

  const handleMove = (event) => {
    const node = ref.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = node.getBoundingClientRect()
    const x = (event.clientX - rect.left - rect.width / 2) / rect.width
    const y = (event.clientY - rect.top - rect.height / 2) / rect.height
    node.style.setProperty('--magnetic-x', `${x * 7}px`)
    node.style.setProperty('--magnetic-y', `${y * 7}px`)
  }

  const handleLeave = () => {
    if (!ref.current) return
    ref.current.style.setProperty('--magnetic-x', '0px')
    ref.current.style.setProperty('--magnetic-y', '0px')
  }

  return (
    <motion.a ref={ref} href={href} onClick={onClick} onPointerMove={handleMove} onPointerLeave={handleLeave} className={`magnetic-link button-${variant} ${className}`} initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay, ease: heroEase }} whileHover={reduceMotion ? undefined : { scale: 1.03, boxShadow: '0 18px 36px rgba(17, 17, 17, .18)' }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}>
      <span>{children}</span><ArrowIcon direction="right" />
    </motion.a>
  )
}

function SectionLabel({ children, number }) {
  return <p className="section-label"><span className="section-label-line" />{number && <span>{number}</span>}<span>{children}</span></p>
}

function SectionHeader({ number, label, title, description, dark = false }) {
  return <Reveal className="section-header"><SectionLabel number={number}>{label}</SectionLabel><h2 className={`section-heading ${dark ? 'on-dark' : ''}`}>{title}</h2>{description && <p className={`section-description ${dark ? 'on-dark' : ''}`}>{description}</p>}</Reveal>
}

function PageLoader({ reduceMotion }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduceMotion) {
      setReady(true)
      return undefined
    }
    const frame = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(frame)
  }, [reduceMotion])

  return <div className={`page-loader ${ready ? 'is-ready' : ''}`} aria-hidden="true"><BrandMark className="loader-mark" loading="eager" /></div>
}

function Hero() {
  const [menuOpen, setMenuOpen] = useState(false)
  const stageRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    const handleMove = (event) => {
      const rect = stage.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      stage.style.setProperty('--mouse-px', `${(x * 18).toFixed(2)}px`)
      stage.style.setProperty('--mouse-py', `${(y * 18).toFixed(2)}px`)
    }
    const handleLeave = () => {
      stage.style.setProperty('--mouse-px', '0px')
      stage.style.setProperty('--mouse-py', '0px')
    }
    stage.addEventListener('pointermove', handleMove)
    stage.addEventListener('pointerleave', handleLeave)
    return () => {
      stage.removeEventListener('pointermove', handleMove)
      stage.removeEventListener('pointerleave', handleLeave)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <section id="top" className="hero-section">
      <header className="site-header">
        <motion.a href="#top" className="brand-lockup" aria-label="NOVAHAUS home" onClick={closeMenu} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: heroEase }}><BrandLogo className="brand-logo-light" /></motion.a>
        <nav className="desktop-nav" aria-label="Primary navigation">{navItems.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}</nav>
        <div className="header-actions"><a className="header-cta" href="#contact">Book a strategy call <ArrowIcon direction="right" /></a><button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /></button></div>
        <div className={`mobile-nav ${menuOpen ? 'is-open' : ''}`}>{navItems.map((item) => <a key={item.label} href={item.href} onClick={closeMenu}>{item.label}<ArrowIcon direction="right" /></a>)}<a className="mobile-nav-cta" href="#contact" onClick={closeMenu}>Book a strategy call <ArrowIcon direction="right" /></a></div>
      </header>

      <div className="hero-grid page-shell">
        <div className="hero-copy">
          <div>
            <motion.div initial={reduceMotion ? false : { opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.1, ease: heroEase }}><SectionLabel>AI Brand & Digital Studio</SectionLabel></motion.div>
            <h1 id="hero-title"><motion.span className="hero-title-line" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.18, ease: heroEase }}>Make the next</motion.span><motion.span className="hero-title-line" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.3, ease: heroEase }}>move</motion.span><motion.span className="hero-title-line" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.42, ease: heroEase }}><em>unmistakable.</em></motion.span></h1>
            <motion.p className="hero-description" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.62, ease: heroEase }}>Strategy, identity and intelligent systems for founders who need the market to understand them—fast.</motion.p>
            <div className="hero-actions"><MagneticLink href="#contact" className="hero-primary-link" delay={0.74} reduceMotion={reduceMotion}>Book a strategy call</MagneticLink><motion.a href="#work" className="text-link hero-secondary-link" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.86, ease: heroEase }} whileHover={reduceMotion ? undefined : { scale: 1.03, boxShadow: '0 14px 30px rgba(17, 17, 17, .1)' }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}><span>See the work</span><ArrowIcon direction="right" /></motion.a></div>
            <motion.div className="hero-traits" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.98, ease: heroEase }}><span>Sharper positioning</span><span className="hero-trait-dot" aria-hidden="true" /><span>Less friction</span><span className="hero-trait-dot" aria-hidden="true" /><span>Digital momentum</span></motion.div>
          </div>
        </div>

        <motion.div className="hero-stage-reveal" initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.18, ease: heroEase }}><motion.div ref={stageRef} className="hero-stage" aria-label="NOVAHAUS brand system visualization" animate={reduceMotion ? undefined : { y: [0, -7, 0] }} transition={reduceMotion ? { duration: 0 } : { duration: 8, ease: 'easeInOut', repeat: Infinity }}><div className="hero-stage-glow" /><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-dashboard" data-parallax="0.08"><div className="dashboard-topline"><span>Brand operating system</span><span>01 / 05</span></div><div className="dashboard-core"><BrandMark className="dashboard-mark" loading="eager" /><span>Clarity / Leverage / Signal</span></div><div className="dashboard-footer"><span>Positioning</span><span className="dashboard-status"><i /> In progress</span></div></div><div className="hero-float-card float-card-top" data-parallax="0.14"><span>Signal strength</span><strong>92</strong><small>+ 18.4%</small></div><div className="hero-float-card float-card-bottom" data-parallax="0.2"><span>System / 04</span><strong>AI leverage</strong><small>Connected</small></div><div className="hero-coordinate">03° 08&apos; N<br />101° 41&apos; E</div></motion.div></motion.div>
      </div>
      <div className="hero-bottomline page-shell"><span>Strategy</span><span>Identity</span><span>Digital</span><span>AI systems</span><span className="scroll-prompt">Scroll to explore <span className="scroll-line" /></span></div>
    </section>
  )
}

function AnimatedNumber({ value, suffix = '', label }) {
  const [display, setDisplay] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value)
      return undefined
    }
    let frame = 0
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / 850, 1)
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [reduceMotion, value])

  return <div><strong>{display}{suffix}</strong><span>{label}</span></div>
}

function AboutSection() {
  return (
    <section id="about" className="section dark-section about-section">
      <div className="page-shell">
        <SectionHeader number="01" label="About NOVAHAUS" title={<>Make your signal<br /><span>impossible to miss.</span></>} description="NOVAHAUS is a brand and digital studio for founders, creators and teams with something worth moving into the world." dark />
        <div className="about-lower"><Reveal className="about-statement" delay={100}><p>The strongest brands do not shout. They make the right thing clear, then make the next decision easier.</p><a href="#why" className="text-link text-link-light">See what matters here <ArrowIcon direction="right" /></a></Reveal><Reveal className="about-metrics" delay={180}><AnimatedNumber value={1} label={<>Integrated<br />system</>} /><AnimatedNumber value={6} label={<>Concept<br />directions</>} /><AnimatedNumber value={24} suffix="h" label={<>Response<br />window</>} /></Reveal></div>

        <Reveal className="proof-strip" delay={240}><div className="proof-intro"><SectionLabel>Trusted by</SectionLabel><p>People building the next chapter of a serious business.</p></div><div className="client-profile-list" aria-label="Selected client profiles">{clientProfiles.map((profile) => <span key={profile}>{profile}</span>)}</div></Reveal>

        <Reveal className="commercial-grid" delay={300}><div className="commercial-card"><SectionLabel>Selected clients</SectionLabel><p>Founder-led services, AI-native products, personal brands and modern teams.</p><span className="commercial-note">The work stays close to the business.</span></div><div className="commercial-card"><SectionLabel>Awards & standards</SectionLabel><p>Concept-led craft, accessibility-aware systems and performance built into the brief.</p><span className="commercial-note">No inflated numbers. Just useful work.</span></div></Reveal>

        <div id="process" className="process-inline"><Reveal className="process-intro"><SectionLabel number="02">Process</SectionLabel><h3>Clear decisions.<br /><span>Visible momentum.</span></h3></Reveal><div className="process-list">{processItems.map((item, index) => <Reveal key={item.number} className="process-item" delay={index * 90}><span>{item.number}</span><h4>{item.title}</h4><p>{item.description}</p></Reveal>)}</div></div>
      </div>
    </section>
  )
}

function ServiceIcon({ type }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '1.5' }
  if (type === 'website') return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><rect x="4.5" y="6" width="23" height="20" rx="3" /><path d="M5 11h22M9 8.5h.01M12 8.5h.01M15 8.5h.01M10 16h12M10 20h8" /></svg>
  if (type === 'strategy') return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><circle cx="16" cy="16" r="10.5" /><path d="m12 20 2.2-6.2L20 12l-2.2 6.2L12 20ZM16 5.5V3M16 29v-2.5M5.5 16H3M29 16h-2.5" /></svg>
  if (type === 'consulting') return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><path d="M6 8.5A3.5 3.5 0 0 1 9.5 5h13A3.5 3.5 0 0 1 26 8.5v8a3.5 3.5 0 0 1-3.5 3.5H15l-5.5 5v-5.2A3.5 3.5 0 0 1 6 16.5v-8Z" /><path d="M12 12.5h.01M16 12.5h.01M20 12.5h.01" /></svg>
  return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><circle cx="8" cy="16" r="2.5" /><circle cx="24" cy="9" r="2.5" /><circle cx="24" cy="23" r="2.5" /><path d="m10.2 15 11.5-5M10.2 17l11.5 5M24 11.5v9" /></svg>
}

const serviceCardVariants = { initial: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: revealMotion }, hover: { y: -8, scale: 1.02, borderColor: 'rgba(200, 162, 74, .72)', boxShadow: '0 24px 55px rgba(17, 17, 17, .14)', transition: cardSpring } }
const serviceIconVariants = { initial: { opacity: 0, scale: 0.86 }, visible: { opacity: 1, scale: 1, transition: { ...revealMotion, delay: 0.12 } }, hover: { color: '#C8A24A', scale: 1.04, transition: cardSpring } }
const serviceArrowVariants = { initial: { x: 0, color: '#111111' }, visible: { x: 0, color: '#111111' }, hover: { x: 8, color: '#C8A24A', transition: cardSpring } }

function ServicesSection() {
  return <section id="services" className="section light-section services-section"><div className="page-shell"><SectionHeader number="03" label="Capabilities" title={<>The work behind<br /><span>the signal.</span></>} description="Four focused disciplines. One coherent way of making the business easier to understand and easier to choose." /><div className="services-grid">{serviceItems.map((item) => <motion.article key={item.number} className="service-card" variants={serviceCardVariants} initial="initial" whileInView="visible" whileHover="hover" viewport={{ once: true, amount: 0.22 }}><motion.div className="service-icon" variants={serviceIconVariants}><ServiceIcon type={item.icon} /></motion.div><span className="service-number">{item.number}</span><h3>{item.title}</h3><p>{item.description}</p><motion.span className="card-arrow" variants={serviceArrowVariants}><span>See the approach</span><span aria-hidden="true">→</span></motion.span></motion.article>)}</div></div></section>
}

function SolutionsSection() {
  return <section id="solutions" className="section dark-section solutions-section"><div className="page-shell"><SectionHeader number="04" label="Solutions" title={<>Designed around<br /><span>what matters next.</span></>} description="Different ambitions need different systems. The common thread is a sharper way forward." dark /><div className="solutions-grid">{solutionItems.map((item, index) => <Reveal key={item.title} className={`solution-card solution-card-${index + 1}`} delay={index * 100}><div className="solution-card-art"><span>{String(index + 1).padStart(2, '0')}</span><div className="solution-art-line" /><div className="solution-art-dot" /></div><p className="card-eyebrow">{item.eyebrow}</p><h3>{item.title}</h3><p>{item.description}</p><div className="tag-row">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></Reveal>)}</div></div></section>
}

function ProjectArt({ type, title }) {
  return <div className={`project-art ${type}`} role="img" aria-label={`${title} concept project cover`}><div className="project-art-window"><span /><span /><span /></div>{type === 'project-signal' && <><div className="signal-word">SIGNAL</div><div className="signal-grid-lines" /><div className="signal-orb"><BrandMark /></div></>}{type === 'project-northstar' && <><div className="northstar-word">north<br /><em>star</em></div><div className="northstar-rule" /></>}{type === 'project-forma' && <><div className="forma-word">VECTOR</div><div className="forma-circle" /><div className="forma-chip">AI PRODUCT</div></>}{type === 'project-vertex' && <><div className="vertex-word">AURELIA</div><div className="vertex-grid" /><div className="vertex-dot" /></>}{type === 'project-morrow' && <><div className="morrow-word">MONUMENT</div><div className="morrow-line" /><div className="morrow-chip">ARCHITECTURE</div></>}{type === 'project-coda' && <><div className="coda-word">MOTION</div><div className="coda-arc" /><div className="coda-chip">FUTURE MOBILITY</div></>}</div>
}

const portfolioCardVariants = { hidden: { opacity: 0, y: 28 }, visible: (index) => ({ opacity: 1, y: 0, transition: { ...revealMotion, delay: index * 0.08 } }), hover: { y: -8, scale: 1.02, background: 'linear-gradient(145deg, #ffffff 0%, #fcf6e9 100%)', boxShadow: '0 26px 58px rgba(17, 17, 17, .14)', transition: cardSpring } }
const portfolioCoverVariants = { hidden: { opacity: 0, scale: 0.985 }, visible: { opacity: 1, scale: 1, transition: revealMotion }, hover: { scale: 1.04, transition: revealMotion } }
const portfolioLinkVariants = { hidden: { opacity: 0, x: 0 }, visible: { opacity: 1, x: 0, transition: { ...revealMotion, delay: 0.18 } }, hover: { color: '#C8A24A', x: 7, transition: cardSpring } }

function PortfolioCard({ item, index }) {
  const cardRef = useRef(null)
  const handlePointerMove = (event) => {
    const node = cardRef.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--portfolio-x', `${(((event.clientX - rect.left) / rect.width - 0.5) * 5).toFixed(2)}px`)
    node.style.setProperty('--portfolio-y', `${(((event.clientY - rect.top) / rect.height - 0.5) * 5).toFixed(2)}px`)
  }
  const handlePointerLeave = () => { if (cardRef.current) { cardRef.current.style.setProperty('--portfolio-x', '0px'); cardRef.current.style.setProperty('--portfolio-y', '0px') } }
  return <motion.article ref={cardRef} className="portfolio-card" custom={index} variants={portfolioCardVariants} initial="hidden" whileInView="visible" whileHover="hover" viewport={{ once: true, amount: 0.18 }} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}><motion.div className="portfolio-cover" variants={portfolioCoverVariants}><ProjectArt type={item.className} title={item.title} /></motion.div><div className="portfolio-meta"><div className="portfolio-meta-top"><span className="portfolio-number">{item.number}</span><span className="portfolio-industry">{item.industry}</span></div><span className="portfolio-kicker">{item.kicker}</span><h3>{item.title}</h3><p>{item.description}</p><motion.a href="#contact" className="portfolio-link" variants={portfolioLinkVariants} aria-label={`Discuss ${item.title}`}><span>Discuss the direction</span><span aria-hidden="true">→</span></motion.a></div></motion.article>
}

function PortfolioSection() {
  return <section id="work" className="section light-section work-section"><div className="page-shell"><SectionHeader number="05" label="Selected work" title={<>Directions with<br /><span>something to say.</span></>} description="Concept projects across brand identity, digital experience, AI product, luxury branding, architecture and future mobility." /><div className="portfolio-grid">{workItems.map((item, index) => <PortfolioCard key={item.number} item={item} index={index} />)}</div></div></section>
}

function WhyIcon({ type }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '1.5' }
  if (type === 'design') return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><path d="m16 4 11 12-11 12L5 16 16 4Z" /><path d="m16 9 6.5 7-6.5 7-6.5-7L16 9Z" /></svg>
  if (type === 'speed') return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><circle cx="16" cy="16" r="11" /><path d="M16 9v7l4.5 3M7 5l-2 2M25 5l2 2" /></svg>
  if (type === 'partner') return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><path d="M12.5 18.5 10 21a3.5 3.5 0 0 0 5 5l3-3M19.5 13.5 22 11a3.5 3.5 0 1 0-5-5l-3 3M12 20l8-8M9 16H5M27 16h-4" /></svg>
  return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><circle cx="16" cy="16" r="6" /><path d="M16 3v4M16 25v4M3 16h4M25 16h4M7 7l3 3M22 22l3 3M25 7l-3 3M10 22l-3 3" /></svg>
}

const whyCardVariants = { hidden: { opacity: 0, y: 28 }, visible: (index) => ({ opacity: 1, y: 0, transition: { ...revealMotion, delay: index * 0.1 } }), hover: { y: -8, borderColor: 'rgba(200, 162, 74, .72)', boxShadow: '0 24px 55px rgba(0, 0, 0, .24)', transition: cardSpring } }
const whyIconVariants = { hidden: { opacity: 0, scale: 0.86 }, visible: { opacity: 1, scale: 1, transition: { ...revealMotion, delay: 0.12 } }, hover: { rotate: 6, color: '#E2C995', transition: cardSpring } }
const whyNumberVariants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { ...revealMotion, delay: 0.18 } }, hover: { scale: 1.08, color: '#C8A24A', transition: cardSpring } }

function WhySection() {
  return <section id="why" className="section dark-section why-section"><div className="page-shell why-layout"><div className="why-intro"><SectionLabel number="06">Why NOVAHAUS</SectionLabel><motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: heroEase }}><h2 className="why-title">Clarity<br />with edge.</h2><p className="why-description">A website is only the surface. The real work is what it sets in motion.</p></motion.div></div><div className="why-card-grid">{principles.map((item, index) => <motion.article key={item.number} className="why-card" custom={index} variants={whyCardVariants} initial="hidden" whileInView="visible" whileHover="hover" viewport={{ once: true, amount: 0.2 }}><motion.div className="why-card-icon" variants={whyIconVariants}><WhyIcon type={item.icon} /></motion.div><motion.span className="why-card-number" variants={whyNumberVariants}>{item.number}</motion.span><h3>{item.title}</h3><p>{item.description}</p></motion.article>)}</div></div></section>
}

function TestimonialsSection() {
  return <section id="testimonials" className="section light-section testimonials-section"><div className="page-shell"><SectionHeader number="07" label="Point of view" title={<>The feeling<br /><span>worth designing toward.</span></>} description="Good work creates a sense of momentum before a single metric moves." /><div className="testimonial-grid"><Reveal className="testimonial-feature"><BrandMark className="testimonial-mark" /><blockquote>“When the story becomes clear, the whole business starts to move differently.”</blockquote><p>NOVAHAUS / concept note</p></Reveal><div className="testimonial-stack"><Reveal className="testimonial-note" delay={100}><span>01 / A field note</span><p>Premium is not a finish. It is the discipline of removing everything that does not matter.</p></Reveal><Reveal className="testimonial-note" delay={180}><span>02 / A field note</span><p>The best systems create room for better decisions, not more noise.</p></Reveal></div></div></div></section>
}

function FAQSection() {
  const [active, setActive] = useState(0)
  return <section id="faq" className="section light-section faq-section"><div className="page-shell faq-layout"><SectionHeader number="08" label="FAQ" title={<>Good questions<br /><span>make better work.</span></>} description="A few useful answers before the first conversation." /><div className="faq-list">{faqs.map((item, index) => { const isActive = active === index; return <Reveal key={item.question} className={`faq-item ${isActive ? 'is-active' : ''}`} delay={index * 50}><button type="button" aria-expanded={isActive} aria-controls={`faq-answer-${index}`} onClick={() => setActive(isActive ? -1 : index)}><span>{item.question}</span><span className="faq-plus" /></button><div id={`faq-answer-${index}`} className="faq-answer"><p>{item.answer}</p></div></Reveal> })}</div></div></section>
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (event) => { event.preventDefault(); setSubmitted(true) }
  return <form className="contact-form" onSubmit={handleSubmit}><div className="form-row"><label htmlFor="contact-name">Name<input id="contact-name" name="name" placeholder="Your name" autoComplete="name" required /></label><label htmlFor="contact-email">Email<input id="contact-email" name="email" type="email" placeholder="you@company.com" autoComplete="email" required /></label></div><div className="form-row"><label htmlFor="contact-company">Company<input id="contact-company" name="company" placeholder="Company or project" autoComplete="organization" /></label><label htmlFor="contact-type">Project type<select id="contact-type" name="projectType" defaultValue="" required><option value="" disabled>Select one</option><option>Brand strategy</option><option>Website / digital experience</option><option>AI automation</option><option>AI consulting</option><option>Something else</option></select></label></div><label htmlFor="contact-budget">Budget range<select id="contact-budget" name="budget" defaultValue=""><option value="">Prefer to discuss</option><option>Under $5,000</option><option>$5,000–$15,000</option><option>$15,000–$30,000</option><option>$30,000+</option></select></label><label htmlFor="contact-message">Business inquiry<textarea id="contact-message" name="message" rows="4" placeholder="What needs to move, and why now?" required /></label><div className="form-footer"><button className="form-submit" type="submit">{submitted ? 'Inquiry prepared' : 'Start the conversation'} <ArrowIcon direction="right" /></button><span aria-live="polite">{submitted ? 'Thank you. Email integration will be available soon.' : 'A considered reply within 24 hours.'}</span></div></form>
}

function CTASection() {
  return <section id="contact" className="section dark-section cta-section"><div className="page-shell"><Reveal className="cta-grid"><div><SectionLabel number="09">Contact</SectionLabel><h2 className="cta-title">Put the right<br /><em>signal in the room.</em></h2><p>For a new venture, a sharper position or a digital system that finally pulls its weight, start with the context.</p><div className="cta-contact-detail"><a href="mailto:hello@novahaus.studio">hello@novahaus.studio</a><span>Kuala Lumpur / Global</span></div><div className="contact-channels"><div><span>Calendly</span><strong>Booking link coming soon</strong></div><div><span>WhatsApp</span><strong>Direct line coming soon</strong></div></div></div><ContactForm /></Reveal></div></section>
}

function Footer() {
  return <footer className="site-footer"><div className="page-shell footer-top"><div className="footer-brand"><BrandLogo reversed className="footer-logo" /><p>AI Brand & Digital Studio</p></div><nav aria-label="Footer navigation">{navItems.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}</nav></div><div className="page-shell footer-bottom"><span>© 2026 NOVAHAUS. All Rights Reserved.</span><span>Built with clarity.</span></div></footer>
}

function App() {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const targets = [...document.querySelectorAll('[data-parallax]')]
    let frame = 0
    const update = () => {
      const scrollY = window.scrollY
      targets.forEach((target) => {
        const speed = Number(target.dataset.parallax) || 0
        const bounds = target.parentElement?.getBoundingClientRect()
        if (bounds && bounds.bottom > -100 && bounds.top < window.innerHeight + 100) target.style.setProperty('--scroll-shift', `${(scrollY - (scrollY + bounds.top)) * speed * -1}px`)
      })
      frame = 0
    }
    const handleScroll = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => { window.removeEventListener('scroll', handleScroll); if (frame) window.cancelAnimationFrame(frame) }
  }, [])

  return <><a className="skip-link" href="#main-content">Skip to content</a><PageLoader reduceMotion={reduceMotion} /><main id="main-content"><Hero /><AboutSection /><ServicesSection /><SolutionsSection /><PortfolioSection /><WhySection /><TestimonialsSection /><FAQSection /><CTASection /><Footer /></main></>
}

export default App
