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
  { number: '01', title: 'Brand Strategy', description: 'Positioning, narrative and a point of view people remember.' },
  { number: '02', title: 'Digital Identity', description: 'A visual system designed to stay coherent as you grow.' },
  { number: '03', title: 'Web Experiences', description: 'Fast, expressive websites that turn attention into action.' },
  { number: '04', title: 'AI Systems', description: 'Thoughtful automation that gives your team leverage.' },
  { number: '05', title: 'Content Engine', description: 'A practical system for creating with consistency and speed.' },
  { number: '06', title: 'Growth Support', description: 'Ongoing refinement for every signal after launch.' },
]

const solutionItems = [
  { eyebrow: 'For founders', title: 'Make the first impression count.', description: 'Turn a good idea into a brand with the clarity to earn trust and the system to move quickly.', tags: ['Positioning', 'Launch system'] },
  { eyebrow: 'For creators', title: 'Make your point of view impossible to miss.', description: 'Build a personal brand that feels unmistakably yours across every touchpoint.', tags: ['Identity', 'Content'] },
  { eyebrow: 'For modern teams', title: 'Give your business an unfair advantage.', description: 'Connect brand, digital experience and AI workflows into one intelligent operating layer.', tags: ['Digital', 'Automation'] },
]

const workItems = [
  { number: '01', type: 'Concept system', title: 'Signal / AI Brand Studio', description: 'A sharper identity and web direction for an AI-native company.', className: 'project-signal' },
  { number: '02', type: 'Concept system', title: 'Northstar / Personal Brand', description: 'A calm, editorial platform for a founder with something to say.', className: 'project-northstar' },
  { number: '03', type: 'Concept system', title: 'Forma / Digital Commerce', description: 'A premium digital storefront built around confidence and ease.', className: 'project-forma' },
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

function ServicesSection() {
  return (
    <section id="services" className="section light-section services-section">
      <div className="page-shell">
        <SectionHeader number="02" label="Capabilities" title={<>The full stack<br /><span>behind a great brand.</span></>} description="From first principles to final polish, we bring the strategic and digital pieces into one coherent system." />
        <div className="services-grid">
          {serviceItems.map((item, index) => (
            <Reveal key={item.number} className="service-card" delay={index * 60}>
              <span className="card-number">{item.number}</span>
              <span className="service-icon"><i /><i /><i /></span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="card-arrow"><ArrowIcon direction="right" /></span>
            </Reveal>
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

function ProjectArt({ type }) {
  return (
    <div className={`project-art ${type}`}>
      <div className="project-art-window"><span /><span /><span /></div>
      {type === 'project-signal' && <><div className="signal-word">SIGNAL</div><div className="signal-grid-lines" /><div className="signal-orb"><BrandMark color="currentColor" /></div></>}
      {type === 'project-northstar' && <><div className="northstar-word">north<br /><em>star</em></div><div className="northstar-rule" /></>}
      {type === 'project-forma' && <><div className="forma-word">FORMA</div><div className="forma-circle" /><div className="forma-chip">Objects with intention</div></>}
    </div>
  )
}

function PortfolioSection() {
  return (
    <section id="work" className="section light-section work-section">
      <div className="page-shell">
        <SectionHeader number="04" label="Selected work" title={<>Ideas with<br /><span>something to say.</span></>} description="A selection of concept projects created to demonstrate our capabilities." />
        <div className="work-list">
          {workItems.map((item, index) => (
            <Reveal key={item.number} className="work-row" delay={index * 100}>
              <div className="work-meta"><span className="work-number">{item.number}</span><span className="card-eyebrow">{item.type}</span><h3>{item.title}</h3><p>{item.description}</p><a href="#contact" className="text-link">Discuss a similar brief <ArrowIcon direction="right" /></a></div>
              <ProjectArt type={item.className} />
            </Reveal>
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
