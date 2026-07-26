import { useState } from 'react'

const navItems = [
  { label: 'Work', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path d="M3.5 12.5 12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
    </svg>
  )
}

function SignalMark() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M4 17.5 10.5 11l3.2 3.2L20 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="20" cy="8" r="1.5" fill="currentColor" />
    </svg>
  )
}

function SignalField() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px] animate-float" aria-label="NOVAHAUS brand system preview">
      <div className="absolute inset-[7%] rounded-[2.25rem] border border-ink/10 bg-white/70 shadow-card backdrop-blur-sm" />

      <div className="absolute inset-[15%] overflow-hidden rounded-[1.75rem] border border-ink/10 bg-ink p-5 text-white shadow-card sm:p-7">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-champagne/25 blur-3xl" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(250,250,248,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(250,250,248,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-white/45">
            <span>NOV / 01</span>
            <span>Signal Field</span>
          </div>

          <div className="relative flex items-center justify-center py-8">
            <div className="absolute h-36 w-36 rounded-full border border-champagne/35 sm:h-44 sm:w-44" />
            <div className="absolute h-24 w-24 rounded-full border border-champagne/20 sm:h-32 sm:w-32" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-champagne text-ink shadow-[0_0_70px_rgba(200,169,107,0.36)] sm:h-24 sm:w-24">
              <SignalMark />
            </div>
            <span className="absolute left-[9%] top-[19%] text-[9px] uppercase tracking-[0.18em] text-white/45">clarity</span>
            <span className="absolute bottom-[15%] right-[5%] text-[9px] uppercase tracking-[0.18em] text-white/45">motion</span>
          </div>

          <div>
            <p className="max-w-[210px] font-sans text-2xl font-medium leading-[1.08] tracking-[-0.04em] text-white sm:text-3xl">
              Make meaning visible.
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-3 text-[9px] uppercase tracking-[0.2em] text-white/45">
              <span>Brand</span>
              <span>AI</span>
              <span>Digital</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-[3%] top-[14%] animate-drift rounded-2xl border border-ink/10 bg-white px-4 py-3 shadow-card sm:px-5">
        <p className="text-[9px] uppercase tracking-[0.2em] text-muted">Built for</p>
        <p className="mt-1 text-xs font-semibold tracking-[-0.02em] text-ink sm:text-sm">Ambitious ideas</p>
      </div>

      <div className="absolute bottom-[9%] left-[2%] rounded-2xl border border-ink/10 bg-canvas/90 px-4 py-3 shadow-card backdrop-blur-sm sm:px-5">
        <p className="text-[9px] uppercase tracking-[0.2em] text-muted">System / 03</p>
        <p className="mt-1 text-xs font-semibold tracking-[-0.02em] text-ink sm:text-sm">Digital experience</p>
      </div>
    </div>
  )
}

function Hero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <section id="top" className="min-h-screen overflow-hidden bg-canvas text-ink selection:bg-champagne/30" aria-labelledby="hero-title">
      <nav className="relative mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between px-6 sm:h-[88px] sm:px-10 lg:px-16" aria-label="Primary navigation">
        <a href="#top" className="text-[15px] font-semibold tracking-[-0.04em] text-ink sm:text-[17px]" aria-label="NOVAHAUS home">
          NOVAHAUS
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="text-[13px] font-medium text-muted transition-colors duration-300 hover:text-ink">
              {item.label}
            </a>
          ))}
        </div>

        <a href="#contact" className="button-base button-dark group hidden px-4 text-[12px] sm:px-5 sm:text-[13px] md:inline-flex">
          <span>Start Your Project</span>
          <ArrowUpRight />
        </a>

        <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink transition duration-300 hover:border-ink md:hidden" aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)}>
          <span className="flex w-4 flex-col gap-1" aria-hidden="true">
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
          </span>
        </button>

        {isMenuOpen && (
          <div className="absolute left-6 right-6 top-[68px] z-50 rounded-2xl border border-ink/10 bg-white p-4 shadow-card md:hidden">
            <div className="flex flex-col">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="border-b border-ink/10 px-3 py-3 text-sm font-medium text-ink" onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
              <a href="#contact" className="button-base button-dark mt-4 w-full" onClick={() => setIsMenuOpen(false)}>
                Start Your Project
                <ArrowUpRight />
              </a>
            </div>
          </div>
        )}
      </nav>

      <div className="mx-auto grid min-h-[calc(100vh-76px)] w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-6 pb-10 pt-10 sm:min-h-[calc(100vh-88px)] sm:px-10 sm:pb-14 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-16 lg:pb-20 lg:pt-8">
        <div className="relative z-10 max-w-[700px]">
          <p className="animate-rise-in text-[11px] font-semibold uppercase tracking-[0.26em] text-champagne [animation-delay:100ms]">
            AI Brand &amp; Digital Studio
          </p>

          <h1 id="hero-title" className="mt-6 max-w-[680px] animate-rise-in text-[clamp(3.25rem,7vw,6.6rem)] font-medium leading-[0.95] tracking-[-0.065em] text-ink [animation-delay:180ms] sm:mt-7">
            Build a Brand That People Trust.
          </h1>

          <p className="mt-7 max-w-[560px] animate-rise-in text-[17px] leading-7 tracking-[-0.015em] text-muted [animation-delay:320ms] sm:mt-8 sm:text-[19px] sm:leading-8">
            We help businesses and creators build premium brands, modern websites and AI-powered digital experiences.
          </p>

          <div className="mt-8 flex animate-rise-in flex-col items-start gap-4 [animation-delay:440ms] sm:mt-10 sm:flex-row sm:items-center sm:gap-6">
            <a href="#contact" className="button-base button-dark group w-full sm:w-auto">
              <span>Start Your Project</span>
              <ArrowUpRight />
            </a>
            <a href="#portfolio" className="button-link group">
              <span>View Portfolio</span>
              <ArrowUpRight />
            </a>
          </div>

          <div className="mt-14 flex animate-fade-in flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted [animation-delay:720ms] sm:mt-20 sm:text-[11px]">
            <span>Brand clarity</span>
            <span className="h-1 w-1 rounded-full bg-champagne" aria-hidden="true" />
            <span>AI leverage</span>
            <span className="h-1 w-1 rounded-full bg-champagne" aria-hidden="true" />
            <span>Digital experience</span>
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <SignalField />
        </div>
      </div>
    </section>
  )
}

export default Hero
