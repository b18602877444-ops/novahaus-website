import { useEffect, useRef, useState } from 'react'
import BrandLogo from './BrandLogo.jsx'

function ContactCard({ isVisible }) {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <form className={`reveal-motion rounded-[1.75rem] border border-white/15 bg-white/[0.06] p-5 shadow-card backdrop-blur-xl delay-100 sm:p-7 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`} onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Name</span>
          <input type="text" name="name" placeholder="Your name" className="mt-3 w-full border-b border-white/15 bg-transparent pb-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-champagne" required />
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Email</span>
          <input type="email" name="email" placeholder="you@company.com" className="mt-3 w-full border-b border-white/15 bg-transparent pb-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-champagne" required />
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Company</span>
          <input type="text" name="company" placeholder="Company or brand" className="mt-3 w-full border-b border-white/15 bg-transparent pb-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-champagne" />
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Project Type</span>
          <select name="projectType" defaultValue="" className="mt-3 w-full border-b border-white/15 bg-transparent pb-3 text-sm text-white outline-none transition focus:border-champagne [&>option]:bg-ink" required>
            <option value="" disabled>Select a project</option>
            <option value="brand">Brand Strategy</option>
            <option value="website">Website Design</option>
            <option value="identity">Visual Identity</option>
            <option value="ai">AI Automation</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Budget</span>
          <select name="budget" defaultValue="" className="mt-3 w-full border-b border-white/15 bg-transparent pb-3 text-sm text-white outline-none transition focus:border-champagne [&>option]:bg-ink" required>
            <option value="" disabled>Select a range</option>
            <option value="starter">$3k — $7k</option>
            <option value="growth">$7k — $15k</option>
            <option value="scale">$15k+</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Message</span>
          <textarea name="message" rows="3" placeholder="Tell us what you are building..." className="mt-3 w-full resize-none border-b border-white/15 bg-transparent pb-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/30 focus:border-champagne" required />
        </label>
      </div>

      <button type="submit" className="button-base button-gold group mt-7 w-full gap-3">
        <span>Start Your Project</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
      </button>
      <p className="mt-4 min-h-[44px] text-center text-xs leading-5 text-champagne" aria-live="polite">
        {isSubmitted ? 'Thank you. Your message has been prepared. Email integration will be available soon.' : ''}
      </p>
    </form>
  )
}

function ContactSection() {
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
    <section ref={sectionRef} id="contact" className="section-padding min-h-[850px] bg-ink text-white lg:h-[850px]" aria-labelledby="contact-title">
      <div className="section-shell flex h-full flex-col justify-between">
        <div className="grid items-start gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-24">
          <div className={`reveal-motion max-w-[560px] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <p className="section-kicker">Contact / 07</p>
            <h2 id="contact-title" className="section-title text-white">Let&apos;s Build Something Great.</h2>
            <p className="section-lead text-white/55">Whether you&apos;re launching a new business, building a personal brand or upgrading your digital presence, we&apos;d love to hear from you.</p>

            <div className="mt-12 space-y-7 sm:mt-16">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">Email</p>
                <a href="mailto:hello@novahaus.studio" className="mt-2 inline-block text-base text-white transition-colors duration-300 hover:text-champagne">hello@novahaus.studio</a>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">Location</p>
                <p className="mt-2 text-base text-white">Kuala Lumpur · Global</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">Response Time</p>
                <p className="mt-2 text-base text-white">Within 24 Hours</p>
              </div>
            </div>
          </div>

          <ContactCard isVisible={isVisible} />
        </div>

        <footer className={`reveal-motion mt-16 border-t border-white/15 pt-6 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <BrandLogo reversed className="h-7 w-auto" />
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">AI Brand &amp; Digital Studio</p>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45" aria-label="Footer navigation">
              <a href="#portfolio" className="transition-colors duration-300 hover:text-champagne">Work</a>
              <a href="#services" className="transition-colors duration-300 hover:text-champagne">Services</a>
              <a href="#process" className="transition-colors duration-300 hover:text-champagne">Process</a>
              <a href="#portfolio" className="transition-colors duration-300 hover:text-champagne">Portfolio</a>
              <a href="#about" className="transition-colors duration-300 hover:text-champagne">About</a>
              <a href="#contact" className="transition-colors duration-300 hover:text-champagne">Contact</a>
            </nav>
          </div>
          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">© 2026 NOVAHAUS. All Rights Reserved.</p>
        </footer>
      </div>
    </section>
  )
}

export default ContactSection
