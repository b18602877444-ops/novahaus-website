import { useMemo, useState } from 'react'
import { roiAssumptions, roiCompanySizes, roiDefaults, roiIndustries } from '../data/roiCalculator.js'
import { calculateRoiScenario } from '../utils/roiCalculator.js'

function ValueLabel({ children, number }) {
  return <p className="section-label"><span className="section-label-line" />{number && <span>{number}</span>}<span>{children}</span></p>
}

function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value)
}

function formatValue(value) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(Math.max(0, value))
}

function RoiCalculatorPage({ InternalPage }) {
  const [form, setForm] = useState(roiDefaults)
  const [submittedForm, setSubmittedForm] = useState(roiDefaults)
  const results = useMemo(() => calculateRoiScenario(submittedForm), [submittedForm])

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmittedForm({ ...form })
  }

  return <InternalPage eyebrow="NOVAHAUS / ROI Calculator" title={<>See where growth<br /><em>could compound.</em></>} description="Model the time, response and conversion opportunity that a more connected digital growth system may create for your business."><section className="roi-calculator-content" aria-label="NOVAHAUS AI ROI Calculator">
    <section className="roi-intro-panel"><div><ValueLabel number="01">Planning tool</ValueLabel><h2>Make the opportunity<br /><em>easier to see.</em></h2><p>Use your current operating context to create a directional scenario. The calculator uses local assumptions only; it is not a financial forecast, guarantee or investment recommendation.</p></div><div className="roi-intro-signal"><span>Model type</span><strong>Scenario</strong><small>Local calculation / no API</small></div></section>
    <section className="roi-workspace" aria-labelledby="roi-input-title"><div className="roi-input-panel"><ValueLabel number="02">Your inputs</ValueLabel><h2 id="roi-input-title">Tell us how the<br /><em>business runs today.</em></h2><form className="roi-form" onSubmit={handleSubmit}><label>Industry<select value={form.industry} onChange={(event) => updateField('industry', event.target.value)}>{roiIndustries.map((industry) => <option key={industry}>{industry}</option>)}</select></label><label>Company size<select value={form.companySize} onChange={(event) => updateField('companySize', event.target.value)}>{roiCompanySizes.map((size) => <option value={size.value} key={size.value}>{size.label}</option>)}</select></label><label>Monthly leads<input type="number" min="0" step="1" value={form.monthlyLeads} onChange={(event) => updateField('monthlyLeads', event.target.value)} /></label><label>Sales team size<input type="number" min="1" step="1" value={form.salesTeamSize} onChange={(event) => updateField('salesTeamSize', event.target.value)} /></label><label>Average conversion rate (%)<input type="number" min="0" max="100" step="0.1" value={form.conversionRate} onChange={(event) => updateField('conversionRate', event.target.value)} /></label><label>Average deal value (your currency)<input type="number" min="0" step="1" value={form.averageDealValue} onChange={(event) => updateField('averageDealValue', event.target.value)} /></label><button className="button-dark roi-submit-button" type="submit">Calculate My Scenario <span aria-hidden="true">↗</span></button></form></div><div className="roi-results-panel" aria-live="polite"><ValueLabel number="03">Estimated outputs</ValueLabel><h2>A directional view<br /><em>of the upside.</em></h2><div className="roi-result-grid"><article><span>Estimated time saved</span><strong>{formatNumber(results.timeSavedHours, 1)}<small> hrs / month</small></strong><p>Potential administrative time supported by a more connected lead process.</p></article><article><span>Lead response improvement</span><strong>{results.responseImprovement}<small>% modeled</small></strong><p>Estimated share of response work that could be supported by automation.</p></article><article><span>Conversion opportunity</span><strong>{formatNumber(results.conversionOpportunity, 1)}<small> leads / month</small></strong><p>Scenario-based additional opportunities using a modeled {formatNumber(results.conversionLiftPoints, 1)} percentage-point lift.</p></article><article><span>Revenue opportunity</span><strong>{formatValue(results.revenueOpportunity)}<small> input currency</small></strong><p>Illustrative value of the modeled conversion opportunity at your stated deal value.</p></article></div><div className="roi-recommendation"><span>Recommended NOVAHAUS package</span><h3>{results.recommendedPackage}</h3><p>{results.recommendedPackage === 'Launch' ? 'Start with positioning, a clearer digital presence and the first practical AI growth entry points.' : results.recommendedPackage === 'Growth' ? 'Connect lead journeys, qualification, CRM-ready workflows and optimisation around active demand.' : 'Plan a coordinated system across markets, integrations, governance and custom operating workflows.'}</p><a href={`/booking/?source=roi-calculator&package=${results.recommendedPackage.toLowerCase()}`} className="roi-result-link">Discuss this scenario <span aria-hidden="true">↗</span></a></div></div></section>
    <section className="roi-assumptions"><ValueLabel number="04">Read the estimate responsibly</ValueLabel><h2>Useful for planning.<br /><em>Not a promise.</em></h2><div className="roi-assumption-grid"><article><span>01</span><h3>Time model</h3><p>Uses an illustrative {roiAssumptions.minutesPerLead}-minute administrative effort per lead and a modeled automation coverage rate.</p></article><article><span>02</span><h3>Conversion model</h3><p>Uses a conservative scenario lift capped at five percentage points. Actual outcomes depend on market, offer, journey and execution.</p></article><article><span>03</span><h3>Revenue model</h3><p>Multiplies the modeled conversion opportunity by the deal value you entered. It is not a revenue forecast or guarantee.</p></article></div><p className="roi-disclaimer">This calculator provides estimates for discussion only. Validate the assumptions with your own data before making operational, financial or investment decisions.</p></section><section className="roi-final-cta"><ValueLabel number="05">Next step</ValueLabel><h2>Turn the scenario<br /><em>into a strategy.</em></h2><p>Bring the assumptions to a focused conversation and decide what is worth testing first.</p><a href="/booking/?source=roi-calculator" className="button-dark">Book a Strategy Call <span aria-hidden="true">↗</span></a></section>
  </section></InternalPage>
}

export default RoiCalculatorPage
