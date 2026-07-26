import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import BrandLogo from './components/BrandLogo.jsx'

const heroEase = [0.22, 1, 0.36, 1]

const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const serviceItems = [
  { number: '01', title: 'AI Automation', description: 'Turn repetitive work into intelligent, reliable systems.', icon: 'automation' },
  { number: '02', title: 'AI Website', description: 'Build a digital presence that is clear, fast and ready to grow.', icon: 'website' },
  { number: '03', title: 'Brand Strategy', description: 'Find the sharpest position and story for your next move.', icon: 'strategy' },
  { number: '04', title: 'AI Consulting', description: 'Identify practical opportunities for AI across your business.', icon: 'consulting' },
]

const solutionItems = [
  { eyebrow: 'For founders', title: 'Make the first impression count.', description: 'Turn a good idea into a brand with the clarity to earn trust and the system to move quickly.', tags: ['Positioning', 'Launch system'] },
  { eyebrow: 'For creators', title: 'Make your point of view impossible to miss.', description: 'Build a personal brand that feels unmistakably yours across every touchpoint.', tags: ['Identity', 'Content'] },
  { eyebrow: 'For modern teams', title: 'Give your business an unfair advantage.', description: 'Connect brand, digital experience and AI workflows into one intelligent operating layer.', tags: ['Digital', 'Automation'] },
]

const workItems = [
  { number: '01', industry: 'AI / Technology', title: 'Signal / AI Brand Studio', description: 'A sharper identity and web direction for an AI-native company.', className: 'project-signal' },
  { number: '02', industry: 'Creator / Education', title: 'Northstar / Personal Brand', description: 'A calm, editorial platform for a founder with something to say.', className: 'project-northstar' },
  { number: '03', industry: 'Lifestyle / Commerce', title: 'Forma / Digital Commerce', description: 'A premium digital storefront built around confidence and ease.', className: 'project-forma' },
  { number: '04', industry: 'SaaS / Strategy', title: 'Vertex / Founder System', description: 'A precise operating identity for a company moving from idea to scale.', className: 'project-vertex' },
  { number: '05', industry: 'Consulting / Advisory', title: 'Morrow / Advisory Brand', description: 'A confident, editorial system designed to make expertise memorable.', className: 'project-morrow' },
  { number: '06', industry: 'Hospitality / Experience', title: 'Coda / Modern Hospitality', description: 'A warmer digital world for a destination built around considered detail.', className: 'project-coda' },
]

const principles = [
  { number: '01', title: 'Clarity before decoration', description: 'We find the sharpest truth first, then build the expression around it.' },
  { number: '02', title: 'Systems over one-offs', description: 'Every decision should make the next decision easier and more consistent.' },
  { number: '03', title: 'Human taste, machine leverage', description: 'The best AI experiences still need judgment, restraint and a point of view.' },
]

const faqs = [
  { question: 'What does a typical project include?', answer: 'Most engagements combine positioning, a focused visual identity and a conversion-led website. We shape the scope around your next meaningful milestone rather than selling a fixed package.' },
  { question: 'Do you work with early-stage companies?', answer: 'Yes. We work with founders, creators and small teams who need a clear story and a premium digital presence without unnecessary layers.' },
  { question: 'Can you build AI workflows as part of the project?', answer: 'Yes. We identify repetitive, high-friction work and design practical AI-assisted systems around your existing tools and team.' },
  { question: 'How long does a project take?', answer: 'A focused brand and website engagement usually takes several weeks, depending on the clarity of inputs and the number of moving parts. We set a clear rhythm before work begins.' },
  { question: 'What happens after launch?', answer: 'We can stay close through a refinement retainer, helping you improve the experience, content system and workflows as real-world signals come in.' },
]

function ArrowIcon({ direction = 'up' }) {
  const path = direction === 'right' ? 'M3 12.5 12 3.5m0 0H5.5M12 3.5V10' : 'M3.5 12.5 12 4m0 0H5.5M12 4v6.5'
  return (
    <svg aria-hidden="true" className="arrow-icon" viewBox="0 0 16 16" fill="none">
      <path d={path} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
    </svg>
  )
}

function BrandMark({ className = '', color = 'currentColor' }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 1024 1024" fill="none">
      <g stroke={color} strokeWidth="112" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M192 792V208L512 500L832 208V792" />
        <path d="M192 500H832" />
        <path d="M512 500V792" />
      </g>
    </svg>
  )
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

  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>
      {children}
    </div>
  )
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
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`magnetic-link button-${variant} ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay, ease: heroEase }}
      whileHover={reduceMotion ? undefined : { scale: 1.03, boxShadow: '0 18px 36px rgba(17, 17, 17, .18)' }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
    >
      <span>{children}</span>
      <ArrowIcon direction="right" />
    </motion.a>
  )
}

function SectionLabel({ children, number }) {
  return (
    <p className="section-label">
      <span className="section-label-line" />
      {number && <span>{number}</span>}
      <span>{children}</span>
    </p>
  )
}

function SectionHeader({ number, label, title, description, dark = false }) {
  return (
    <Reveal className="section-header">
      <SectionLabel number={number}>{label}</SectionLabel>
      <h2 className={`section-heading ${dark ? 'on-dark' : ''}`}>{title}</h2>
      {description && <p className={`section-description ${dark ? 'on-dark' : ''}`}>{description}</p>}
    </Reveal>
  )
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
        <motion.a href="#top" className="brand-lockup" aria-label="NOVAHAUS home" onClick={closeMenu} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: heroEase }}>
          <BrandLogo className="brand-logo-light" />
        </motion.a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <a className="header-cta" href="#contact">Start a conversation <ArrowIcon direction="right" /></a>
          <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <span /><span />
          </button>
        </div>
        <div className={`mobile-nav ${menuOpen ? 'is-open' : ''}`}>
          {navItems.map((item) => <a key={item.label} href={item.href} onClick={closeMenu}>{item.label}<ArrowIcon direction="right" /></a>)}
          <a className="mobile-nav-cta" href="#contact" onClick={closeMenu}>Start a conversation <ArrowIcon direction="right" /></a>
        </div>
      </header>

      <div className="hero-grid page-shell">
        <div className="hero-copy">
          <div>
            <motion.div initial={reduceMotion ? false : { opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.1, ease: heroEase }}><SectionLabel>AI Brand & Digital Studio</SectionLabel></motion.div>
            <h1 id="hero-title">
              <motion.span className="hero-title-line" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.18, ease: heroEase }}>Build a Brand</motion.span>
              <motion.span className="hero-title-line" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.3, ease: heroEase }}>That People</motion.span>
              <motion.span className="hero-title-line" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.42, ease: heroEase }}><em>Trust.</em></motion.span>
            </h1>
            <motion.p className="hero-description" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.62, ease: heroEase }}>We build clear, premium brands and intelligent digital experiences for the people moving business forward.</motion.p>
            <div className="hero-actions">
              <MagneticLink href="#contact" className="hero-primary-link" delay={0.74} reduceMotion={reduceMotion}>Start Your Project</MagneticLink>
              <motion.a href="#work" className="text-link hero-secondary-link" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.86, ease: heroEase }} whileHover={reduceMotion ? undefined : { scale: 1.03, boxShadow: '0 14px 30px rgba(17, 17, 17, .1)' }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}>
                <span>View Portfolio</span>
                <ArrowIcon direction="right" />
              </motion.a>
            </div>
            <motion.div className="hero-traits" initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.98, ease: heroEase }}><span>Brand clarity</span><span className="hero-trait-dot" aria-hidden="true" /><span>AI leverage</span><span className="hero-trait-dot" aria-hidden="true" /><span>Digital experience</span></motion.div>
          </div>
        </div>

        <motion.div className="hero-stage-reveal" initial={reduceMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.18, ease: heroEase }}>
        <motion.div ref={stageRef} className="hero-stage" aria-label="NOVAHAUS brand system visualization" animate={reduceMotion ? undefined : { y: [0, -7, 0] }} transition={reduceMotion ? { duration: 0 } : { duration: 8, ease: 'easeInOut', repeat: Infinity }}>
          <div className="hero-stage-glow" />
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-dashboard" data-parallax="0.08">
            <div className="dashboard-topline"><span>Brand operating system</span><span>01 / 05</span></div>
            <div className="dashboard-core"><BrandMark className="dashboard-mark" color="currentColor" /><span>Clarity / Leverage / Signal</span></div>
            <div className="dashboard-footer"><span>Positioning</span><span className="dashboard-status"><i /> In progress</span></div>
          </div>
          <div className="hero-float-card float-card-top" data-parallax="0.14"><span>Signal strength</span><strong>92</strong><small>+ 18.4%</small></div>
          <div className="hero-float-card float-card-bottom" data-parallax="0.2"><span>System / 04</span><strong>AI leverage</strong><small>Connected</small></div>
          <div className="hero-coordinate">03° 08&apos; N<br />101° 41&apos; E</div>
        </motion.div>
        </motion.div>
      </div>
      <div className="hero-bottomline page-shell"><span>Strategy</span><span>Identity</span><span>Digital</span><span>AI systems</span><span className="scroll-prompt">Scroll to explore <span className="scroll-line" /></span></div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="section dark-section about-section">
      <div className="page-shell">
        <SectionHeader number="01" label="About NOVAHAUS" title={<>A sharper signal<br /><span>for a changing world.</span></>} description="NOVAHAUS is an AI brand and digital studio for founders, creators and teams who refuse to look ordinary." dark />
        <div className="about-lower">
          <Reveal className="about-statement" delay={100}><p>Modern brands need more than beautiful output. They need a point of view, a system and the momentum to make the next move.</p><a href="#why" className="text-link text-link-light">Why we work differently <ArrowIcon direction="right" /></a></Reveal>
          <Reveal className="about-metrics" delay={180}>
            <div><strong>01</strong><span>One integrated<br />team</span></div>
            <div><strong>∞</strong><span>Long-term<br />thinking</span></div>
            <div><strong>AI</strong><span>Practical<br />leverage</span></div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ServiceIcon({ type }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '1.5' }

  if (type === 'website') {
    return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><rect x="4.5" y="6" width="23" height="20" rx="3" /><path d="M5 11h22M9 8.5h.01M12 8.5h.01M15 8.5h.01M10 16h12M10 20h8" /></svg>
  }

  if (type === 'strategy') {
    return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><circle cx="16" cy="16" r="10.5" /><path d="m12 20 2.2-6.2L20 12l-2.2 6.2L12 20ZM16 5.5V3M16 29v-2.5M5.5 16H3M29 16h-2.5" /></svg>
  }

  if (type === 'consulting') {
    return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><path d="M6 8.5A3.5 3.5 0 0 1 9.5 5h13A3.5 3.5 0 0 1 26 8.5v8a3.5 3.5 0 0 1-3.5 3.5H15l-5.5 5v-5.2A3.5 3.5 0 0 1 6 16.5v-8Z" /><path d="M12 12.5h.01M16 12.5h.01M20 12.5h.01" /></svg>
  }

  return <svg aria-hidden="true" viewBox="0 0 32 32" {...common}><circle cx="8" cy="16" r="2.5" /><circle cx="24" cy="9" r="2.5" /><circle cx="24" cy="23" r="2.5" /><path d="m10.2 15 11.5-5M10.2 17l11.5 5M24 11.5v9" /></svg>
}

const serviceCardVariants = {
  initial: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: heroEase } },
  hover: { y: -8, scale: 1.02, borderColor: 'rgba(200, 162, 74, .72)', boxShadow: '0 24px 55px rgba(17, 17, 17, .14)', transition: { type: 'spring', stiffness: 320, damping: 24, mass: 0.7 } },
}

const serviceIconVariants = {
  initial: { opacity: 0, scale: 0.86 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.12, ease: heroEase } },
  hover: { color: '#C8A24A', scale: 1.04, transition: { type: 'spring', stiffness: 320, damping: 20 } },
}

const serviceArrowVariants = {
  initial: { x: 0, color: '#111111' },
  visible: { x: 0, color: '#111111' },
  hover: { x: 8, color: '#C8A24A', transition: { type: 'spring', stiffness: 340, damping: 20 } },
}

function ServicesSection() {
  return (
    <section id="services" className="section light-section services-section">
      <div className="page-shell">
        <SectionHeader number="02" label="Capabilities" title={<>The full stack<br /><span>behind a great brand.</span></>} description="From first principles to final polish, we bring the strategic and digital pieces into one coherent system." />
        <div className="services-grid">
          {serviceItems.map((item, index) => (
            <motion.article key={item.number} className="service-card" variants={serviceCardVariants} initial="initial" whileInView="visible" whileHover="hover" viewport={{ once: true, amount: 0.22 }}>
              <motion.div className="service-icon" variants={serviceIconVariants}><ServiceIcon type={item.icon} /></motion.div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <motion.span className="card-arrow" variants={serviceArrowVariants}><span>Learn More</span><span aria-hidden="true">→</span></motion.span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function SolutionsSection() {
  return (
    <section id="solutions" className="section dark-section solutions-section">
      <div className="page-shell">
        <SectionHeader number="03" label="Solutions" title={<>Built around<br /><span>what&apos;s next.</span></>} description="Different ambitions need different systems. The common thread is a sharper way forward." dark />
        <div className="solutions-grid">
          {solutionItems.map((item, index) => (
            <Reveal key={item.title} className={`solution-card solution-card-${index + 1}`} delay={index * 100}>
              <div className="solution-card-art"><span>{String(index + 1).padStart(2, '0')}</span><div className="solution-art-line" /><div className="solution-art-dot" /></div>
              <p className="card-eyebrow">{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="tag-row">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectArt({ type, title }) {
  return (
    <div className={`project-art ${type}`} role="img" aria-label={`${title} concept cover`}>
      <div className="project-art-window"><span /><span /><span /></div>
      {type === 'project-signal' && <><div className="signal-word">SIGNAL</div><div className="signal-grid-lines" /><div className="signal-orb"><BrandMark color="currentColor" /></div></>}
      {type === 'project-northstar' && <><div className="northstar-word">north<br /><em>star</em></div><div className="northstar-rule" /></>}
      {type === 'project-forma' && <><div className="forma-word">FORMA</div><div className="forma-circle" /><div className="forma-chip">Objects with intention</div></>}
      {type === 'project-vertex' && <><div className="vertex-word">VERTEX</div><div className="vertex-grid" /><div className="vertex-dot" /></>}
      {type === 'project-morrow' && <><div className="morrow-word">morrow</div><div className="morrow-line" /><div className="morrow-chip">Advisory / 05</div></>}
      {type === 'project-coda' && <><div className="coda-word">CODA</div><div className="coda-arc" /><div className="coda-chip">Stay curious</div></>}
    </div>
  )
}

const portfolioCardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (index) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.08, ease: heroEase } }),
  hover: { y: -8, scale: 1.02, background: 'linear-gradient(145deg, #ffffff 0%, #fcf6e9 100%)', boxShadow: '0 26px 58px rgba(17, 17, 17, .14)', transition: { type: 'spring', stiffness: 300, damping: 24, mass: 0.75 } },
}

const portfolioCoverVariants = {
  hidden: { opacity: 0, scale: 0.985 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: heroEase } },
  hover: { scale: 1.04, transition: { duration: 0.7, ease: heroEase } },
}

const portfolioLinkVariants = {
  hidden: { opacity: 0, x: 0 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, delay: 0.18, ease: heroEase } },
  hover: { color: '#C8A24A', x: 7, transition: { type: 'spring', stiffness: 340, damping: 20 } },
}

function PortfolioSection() {
  return (
    <section id="work" className="section light-section work-section">
      <div className="page-shell">
        <SectionHeader number="04" label="Selected work" title={<>Ideas with<br /><span>something to say.</span></>} description="A selection of concept projects created to demonstrate our capabilities." />
        <div className="portfolio-grid">
          {workItems.map((item, index) => (
            <motion.article key={item.number} className="portfolio-card" custom={index} variants={portfolioCardVariants} initial="hidden" whileInView="visible" whileHover="hover" viewport={{ once: true, amount: 0.18 }}>
              <motion.div className="portfolio-cover" variants={portfolioCoverVariants}><ProjectArt type={item.className} title={item.title} /></motion.div>
              <div className="portfolio-meta">
                <div className="portfolio-meta-top"><span className="portfolio-number">{item.number}</span><span className="portfolio-industry">{item.industry}</span></div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <motion.a href="#contact" className="portfolio-link" variants={portfolioLinkVariants} aria-label={`View ${item.title} concept case`}><span>View Case</span><span aria-hidden="true">→</span></motion.a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section id="why" className="section dark-section why-section">
      <div className="page-shell why-layout">
        <SectionHeader number="05" label="Why NOVAHAUS" title={<>Clarity<br /><span>compounds.</span></>} description="The work gets better when the thinking gets sharper. That is where we start." dark />
        <div className="principles-list">
          {principles.map((item, index) => (
            <Reveal key={item.number} className="principle-row" delay={index * 100}>
              <span>{item.number}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><ArrowIcon direction="right" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="section light-section testimonials-section">
      <div className="page-shell">
        <SectionHeader number="06" label="Perspectives" title={<>The feeling<br /><span>we design toward.</span></>} description="Great work creates a sense of momentum before a single metric moves." />
        <div className="testimonial-grid">
          <Reveal className="testimonial-feature"><BrandMark className="testimonial-mark" color="currentColor" /><blockquote>“When the story becomes clear, the whole business starts to move differently.”</blockquote><p>Founder / concept profile</p></Reveal>
          <div className="testimonial-stack">
            <Reveal className="testimonial-note" delay={100}><span>01 / A field note</span><p>Premium is not a finish. It is the discipline of removing everything that does not matter.</p></Reveal>
            <Reveal className="testimonial-note" delay={180}><span>02 / A field note</span><p>The best systems create space for better decisions, not more noise.</p></Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [active, setActive] = useState(0)
  return (
    <section id="faq" className="section light-section faq-section">
      <div className="page-shell faq-layout">
        <SectionHeader number="07" label="FAQ" title={<>Good questions<br /><span>make better work.</span></>} description="A few useful answers before we begin." />
        <div className="faq-list">
          {faqs.map((item, index) => {
            const isActive = active === index
            return <Reveal key={item.question} className={`faq-item ${isActive ? 'is-active' : ''}`} delay={index * 50}>
              <button type="button" aria-expanded={isActive} onClick={() => setActive(isActive ? -1 : index)}><span>{item.question}</span><span className="faq-plus" /></button>
              <div className="faq-answer"><p>{item.answer}</p></div>
            </Reveal>
          })}
        </div>
      </div>
    </section>
  )
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }
  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row"><label>Name<input name="name" placeholder="Your name" required /></label><label>Email<input name="email" type="email" placeholder="you@company.com" required /></label></div>
      <label>What are you building?<textarea name="message" rows="3" placeholder="A sentence or two is perfect." required /></label>
      <div className="form-footer"><button className="form-submit" type="submit">{submitted ? 'Message prepared' : 'Start the conversation'} <ArrowIcon direction="right" /></button><span>{submitted ? 'Email integration will be available soon.' : 'We reply within 24 hours.'}</span></div>
    </form>
  )
}

function CTASection() {
  return (
    <section id="contact" className="section dark-section cta-section">
      <div className="page-shell">
        <Reveal className="cta-grid">
          <div><SectionLabel number="08">Let&apos;s build</SectionLabel><h2 className="cta-title">Make the next<br /><em>move matter.</em></h2><p>Whether you are launching, repositioning or building what comes next, we would love to hear the thinking behind it.</p><div className="cta-contact-detail"><span>hello@novahaus.studio</span><span>Kuala Lumpur / Global</span></div></div>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-top"><div className="footer-brand"><BrandLogo reversed className="footer-logo" /><p>AI Brand & Digital Studio</p></div><nav aria-label="Footer navigation">{navItems.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}</nav></div>
      <div className="page-shell footer-bottom"><span>© 2026 NOVAHAUS. All Rights Reserved.</span><span>Built with clarity.</span></div>
    </footer>
  )
}

function App() {
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

  return <main><Hero /><AboutSection /><ServicesSection /><SolutionsSection /><PortfolioSection /><WhySection /><TestimonialsSection /><FAQSection /><CTASection /><Footer /></main>
}

export default App
