# The System V.1

Read-only production snapshot captured on August 25, 2026 before the V1.1 refinement.

## Retell production state

- Agent: `Wondora V2` (`agent_15c666cc5c17c66cf48de2c710`)
- Latest published version: `V15 — Human Conversation and Scheduling Safety`
- Live inbound selection: `V16 (Draft)` selected explicitly for `+1 239 299 7352`
- Voice: Cimo (`fish_audio-Cimo`)
- Voice model: Auto (S2.1 Pro)
- Speed: `1.12`
- Temperature: `1.00`
- Volume: `1.00`
- Response eagerness: `1.0`; dynamic adjustment off
- Interruption sensitivity: `0.9`
- Background sound: None
- Denoising: Remove noise
- Transcription: Optimize for speed; General vocabulary
- Boosted keywords: empty
- Knowledge Base attachments: none
- Functions: `end_call`, `check_availability_cal`, `book_appointment_cal`
- Agent webhook: `https://equation-us.app.n8n.cloud/webhook/retell-call-intake`
- Webhook timeout: 5 seconds
- Webhook events: call started, call ended, and call analyzed
- Welcome message: `Howzit, thanks for calling Wondora. I'm Isabella, how can I help you today?`

The phone assignment is recorded exactly as observed. It was not changed while taking this snapshot.

## n8n production state

All six workflows were active/published when exported. `pinData` and instance `meta` were removed because they are not needed for restoration and may contain execution-specific data. Credential references remain; credential secrets are never present in exports.

| # | Workflow | Workflow ID | Published version label | Version ID |
|---|---|---|---|---|
| 1 | Main Call Router (Retell Intake) | `U1Z8EN0hyzATZ3Gf` | Wondora Brands V.1 | `353f1346-f9fd-4666-9666-f1fae4e1a346` |
| 2 | Booking | `njAV9xnSsJiREcFs` | V15 booking SMS follow-up | `de0bdea4-ba75-471e-906f-eb1df29151fd` |
| 3 | Message & Follow-Up | `hw3rdf9VcULfUr60` | 3 - Message & Follow-Up V.1 | `afb2d19b-5734-4cd8-bc5b-892bf3708009` |
| 4 | Error Handler | `i7lxxYMvVcEHMHdt` | 4 - Error Handler V.1 | `be341f41-9ede-4e34-b30f-535c0033ca3c` |
| 5 | Check Calendar Availability | `dKrtxs0EmMmVcVdy` | V15 scheduling safety | `220eee78-f03d-436e-907b-85f7620111ed` |
| 6 | Create Calendar Booking | `opQJxjO8mL9ehYY3` | V15 scheduling safety | `04e8183e-da16-4dfc-bdec-e96aa9959231` |

Workflow 6 is the only active calendar writer. Workflow 2's legacy Google Calendar node is deactivated.

## Integrations

- Google Sheet: `Wondora Brands AI Receptionist`
- Sheet tabs: Call Log, Bookings, Messages
- Calendar: `Equation Discovery Calls`
- Business timezone: `America/New_York`

See the integration notes in this directory for the exact pre-refinement schemas.

## Scope

This directory is the immutable baseline for the Git tag and GitHub release titled **The System V.1**. Files outside this snapshot may contain later unpublished preparation work and are not part of the production-state assertion.
