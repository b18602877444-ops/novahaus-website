import { useState } from 'react'
import { buildDiagnosticReport, CAPABILITY_QUESTIONS, GROWTH_CATEGORIES } from '../lib/growthDiagnostic.js'
import { trackAssessmentEvent } from '../lib/analytics.js'
import { saveAssessmentLocally } from '../services/assessmentSubmission.js'

const industryOptions = ['Web3', 'FinTech', 'AI', 'Professional Services', 'Education', 'E-commerce', 'Membership Business', 'Other']
const challengeOptions = ['Unclear positioning', 'Weak digital presence', 'Low-quality leads', 'Low conversion', 'Manual operations', 'No CRM or follow-up system', 'Inconsistent content', 'Difficulty expanding internationally', 'Unsure how to use AI', 'Other']
const stageOptions = ['Pre-launch', 'Early Stage', 'Growth Stage', 'Established Business']
const teamOptions = ['1–5', '6–20', '21–50', '51+']
const goalOptions = ['Launch a new business', 'Improve positioning', 'Generate more qualified leads', 'Improve conversion', 'Implement AI automation', 'Build a CRM and follow-up system', 'Enter international markets', 'Create a long-term growth system']
const timelineOptions = ['Immediately', 'Within 30 days', 'Within 3 months', 'Exploring options']
const rangeOptions = ['Under USD 5,000', 'USD 5,000–15,000', 'USD 15,000–30,000', 'USD 30,000+', 'Not sure yet']
const steps = ['Business Profile', 'Business Stage', 'Current Challenges', 'Capability Questions', 'Goals']

const initialAnswers = {
  profile: { name: '', company: '', email: '', whatsapp: '', website: '', country: '', industry: '' },
  businessStage: '',
  teamSize: '',
  challenges: [],
  capabilityAnswers: Object.fromEntries(GROWTH_CATEGORIES.map((category) => [category, [0, 0, 0]])),
  primaryGoal: '',
  timeline: '',
  projectRange: '',
}

function FieldError({ id, message }) {
  return message ? <span id={id} className="assessment-field-error" role="alert">{message}</span> : null
}

function SelectField({ id, label, value, onChange, options, error, required = true }) {
  return <label htmlFor={id}>{label}<select id={id} name={id} value={value} onChange={onChange} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}><option value="" disabled>Select one</option>{options.map((option) => <option key={option}>{option}</option>)}</select><FieldError id={`${id}-error`} message={error} /></label>
}

function TextField({ id, label, value, onChange, type = 'text', optional = false, error, placeholder = '' }) {
  return <label htmlFor={id}>{label}{optional && <span className="assessment-optional">Optional</span>}<input id={id} name={id} type={type} value={value} onChange={onChange} placeholder={placeholder} required={!optional} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} /> <FieldError id={`${id}-error`} message={error} /></label>
}

function GrowthAssessment() {
  const [answers, setAnswers] = useState(initialAnswers)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [report, setReport] = useState(null)

  const updateProfile = (event) => setAnswers((current) => ({ ...current, profile: { ...current.profile, [event.target.name]: event.target.value } }))
  const updateAnswer = (field, value) => setAnswers((current) => ({ ...current, [field]: value }))
  const toggleChallenge = (challenge) => setAnswers((current) => ({ ...current, challenges: current.challenges.includes(challenge) ? current.challenges.filter((item) => item !== challenge) : [...current.challenges, challenge] }))
  const updateCapability = (category, index, value) => setAnswers((current) => ({ ...current, capabilityAnswers: { ...current.capabilityAnswers, [category]: current.capabilityAnswers[category].map((answer, answerIndex) => answerIndex === index ? Number(value) : answer) } }))

  const validateStep = () => {
    const nextErrors = {}
    if (step === 0) {
      for (const field of ['name', 'company', 'email', 'whatsapp', 'country', 'industry']) if (!answers.profile[field].trim()) nextErrors[field] = 'This field is required.'
      if (answers.profile.email && !/^\S+@\S+\.\S+$/.test(answers.profile.email)) nextErrors.email = 'Enter a valid email address.'
      if (answers.profile.website && !/^https?:\/\/[^\s]+$/i.test(answers.profile.website)) nextErrors.website = 'Use a complete URL beginning with http:// or https://.'
    }
    if (step === 1) { if (!answers.businessStage) nextErrors.businessStage = 'Select a business stage.'; if (!answers.teamSize) nextErrors.teamSize = 'Select a team size.' }
    if (step === 2 && answers.challenges.length === 0) nextErrors.challenges = 'Select at least one current challenge.'
    if (step === 3) GROWTH_CATEGORIES.forEach((category) => answers.capabilityAnswers[category].forEach((value, index) => { if (!value) nextErrors[`capability-${category}-${index}`] = 'Choose a score from 1 to 5.' }))
    if (step === 4) { if (!answers.primaryGoal) nextErrors.primaryGoal = 'Select a primary goal.'; if (!answers.timeline) nextErrors.timeline = 'Select a preferred timeline.'; if (!answers.projectRange) nextErrors.projectRange = 'Select an indicative project range.' }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleContinue = () => {
    if (!validateStep()) return
    if (step < steps.length - 1) {
      trackAssessmentEvent('assessment_step_completed', { step: step + 1 })
      setStep((current) => current + 1)
      setErrors({})
    } else {
      const nextReport = buildDiagnosticReport(answers)
      saveAssessmentLocally({ contact: answers.profile, answers, scores: nextReport.categoryScores, overallScore: nextReport.overallScore, recommendedProduct: nextReport.recommendedProduct })
      trackAssessmentEvent('assessment_submitted', { overallScore: nextReport.overallScore, recommendedProduct: nextReport.recommendedProduct.name })
      setReport(nextReport)
    }
  }

  const handleBack = () => { setStep((current) => Math.max(0, current - 1)); setErrors({}) }
  const handleRetake = () => { setAnswers(initialAnswers); setStep(0); setErrors({}); setReport(null) }

  if (report) return <AssessmentResults report={report} onRetake={handleRetake} />

  return <section id="growth-assessment" className="growth-assessment-shell" aria-label="NOVAHAUS Growth Diagnostic"><div className="assessment-progress-header"><div><span>Assessment</span><strong>0{step + 1} / 0{steps.length}</strong></div><div className="assessment-progress" role="progressbar" aria-valuemin="1" aria-valuemax={steps.length} aria-valuenow={step + 1} aria-label={`Assessment step ${step + 1} of ${steps.length}`}><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div><p>Step {step + 1} of {steps.length} — {steps[step]}</p></div><div className="assessment-card"><div className="assessment-step-heading"><span>Step {String(step + 1).padStart(2, '0')}</span><h2>{steps[step]}</h2><p>Answer from the current state of the business. There are no right or wrong answers.</p></div>{Object.keys(errors).length > 0 && <p className="assessment-error-summary" role="alert">Please complete the highlighted fields before continuing.</p>}<div className="assessment-step-content">{step === 0 && <div className="assessment-form-grid"><TextField id="name" label="Name" value={answers.profile.name} onChange={updateProfile} error={errors.name} /><TextField id="company" label="Company" value={answers.profile.company} onChange={updateProfile} error={errors.company} /><TextField id="email" label="Email" type="email" value={answers.profile.email} onChange={updateProfile} error={errors.email} /><TextField id="whatsapp" label="WhatsApp" type="tel" value={answers.profile.whatsapp} onChange={updateProfile} error={errors.whatsapp} /><TextField id="website" label="Website" type="url" optional value={answers.profile.website} onChange={updateProfile} error={errors.website} placeholder="https://" /><TextField id="country" label="Country" value={answers.profile.country} onChange={updateProfile} error={errors.country} /><SelectField id="industry" label="Industry" value={answers.profile.industry} onChange={(event) => setAnswers((current) => ({ ...current, profile: { ...current.profile, industry: event.target.value } }))} options={industryOptions} error={errors.industry} /></div>}{step === 1 && <div className="assessment-choice-grid"><SelectField id="business-stage" label="Business Stage" value={answers.businessStage} onChange={(event) => updateAnswer('businessStage', event.target.value)} options={stageOptions} error={errors.businessStage} /><SelectField id="team-size" label="Team Size" value={answers.teamSize} onChange={(event) => updateAnswer('teamSize', event.target.value)} options={teamOptions} error={errors.teamSize} /></div>}{step === 2 && <fieldset className="assessment-challenges"><legend>Select all that apply.</legend><div className="assessment-check-grid">{challengeOptions.map((challenge) => <label key={challenge} className="assessment-check"><input type="checkbox" checked={answers.challenges.includes(challenge)} onChange={() => toggleChallenge(challenge)} /><span>{challenge}</span></label>)}</div><FieldError id="challenges-error" message={errors.challenges} /></fieldset>}{step === 3 && <div className="assessment-capability-groups"><p className="assessment-scale-note"><span>1</span> Not established <span>5</span> Strong and repeatable</p>{GROWTH_CATEGORIES.map((category) => <fieldset className="assessment-capability-group" key={category}><legend>{category}</legend>{CAPABILITY_QUESTIONS[category].map((question, index) => { const fieldError = errors[`capability-${category}-${index}`]; return <div className="assessment-rating" key={question}><p>{question}</p><div className="assessment-rating-options" role="radiogroup" aria-label={question}>{[1, 2, 3, 4, 5].map((value) => <label key={value}><input type="radio" name={`capability-${category}-${index}`} value={value} checked={answers.capabilityAnswers[category][index] === value} onChange={(event) => updateCapability(category, index, event.target.value)} /><span>{value}</span></label>)}</div><FieldError id={`capability-${category}-${index}-error`} message={fieldError} /></div>})}</fieldset>)}</div>}{step === 4 && <div className="assessment-form-grid"><SelectField id="primary-goal" label="Primary Goal" value={answers.primaryGoal} onChange={(event) => updateAnswer('primaryGoal', event.target.value)} options={goalOptions} error={errors.primaryGoal} /><SelectField id="timeline" label="Preferred Timeline" value={answers.timeline} onChange={(event) => updateAnswer('timeline', event.target.value)} options={timelineOptions} error={errors.timeline} /><SelectField id="project-range" label="Indicative Project Range" value={answers.projectRange} onChange={(event) => updateAnswer('projectRange', event.target.value)} options={rangeOptions} error={errors.projectRange} /></div>}</div><div className="assessment-controls">{step > 0 ? <button className="assessment-back" type="button" onClick={handleBack}>Back</button> : <span />}{<button className="button-dark assessment-continue" type="button" onClick={handleContinue}>{step === steps.length - 1 ? 'Generate My Growth Report' : 'Continue'} <span aria-hidden="true">↗</span></button>}</div></div></section>
}

function AssessmentResults({ report, onRetake }) {
  const handleStrategyClick = () => trackAssessmentEvent('strategy_call_clicked', { source: 'growth_assessment' })
  const handleProductClick = () => trackAssessmentEvent('recommended_product_clicked', { product: report.recommendedProduct.name })
  return <section className="growth-assessment-shell assessment-results" aria-label="NOVAHAUS Growth Diagnostic Results"><div className="assessment-result-header"><span>NOVAHAUS Growth Score</span><h2>{report.overallScore} <small>/ 100</small></h2><p>This is a transparent preliminary self-assessment, not a guaranteed business result.</p></div><div className="assessment-result-grid">{GROWTH_CATEGORIES.map((category) => <div className="assessment-score-card" key={category}><span>{category}</span><strong>{report.categoryScores[category]}</strong><div className="score-bar" role="progressbar" aria-label={`${category} score`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={report.categoryScores[category]}><i style={{ width: `${report.categoryScores[category]}%` }} /></div></div>)}</div><div className="assessment-recommendation"><div><span>Biggest Opportunity</span><h3>{report.biggestOpportunity}</h3></div><div><span>Recommended Product</span><h3>{report.recommendedProduct.name}</h3><p><strong>Suggested Engagement:</strong> {report.recommendedProduct.engagement}</p><p><strong>Indicative Timeline:</strong> {report.recommendedProduct.timeline}</p></div></div><p className="assessment-disclaimer">This report is a preliminary assessment based on the information provided. Final recommendations require a NOVAHAUS Strategy Call.</p><div className="assessment-result-actions"><a href="/strategy/" className="button-dark" onClick={handleStrategyClick}>Book My Strategy Call <span aria-hidden="true">↗</span></a><a href="/products/" className="text-link" onClick={handleProductClick}>Explore Recommended Product <span aria-hidden="true">↗</span></a><button type="button" className="assessment-retake" onClick={onRetake}>Retake Assessment</button></div></section>
}

export default GrowthAssessment
