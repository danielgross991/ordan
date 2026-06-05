import { v4 as uuidv4 } from 'uuid'
import { getSql } from './client'

export type EventType =
  | 'view'
  | 'card_click'
  | 'phone_click'
  | 'wa_click'
  | 'website_click'
  | 'email_click'
  | 'save'
  | 'unsave'

export interface SupplierEventCounts {
  totalViews: number
  totalCardClicks: number
  totalPhoneClicks: number
  totalWaClicks: number
  totalWebsiteClicks: number
  totalSaves: number
}

export async function trackEvent({
  supplierId,
  userId,
  eventType,
  sessionId,
}: {
  supplierId: string
  userId?: string | null
  eventType: EventType
  sessionId?: string | null
}): Promise<void> {
  const sql = getSql()
  if (!sql) return
  const id = uuidv4()
  await sql`
    INSERT INTO supplier_events (id, supplier_id, user_id, event_type, session_id)
    VALUES (${id}, ${supplierId}, ${userId ?? null}, ${eventType}, ${sessionId ?? null})
  `
}

export async function getSupplierEventCounts(supplierId: string): Promise<SupplierEventCounts> {
  const sql = getSql()
  if (!sql) {
    return { totalViews: 0, totalCardClicks: 0, totalPhoneClicks: 0, totalWaClicks: 0, totalWebsiteClicks: 0, totalSaves: 0 }
  }
  const rows = await sql`
    SELECT
      COUNT(*) FILTER (WHERE event_type = 'view')         AS total_views,
      COUNT(*) FILTER (WHERE event_type = 'card_click')   AS total_card_clicks,
      COUNT(*) FILTER (WHERE event_type = 'phone_click')  AS total_phone_clicks,
      COUNT(*) FILTER (WHERE event_type = 'wa_click')     AS total_wa_clicks,
      COUNT(*) FILTER (WHERE event_type = 'website_click') AS total_website_clicks,
      COUNT(*) FILTER (WHERE event_type = 'save')         AS total_saves
    FROM supplier_events
    WHERE supplier_id = ${supplierId}
  `
  const r = rows[0] ?? {}
  return {
    totalViews: Number(r.total_views ?? 0),
    totalCardClicks: Number(r.total_card_clicks ?? 0),
    totalPhoneClicks: Number(r.total_phone_clicks ?? 0),
    totalWaClicks: Number(r.total_wa_clicks ?? 0),
    totalWebsiteClicks: Number(r.total_website_clicks ?? 0),
    totalSaves: Number(r.total_saves ?? 0),
  }
}
