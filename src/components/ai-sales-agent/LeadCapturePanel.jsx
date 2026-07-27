import { useState } from 'react'

const initialLead = { name: '', company: '', email: '', whatsapp: '', industry: '', country: '', budget: '', timeline: '', goals: '', painPoints: '' }

function LeadCapturePanel({ onSubmit, industryOptions, budgetOptions, timelineOptions, disabled = false }) {
  const [fields, setFields] = useState(initialLead)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const update = (key, value) => { setFields((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: '' })) }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!fields.name.trim()) nextErrors.name = 'Name is required.'
    if (!fields.company.trim()) nextErrors.company = 'Company is required.'
    if (!fields.email.trim()) nextErrors.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(fields.email)) nextErrors.email = 'Enter a valid email.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    onSubmit(fields)
    setSubmitted(true)
  }

  if (submitted) return <div className="sales-agent-lead-success" role="status" aria-live="polite"><span>Context saved.</span><p>Lead data is stored locally in this browser.</p></div>

  return <form className="sales-agent-lead-form" onSubmit={handleSubmit} noValidate>
    <div className="sales-agent-form-heading"><span>Next step</span><h3>Give the context a name.</h3><p>These details stay in this browser and help us shape a more useful recommendation.</p></div>
    <div className="sales-agent-form-grid">
      {['name', 'company', 'email', 'whatsapp', 'country'].map((key) => <label key={key} className="sales-agent-field"><span>{key === 'name' ? 'Name' : key === 'company' ? 'Company' : key === 'email' ? 'Email' : key === 'whatsapp' ? 'WhatsApp' : 'Country'}{['name', 'company', 'email'].includes(key) && <b aria-hidden="true"> *</b>}</span><input type={key === 'email' ? 'email' : key === 'whatsapp' ? 'tel' : 'text'} value={fields[key]} onChange={(event) => update(key, event.target.value)} required={['name', 'company', 'email'].includes(key)} aria-invalid={errors[key] ? 'true' : undefined} />{errors[key] && <small role="alert">{errors[key]}</small>}</label>)}
      <label className="sales-agent-field"><span>Industry</span><select value={fields.industry} onChange={(event) => update('industry', event.target.value)}><option value="">Select one</option>{industryOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="sales-agent-field"><span>Budget</span><select value={fields.budget} onChange={(event) => update('budget', event.target.value)}><option value="">Select one</option>{budgetOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="sales-agent-field"><span>Timeline</span><select value={fields.timeline} onChange={(event) => update('timeline', event.target.value)}><option value="">Select one</option>{timelineOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="sales-agent-field sales-agent-field-wide"><span>Goals</span><textarea rows="2" value={fields.goals} onChange={(event) => update('goals', event.target.value)} placeholder="What would you like to improve?" /></label>
      <label className="sales-agent-field sales-agent-field-wide"><span>Pain Points</span><textarea rows="2" value={fields.painPoints} onChange={(event) => update('painPoints', event.target.value)} placeholder="What is creating friction?" /></label>
    </div>
    <button className="sales-agent-button sales-agent-button-gold" type="submit" disabled={disabled}>Save My Context <span aria-hidden="true">↗</span></button>
    <p className="sales-agent-storage-note">Lead data is stored locally in this browser.</p>
  </form>
}

export default LeadCapturePanel
