import { useState } from 'react'

const captureSteps = [
  { key: 'name', prompt: 'Great. Before I prepare the next recommendation, may I know your name?', label: 'Your name', type: 'text', required: true },
  { key: 'company', prompt: 'Which business or project are you representing?', label: 'Business or project name', type: 'text', required: true },
  { key: 'email', prompt: "What's the best email for us to send the initial Proposal or next-step context?", label: 'Email address', type: 'email', required: true },
  { key: 'whatsapp', prompt: 'If Telegram or WhatsApp is useful for the next step, you can share it here. This is optional.', label: 'Telegram or WhatsApp (optional)', type: 'tel' },
  { key: 'preferredContactMethod', prompt: 'What is your preferred contact method?', label: 'Preferred contact method (optional)', type: 'select', options: ['Email', 'WhatsApp', 'Telegram', 'Strategy Call'] },
]

const initialFields = captureSteps.reduce((result, step) => ({ ...result, [step.key]: '' }), {})

function LeadCapturePanel({ onSubmit, disabled = false }) {
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
    <div className="sales-agent-form-heading"><span>Contact context / {String(stepIndex + 1).padStart(2, '0')} of {String(captureSteps.length).padStart(2, '0')}</span><h3>A useful handoff.</h3><p>{step.prompt}</p></div>
    <label className="sales-agent-field sales-agent-capture-field" htmlFor={`sales-agent-capture-${step.key}`}><span>{step.label}{step.required && <b aria-hidden="true"> *</b>}</span>{step.type === 'select' ? <select id={`sales-agent-capture-${step.key}`} value={value} onChange={(event) => update(event.target.value)} disabled={disabled}><option value="">Select one</option>{step.options.map((item) => <option key={item}>{item}</option>)}</select> : <input id={`sales-agent-capture-${step.key}`} type={step.type} value={value} onChange={(event) => update(event.target.value)} autoComplete={step.key} disabled={disabled} />}{error && <small role="alert">{error}</small>}</label>
    <div className="sales-agent-capture-actions"><button className="sales-agent-button sales-agent-button-gold" type="submit" disabled={disabled}>{stepIndex === captureSteps.length - 1 ? 'Prepare My Summary' : 'Continue'} <span aria-hidden="true">↗</span></button>{!step.required && <button className="sales-agent-capture-skip" type="button" onClick={() => { update(''); if (stepIndex < captureSteps.length - 1) setStepIndex((current) => current + 1) }} disabled={disabled}>Skip for now</button>}</div>
    <p className="sales-agent-storage-note">Lead data is stored locally in this browser.</p>
  </form>
}

export default LeadCapturePanel
