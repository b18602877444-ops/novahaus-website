import { useState } from 'react'
import { trackAssessmentEvent } from '../lib/analytics.js'
import { ASSESSMENT_QUESTIONS, buildAssessmentSummary, recommendGrowthOffer } from '../lib/growthOfferRecommendation.js'
import { getGrowthOperationsPlanForOffer } from '../data/growthOperationsPlans.js'
import { saveAssessmentLocally } from '../services/assessmentSubmission.js'

const emptyAnswers = Object.fromEntries(ASSESSMENT_QUESTIONS.map((question) => [question.id, question.multi ? [] : '']))
const emptyContact = { name: '', company: '', email: '', whatsapp: '', website: '', country: '' }

function FieldError({ id, message }) {
  return message ? <span id={id} className="assessment-field-error" role="alert">{message}</span> : null
}

function ChoiceField({ question, value, error, onChange }) {
  if (question.multi) {
    return <fieldset className="assessment-question-fieldset"><legend>{question.prompt}</legend><p className="assessment-question-note">Select all that apply.</p><div className="assessment-check-grid">{question.options.map((option) => <label className="assessment-check" key={option}><input type="checkbox" checked={value.includes(option)} onChange={() => onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])} /><span>{option}</span></label>)}</div><FieldError id={`${question.id}-error`} message={error} /></fieldset>
  }

  return <fieldset className="assessment-question-fieldset"><legend>{question.prompt}</legend><div className="assessment-option-grid">{question.options.map((option) => <label className={`assessment-option ${value === option ? 'is-selected' : ''}`} key={option}><input type="radio" name={question.id} value={option} checked={value === option} onChange={() => onChange(option)} /><span>{option}</span></label>)}</div><FieldError id={`${question.id}-error`} message={error} /></fieldset>
}

function ContactField({ id, label, value, onChange, type = 'text', optional = true, error, placeholder = '' }) {
  return <label className="assessment-contact-field" htmlFor={`assessment-${id}`}>{label}{optional && <span className="assessment-optional">Optional</span>}<input id={`assessment-${id}`} name={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? `assessment-${id}-error` : undefined} /> <FieldError id={`assessment-${id}-error`} message={error} /></label>
}

function GrowthAssessment() {
  const [answers, setAnswers] = useState(emptyAnswers)
  const [contact, setContact] = useState(emptyContact)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [report, setReport] = useState(null)
  const isContactStep = step === ASSESSMENT_QUESTIONS.length
  const totalSteps = ASSESSMENT_QUESTIONS.length + 1
  const currentQuestion = ASSESSMENT_QUESTIONS[step]

  const updateAnswer = (value) => setAnswers((current) => ({ ...current, [currentQuestion.id]: value }))
  const updateContact = (id, value) => setContact((current) => ({ ...current, [id]: value }))

  const validateStep = () => {
    const nextErrors = {}
    if (!isContactStep) {
      const value = answers[currentQuestion.id]
      if ((Array.isArray(value) && value.length === 0) || (!Array.isArray(value) && !value)) nextErrors[currentQuestion.id] = 'Choose one option to continue.'
    } else if (contact.email && !/^\S+@\S+\.\S+$/.test(contact.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleContinue = () => {
    if (!validateStep()) return
    if (step < totalSteps - 1) {
      trackAssessmentEvent('assessment_step_completed', { step: step + 1, question: currentQuestion?.id || 'contact' })
      setStep((current) => current + 1)
      setErrors({})
    return
  }

    const recommendation = recommendGrowthOffer(answers)
    const summary = buildAssessmentSummary(answers, recommendation)
    const plan = getGrowthOperationsPlanForOffer(recommendation.offer.id)
    const compatibilityAnswers = {
      ...answers,
      profile: { ...contact, industry: answers.customerGroup },
      customerGroup: answers.customerGroup,
      industry: answers.customerGroup,
      teamSize: answers.teamSize,
      challenges: [answers.biggestChallenge],
      primaryGoal: answers.businessGoal,
      timeline: 'To be confirmed during the Strategy Call',
      projectRange: answers.budgetRange,
    }
    const saved = saveAssessmentLocally({
      contact: { ...contact, industry: answers.customerGroup },
      answers: compatibilityAnswers,
      summary,
      recommendation,
      recommendedOffer: recommendation.offer,
      recommendedPlan: plan,
      recommendedProduct: { name: recommendation.offer.name, engagement: recommendation.offer.shortDescription, timeline: recommendation.offer.estimatedTimeline },
    })
    trackAssessmentEvent('assessment_submitted', { assessmentId: saved.id, recommendedOffer: recommendation.offer.name })
    setReport({ ...recommendation, plan, summary })
  }

  const handleBack = () => { setStep((current) => Math.max(0, current - 1)); setErrors({}) }
  const handleRetake = () => { setAnswers(emptyAnswers); setContact(emptyContact); setStep(0); setErrors({}); setReport(null) }

  if (report) return <AssessmentResults report={report} onRetake={handleRetake} />

  const progress = ((step + 1) / totalSteps) * 100
  return <section id="growth-assessment" className="growth-assessment-shell" aria-label="NOVAHAUS AI Business Growth Assessment"><div className="assessment-progress-header"><div><span>Assessment</span><strong>{String(Math.min(step + 1, totalSteps)).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}</strong></div><div className="assessment-progress" role="progressbar" aria-valuemin="1" aria-valuemax={totalSteps} aria-valuenow={step + 1} aria-label={`Assessment step ${step + 1} of ${totalSteps}`}><span style={{ width: `${progress}%` }} /></div><p>{isContactStep ? 'Share context' : `Question ${step + 1} of ${ASSESSMENT_QUESTIONS.length}`}</p></div><div className="assessment-card"><div className="assessment-step-heading"><span>{isContactStep ? 'Next step' : `Question ${String(step + 1).padStart(2, '0')}`}</span><h2>{isContactStep ? <>Where should we<br /><em>take the conversation?</em></> : currentQuestion.label}</h2><p>{isContactStep ? 'Add your details if you would like NOVAHAUS to use this context for a follow-up. These fields are not part of the 12 assessment questions.' : currentQuestion.prompt}</p></div>{Object.keys(errors).length > 0 && <p className="assessment-error-summary" role="alert">Please complete the highlighted field before continuing.</p>}<div className="assessment-step-content">{isContactStep ? <div className="assessment-form-grid assessment-contact-grid"><ContactField id="name" label="Name" value={contact.name} onChange={(value) => updateContact('name', value)} /><ContactField id="company" label="Company" value={contact.company} onChange={(value) => updateContact('company', value)} /><ContactField id="email" label="Email" type="email" value={contact.email} onChange={(value) => updateContact('email', value)} error={errors.email} /><ContactField id="whatsapp" label="WhatsApp" type="tel" value={contact.whatsapp} onChange={(value) => updateContact('whatsapp', value)} /><ContactField id="website" label="Website" type="url" value={contact.website} onChange={(value) => updateContact('website', value)} placeholder="https://" /><ContactField id="country" label="Country" value={contact.country} onChange={(value) => updateContact('country', value)} /></div> : <ChoiceField question={currentQuestion} value={answers[currentQuestion.id]} error={errors[currentQuestion.id]} onChange={updateAnswer} />}</div><div className="assessment-controls"><button className="assessment-back" type="button" onClick={handleBack} disabled={step === 0}>Back</button><span className="assessment-time-note">12 questions · about 3 minutes</span><button className="button-dark assessment-continue" type="button" onClick={handleContinue}>{isContactStep ? 'Show My Recommendation' : 'Continue'} <span aria-hidden="true">↗</span></button></div></div></section>
}

function AssessmentResults({ report, onRetake }) {
  const { offer, plan } = report
  const handleStrategyClick = () => trackAssessmentEvent('strategy_call_clicked', { source: 'growth_assessment', offer: offer.name })
  const handleProposalClick = () => trackAssessmentEvent('proposal_clicked', { source: 'growth_assessment', offer: offer.name })
  return <section className="growth-assessment-shell assessment-results" aria-label="NOVAHAUS Growth Assessment Recommendation"><div className="assessment-result-header"><span>Assessment complete</span><h2>Your next<br /><em>useful move.</em></h2><p>Based on the context you shared, this is the single NOVAHAUS department that best fits the current operating context. It is a directional recommendation, not a guaranteed business outcome.</p></div><div className="assessment-offer-card"><div className="assessment-offer-heading"><span>Recommended department</span><h3>{plan.name}</h3><p>{plan.bestFor}</p><p className="assessment-recommendation-reason"><strong>Why this fits:</strong> {report.reason}</p></div><div className="assessment-offer-columns"><div><span>Standard monthly capacity</span><ul>{plan.monthlyStandardCapacity.map((item) => <li key={item}>{item}</li>)}</ul></div><div><span>Investment</span><h3>{plan.monthlyPrice}</h3><p>Onboarding: {plan.onboardingFee}</p><span>Client responsibilities</span><ul>{plan.clientResponsibilities.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul></div></div><div className="assessment-offer-details"><div><span>Exclusions</span><ul>{plan.exclusions.slice(0, 6).map((item) => <li key={item}>{item}</li>)}</ul></div><div><span>Add-on triggers</span><ul>{plan.customQuoteTriggers.map((item) => <li key={item}>{item}</li>)}</ul></div></div></div><p className="assessment-disclaimer">{plan.finalQuoteNotice}</p><div className="assessment-result-actions"><a href={plan.cta.href} className="button-dark" onClick={handleStrategyClick}>Book Strategy Call <span aria-hidden="true">↗</span></a><a href="/proposal/" className="text-link" onClick={handleProposalClick}>Prepare a Proposal <span aria-hidden="true">↗</span></a><button type="button" className="assessment-retake" onClick={onRetake}>Retake Assessment</button></div></section>
}

export default GrowthAssessment
