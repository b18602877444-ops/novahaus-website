function MessageBubble({ message }) {
  return <div className={`sales-agent-message-row ${message.role === 'user' ? 'is-user' : 'is-agent'}`}><div className="sales-agent-message-bubble"><p>{message.content}</p><time dateTime={message.timestamp}>{new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(message.timestamp))}</time></div></div>
}

export default MessageBubble
