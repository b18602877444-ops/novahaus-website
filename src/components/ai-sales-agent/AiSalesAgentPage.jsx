import { useEffect, useRef, useState } from 'react'
import BrandLogo from '../BrandLogo.jsx'
import { saveProposalPrefill } from '../../services/aiSalesAgentProposal.js'
import { trackAssessmentEvent } from '../../lib/analytics.js'
import { useSalesConversation } from '../../hooks/useSalesConversation.js'
import MessageBubble from './MessageBubble.jsx'
import LeadCapturePanel from './LeadCapturePanel.jsx'
import ServiceRecommendationCard from './ServiceRecommendationCard.jsx'

function LeadTemperature({ qualification }) {
  return <div className={`sales-agent-temperature ${qualification.temperature.toLowerCase().replace(' ', '-')}`}><span>Lead temperature</span><strong>{qualification.temperature}</strong><small>{qualification.score}/100 · {qualification.breakdown.length} signal{qualification.breakdown.length === 1 ? '' : 's'}</small></div>
}

function AiSalesAgentPage() {
  const { conversation, lead, isLoading, error, sendMessage, submitLead, createProposalPayload, reset, budgetOptions, industryOptions, timelineOptions } = useSalesConversation()
  const [input, setInput] = useState('')
  const messageEndRef = useRef(null)
  const hasLead = Boolean(lead.id || conversation.leadId)
  const showLeadCapture = conversation.currentStage === 'lead-capture' && !hasLead
  const showRecommendations = conversation.recommendations?.length > 0
  const showCtas = hasLead || conversation.currentStage === 'cta' || conversation.currentStage === 'recommendation'

  useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }, [conversation.messages.length, isLoading])

  const handleSubmit = (event) => { event.preventDefault(); if (!input.trim()) return; sendMessage(input); setInput('') }
  const handleProposal = () => { const payload = createProposalPayload(); saveProposalPrefill(payload); trackAssessmentEvent('sales_agent_proposal_prefill_created', { conversationId: payload.conversationId }); window.location.assign('/proposal-builder/') }
  const handleReset = () => { if (window.confirm('Reset this conversation and clear its locally stored lead data?')) reset() }

  return <div className="sales-agent-page"><header className="sales-agent-header"><a href="/" aria-label="NOVAHAUS home"><BrandLogo className="sales-agent-logo" /></a><div><span>NOVAHAUS AI Sales Agent</span><small>Guided consultation · Local session</small></div><button type="button" className="sales-agent-reset" onClick={handleReset}>Reset conversation</button></header><main className="sales-agent-main">
    <section className="sales-agent-intro"><span className="sales-agent-eyebrow">AI SALES AGENT / V1.0</span><h1>Turn the next<br /><em>conversation into clarity.</em></h1><p>A guided, consultative conversation for businesses exploring brand, digital systems and AI automation.</p><div className="sales-agent-flow"><span>Build Trust</span><i>→</i><span>Understand</span><i>→</i><span>Qualify</span><i>→</i><span>Recommend</span></div></section>
    <section className="sales-agent-workspace" aria-label="NOVAHAUS AI Sales Agent"><aside className="sales-agent-context"><span className="sales-agent-eyebrow">Conversation state</span><h2>{hasLead ? 'A clearer next step.' : 'Start with the business.'}</h2><p>{hasLead ? 'Your context has been saved locally and the next actions are ready.' : 'Share the business problem in your own words. The agent will ask only for the context it needs.'}</p><LeadTemperature qualification={conversation.qualification} />{showRecommendations && <div className="sales-agent-sidebar-recommendations"><span>Recommended paths</span>{conversation.recommendations.map((recommendation) => <strong key={recommendation.serviceId}>{recommendation.title}</strong>)}</div>}<p className="sales-agent-privacy">Your conversation stays in this browser. External AI, CRM and email connections can be added when the workflow is ready.</p></aside>
      <div className="sales-agent-chat-card"><div className="sales-agent-chat-header"><div><span>Conversation</span><strong>{conversation.currentStage.replace('-', ' ')}</strong></div><span className="sales-agent-live-dot">Local session</span></div><div className="sales-agent-message-list" aria-live="polite">{conversation.messages.map((message) => <MessageBubble key={message.id} message={message} />)}{isLoading && <div className="sales-agent-message-row is-agent"><div className="sales-agent-message-bubble sales-agent-loading" role="status"><span /><span /><span /></div></div>}{error && <div className="sales-agent-error" role="alert">{error}</div>}<div ref={messageEndRef} /></div>{!showLeadCapture && conversation.quickReplies?.length > 0 && <div className="sales-agent-quick-replies" aria-label="Suggested replies">{conversation.quickReplies.map((reply) => <button type="button" key={reply} onClick={() => sendMessage(reply)} disabled={isLoading}>{reply}</button>)}</div>}{showLeadCapture && <LeadCapturePanel onSubmit={submitLead} industryOptions={industryOptions} budgetOptions={budgetOptions} timelineOptions={timelineOptions} disabled={isLoading} />}{showRecommendations && <div className="sales-agent-recommendations">{conversation.recommendations.map((recommendation) => <ServiceRecommendationCard key={recommendation.serviceId} recommendation={recommendation} />)}</div>}{showCtas && <div className="sales-agent-cta-row"><a href="/strategy/" className="sales-agent-button sales-agent-button-gold" onClick={() => trackAssessmentEvent('sales_agent_strategy_call_clicked', { conversationId: conversation.id })}>Book Strategy Call <span aria-hidden="true">↗</span></a><button type="button" className="sales-agent-button" onClick={handleProposal}>Prepare a Proposal <span aria-hidden="true">↗</span></button><a href="/#contact" className="sales-agent-button" onClick={() => trackAssessmentEvent('sales_agent_contact_clicked', { conversationId: conversation.id })}>Contact Us <span aria-hidden="true">↗</span></a></div>}<form className="sales-agent-composer" onSubmit={handleSubmit}><label className="sales-agent-sr-only" htmlFor="sales-agent-message">Message NOVAHAUS AI Sales Agent</label><input id="sales-agent-message" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tell us what you are working on..." disabled={isLoading || showLeadCapture} /><button type="submit" aria-label="Send message" disabled={isLoading || showLeadCapture || !input.trim()}>Send <span aria-hidden="true">↗</span></button></form></div>
    </section>
  </main></div>
}

export default AiSalesAgentPage
