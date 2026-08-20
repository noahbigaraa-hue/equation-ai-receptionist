# Retell webhook settings

## Agent-level webhook

- URL: `https://equation-us.app.n8n.cloud/webhook/retell-call-intake`
- Timeout: 5 seconds

Enabled events:

- Call started
- Call ended
- Call analyzed

Disabled events:

- Transcript updated
- Transfer started
- Transfer bridged
- Transfer cancelled
- Transfer ended

Workflow 1 ignores everything except the final `call_analyzed` event for routing and post-call processing. It also blocks duplicate webhook retries.

## Function webhooks

- Availability: `POST https://equation-us.app.n8n.cloud/webhook/check-availability`
- Booking: `POST https://equation-us.app.n8n.cloud/webhook/book-appointment`

No secret headers or query parameters were shown in the current function configuration. If authentication is added later, store it in Retell/n8n secret facilities and never commit it here.
