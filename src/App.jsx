import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import BrandLogo from './components/BrandLogo.jsx'
import LeadCapture from './components/LeadCapture.jsx'
import GrowthAssessment from './components/GrowthAssessment.jsx'
import ProposalBuilder from './components/ProposalBuilder.jsx'
import ProposalStudioPage from './components/ProposalStudioPage.jsx'
import AiSalesAgentPage from './components/ai-sales-agent/AiSalesAgentPage.jsx'
import AiSalesAgentWidget from './components/ai-sales-agent/AiSalesAgentWidget.jsx'
import InteractiveAIExperienceCenter from './components/InteractiveAIExperienceCenter.jsx'
import LeadsPage from './components/leads/LeadsPage.jsx'
import CRMPage from './components/crm/CRMPage.jsx'
import KnowledgeHubPage from './components/KnowledgeHubPage.jsx'
import ValuePropositionPage from './components/ValuePropositionPage.jsx'
import { BookingPage, BookingReviewPage } from './components/BookingPage.jsx'
import { blogPosts, caseStudies } from './data/caseStudies.js'
import { products } from './data/products.js'
import { growthPackages, packagePrinciples } from './data/packages.js'
import { trackAssessmentEvent } from './lib/analytics.js'

const heroEase = [0.22, 1, 0.36, 1]
const cardSpring = { type: 'spring', stiffness: 300, damping: 25, mass: 0.75 }
const revealMotion = { duration: 0.65, ease: heroEase }

const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'Case Studies', href: '/case-studies/' },
  { label: 'Growth Assessment', href: '/growth-assessment/' },
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '/products/' },
  { label: 'Knowledge Hub', href: '/knowledge-hub/' },
  { label: 'AI Sales Agent', href: '/ai-sales-agent/' },
  { label: 'Process', href: '#approach' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
  { label: 'Book a Strategy Call', href: '/booking/?source=footer' },
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

const positioningItems = [
  { number: '01', title: 'Strategy', description: 'Clarify the positioning, offer and message your market needs to understand.' },
  { number: '02', title: 'Experience', description: 'Create websites and landing pages designed to turn attention into qualified enquiries.' },
  { number: '03', title: 'Automation', description: 'Connect forms, CRM, follow-up, reporting and internal workflows into one efficient system.' },
  { number: '04', title: 'Growth', description: 'Measure performance, improve conversion and support long-term market expansion.' },
]

const whoWeHelpItems = ['Web3 Projects', 'FinTech', 'AI Startups', 'High-Net-Worth Entrepreneurs', 'Professional Services', 'Global Businesses']

const faqs = [
  { question: 'Why NOVAHAUS?', answer: 'NOVAHAUS brings strategy, digital experience and practical AI systems into one commercial conversation, so the work supports the business rather than sitting beside it.' },
  { question: 'How is NOVAHAUS different?', answer: 'We start with the business problem and the decision your market needs to make. The brand, website and systems follow that clarity.' },
  { question: 'Do you only build websites?', answer: 'No. Websites are one part of the system. We also work across positioning, automation, CRM, content operations and ongoing optimisation.' },
  { question: 'How do Strategy Calls work?', answer: 'A Strategy Call is a focused first conversation about your goals, constraints and next commercial priority. If there is a fit, we outline a useful route forward.' },
  { question: 'Do you provide long-term support?', answer: 'Yes. Growth Partner is a monthly retainer for businesses that want continued strategic support, optimisation and system refinement after launch.' },
]

const strategyCallFaqs = [
  { question: 'What happens on the call?', answer: 'We use the conversation to understand your business, current priorities and the friction between where you are and where you want to go.' },
  { question: 'Do I need to prepare anything?', answer: 'Bring the context you already have. A clear view of your goals, audience and current challenge is enough to begin.' },
  { question: 'Is this a sales call?', answer: 'It is a practical first conversation. If there is a useful fit, we will explain the next step; there is no obligation to continue.' },
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

function Reveal({ children, className = '', delay = 0, id }) {
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

  return <div id={id} ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>{children}</div>
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
        <div className="header-actions"><a className="header-cta" href="/booking/?source=homepage-header">Book a Strategy Call <ArrowIcon direction="right" /></a><button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /></button></div>
        <div className={`mobile-nav ${menuOpen ? 'is-open' : ''}`}>{navItems.map((item) => <a key={item.label} href={item.href} onClick={closeMenu}>{item.label}<ArrowIcon direction="right" /></a>)}<a className="mobile-nav-cta" href="/booking/?source=homepage-header" onClick={closeMenu}>Book a Strategy Call <ArrowIcon direction="right" /></a></div>
      </header>

      <div className="hero-grid page-shell">
        <div className="hero-copy">
          <div>
            <motion.div initial={reduceMotion ? false : { opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.1, ease: heroEase }}><SectionLabel>AI GROWTH & DIGITAL SYSTEMS</SectionLabel></motion.div>
            <h1 id="hero-title"><motion.span className="hero-title-line" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.18, ease: heroEase }}>Make growth easier</motion.span><motion.span className="hero-title-line" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.3, ease: heroEase }}><em>to choose.</em></motion.span></h1>
            <motion.p className="hero-description" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.62, ease: heroEase }}>NOVAHAUS connects positioning, digital experience and practical AI systems so ambitious businesses can earn attention, qualify demand and move with less friction.</motion.p>
            <div className="hero-actions"><MagneticLink href="/booking/?source=homepage-hero" className="hero-primary-link" delay={0.74} reduceMotion={reduceMotion}>Build Your Growth System</MagneticLink><motion.a href="#capabilities" className="text-link hero-secondary-link" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.86, ease: heroEase }} whileHover={reduceMotion ? undefined : { scale: 1.03, boxShadow: '0 14px 30px rgba(17, 17, 17, .1)' }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}><span>See How It Works</span><ArrowIcon direction="right" /></motion.a></div>
            <motion.p className="hero-trust-note" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.98, ease: heroEase }}>Strategy-led. AI-enabled. Designed around the next commercial decision.</motion.p>
          </div>
        </div>

        <motion.div className="hero-stage-reveal" initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.18, ease: heroEase }}><motion.div ref={stageRef} className="hero-stage" aria-label="NOVAHAUS brand system visualization" animate={reduceMotion ? undefined : { y: [0, -7, 0] }} transition={reduceMotion ? { duration: 0 } : { duration: 8, ease: 'easeInOut', repeat: Infinity }}><div className="hero-stage-glow" /><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-dashboard" data-parallax="0.08"><div className="dashboard-topline"><span>Brand operating system</span><span>01 / 05</span></div><div className="dashboard-core"><BrandMark className="dashboard-mark" loading="eager" /><span>Clarity / Leverage / Signal</span></div><div className="dashboard-footer"><span>Positioning</span><span className="dashboard-status"><i /> In progress</span></div></div><div className="hero-float-card float-card-top" data-parallax="0.14"><span>Signal strength</span><strong>92</strong><small>+ 18.4%</small></div><div className="hero-float-card float-card-bottom" data-parallax="0.2"><span>System / 04</span><strong>AI leverage</strong><small>Connected</small></div><div className="hero-coordinate">03° 08&apos; N<br />101° 41&apos; E</div></motion.div></motion.div>
      </div>
      <div className="hero-bottomline page-shell"><span>Strategy</span><span>Identity</span><span>Digital</span><span>AI systems</span><span className="scroll-prompt">Scroll to explore <span className="scroll-line" /></span></div>
    </section>
  )
}

function PositioningStrip() {
  return <section id="capabilities" className="positioning-strip-section section light-section"><div className="page-shell"><Reveal className="positioning-strip-header"><SectionLabel>Growth system</SectionLabel><h2>One system for the work<br /><span>behind the growth.</span></h2></Reveal><div className="positioning-grid">{positioningItems.map((item, index) => <Reveal key={item.number} className="positioning-item" delay={index * 80}><span className="positioning-number">{item.number}</span><h3>{item.title}</h3><p>{item.description}</p></Reveal>)}</div></div></section>
}

function WhoWeHelpSection() {
  return <section id="who-we-work-with" className="who-we-help-section section paper-section"><div className="page-shell"><Reveal className="who-we-help-header"><SectionLabel>Who we work with</SectionLabel><h2>Who We<br /><span>Work With</span></h2><p>Ambitious teams in complex markets that need clarity, operating leverage and a partner who can stay close to the next decision.</p></Reveal><Reveal className="industry-tags" delay={120}>{whoWeHelpItems.map((item) => <span key={item}>{item}</span>)}</Reveal></div></section>
}

const howWeHelpItems = [
  { number: '01', title: 'Strategy', description: 'Business positioning, messaging and growth planning.' },
  { number: '02', title: 'AI Automation', description: 'CRM, AI workflows, lead automation and operational efficiency.' },
  { number: '03', title: 'Digital Presence', description: 'Website, landing pages and conversion-focused user experience.' },
  { number: '04', title: 'Growth Partnership', description: 'Long-term optimisation, analytics and strategic support.' },
]

const trustReasons = ['Strategy Before Execution', 'AI-Powered Systems', 'Long-Term Partnership', 'Global Perspective']

const approachSteps = [
  { number: '01', title: 'Discovery', description: 'Understand business goals and challenges.' },
  { number: '02', title: 'Strategy', description: 'Design the growth roadmap.' },
  { number: '03', title: 'Build', description: 'Develop websites, AI systems and automation.' },
  { number: '04', title: 'Launch', description: 'Deploy and optimise.' },
  { number: '05', title: 'Scale', description: 'Continuous growth through long-term partnership.' },
]

function HowWeHelpSection() {
  return <section id="how-we-help" className="section light-section conversion-help-section"><div className="page-shell"><SectionHeader label="How we help" title={<>How We Help<br /><span>Businesses Grow</span></>} description="We build complete growth systems instead of isolated digital services." /><div className="services-grid conversion-help-grid">{howWeHelpItems.map((item, index) => <Reveal key={item.number} className="service-card conversion-help-card" delay={index * 80}><span className="service-number">{item.number}</span><h3>{item.title}</h3><p>{item.description}</p></Reveal>)}</div></div></section>
}

function TrustSection() {
  return <section id="why-choose" className="section dark-section conversion-trust-section"><div className="page-shell"><SectionHeader label="Why NOVAHAUS" title={<>Why Businesses<br /><span>Choose NOVAHAUS</span></>} dark /><div className="conversion-trust-grid">{trustReasons.map((reason, index) => <Reveal key={reason} className="conversion-trust-card" delay={index * 80}><span>{String(index + 1).padStart(2, '0')}</span><h3>{reason}</h3></Reveal>)}</div></div></section>
}

function ApproachSection() {
  return <section id="approach" className="section dark-section approach-section"><div className="page-shell"><SectionHeader label="Our Approach" title={<>A clear path from<br /><span>ambition to traction.</span></>} description="Five focused steps keep the work useful, visible and moving." dark /><div className="approach-grid">{approachSteps.map((step, index) => <Reveal key={step.number} className="approach-card" delay={index * 70}><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></Reveal>)}</div></div></section>
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
        <SectionHeader number="01" label="About NOVAHAUS" title={<>Make your signal<br /><span>impossible to miss.</span></>} description="NOVAHAUS is an AI growth company for founders, operators and teams with something worth moving into the world." dark />
        <div className="about-lower"><Reveal className="about-statement" delay={100}><p>The strongest brands do not shout. They make the right thing clear, then make the next decision easier.</p><a href="#why" className="text-link text-link-light">See how we work <ArrowIcon direction="right" /></a></Reveal><Reveal className="about-metrics" delay={180}><AnimatedNumber value={1} label={<>Integrated<br />system</>} /><AnimatedNumber value={3} label={<>Growth<br />levers</>} /><AnimatedNumber value={1} label={<>Shared<br />direction</>} /></Reveal></div>

        <Reveal className="proof-strip" delay={240}><div className="proof-intro"><SectionLabel>Built for</SectionLabel><p>Teams building the next chapter of a serious business.</p></div><div className="client-profile-list" aria-label="Business profiles NOVAHAUS supports">{clientProfiles.map((profile) => <span key={profile}>{profile}</span>)}</div></Reveal>

        <Reveal className="commercial-grid" delay={300}><div className="commercial-card"><SectionLabel>Engagement focus</SectionLabel><p>Founder-led services, AI-native products, personal brands and modern teams.</p><span className="commercial-note">The work stays close to the business.</span></div><div className="commercial-card"><SectionLabel>Working standard</SectionLabel><p>Concept-led craft, accessibility-aware systems and performance built into the brief.</p><span className="commercial-note">Clear scope. Useful decisions. No inflated claims.</span></div></Reveal>

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

function CaseStudyShowcaseCard({ study, index }) {
  return <Reveal className="case-showcase-card" delay={index * 80}><div className="case-showcase-visual"><ProjectArt type={study.className} title={study.title} /></div><div className="case-showcase-content"><div className="case-showcase-meta"><span>{study.caseType}</span><span>{study.industry}</span></div><h3>{study.title}</h3><div className="case-showcase-summary"><div><span>Problem</span><p>{study.challenge}</p></div><div><span>Solution</span><p>{study.solution}</p></div></div><a href={`/case-studies/${study.slug}/`} className="case-showcase-link" aria-label={`View ${study.title} case study`}>View Case Study <ArrowIcon direction="right" /></a></div></Reveal>
}

function CaseStudiesShowcase() {
  return <section id="case-studies-home" className="section light-section case-studies-showcase-section"><div className="page-shell"><SectionHeader label="Case Studies" title={<>AI Growth Systems for<br /><span>real business challenges.</span></>} description="Explore how NOVAHAUS combines strategy, websites and AI systems to improve customer journeys, sales processes and business operations." /><div className="case-showcase-grid">{caseStudies.map((study, index) => <CaseStudyShowcaseCard key={study.slug} study={study} index={index} />)}</div><Reveal className="case-showcase-footer"><p>Internal product work and concept demos are clearly labelled. No unsupported client results are presented.</p><a href="/case-studies/" className="text-link">View all case studies <ArrowIcon direction="right" /></a></Reveal></div></section>
}

function PackageCard({ packageItem, index }) {
  return <Reveal className={`growth-package-card${packageItem.featured ? ' is-featured' : ''}`} delay={index * 90}><div className="growth-package-top"><div><span className="growth-package-number">{packageItem.number}</span><h3>{packageItem.name}</h3></div><span className="growth-package-label">{packageItem.label}</span></div><p className="growth-package-description">{packageItem.description}</p><ul className="growth-package-features">{packageItem.features.map((feature) => <li key={feature}><i aria-hidden="true">✓</i><span>{feature}</span></li>)}</ul><a href={packageItem.href} className="growth-package-cta" aria-label={`${packageItem.cta} for ${packageItem.name} package`}>{packageItem.cta}<ArrowIcon direction="right" /></a></Reveal>
}

function PackagesSection() {
  return <section id="packages" className="section light-section packages-section"><div className="page-shell"><SectionHeader label="Packages" title={<>Choose the right<br /><span>AI growth package.</span></>} description="Flexible AI solutions designed for businesses at different stages of growth." /><div className="growth-packages-grid">{growthPackages.map((packageItem, index) => <PackageCard key={packageItem.name} packageItem={packageItem} index={index} />)}</div><div className="package-principles"><SectionLabel>Why choose NOVAHAUS</SectionLabel><div className="package-principles-grid">{packagePrinciples.map((principle, index) => <Reveal key={principle.title} className="package-principle" delay={index * 70}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{principle.title}</h3><p>{principle.description}</p></div></Reveal>)}</div></div></div></section>
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
  return <motion.article ref={cardRef} className="portfolio-card" custom={index} variants={portfolioCardVariants} initial="hidden" whileInView="visible" whileHover="hover" viewport={{ once: true, amount: 0.18 }} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}><motion.div className="portfolio-cover" variants={portfolioCoverVariants}><ProjectArt type={item.className} title={item.title} /></motion.div><div className="portfolio-meta"><div className="portfolio-meta-top"><span className="portfolio-number">{item.number}</span><span className="portfolio-industry">{item.industry}</span></div><span className="portfolio-kicker">{item.status}</span><h3>{item.title}</h3><p>{item.description}</p><motion.a href={`/case-studies/${item.slug}/`} className="portfolio-link" variants={portfolioLinkVariants} aria-label={`View ${item.title} case study`}><span>View the case study</span><span aria-hidden="true">→</span></motion.a></div></motion.article>
}

function PortfolioSection() {
  return <section id="work" className="section light-section work-section"><div className="page-shell"><SectionHeader number="05" label="Latest case studies" title={<>Directions with<br /><span>something to say.</span></>} description="A replaceable case study library: concept work today, real client stories as they launch." /><div className="portfolio-grid">{caseStudies.slice(0, 3).map((item, index) => <PortfolioCard key={item.slug} item={item} index={index} />)}</div><Reveal className="portfolio-note" delay={220}><p>These are concept projects created to show how NOVAHAUS thinks. Client work will be added here with permission.</p><div className="portfolio-note-actions"><a href="/case-studies/" className="text-link">View All Case Studies <ArrowIcon direction="right" /></a><a href="/#contact" className="text-link">Have a project in mind <ArrowIcon direction="right" /></a></div></Reveal></div></section>
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
  return <section id="testimonials" className="section light-section testimonials-section"><div className="page-shell"><SectionHeader number="07" label="Point of view" title={<>The feeling<br /><span>worth designing toward.</span></>} description="Good work creates a sense of momentum before a single metric moves." /><div className="testimonial-grid"><Reveal className="testimonial-feature"><BrandMark className="testimonial-mark" /><blockquote>“When the story becomes clear, the whole business starts to move differently.”</blockquote><p>NOVAHAUS / point of view</p></Reveal><div className="testimonial-stack"><Reveal className="testimonial-note" delay={100}><span>01 / A working principle</span><p>Premium is not a finish. It is the discipline of removing everything that does not matter.</p></Reveal><Reveal className="testimonial-note" delay={180}><span>02 / A working principle</span><p>The best systems create room for better decisions, not more noise.</p></Reveal></div></div></div></section>
}

function FAQSection() {
  const [active, setActive] = useState(0)
  return <section id="faq" className="section light-section faq-section"><div className="page-shell faq-layout"><SectionHeader number="08" label="FAQ" title={<>Good questions<br /><span>make better work.</span></>} description="A few useful answers before the first conversation." /><div className="faq-list">{faqs.map((item, index) => { const isActive = active === index; return <Reveal key={item.question} className={`faq-item ${isActive ? 'is-active' : ''}`} delay={index * 50}><button type="button" aria-expanded={isActive} aria-controls={`faq-answer-${index}`} onClick={() => setActive(isActive ? -1 : index)}><span>{item.question}</span><span className="faq-plus" /></button><div id={`faq-answer-${index}`} className="faq-answer"><p>{item.answer}</p></div></Reveal> })}</div></div></section>
}

function ContactForm() {
  const handleSubmit = (event) => { event.preventDefault(); window.location.assign('/thank-you/') }
  return <form className="contact-form" onSubmit={handleSubmit}><div className="form-row"><label htmlFor="contact-name">Name<input id="contact-name" name="name" placeholder="Your name" autoComplete="name" required /></label><label htmlFor="contact-email">Email<input id="contact-email" name="email" type="email" placeholder="you@company.com" autoComplete="email" required /></label></div><div className="form-row"><label htmlFor="contact-company">Company<input id="contact-company" name="company" placeholder="Company or project" autoComplete="organization" /></label><label htmlFor="contact-type">Project type<select id="contact-type" name="projectType" defaultValue="" required><option value="" disabled>Select one</option><option>Brand strategy</option><option>Website / digital experience</option><option>AI automation</option><option>AI consulting</option><option>Something else</option></select></label></div><label htmlFor="contact-budget">Budget range<select id="contact-budget" name="budget" defaultValue=""><option value="">Prefer to discuss</option><option>Under $5,000</option><option>$5,000–$15,000</option><option>$15,000–$30,000</option><option>$30,000+</option></select></label><label htmlFor="contact-message">Business inquiry<textarea id="contact-message" name="message" rows="4" placeholder="What needs to move, and why now?" required /></label><div className="form-footer"><button className="form-submit" type="submit">Start the conversation <ArrowIcon direction="right" /></button><span>Your request is reviewed before the next conversation.</span></div></form>
}

function CTASection() {
  return <section id="contact" className="section dark-section cta-section"><div className="page-shell"><Reveal className="cta-grid"><div><SectionLabel number="09">Contact</SectionLabel><h2 className="cta-title">Ready to Build<br /><em>Your Growth System?</em></h2><p>Book a Strategy Call and discover how NOVAHAUS can help your business grow with AI, automation and strategy.</p><div className="conversion-cta-actions"><a href="/booking/?source=homepage-cta" className="magnetic-link conversion-primary-cta">Book a Strategy Call <ArrowIcon direction="right" /></a><a href="/products/" className="text-link text-link-light conversion-secondary-cta">View Products <ArrowIcon direction="right" /></a></div><div className="cta-contact-detail"><a href="mailto:hello@novahaus.studio">hello@novahaus.studio</a><span>Kuala Lumpur / Global</span></div><div className="contact-channels"><div><span>Calendly</span><strong>Booking request available</strong></div><div><span>WhatsApp</span><strong>Optional on the request form</strong></div></div></div><ContactForm /></Reveal></div></section>
}

function Footer() {
  const prefix = window.location.pathname === '/' ? '' : '/'
  return <footer className="site-footer"><div className="page-shell footer-top"><div className="footer-brand"><BrandLogo reversed className="footer-logo" /><p>Build Better Businesses.<br />Powered by AI.<br />Driven by Strategy.</p></div><nav aria-label="Footer navigation">{navItems.map((item) => <a key={item.label} href={item.href.startsWith('/') ? item.href : `${prefix}${item.href}`}>{item.label}</a>)}<a href="/about/">About page</a><a href="/blog/">Journal</a><a href="/privacy/">Privacy Policy</a><a href="/terms/">Terms of Service</a><a href="/trust/">Trust Center</a></nav></div><div className="page-shell footer-bottom"><span>© 2026 NOVAHAUS. All Rights Reserved.</span><span>Built with clarity.</span></div></footer>
}

function InternalHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  return <header className="internal-header page-shell"><a href="/" className="internal-brand" aria-label="NOVAHAUS home" onClick={closeMenu}><BrandLogo className="brand-logo-light" /></a><nav className="internal-nav" aria-label="Page navigation"><a href="/about/">About</a><a href="/blog/">Journal</a><a href="/products/">Products</a><a href="/knowledge-hub/">Knowledge Hub</a><a href="/ai-sales-agent/">AI Sales Agent</a><a href="/case-studies/">Case Studies</a><a href="/growth-assessment/">Growth Assessment</a><a href="/#work">Work</a><a href="/#contact">Contact</a></nav><div className="internal-actions"><a href="/booking/?source=internal-header" className="internal-cta">Book a Strategy Call <ArrowIcon direction="right" /></a><button className="internal-menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /></button></div><nav className={`internal-mobile-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Mobile page navigation">{['About', 'Journal', 'Products', 'Knowledge Hub', 'AI Sales Agent', 'Case Studies', 'Growth Assessment', 'Work', 'Contact'].map((label) => { const href = label === 'About' ? '/about/' : label === 'Journal' ? '/blog/' : label === 'Products' ? '/products/' : label === 'Knowledge Hub' ? '/knowledge-hub/' : label === 'AI Sales Agent' ? '/ai-sales-agent/' : label === 'Case Studies' ? '/case-studies/' : label === 'Growth Assessment' ? '/growth-assessment/' : label === 'Work' ? '/#work' : '/#contact'; return <a key={label} href={href} onClick={closeMenu}>{label}<ArrowIcon direction="right" /></a> })}<a href="/booking/?source=internal-header" className="internal-mobile-cta" onClick={closeMenu}>Book a Strategy Call <ArrowIcon direction="right" /></a></nav></header>
}

function InternalPage({ eyebrow, title, description, children, dark = false }) {
  return <div className={`internal-page ${dark ? 'internal-page-dark' : ''}`}><InternalHeader /><main id="main-content" className="internal-main"><Reveal className="internal-hero"><SectionLabel>{eyebrow}</SectionLabel><h1>{title}</h1><p>{description}</p></Reveal>{children}</main><Footer /></div>
}

function ProductFlowItem({ label, children }) {
  return <article className="product-flow-item"><span>{label}</span><div>{children}</div></article>
}

const productComparison = [
  { title: 'Launch', features: ['Positioning and message direction', 'Brand and visual direction', 'Website or landing page system', 'Lead capture pathway', 'Foundational SEO and analytics'] },
  { title: 'Growth', features: ['Everything in Launch', 'Lead qualification', 'CRM-ready workflows', 'AI Sales Agent discovery', 'Analytics and optimisation'] },
  { title: 'Enterprise', features: ['Everything in Growth', 'Multi-market experience', 'Integration architecture', 'Knowledge Hub structure', 'Governance and custom workflows'] },
]

const productsFaqs = [
  { question: 'Which package should I start with?', answer: 'Choose Launch when the foundation is the priority, Growth when the business needs connected acquisition and operations, or Enterprise when multiple markets, integrations and governance are in scope.' },
  { question: 'Can packages be combined?', answer: 'Yes. Each package is a clear starting point. The scope can expand as the business develops and new systems become useful.' },
  { question: 'What happens after a Strategy Call?', answer: 'We clarify the business context, priorities and constraints, then recommend a focused scope for the next stage.' },
  { question: 'Can we add AI capabilities later?', answer: 'Yes. AI capabilities can be introduced in stages, based on the workflows, customer journeys and operating context that matter most.' },
]

const trustPrinciples = [
  { number: '01', title: 'AI-first growth solutions', description: 'Use AI where it creates useful leverage across the customer journey and the work behind it.' },
  { number: '02', title: 'Strategy + implementation', description: 'Connect the thinking to the build so priorities become practical, usable systems.' },
  { number: '03', title: 'Measurable business outcomes', description: 'Define the signal that matters before selecting the tools, pages or workflows.' },
  { number: '04', title: 'Modular and scalable systems', description: 'Start with the highest-value move and leave room for the next stage.' },
]

const trustProcess = [
  { number: '01', title: 'Diagnose', description: 'Understand the business context, constraints and opportunity before recommending a direction.' },
  { number: '02', title: 'Design', description: 'Shape the offer, experience and system around the decisions the business needs to make.' },
  { number: '03', title: 'Build', description: 'Turn the agreed direction into a clear digital experience and practical operating layer.' },
  { number: '04', title: 'Optimize', description: 'Review the signal, remove friction and improve the system as the business develops.' },
]

const trustResponsibilities = [
  'Client information is used only to deliver requested services.',
  'NOVAHAUS does not claim certifications that are not verified.',
  'AI-generated outputs should be reviewed before important business decisions.',
  'External platforms and integrations follow their own privacy and security policies.',
]

const trustCapabilities = ['AI agents', 'Workflow automation', 'Lead capture systems', 'CRM-ready architecture', 'Analytics and optimization', 'API integrations']

const trustFaqs = [
  { question: 'What businesses do you work with?', answer: 'We work with ambitious founders, project teams and established businesses that need a clearer brand, digital experience or growth system.' },
  { question: 'Do I need technical knowledge?', answer: 'No. We explain the business decision first, then translate the technical work into a practical route your team can understand and use.' },
  { question: 'How long does implementation take?', answer: 'Timing depends on scope, available context and the systems involved. We confirm a realistic sequence after understanding the work.' },
  { question: 'Can solutions integrate with existing tools?', answer: 'They can be designed with existing tools and future integrations in mind. The exact approach depends on the platforms and access available.' },
  { question: 'How is business data handled?', answer: 'Information shared through the site is used to respond to the requested enquiry or service. External platforms retain their own policies and controls.' },
  { question: 'What happens after launch?', answer: 'We can review what is working, identify friction and agree the next useful improvement. Ongoing support is shaped around the business need.' },
]

function TrustCenterPage() {
  return <InternalPage eyebrow="NOVAHAUS / Trust Center" title={<>Clarity before<br /><em>the next decision.</em></>} description="A concise view of how NOVAHAUS works, the systems we build and the principles we follow when handling business context."><section className="trust-center-content" aria-label="NOVAHAUS Trust Center">
    <section className="trust-section trust-why-section" aria-labelledby="trust-why-title"><Reveal><SectionLabel number="01">Why NOVAHAUS</SectionLabel><h2 id="trust-why-title">Build with a partner<br /><em>who sees the whole system.</em></h2></Reveal><div className="trust-principle-grid">{trustPrinciples.map((item, index) => <Reveal className="trust-principle-card" delay={index * 70} key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.description}</p></Reveal>)}</div></section>
    <section className="trust-section trust-process-section" aria-labelledby="trust-process-title"><Reveal><SectionLabel number="02">How We Work</SectionLabel><h2 id="trust-process-title">A clear path from<br /><em>diagnosis to improvement.</em></h2></Reveal><div className="trust-process-grid">{trustProcess.map((item, index) => <Reveal className="trust-process-step" delay={index * 70} key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.description}</p></Reveal>)}</div></section>
    <section className="trust-section trust-responsibility-section" aria-labelledby="trust-responsibility-title"><div className="trust-section-heading"><Reveal><SectionLabel number="03">Data &amp; AI Responsibility</SectionLabel><h2 id="trust-responsibility-title">Useful systems need<br /><em>clear boundaries.</em></h2></Reveal></div><Reveal className="trust-responsibility-card" delay={100}><p>We keep the guidance practical and the claims proportionate to what can be verified.</p><ul>{trustResponsibilities.map((item) => <li key={item}><span aria-hidden="true">↗</span>{item}</li>)}</ul></Reveal></section>
    <section className="trust-section trust-technology-section" aria-labelledby="trust-technology-title"><Reveal><SectionLabel number="04">Technology Approach</SectionLabel><h2 id="trust-technology-title">Capabilities that support<br /><em>the business behind the brand.</em></h2><p className="trust-section-intro">NOVAHAUS combines strategy and implementation across the digital touchpoints that shape how a business is understood, chosen and operated.</p></Reveal><div className="trust-capability-grid">{trustCapabilities.map((item, index) => <Reveal className="trust-capability" delay={index * 55} key={item}><span>0{index + 1}</span><h3>{item}</h3></Reveal>)}</div></section>
    <section className="trust-section trust-faq-section" aria-labelledby="trust-faq-title"><Reveal><SectionLabel number="05">Frequently Asked Questions</SectionLabel><h2 id="trust-faq-title">Good questions<br /><em>before we begin.</em></h2></Reveal><div className="trust-faq-list">{trustFaqs.map((item, index) => <Reveal className="trust-faq-item" delay={index * 45} key={item.question}><details><summary>{item.question}<span className="faq-plus" aria-hidden="true" /></summary><p>{item.answer}</p></details></Reveal>)}</div></section>
    <Reveal className="trust-final-cta"><SectionLabel number="06">Next step</SectionLabel><h2>Bring the context<br /><em>to the table.</em></h2><p>Start with a focused conversation or generate a structured proposal from the context you already have.</p><div className="trust-cta-actions"><a href="/booking/?source=trust-center" className="button-dark">Book Strategy Call <ArrowIcon direction="right" /></a><a href="/proposal/" className="text-link">Generate Your Proposal <ArrowIcon direction="right" /></a></div></Reveal>
  </section></InternalPage>
}

const strategyBenefits = [
  { number: '01', title: 'Business Growth Assessment', description: 'A focused look at the business, market and next decision that matters.' },
  { number: '02', title: 'AI Opportunity Review', description: 'Identify practical places where automation could remove friction and create leverage.' },
  { number: '03', title: 'Website & Brand Review', description: 'See where your digital presence can make the value easier to understand and choose.' },
  { number: '04', title: 'Growth Roadmap', description: 'Leave with a clearer sequence of priorities for the next stage of growth.' },
]

const strategyAudience = ['Web3 Projects', 'High-Net-Worth Entrepreneurs', 'AI Companies', 'FinTech Businesses']

function LegacyStrategyCallPage() {
  return <InternalPage eyebrow="NOVAHAUS / Strategy Call" title={<>Book Your<br /><em>Strategy Call.</em></>} description="Discover how AI, automation and growth systems can help your business scale."><section className="strategy-page-content"><Reveal className="strategy-booking-placeholder" id="strategy-booking"><div><SectionLabel number="01">What to expect</SectionLabel><h2>A sharper starting point<br /><span>for the next move.</span></h2></div><div className="strategy-placeholder-copy"><p>Share a little context before the conversation. This form is stored locally for now and is ready for a future CRM, Calendly or API connection.</p><LeadCapture /></div></Reveal><section className="strategy-subsection"><SectionLabel number="02">What You'll Get</SectionLabel><div className="strategy-benefit-grid">{strategyBenefits.map((item, index) => <Reveal className="strategy-benefit" delay={index * 70} key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.description}</p></Reveal>)}</div></section><section className="strategy-subsection strategy-audience-section"><Reveal><SectionLabel number="03">Who This Is For</SectionLabel><h2>Built for businesses<br /><em>with something at stake.</em></h2><p className="strategy-subsection-intro">The conversation is for ambitious operators who need a clearer route through complexity, not another disconnected service.</p></Reveal><Reveal className="strategy-audience-grid" delay={100}>{strategyAudience.map((item) => <span key={item}>{item}</span>)}</Reveal></section><section className="strategy-subsection"><SectionLabel number="04">Simple 3-Step Process</SectionLabel><div className="strategy-process-grid">{['Book', 'Meet', 'Receive Your Roadmap'].map((title, index) => <Reveal className="strategy-process-step" delay={index * 80} key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{['Choose a time for a focused first conversation.', 'Talk through your business, goals and current constraints.', 'Leave with a clear direction for the next useful step.'][index]}</p></Reveal>)}</div></section><section className="strategy-subsection strategy-faq-section"><Reveal><SectionLabel number="05">FAQ</SectionLabel><h2>Before we<br /><em>get started.</em></h2></Reveal><div className="strategy-faq-list">{strategyCallFaqs.map((item, index) => <Reveal className="strategy-faq-item" delay={index * 60} key={item.question}><details><summary>{item.question}<span className="faq-plus" /></summary><p>{item.answer}</p></details></Reveal>)}</div></section><Reveal className="strategy-final-cta"><SectionLabel number="06">Next step</SectionLabel><h2>Book Your<br /><em>Strategy Call.</em></h2><p>Bring the ambition, the friction or the open question. We will find the useful starting point together.</p><a href="#strategy-booking" className="button-dark">Book Your Strategy Call <ArrowIcon direction="right" /></a></Reveal></section></InternalPage>
}

function StrategyCallPage() {
  return <InternalPage eyebrow="NOVAHAUS / Strategy Call" title={<>Book Your<br /><em>Strategy Call.</em></>} description="Discover how AI, automation and growth systems can help your business scale."><section className="strategy-page-content"><Reveal className="strategy-booking-placeholder" id="strategy-booking"><div><SectionLabel number="01">What to expect</SectionLabel><h2>A sharper starting point<br /><span>for the next move.</span></h2></div><div className="strategy-placeholder-copy"><p>Share a little context before the conversation. Choose a preferred time and the NOVAHAUS team will review your request before confirming the meeting.</p><a className="button-dark" href="/booking/?source=strategy">Open Strategy Call Request <ArrowIcon direction="right" /></a><p className="strategy-booking-note">Submitting a request does not confirm a meeting automatically.</p></div></Reveal><section className="strategy-subsection"><SectionLabel number="02">What You'll Get</SectionLabel><div className="strategy-benefit-grid">{strategyBenefits.map((item, index) => <Reveal className="strategy-benefit" delay={index * 70} key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.description}</p></Reveal>)}</div></section><section className="strategy-subsection strategy-audience-section"><Reveal><SectionLabel number="03">Who This Is For</SectionLabel><h2>Built for businesses<br /><em>with something at stake.</em></h2><p className="strategy-subsection-intro">The conversation is for ambitious operators who need a clearer route through complexity, not another disconnected service.</p></Reveal><Reveal className="strategy-audience-grid" delay={100}>{strategyAudience.map((item) => <span key={item}>{item}</span>)}</Reveal></section><section className="strategy-subsection"><SectionLabel number="04">Simple 3-Step Process</SectionLabel><div className="strategy-process-grid">{['Book', 'Meet', 'Receive Your Roadmap'].map((title, index) => <Reveal className="strategy-process-step" delay={index * 80} key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{['Choose a time for a focused first conversation.', 'Talk through your business, goals and current constraints.', 'Leave with a clear direction for the next useful step.'][index]}</p></Reveal>)}</div></section><Reveal className="strategy-final-cta"><SectionLabel number="05">Next step</SectionLabel><h2>Bring the context<br /><em>to the table.</em></h2><p>Our team will review the request and follow up with confirmation.</p><a href="/booking/?source=strategy-cta" className="button-dark">Book a Strategy Call <ArrowIcon direction="right" /></a></Reveal></section></InternalPage>
}

function GrowthAssessmentPage() {
  return <InternalPage eyebrow="NOVAHAUS GROWTH DIAGNOSTIC" title={<>Discover What Is<br /><em>Limiting Your Growth.</em></>} description="Complete this short assessment to identify your strongest opportunities across strategy, digital presence, automation and growth operations."><section className="growth-assessment-page"><Reveal className="assessment-page-intro"><p>Takes approximately 3 minutes.</p><a href="#growth-assessment" className="magnetic-link" onClick={() => trackAssessmentEvent('assessment_started')}>Start Assessment <ArrowIcon direction="right" /></a></Reveal><GrowthAssessment /></section></InternalPage>
}

function ProposalBuilderPage() {
  return <div className="proposal-tool-page"><a className="skip-link" href="#proposal-tool-main">Skip to proposal tool</a><header className="proposal-tool-header"><a href="/" aria-label="NOVAHAUS home"><BrandLogo className="proposal-tool-logo" /></a><span>NOVAHAUS Internal Proposal Tool</span></header><main id="proposal-tool-main"><ProposalBuilder /></main></div>
}

function ProductsPage() {
  return <InternalPage eyebrow="Products" title={<>Products Designed<br /><em>For Growth.</em></>} description="Three clear starting points for businesses building stronger brands, better digital journeys and practical AI systems."><section className="products-list" aria-label="NOVAHAUS products"><Reveal className="products-page-actions"><a href="/booking/?source=products" className="magnetic-link">Book a Strategy Call <ArrowIcon direction="right" /></a></Reveal>{products.map((product, index) => <Reveal className="product-block" delay={index * 70} key={product.slug}><div className="product-heading"><SectionLabel number={product.number}>Product</SectionLabel><h2>{product.name}</h2><p>{product.summary}</p><a href={`/booking/?source=products&package=${product.slug}`} className="magnetic-link product-cta">Book a Strategy Call <ArrowIcon direction="right" /></a></div><div className="product-flow"><ProductFlowItem label="Best for"><p>{product.bestFor}</p></ProductFlowItem><ProductFlowItem label="Business problems"><ul>{product.problems.map((problem) => <li key={problem}>{problem}</li>)}</ul></ProductFlowItem><ProductFlowItem label="Solution"><p>{product.solution}</p></ProductFlowItem><ProductFlowItem label="Deliverables"><ul>{product.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}</ul></ProductFlowItem><ProductFlowItem label="Included AI capabilities"><ul>{product.aiCapabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul></ProductFlowItem><ProductFlowItem label="Timeline"><p>{product.timeline}</p></ProductFlowItem></div></Reveal>)}<section className="products-comparison"><SectionLabel number="05">Compare the products</SectionLabel><h2>Choose the right<br /><em>starting point.</em></h2><div className="products-comparison-grid">{productComparison.map((column, index) => <Reveal className="products-comparison-column" delay={index * 70} key={column.title}><span>{column.title}</span><ul>{column.features.map((feature) => <li key={feature}><i aria-hidden="true">✓</i>{feature}</li>)}</ul><strong>Built around your context</strong></Reveal>)}</div></section><section className="products-faq"><Reveal><SectionLabel number="06">FAQ</SectionLabel><h2>Good questions<br /><em>before choosing.</em></h2></Reveal><div className="products-faq-list">{productsFaqs.map((item, index) => <Reveal className="products-faq-item" delay={index * 60} key={item.question}><details><summary>{item.question}<span className="faq-plus" /></summary><p>{item.answer}</p></details></Reveal>)}</div></section><Reveal className="products-final-cta"><SectionLabel number="07">Next step</SectionLabel><h2>Not sure which<br /><em>product fits?</em></h2><a href="/booking/?source=products" className="button-dark">Book a Strategy Call <ArrowIcon direction="right" /></a></Reveal></section></InternalPage>
}

function AboutPage() {
  return <InternalPage eyebrow="About NOVAHAUS" title={<>The clearest brands<br /><em>move with intent.</em></>} description="NOVAHAUS helps founders and small teams turn a good business into a clear, credible and easier-to-choose presence."><section className="internal-content-grid"><Reveal className="internal-feature-card dark-card"><span className="internal-card-label">The point of view</span><p>People do not need more noise. They need a reason to understand, trust and choose.</p></Reveal><Reveal className="internal-prose" delay={120}><p>We work at the point where business decisions become brand decisions: what the company means, who it is for and what should happen next.</p><p>That means a sharper position, an identity with restraint, a website that carries the story and practical systems that give the team time back.</p><a href="/#contact" className="text-link">Start with the context <ArrowIcon direction="right" /></a></Reveal></section><section className="internal-list-section"><SectionLabel number="01">How we work</SectionLabel><div className="internal-list-grid">{['Find the signal', 'Give it a shape', 'Put it to work'].map((title, index) => <Reveal className="internal-list-item" delay={index * 90} key={title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{title}</h2><p>{['Start with the business, audience and decision that matter most.', 'Build the position, identity and digital language around that decision.', 'Launch a system the team can use, improve and grow into.'][index]}</p></Reveal>)}</div></section></InternalPage>
}

function BlogPage() {
  return <InternalPage eyebrow="Journal" title={<>Useful thinking for<br /><em>the next decision.</em></>} description="Notes on positioning, digital presence and the practical side of making a business easier to choose."><section className="blog-list" aria-label="NOVAHAUS journal"><div className="blog-list-intro"><p>Editorial programme</p><span>New notes will appear here as the studio publishes.</span></div>{blogPosts.map((post, index) => <Reveal className="blog-card" delay={index * 90} key={post.slug}><div className="blog-card-meta"><span>{post.category}</span><span>{post.date}</span></div><div><h2>{post.title}</h2><p>{post.excerpt}</p></div><span className="blog-read">{post.readingTime} <ArrowIcon direction="right" /></span></Reveal>)}</section><Reveal className="internal-callout"><span className="internal-card-label">Have a question behind the question?</span><h2>Bring it to the table.</h2><a href="/#contact" className="text-link">Start a conversation <ArrowIcon direction="right" /></a></Reveal></InternalPage>
}

function BlogPostPage({ post }) {
  if (!post) return <NotFoundPage />
  return <InternalPage eyebrow={`${post.category} / ${post.date}`} title={<>{post.title}</>} description={post.excerpt}><article className="internal-article"><p className="article-status">This editorial is being prepared for publication.</p><p>Good decisions get easier when the underlying signal is clear. NOVAHAUS publishes practical notes on the work between business strategy, brand identity, digital experience and useful AI systems.</p><p>This page is ready for the full article content when the journal goes live.</p><a href="/#contact" className="button-dark internal-article-cta">Talk about the idea <ArrowIcon direction="right" /></a></article></InternalPage>
}

const caseStudyFilters = ['All', 'AI', 'Web3', 'Fintech', 'Professional Services', 'Global Business']

function matchesCaseStudyFilter(study, filter) {
  if (filter === 'All') return true
  const industry = study.industry.toLowerCase()
  if (filter === 'AI') return industry.includes('ai')
  if (filter === 'Web3') return industry.includes('web3')
  if (filter === 'Fintech') return industry.includes('fintech')
  if (filter === 'Professional Services') return industry.includes('professional services')
  if (filter === 'Global Business') return industry.includes('international') || industry.includes('cross-border')
  return false
}

function CaseStudiesPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const visibleStudies = caseStudies.filter((study) => matchesCaseStudyFilter(study, activeFilter))
  return <InternalPage eyebrow="Case Studies" title={<>Business problems.<br /><em>Clearer systems.</em></>} description="Explore NOVAHAUS internal product work and clearly labelled concept demos for real business challenges."><section className="case-studies-index"><div className="case-study-filters" role="group" aria-label="Filter case studies">{caseStudyFilters.map((filter) => <button key={filter} type="button" className={activeFilter === filter ? 'is-active' : ''} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><div className="portfolio-grid case-studies-index-grid">{visibleStudies.map((study, index) => <PortfolioCard key={study.slug} item={study} index={index} />)}</div>{visibleStudies.length === 0 && <p className="case-studies-empty">More case studies for this category will be added as approved projects launch.</p>}</section></InternalPage>
}

function CaseStudyTimeline({ study }) {
  const timeline = [
    { label: 'Problem', text: study.challenge },
    { label: 'Strategy', text: study.strategy },
    { label: 'Execution', text: `${study.solution} ${study.deliverables.join(' / ')}.` },
    { label: 'Result', text: study.outcome },
  ]
  return <section className="case-study-timeline"><SectionLabel>Project path</SectionLabel><div className="case-study-timeline-grid">{timeline.map((item, index) => <Reveal className="case-study-timeline-item" delay={index * 70} key={item.label}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.label}</h3><p>{item.text}</p></Reveal>)}</div></section>
}

function CaseStudyPage({ study }) {
  if (!study) return <NotFoundPage />
  const isInternal = study.caseType === 'NOVAHAUS Internal Product Case'
  return <InternalPage eyebrow={`${study.number} / ${study.caseType}`} title={<>{study.title}</>} description={study.overview}><section className="case-study-cover"><ProjectArt type={study.className} title={study.title} /></section><section className="case-study-details"><div className="case-study-meta"><div><span>Case type</span><strong>{study.caseType}</strong></div><div><span>Industry</span><strong>{study.industry}</strong></div><div><span>Year</span><strong>{study.year}</strong></div><div><span>Client</span><strong>{study.client}</strong></div></div><div className="case-study-body"><div><SectionLabel>Solution components</SectionLabel><div className="case-study-services">{study.services.map((service) => <span key={service}>{service}</span>)}</div></div><div className="internal-prose"><p>{study.overview}</p><p>{isInternal ? 'We use the same AI growth systems we design for clients. This page documents NOVAHAUS internal product work and the current systems available to experience.' : 'This is a Concept Demo, created to make a possible direction visible. It is not presented as completed client work, and no external performance claim is made.'}</p></div></div></section><CaseStudyTimeline study={study} /><section className="case-study-proof"><div><SectionLabel>{study.outcomeLabel}</SectionLabel><p>{study.outcome}</p></div>{study.keyMetrics.length > 0 ? <div><SectionLabel>Demonstrated workflows</SectionLabel><ul>{study.keyMetrics.map((metric) => <li key={metric}>{metric}</li>)}</ul></div> : <div><SectionLabel>Evidence boundary</SectionLabel><p className="case-study-proof-note">No client performance data is claimed for this concept.</p></div>}{study.quote && <blockquote>{study.quote}</blockquote>}</section><section className="case-study-detail-cta"><SectionLabel>Next step</SectionLabel><h2>Explore the next useful move.</h2><div><a href="/ai-sales-agent/" className="button-dark">Talk to NOVAHAUS AI <ArrowIcon direction="right" /></a><a href="/growth-assessment/" className="text-link">Start Growth Assessment <ArrowIcon direction="right" /></a></div></section></InternalPage>
}

function LegalPage({ type }) {
  const privacy = type === 'privacy'
  return <InternalPage eyebrow={`NOVAHAUS / ${privacy ? 'Privacy' : 'Terms'}`} title={privacy ? <>Privacy,<br /><em>plainly stated.</em></> : <>Terms for<br /><em>working together.</em></>} description={privacy ? 'How NOVAHAUS handles information shared through this website.' : 'The basic terms that apply when you use this website or begin a conversation with NOVAHAUS.'}><article className="legal-article"><p className="article-status">Last updated: July 2026</p>{privacy ? <><h2>Information collected</h2><p>When you use this website, you may share your name, email address, company, contact details, project context and other information you choose to provide through an assessment, lead capture flow, proposal or booking request.</p><h2>How information is used</h2><p>Information is used to understand your enquiry, prepare the requested experience or service, and respond to you. We do not use it to make guarantees about business outcomes.</p><h2>Data storage</h2><p>This version of the website may store submitted information locally in your browser so the relevant experience can continue after a refresh. Local storage is not a substitute for a secure production database.</p><h2>Third-party services</h2><p>Future or optional integrations may include booking, analytics, CRM or other external platforms. Those platforms follow their own privacy and security policies. Review their terms before sharing information through them.</p><h2>Your rights</h2><p>You may ask what information has been shared with NOVAHAUS, request a correction or ask for local information to be cleared from your browser. Contact us so we can explain the available next step.</p><h2>Contact</h2><p>For privacy questions, email <a href="mailto:hello@novahaus.ai">hello@novahaus.ai</a>.</p></> : <><h2>Website usage</h2><p>Use this website for lawful, personal or business evaluation. The website and its concept projects are provided for information and demonstration. Portfolio concepts are not presented as completed client work.</p><h2>AI-generated content disclaimer</h2><p>Some examples, recommendations or draft outputs may be produced with AI-assisted tools. Review them before relying on them for important business, legal, financial or operational decisions.</p><h2>No guaranteed business results</h2><p>NOVAHAUS does not guarantee leads, revenue, growth, members, investment returns or any other business result. Outcomes depend on the context, decisions and implementation surrounding each project.</p><h2>Intellectual property</h2><p>Unless stated otherwise, the NOVAHAUS name, identity, writing, visual system and original website materials remain the property of NOVAHAUS. Do not copy, republish or redistribute them without permission.</p><h2>Starting a project</h2><p>A project begins only after scope, fees, timing and responsibilities are confirmed in writing.</p><h2>Contact</h2><p>For questions about these terms, email <a href="mailto:hello@novahaus.ai">hello@novahaus.ai</a>.</p></>}</article></InternalPage>
}

function ThankYouPage() {
  return <InternalPage eyebrow="Inquiry received" title={<>The next step<br /><em>is in motion.</em></>} description="Thank you for sharing the context. Your message has been prepared; email integration will be available soon."><section className="thank-you-card"><BrandMark className="thank-you-mark" /><span className="internal-card-label">NOVAHAUS / next step</span><h2>We have the starting point.</h2><p>Keep an eye on your inbox. If the matter is urgent, write directly to <a href="mailto:hello@novahaus.studio">hello@novahaus.studio</a>.</p><a href="/" className="button-dark">Return to the homepage <ArrowIcon direction="right" /></a></section></InternalPage>
}

function NotFoundPage() {
  return <InternalPage eyebrow="404 / Not found" title={<>This page took<br /><em>a different route.</em></>} description="The page you are looking for is not here, but the next useful move may be."><section className="not-found-card"><span className="not-found-code">404</span><p>Return to the homepage or start a conversation with NOVAHAUS.</p><div><a href="/" className="button-dark">Return Home <ArrowIcon direction="right" /></a><a href="/#contact" className="text-link">Contact NOVAHAUS <ArrowIcon direction="right" /></a></div></section></InternalPage>
}

const routeMeta = {
  '/': { title: 'NOVAHAUS — Brand, digital and AI systems with intent', description: 'NOVAHAUS helps founders and small teams clarify their offer, launch a premium website and automate the work that slows growth.', indexable: true },
  '/about': { title: 'About NOVAHAUS — AI growth and digital systems', description: 'Meet NOVAHAUS, an AI growth company for founders, operators and modern teams.', indexable: true },
  '/blog': { title: 'Journal — NOVAHAUS', description: 'Practical notes on positioning, digital presence and useful AI systems.', indexable: true },
  '/privacy': { title: 'Privacy Policy — NOVAHAUS', description: 'How NOVAHAUS handles information shared through this website.', indexable: true },
  '/terms': { title: 'Terms of Service — NOVAHAUS', description: 'Terms that apply when you use the NOVAHAUS website or begin a conversation.', indexable: true },
  '/thank-you': { title: 'Thank you — NOVAHAUS', description: 'Your NOVAHAUS enquiry has been prepared.', indexable: false },
  '/404': { title: 'Page not found — NOVAHAUS', description: 'The requested NOVAHAUS page was not found.', indexable: false },
}

Object.assign(routeMeta, {
  '/': { title: 'NOVAHAUS — AI Growth & Digital Systems', description: 'NOVAHAUS builds AI-powered brand, website, automation and growth systems for ambitious businesses expanding in digital and global markets.', indexable: true },
  '/products': { title: 'AI Growth Products | NOVAHAUS', description: 'Explore NOVAHAUS Launch, Growth and Enterprise products for brand strategy, digital experiences, AI automation and scalable growth systems.', indexable: true },
  '/knowledge-hub': { title: 'Knowledge Hub | NOVAHAUS', description: 'Explore NOVAHAUS guidance, demos and working references for AI growth, brand strategy, automation and digital systems.', indexable: true },
  '/knowledge-hub/admin': { title: 'Knowledge Hub Admin | NOVAHAUS', description: 'Local Knowledge Hub resource upload workspace for NOVAHAUS.', indexable: false },
  '/value-proposition': { title: 'Value Proposition | NOVAHAUS', description: 'Understand what NOVAHAUS does, why AI growth matters and how the work creates practical value for ambitious businesses.', indexable: true },
  '/case-studies': { title: 'Case Studies | NOVAHAUS', description: 'Explore how NOVAHAUS helps ambitious businesses build strategy, AI systems and digital growth.', indexable: true },
  '/growth-assessment': { title: 'AI Growth Assessment | NOVAHAUS', description: 'Assess your business across strategy, digital presence, automation and growth operations, then receive a personalised NOVAHAUS product recommendation.', indexable: true },
  '/proposal-builder': { title: 'NOVAHAUS Internal Proposal Tool', description: 'Private internal proposal builder for NOVAHAUS.', indexable: false },
  '/proposal': { title: 'Proposal Studio | NOVAHAUS', description: 'Generate a structured NOVAHAUS growth proposal from your existing assessment, lead and booking context.', indexable: false },
  '/trust': { title: 'Trust Center | NOVAHAUS', description: 'Learn how NOVAHAUS works, approaches AI and handles business context while building practical growth systems.', indexable: true },
  '/ai-sales-agent': { title: 'NOVAHAUS AI Sales Agent', description: 'Private NOVAHAUS AI Sales Agent preview for understanding business needs and preparing the next useful step.', indexable: false },
  '/leads': { title: 'Lead Review - NOVAHAUS', description: 'Internal local lead review workspace for NOVAHAUS.', indexable: false },
  '/crm': { title: 'Client CRM - NOVAHAUS', description: 'Internal local CRM workspace for NOVAHAUS leads, conversations and client health.', indexable: false },
  '/strategy': { title: 'Strategy Call - NOVAHAUS AI Growth & Digital Systems', description: 'Book a NOVAHAUS Strategy Call to explore AI, automation and growth systems for your business.', indexable: true },
  '/booking': { title: 'Book a Strategy Call | NOVAHAUS', description: 'Submit a NOVAHAUS Strategy Call request and share the business context our team needs to prepare.', indexable: true },
  '/bookings': { title: 'Internal Booking Review | NOVAHAUS', description: 'Internal local booking review workspace for NOVAHAUS.', indexable: false },
  '/about': { title: 'About NOVAHAUS - Brand and digital direction', description: routeMeta['/about'].description, indexable: true },
  '/blog': { title: 'Journal - NOVAHAUS', description: routeMeta['/blog'].description, indexable: true },
  '/privacy': { title: 'Privacy Policy - NOVAHAUS', description: routeMeta['/privacy'].description, indexable: true },
  '/terms': { title: 'Terms of Service - NOVAHAUS', description: routeMeta['/terms'].description, indexable: true },
  '/thank-you': { title: 'Thank you - NOVAHAUS', description: routeMeta['/thank-you'].description, indexable: false },
  '/404': { title: 'Page not found - NOVAHAUS', description: routeMeta['/404'].description, indexable: false },
})

function normalizePath(pathname) {
  const clean = pathname.replace(/\/+$/, '')
  return clean || '/'
}

function setPageMeta(pathname) {
  const path = normalizePath(pathname)
  const studyMatch = path.match(/^\/(?:case-study|case-studies)\/([^/]+)$/)
  const postMatch = path.match(/^\/blog\/([^/]+)$/)
  const study = studyMatch ? caseStudies.find((item) => item.slug === studyMatch[1]) : null
  const post = postMatch ? blogPosts.find((item) => item.slug === postMatch[1]) : null
  const meta = study ? { title: `${study.title} — NOVAHAUS`, description: study.overview, indexable: true } : post ? { title: `${post.title} — NOVAHAUS`, description: post.excerpt, indexable: true } : routeMeta[path] || routeMeta['/404']
  const resolvedTitle = study ? `${study.title} - NOVAHAUS` : post ? `${post.title} - NOVAHAUS` : meta.title
  document.title = resolvedTitle
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', resolvedTitle)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description)
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', resolvedTitle)
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', meta.description)
  document.querySelector('meta[name="robots"]')?.setAttribute('content', meta.indexable ? 'index, follow' : 'noindex, nofollow')
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) canonical.href = `${window.location.origin}${path === '/' ? '/' : `${path}/`}`
}

function App() {
  const reduceMotion = useReducedMotion()
  const path = normalizePath(window.location.pathname)

  useEffect(() => {
    setPageMeta(path)
  }, [path])

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

  const studyMatch = path.match(/^\/(?:case-study|case-studies)\/([^/]+)$/)
  const postMatch = path.match(/^\/blog\/([^/]+)$/)
  if (path === '/booking') return <><PageLoader reduceMotion={reduceMotion} /><BookingPage /></>
  if (path === '/bookings') return <><PageLoader reduceMotion={reduceMotion} /><BookingReviewPage /></>
  if (path === '/proposal') return <><PageLoader reduceMotion={reduceMotion} /><ProposalStudioPage /></>
  const page = path === '/' ? <><a className="skip-link" href="#main-content">Skip to content</a><main id="main-content"><Hero /><HowWeHelpSection /><TrustSection /><ApproachSection /><PositioningStrip /><WhoWeHelpSection /><AboutSection /><ServicesSection /><SolutionsSection /><InteractiveAIExperienceCenter /><CaseStudiesShowcase /><PackagesSection /><PortfolioSection /><WhySection /><TestimonialsSection /><FAQSection /><CTASection /><Footer /></main><AiSalesAgentWidget /></> : path === '/ai-sales-agent' ? <AiSalesAgentPage /> : path === '/leads' ? <LeadsPage /> : path === '/crm' ? <CRMPage /> : path === '/proposal-builder' ? <ProposalBuilderPage /> : path === '/proposal' ? <ProposalStudioPage /> : path === '/products' ? <ProductsPage /> : path === '/knowledge-hub' ? <KnowledgeHubPage Header={InternalHeader} Footer={Footer} /> : path === '/knowledge-hub/admin' ? <KnowledgeHubPage Header={InternalHeader} Footer={Footer} admin /> : path === '/value-proposition' ? <ValuePropositionPage InternalPage={InternalPage} /> : path === '/strategy' ? <StrategyCallPage /> : path === '/case-studies' ? <CaseStudiesPage /> : path === '/growth-assessment' ? <GrowthAssessmentPage /> : path === '/trust' ? <TrustCenterPage /> : path === '/about' ? <AboutPage /> : path === '/blog' ? <BlogPage /> : path === '/privacy' ? <LegalPage type="privacy" /> : path === '/terms' ? <LegalPage type="terms" /> : path === '/thank-you' ? <ThankYouPage /> : path === '/404' ? <NotFoundPage /> : studyMatch ? <CaseStudyPage study={caseStudies.find((item) => item.slug === studyMatch[1])} /> : postMatch ? <BlogPostPage post={blogPosts.find((item) => item.slug === postMatch[1])} /> : <NotFoundPage />
  return <><PageLoader reduceMotion={reduceMotion} />{page}</>
}

export default App
