import { useEffect, useRef, useState } from 'react'
import BrandLogo from '../BrandLogo.jsx'
import { saveProposalPrefill } from '../../services/aiSalesAgentProposal.js'
import { trackAssessmentEvent } from '../../lib/analytics.js'
import { useSalesConversation } from '../../hooks/useSalesConversation.js'
import MessageBubble from './MessageBubble.jsx'
import LeadCapturePanel from './LeadCapturePanel.jsx'
import ServiceRecommendationCard from './ServiceRecommendationCard.jsx'

function AiSalesAgentWidget() {
  const { conversation, lead, isLoading, error, sendMessage, submitLead, createProposalPayload, goBack, reset, bookingHref } = useSalesConversation()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState('')
  const messageEndRef = useRef(null)
  const hasLead = Boolean(lead.id || conversation.leadId)
  const showLeadCapture = conversation.currentStage === 'lead-capture' && !hasLead
  const showRecommendations = conversation.recommendations?.length > 0
  const showCtas = hasLead || conversation.currentStage === 'cta' || conversation.currentStage === 'recommendation'

  useEffect(() => {
    if (isOpen && !isMinimized) messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [conversation.messages.length, isLoading, isOpen, isMinimized])

  useEffect(() => {
    const handleOpenRequest = () => openWidget()
    window.addEventListener('novahaus:open-ai-sales', handleOpenRequest)
    return () => window.removeEventListener('novahaus:open-ai-sales', handleOpenRequest)
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  const handleProposal = () => {
    if (!hasLead) {
      sendMessage('Generate an Initial Proposal')
      return
    }
    const payload = createProposalPayload()
    saveProposalPrefill(payload)
    trackAssessmentEvent('sales_agent_proposal_prefill_created', { conversationId: payload.conversationId })
    window.location.assign('/proposal-builder/')
  }

  const handleReset = () => {
    if (window.confirm('Reset this conversation and clear its locally stored lead data?')) reset()
  }

  const openWidget = () => {
    setIsOpen(true)
    setIsMinimized(false)
  }

  return <div className="ai-sales-widget">
    {isOpen && isMinimized && <div className="ai-sales-widget-minimized" role="status"><span><strong>NOVAHAUS AI</strong><small>Conversation saved locally</small></span><button type="button" onClick={() => setIsMinimized(false)}>Open</button></div>}
    {isOpen && !isMinimized && <section id="novahaus-ai-sales-widget-panel" className="ai-sales-widget-panel" role="dialog" aria-label="NOVAHAUS Growth Consultant">
      <header className="ai-sales-widget-header"><div className="ai-sales-widget-heading"><BrandLogo className="ai-sales-widget-logo" /><span><strong>NOVAHAUS</strong><small>Growth Consultant</small></span></div><div className="ai-sales-widget-controls"><button type="button" aria-label="Minimize NOVAHAUS Growth Consultant" onClick={() => setIsMinimized(true)}>−</button><button type="button" aria-label="Close NOVAHAUS Growth Consultant" onClick={() => setIsOpen(false)}>×</button></div></header>
      <div className="ai-sales-widget-scroll"><div className="sales-agent-message-list" aria-live="polite">{conversation.messages.map((message) => <MessageBubble key={message.id} message={message} />)}{isLoading && <div className="sales-agent-message-row is-agent"><div className="sales-agent-message-bubble sales-agent-loading" role="status"><span /><span /><span /></div></div>}{error && <div className="sales-agent-error" role="alert">{error}</div>}<div ref={messageEndRef} /></div>{!showLeadCapture && conversation.quickReplies?.length > 0 && <div className="sales-agent-quick-replies" aria-label="Suggested replies">{conversation.quickReplies.map((reply) => <button type="button" key={reply} onClick={() => sendMessage(reply)} disabled={isLoading}>{reply}</button>)}</div>}{showLeadCapture && <LeadCapturePanel onSubmit={submitLead} disabled={isLoading} />}{showRecommendations && <div className="sales-agent-recommendations">{conversation.recommendations.map((recommendation) => <ServiceRecommendationCard key={recommendation.serviceId} recommendation={recommendation} />)}</div>}{showCtas && <div className="sales-agent-cta-row"><a href={bookingHref} className="sales-agent-button sales-agent-button-gold" onClick={() => trackAssessmentEvent('sales_agent_strategy_call_clicked', { conversationId: conversation.id })}>Book Strategy Call <span aria-hidden="true">↗</span></a><button type="button" className="sales-agent-button" onClick={handleProposal}>Generate Initial Proposal <span aria-hidden="true">↗</span></button><a href="/#contact" className="sales-agent-button" onClick={() => trackAssessmentEvent('sales_agent_contact_clicked', { conversationId: conversation.id })}>Contact Us <span aria-hidden="true">↗</span></a></div>}</div>
      <form className="sales-agent-composer" onSubmit={handleSubmit}><label className="sales-agent-sr-only" htmlFor="sales-agent-widget-message">Message NOVAHAUS AI</label><input id="sales-agent-widget-message" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tell us what you are working on..." disabled={isLoading || showLeadCapture} /><button type="submit" aria-label="Send message" disabled={isLoading || showLeadCapture || !input.trim()}>Send <span aria-hidden="true">↗</span></button></form>
      <div className="ai-sales-widget-footer"><span>Step {conversation.progress?.current || 1} of {conversation.progress?.total || 7} · Saved locally</span><div>{conversation.history?.length > 0 && <button type="button" onClick={goBack}>Back</button>}<button type="button" onClick={handleReset}>Reset</button></div></div>
    </section>}
    {(!isOpen || isMinimized) && <button type="button" className={`ai-sales-widget-trigger ${isOpen ? 'is-open' : ''}`} aria-expanded={isOpen && !isMinimized} aria-controls="novahaus-ai-sales-widget-panel" onClick={isOpen && !isMinimized ? () => setIsOpen(false) : openWidget}><BrandLogo className="ai-sales-widget-trigger-logo" /><span><strong>NOVAHAUS AI</strong><small>{isOpen ? 'Open conversation' : 'Start a conversation'}</small></span><i aria-hidden="true">↗</i></button>}
  </div>
}

export default AiSalesAgentWidget
