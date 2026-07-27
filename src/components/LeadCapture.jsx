import { useState } from 'react'

export const LEAD_CAPTURE_STORAGE_KEY = 'novahaus-lead-capture'

const initialLead = {
  name: '',
  company: '',
  email: '',
  whatsapp: '',
  website: '',
  businessStage: '',
  challenge: '',
}

const challengeOptions = [
  'Business Growth',
  'AI Automation',
  'Lead Generation',
  'Brand Positioning',
  'Website',
  'Global Expansion',
  'Other',
]

function saveLeadLocally(lead) {
  try {
    const savedLeads = JSON.parse(window.localStorage.getItem(LEAD_CAPTURE_STORAGE_KEY) || '[]')
    window.localStorage.setItem(LEAD_CAPTURE_STORAGE_KEY, JSON.stringify([...savedLeads, { ...lead, submittedAt: new Date().toISOString() }]))
  } catch {
    // Local storage can be unavailable in private browsing; the success state still gives the user clear feedback.
  }
}

function LeadCapture({ onSubmit }) {
  const [lead, setLead] = useState(initialLead)
  const [submitted, setSubmitted] = useState(false)

  const updateField = (event) => {
    const { name, value } = event.target
    setLead((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    saveLeadLocally(lead)
    onSubmit?.(lead)
    setSubmitted(true)
  }

  if (submitted) {
    return <div className="lead-capture-success" role="status" aria-live="polite"><span>Thank you.</span><p>Our team will contact you soon.</p></div>
  }

  return <form className="lead-capture" onSubmit={handleSubmit} noValidate={false}><div className="lead-capture-fields"><label htmlFor="lead-name">Name<input id="lead-name" name="name" value={lead.name} onChange={updateField} autoComplete="name" required /></label><label htmlFor="lead-company">Company<input id="lead-company" name="company" value={lead.company} onChange={updateField} autoComplete="organization" required /></label><label htmlFor="lead-email">Email<input id="lead-email" name="email" value={lead.email} onChange={updateField} type="email" autoComplete="email" required /></label><label htmlFor="lead-whatsapp">WhatsApp<input id="lead-whatsapp" name="whatsapp" value={lead.whatsapp} onChange={updateField} type="tel" autoComplete="tel" required /></label><label htmlFor="lead-website">Website <span>Optional</span><input id="lead-website" name="website" value={lead.website} onChange={updateField} type="url" placeholder="https://" autoComplete="url" /></label><label htmlFor="lead-stage">Business Stage<select id="lead-stage" name="businessStage" value={lead.businessStage} onChange={updateField} required><option value="" disabled>Select one</option><option>Startup</option><option>Growth</option><option>Enterprise</option></select></label><label className="lead-capture-wide" htmlFor="lead-challenge">Biggest Business Challenge<select id="lead-challenge" name="challenge" value={lead.challenge} onChange={updateField} required><option value="" disabled>Select one</option>{challengeOptions.map((option) => <option key={option}>{option}</option>)}</select></label></div><button className="form-submit lead-capture-submit" type="submit">Get My Strategy Session <span aria-hidden="true">↗</span></button></form>
}

export default LeadCapture
