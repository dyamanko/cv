/** which part of the retry loop is working right now; null shows the whole loop */
export type IncidentPhase = 'failed' | 'retry' | 'resolved' | 'escalated' | 'limit' | null

/** integration flows the events case can light up */
export type FlowId = 'notify' | 'courier' | 'search' | 'idea'
