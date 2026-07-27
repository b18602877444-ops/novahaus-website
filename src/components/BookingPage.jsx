import { useMemo, useState } from 'react'
import BrandLogo from './BrandLogo.jsx'
import { bookingStatuses } from '../data/bookingSchema.js'
import { deleteBooking, getBooking, listBookings, saveBooking, updateBooking } from '../services/bookingStorage.js'
import { getBookingPrefill } from '../services/bookingPrefill.js'

const steps = ['Contact', 'Business', 'Preferred Time', 'Review']
const industryOptions = ['Web3', 'FinTech', 'AI', 'Professional Services', 'Education', 'E-commerce', 'Membership Business', 'Other']
const companySizeOptions = ['Solo founder', '2–10', '11–50', '51–200', '201+']
const challengeOptions = ['Business growth', 'AI automation', 'Lead generation', 'Brand positioning', 'Website or digital experience', 'Global expansion', 'Other']
const serviceOptions = ['AI Growth Website', 'AI Sales Agent', 'AI Customer Service', 'Growth Assessment', 'Proposal System', 'Business Automation', 'Knowledge Hub', 'Custom AI Solution', 'Not Sure Yet']
const revenueOptions = ['Pre-revenue', 'Under USD 10,000 / month', 'USD 10,000–50,000 / month', 'USD 50,000+ / month', 'Prefer not to say']
const timeOptions = ['09:00–10:00', '10:00–11:00', '11:00–12:00', '14:00–15:00', '15:00–16:00', '16:00–17:00']
const timeZoneOptions = ['MYT (UTC+8)', 'SGT (UTC+8)', 'ICT (UTC+7)', 'GMT (UTC+0)', 'CET (UTC+1)', 'EST (UTC-5)', 'PST (UTC-8)', 'Other']

const blankForm = {
  fullName: '', company: '', email: '', whatsapp: '', country: '', website: '', industry: '', companySize: '', monthlyRevenueRange: '', primaryChallenge: '', serviceInterest: '', interestedPackage: '', preferredDate: '', preferredTime: '', timeZone: '', alternativeDate: '', alternativeTime: '', additionalNotes: '', growthScore: '', assessmentSummary: '', proposalSummary: '', aiSummary: '',
}

function getBookingContext() {
  const params = new URLSearchParams(window.location.search)
  return { source: params.get('source') || 'homepage', packageName: params.get('package') || '', submittedId: params.get('submitted') || '' }
}

function today() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function BookingHeader() {
  return <header className="booking-header"><a href="/" aria-label="NOVAHAUS home"><BrandLogo className="brand-logo-light" /></a><span>Strategy Call Request</span><a className="booking-header-home" href="/">Return to NOVAHAUS <span aria-hidden="true">↗</span></a></header>
}

function Field({ id, label, value, onChange, error, type = 'text', required = false, optional = false, placeholder = '', min }) {
  const update = (event) => onChange(id, event.target.value)
  return <label className="booking-field" htmlFor={`booking-${id}`}><span>{label}{optional && <small>Optional</small>}</span><input id={`booking-${id}`} name={id} type={type} value={value} onChange={update} onInput={update} required={required} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? `booking-${id}-error` : undefined} placeholder={placeholder} min={min} />{error && <strong id={`booking-${id}-error`} className="booking-field-error" role="alert">{error}</strong>}</label>
}

function SelectField({ id, label, value, onChange, options, error, required = false, optional = false }) {
  return <label className="booking-field" htmlFor={`booking-${id}`}><span>{label}{optional && <small>Optional</small>}</span><select id={`booking-${id}`} name={id} value={value} onChange={(event) => onChange(id, event.target.value)} required={required} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? `booking-${id}-error` : undefined}><option value="">Select one</option>{options.map((option) => <option key={option}>{option}</option>)}</select>{error && <strong id={`booking-${id}-error`} className="booking-field-error" role="alert">{error}</strong>}</label>
}

function BookingSection({ number, title, children }) {
  return <section className="booking-form-section"><div className="booking-section-heading"><span>{number}</span><h2>{title}</h2></div>{children}</section>
}

function BookingSummary({ form }) {
  const rows = [['Name', form.fullName], ['Company', form.company], ['Email', form.email], ['Country', form.country], ['Service interest', form.serviceInterest], ['Preferred date', form.preferredDate], ['Preferred time', form.preferredTime], ['Time zone', form.timeZone]]
  return <aside className="booking-summary" aria-label="Booking summary"><span className="booking-summary-label">Your starting point</span><h2>{form.company || 'Your business'}</h2>{form.interestedPackage && <p className="booking-summary-package">{form.interestedPackage} package</p>}<dl>{rows.map(([label, value]) => value && <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="booking-summary-note">Your request is reviewed by NOVAHAUS before any meeting is confirmed. You will receive the next step by email.</p></aside>
}

function BookingConfirmation({ booking }) {
  return <div className="booking-confirmation"><span className="booking-confirmation-mark">01</span><p className="booking-eyebrow">Request received</p><h1>Your Strategy Call<br /><em>request is in.</em></h1><p className="booking-confirmation-copy">Thank you for sharing your business information. The NOVAHAUS team will review your request and contact you to confirm the meeting.</p><div className="booking-confirmation-summary"><span>Booking request summary</span><dl><div><dt>Name</dt><dd>{booking?.fullName || 'Not provided'}</dd></div><div><dt>Company</dt><dd>{booking?.company || 'Not provided'}</dd></div><div><dt>Service interest</dt><dd>{booking?.serviceInterest || 'Not provided'}</dd></div><div><dt>Preferred date</dt><dd>{booking?.preferredDate || 'Not provided'}</dd></div><div><dt>Preferred time</dt><dd>{booking?.preferredTime || 'Not provided'}</dd></div><div><dt>Time zone</dt><dd>{booking?.timeZone || 'Not provided'}</dd></div></dl><strong>Booking Reference ID: {booking?.id || 'Pending local reference'}</strong></div><div className="booking-confirmation-actions"><a className="button-dark" href="/">Return to Homepage <span aria-hidden="true">↗</span></a><a className="text-link" href="/proposal-builder/">Explore Proposal Generator <span aria-hidden="true">↗</span></a><a className="text-link" href="/ai-sales-agent/">Talk to NOVAHAUS AI <span aria-hidden="true">↗</span></a></div></div>
}

export function BookingPage() {
  const context = useMemo(getBookingContext, [])
  const prefill = useMemo(() => getBookingPrefill(context.source, context.packageName), [context.packageName, context.source])
  const [form, setForm] = useState(() => ({ ...blankForm, ...prefill, interestedPackage: prefill.interestedPackage || context.packageName }))
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [storageError, setStorageError] = useState(false)
  const [booking, setBooking] = useState(() => context.submittedId ? getBooking(context.submittedId) : null)

  const updateField = (id, value) => setForm((current) => ({ ...current, [id]: value }))
  const sourceLabel = context.source === 'ai-sales-agent' ? 'AI Sales Agent context imported.' : context.source === 'growth-assessment' ? 'Growth Assessment context imported.' : context.source === 'proposal-generator' ? 'Proposal context imported.' : context.packageName ? `${context.packageName} package selected.` : ''

  const validate = (currentStep) => {
    const next = {}
    if (currentStep === 0) {
      if (!form.fullName.trim()) next.fullName = 'Enter your full name.'
      if (!form.company.trim()) next.company = 'Enter your company name.'
      if (!form.email.trim()) next.email = 'Enter your email address.'
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
      if (!form.country.trim()) next.country = 'Enter your country.'
      if (form.website && !/^https?:\/\/[^\s]+$/i.test(form.website)) next.website = 'Use a complete URL beginning with http:// or https://.'
    }
    if (currentStep === 1) {
      if (!form.industry) next.industry = 'Select an industry.'
      if (!form.companySize) next.companySize = 'Select a company size.'
      if (!form.primaryChallenge) next.primaryChallenge = 'Select the main challenge.'
      if (!form.serviceInterest) next.serviceInterest = 'Select a service interest.'
    }
    if (currentStep === 2) {
      if (!form.preferredDate) next.preferredDate = 'Choose a preferred date.'
      else if (form.preferredDate < today()) next.preferredDate = 'Choose a future date.'
      if (!form.preferredTime) next.preferredTime = 'Choose a preferred time.'
      if (!form.timeZone) next.timeZone = 'Select your time zone.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const nextStep = () => { if (validate(step)) { setErrors({}); setStep((current) => Math.min(current + 1, steps.length - 1)) } }
  const previousStep = () => { setErrors({}); setStep((current) => Math.max(current - 1, 0)) }
  const handleSubmit = (event) => {
    event.preventDefault()
    const record = saveBooking({ ...form, source: context.source })
    if (!record?.id) { setStorageError(true); return }
    setBooking(record)
    window.history.replaceState({}, '', `/booking/?submitted=${encodeURIComponent(record.id)}`)
  }

  return <div className="booking-page"><BookingHeader />{booking ? <main id="main-content" className="booking-main"><BookingConfirmation booking={booking} /></main> : <main id="main-content" className="booking-main"><div className="booking-hero"><p className="booking-eyebrow">NOVAHAUS / Strategy Call</p><h1>Book a Strategy<br /><em>Call.</em></h1><p>Tell us about your business and choose a preferred consultation time. Our team will review your request and confirm the meeting details.</p><div className="booking-request-notice" role="note">Submitting this form sends a strategy call request. Your meeting is confirmed only after you receive a confirmation from NOVAHAUS.</div></div><div className="booking-layout"><form className="booking-form" onSubmit={handleSubmit} noValidate><div className="booking-progress" aria-label={`Booking step ${step + 1} of ${steps.length}`}><div className="booking-progress-bar"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div><div className="booking-progress-steps">{steps.map((label, index) => <span className={index === step ? 'is-active' : index < step ? 'is-complete' : ''} key={label}><b>0{index + 1}</b>{label}</span>)}</div></div>{sourceLabel && <p className="booking-prefill-notice" role="status">{sourceLabel} You can review and edit every field before submitting.</p>}{step === 0 && <BookingSection number="01" title="Contact Information"><div className="booking-field-grid"><Field id="fullName" label="Full Name" value={form.fullName} onChange={updateField} error={errors.fullName} required /><Field id="company" label="Company Name" value={form.company} onChange={updateField} error={errors.company} required /><Field id="email" label="Email" value={form.email} onChange={updateField} error={errors.email} type="email" required /><Field id="country" label="Country" value={form.country} onChange={updateField} error={errors.country} required /><Field id="whatsapp" label="WhatsApp" value={form.whatsapp} onChange={updateField} type="tel" optional /><Field id="website" label="Website" value={form.website} onChange={updateField} type="url" optional placeholder="https://" /></div></BookingSection>}{step === 1 && <BookingSection number="02" title="Business Information"><div className="booking-field-grid"><SelectField id="industry" label="Industry" value={form.industry} onChange={updateField} options={industryOptions} error={errors.industry} required /><SelectField id="companySize" label="Company Size" value={form.companySize} onChange={updateField} options={companySizeOptions} error={errors.companySize} required /><SelectField id="primaryChallenge" label="Primary Business Challenge" value={form.primaryChallenge} onChange={updateField} options={challengeOptions} error={errors.primaryChallenge} required /><SelectField id="serviceInterest" label="Service Interest" value={form.serviceInterest} onChange={updateField} options={serviceOptions} error={errors.serviceInterest} required /><SelectField id="monthlyRevenueRange" label="Monthly Revenue Range" value={form.monthlyRevenueRange} onChange={updateField} options={revenueOptions} optional /><Field id="currentWebsiteOrSystem" label="Current Website or System" value={form.currentWebsiteOrSystem || ''} onChange={updateField} optional placeholder="https:// or a short description" /><label className="booking-field booking-field-wide" htmlFor="booking-additionalNotes"><span>Additional Notes<small>Optional</small></span><textarea id="booking-additionalNotes" value={form.additionalNotes} onChange={(event) => updateField('additionalNotes', event.target.value)} rows={5} placeholder="Anything useful to know before the call?" /></label></div></BookingSection>}{step === 2 && <BookingSection number="03" title="Preferred Meeting"><div className="booking-field-grid"><Field id="preferredDate" label="Preferred Date" value={form.preferredDate} onChange={updateField} error={errors.preferredDate} type="date" required min={today()} /><SelectField id="preferredTime" label="Preferred Time" value={form.preferredTime} onChange={updateField} options={timeOptions} error={errors.preferredTime} required /><SelectField id="timeZone" label="Time Zone" value={form.timeZone} onChange={updateField} options={timeZoneOptions} error={errors.timeZone} required /><Field id="alternativeDate" label="Alternative Date" value={form.alternativeDate} onChange={updateField} type="date" optional min={today()} /><SelectField id="alternativeTime" label="Alternative Time" value={form.alternativeTime} onChange={updateField} options={timeOptions} optional /></div></BookingSection>}{step === 3 && <BookingSection number="04" title="Review Your Request"><div className="booking-review-grid"><div><p>Check the details before sending your request. You can go back to edit any section.</p><dl>{[['Full Name', form.fullName], ['Company Name', form.company], ['Email', form.email], ['Country', form.country], ['Industry', form.industry], ['Company Size', form.companySize], ['Primary Challenge', form.primaryChallenge], ['Service Interest', form.serviceInterest], ['Preferred Date', form.preferredDate], ['Preferred Time', form.preferredTime], ['Time Zone', form.timeZone], ['Alternative Date', form.alternativeDate], ['Alternative Time', form.alternativeTime]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Not provided'}</dd></div>)}</dl></div><div className="booking-review-disclaimer"><span>Privacy note</span><p>Your information is used only to review and respond to your consultation request. This version stores the request locally in this browser and does not send data to an external service.</p></div></div></BookingSection>}{storageError && <p className="booking-form-error" role="alert">We could not store this request in the browser. Please keep this page open and contact hello@novahaus.studio directly.</p>}<div className="booking-form-actions">{step > 0 ? <button type="button" className="booking-back" onClick={previousStep}>Back</button> : <span />}{step < steps.length - 1 ? <button type="button" className="button-dark" onClick={nextStep}>Continue <span aria-hidden="true">↗</span></button> : <button type="submit" className="button-dark">Submit Request <span aria-hidden="true">↗</span></button>}</div></form><BookingSummary form={form} /></div></main>}</div>
}

export function BookingReviewPage() {
  const [bookings, setBookings] = useState(() => listBookings())
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [selectedId, setSelectedId] = useState('')
  const visible = bookings.filter((booking) => { const haystack = `${booking.fullName} ${booking.company} ${booking.country} ${booking.serviceInterest}`.toLowerCase(); return (!query || haystack.includes(query.toLowerCase())) && (status === 'all' || booking.status === status) })
  const selected = bookings.find((booking) => booking.id === selectedId)
  const refresh = () => setBookings(listBookings())
  const changeStatus = (value) => { updateBooking(selected.id, { status: value }); refresh() }
  const remove = () => { if (!window.confirm('Delete this booking request from this browser?')) return; deleteBooking(selected.id); setSelectedId(''); refresh() }

  return <div className="booking-review-page"><header className="booking-review-header"><a href="/" aria-label="NOVAHAUS home"><BrandLogo className="brand-logo-light" /></a><span>Internal Booking Review</span><a href="/booking/" className="booking-review-new">Open booking page ↗</a></header><main className="booking-review-main"><div className="booking-review-intro"><p className="booking-eyebrow">Local workspace / {bookings.length} request{bookings.length === 1 ? '' : 's'}</p><h1>Review the next<br /><em>useful conversation.</em></h1><p>Booking data is stored only in this browser. No request is sent to an external calendar, CRM or email service in this version.</p></div>{selected ? <section className="booking-detail"><button type="button" className="booking-back" onClick={() => setSelectedId('')}>← Back to booking list</button><div className="booking-detail-header"><div><span>Booking reference</span><h2>{selected.id}</h2></div><span className={`booking-status booking-status-${selected.status}`}>{selected.status}</span></div><dl className="booking-detail-grid">{Object.entries({ Name: selected.fullName, Company: selected.company, Email: selected.email, WhatsApp: selected.whatsapp, Country: selected.country, Industry: selected.industry, 'Company Size': selected.companySize, 'Service Interest': selected.serviceInterest, Package: selected.interestedPackage, 'Preferred Date': selected.preferredDate, 'Preferred Time': selected.preferredTime, 'Time Zone': selected.timeZone, Source: selected.source, 'Created Time': new Date(selected.createdAt).toLocaleString(), Notes: selected.additionalNotes }).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || '—'}</dd></div>)}</dl><div className="booking-review-actions"><label>Update status<select value={selected.status} onChange={(event) => changeStatus(event.target.value)}>{bookingStatuses.map((item) => <option key={item}>{item}</option>)}</select></label><button type="button" className="booking-danger" onClick={remove}>Delete Booking</button></div></section> : <section className="booking-review-list"><div className="booking-review-toolbar"><h2>Booking requests</h2><div><label><span className="booking-visually-hidden">Search bookings</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, company..." /></label><label><span className="booking-visually-hidden">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{bookingStatuses.map((item) => <option key={item}>{item}</option>)}</select></label></div></div>{visible.length ? <div className="booking-table-wrap"><table className="booking-table"><thead><tr><th>Created Time</th><th>Name</th><th>Company</th><th>Country</th><th>Service Interest</th><th>Preferred Date</th><th>Preferred Time</th><th>Time Zone</th><th>Status</th><th>Source</th><th><span className="booking-visually-hidden">View</span></th></tr></thead><tbody>{visible.map((item) => <tr key={item.id} onClick={() => setSelectedId(item.id)}><td>{new Date(item.createdAt).toLocaleString()}</td><td><strong>{item.fullName || 'Unnamed'}</strong><small>{item.email}</small></td><td>{item.company || '—'}</td><td>{item.country || '—'}</td><td>{item.serviceInterest || '—'}</td><td>{item.preferredDate || '—'}</td><td>{item.preferredTime || '—'}</td><td>{item.timeZone || '—'}</td><td><span className={`booking-status booking-status-${item.status}`}>{item.status}</span></td><td>{item.source}</td><td><button type="button" aria-label={`View booking for ${item.fullName || item.id}`} onClick={(event) => { event.stopPropagation(); setSelectedId(item.id) }}>View ↗</button></td></tr>)}</tbody></table></div> : <div className="booking-review-empty"><span>01</span><h2>No booking requests yet.</h2><p>Submit a Strategy Call request to see it in this local review workspace.</p><a className="button-dark" href="/booking/">Open Booking Page ↗</a></div>}</section>}</main></div>
}
