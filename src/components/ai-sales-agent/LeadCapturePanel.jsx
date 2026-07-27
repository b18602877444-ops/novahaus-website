import { useState } from 'react'

const captureSteps = [
  { key: 'name', prompt: 'Great. Before I prepare the next recommendation, may I know your name?', label: 'Your name', type: 'text', required: true },
  { key: 'company', prompt: 'Thanks. Which company are you representing?', label: 'Company', type: 'text', required: true },
  { key: 'email', prompt: "What's the best email for us to send the proposal?", label: 'Email address', type: 'email', required: true },
  { key: 'whatsapp', prompt: 'If WhatsApp is useful for the next step, you can share it here. This one is optional.', label: 'WhatsApp (optional)', type: 'tel' },
  { key: 'country', prompt: 'Which country is the business based in?', label: 'Country (optional)', type: 'text' },
  { key: 'businessType', prompt: 'What kind of business are you building?', label: 'Business type (optional)', type: 'select' },
  { key: 'interestedPackage', prompt: 'Which NOVAHAUS package feels closest to what you need right now?', label: 'Interested package (optional)', type: 'package' },
  { key: 'challenge', prompt: 'Finally, what would you most like to improve?', label: 'Current challenge (optional)', type: 'textarea' },
]

const initialFields = captureSteps.reduce((result, step) => ({ ...result, [step.key]: '' }), {})

function LeadCapturePanel({ onSubmit, industryOptions = [], disabled = false }) {
  const [fields, setFields] = useState(initialFields)
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const step = captureSteps[stepIndex]
  const value = fields[step.key]

  const update = (nextValue) => {
    setFields((current) => ({ ...current, [step.key]: nextValue }))
    setError('')
  }

  const handleContinue = (event) => {
    event.preventDefault()
    const trimmed = String(value || '').trim()
    if (step.required && !trimmed) {
      setError(`${step.label} is required.`)
      return
    }
    if (step.key === 'email' && trimmed && !/^\S+@\S+\.\S+$/.test(trimmed)) {
      setError('Enter a valid email address.')
      return
    }
    if (stepIndex < captureSteps.length - 1) {
      setStepIndex((current) => current + 1)
      return
    }
    onSubmit(fields)
    setSubmitted(true)
  }

  if (submitted) return <div className="sales-agent-lead-success" role="status" aria-live="polite"><span>Context saved.</span><p>Lead data is stored locally in this browser.</p></div>

  return <form className="sales-agent-lead-form sales-agent-capture-conversation" onSubmit={handleContinue} noValidate>
    <div className="sales-agent-form-heading"><span>Context / {String(stepIndex + 1).padStart(2, '0')} of {String(captureSteps.length).padStart(2, '0')}</span><h3>A few useful details.</h3><p>{step.prompt}</p></div>
    <label className="sales-agent-field sales-agent-capture-field" htmlFor={`sales-agent-capture-${step.key}`}><span>{step.label}{step.required && <b aria-hidden="true"> *</b>}</span>{step.type === 'select' ? <select id={`sales-agent-capture-${step.key}`} value={value} onChange={(event) => update(event.target.value)} disabled={disabled}><option value="">Select one</option>{industryOptions.map((item) => <option key={item}>{item}</option>)}</select> : step.type === 'package' ? <select id={`sales-agent-capture-${step.key}`} value={value} onChange={(event) => update(event.target.value)} disabled={disabled}><option value="">Select one</option><option>Starter</option><option>Growth</option><option>Enterprise</option><option>Not sure yet</option></select> : step.type === 'textarea' ? <textarea id={`sales-agent-capture-${step.key}`} rows="3" value={value} onChange={(event) => update(event.target.value)} placeholder="Share it in your own words." disabled={disabled} /> : <input id={`sales-agent-capture-${step.key}`} type={step.type} value={value} onChange={(event) => update(event.target.value)} autoComplete={step.key} disabled={disabled} />}{error && <small role="alert">{error}</small>}</label>
    <div className="sales-agent-capture-actions"><button className="sales-agent-button sales-agent-button-gold" type="submit" disabled={disabled}>{stepIndex === captureSteps.length - 1 ? 'Prepare My Summary' : 'Continue'} <span aria-hidden="true">↗</span></button>{!step.required && <button className="sales-agent-capture-skip" type="button" onClick={() => { update(''); if (stepIndex < captureSteps.length - 1) setStepIndex((current) => current + 1) }} disabled={disabled}>Skip for now</button>}</div>
    <p className="sales-agent-storage-note">Lead data is stored locally in this browser.</p>
  </form>
}

export default LeadCapturePanel
