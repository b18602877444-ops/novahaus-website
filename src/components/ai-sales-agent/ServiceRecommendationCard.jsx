function ServiceRecommendationCard({ recommendation }) {
  return <article className="sales-agent-recommendation-card"><div><span>Recommended path · {String(recommendation.priority).padStart(2, '0')}</span><h3>{recommendation.title}</h3></div><p>{recommendation.reason}</p><a href={recommendation.ctaTarget} className="sales-agent-inline-link">{recommendation.ctaLabel} <span aria-hidden="true">↗</span></a></article>
}

export default ServiceRecommendationCard
