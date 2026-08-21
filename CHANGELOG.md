# Changelog

## Unreleased — SMS consent and A2P preparation

- Created Retell V16 as an unpublished draft from the published V15 production version.
- Added a one-time, post-booking SMS consent question and deterministic post-call extraction for booking success, explicit consent, and consent evidence.
- Prepared Workflow 1 mappings and Workflow 2 booking-success, phone, consent, call-ID, and duplicate-attempt gates without changing calendar ownership.
- Added compliant Eastern-time transactional copy and carrier-independent Workflow 2 tests.
- Added `docs/SMS-COMPLIANCE.md` with the pending Primary Profile status, A2P Brand/Campaign fields, Messaging Service plan, STOP/HELP behavior, fees, and user approvals.
- Prepared Wondora Brands Privacy Policy and SMS Terms pages and footer links; public deployment remains separately verified before A2P submission.
- Did not create or submit an A2P Brand/Campaign, accept fees or attestations, alter the pending Primary Customer Profile, or publish Retell/n8n drafts.

## V15 — Human Conversation and Scheduling Safety — 2026-08-20

- Consolidated the Retell handbook and removed stale transfer, duplicated greeting, and contradictory closing rules.
- Added concise conversation, memory, correction, and interruption guidance.
- Added future-only scheduling guards to Retell and n8n Workflows 5 and 6.
- Made Workflow 6 fail closed so a rejected calendar write cannot reach its success response.
- Detached the stale `Wonder` Knowledge Base from draft V15.
- Kept live transfer disabled and added message-taking as the fallback.
- Selected no background sound after draft A/B testing; Cimo, speed 1.12, and interruption sensitivity 0.9 remain unchanged.
- Published the approved Retell V15 and n8n Workflow 5/6 safety refinements after simulation.
- Verified the real inbound booking path; the later SMS attempt reached Twilio but carrier delivery was blocked by A2P error 30034.

## v1.0.0-working-receptionist — 2026-08-19

Working production baseline:

- Migrated the current receptionist to the Retell + n8n architecture.
- Changed the phone number assignment from pinned V4 to Latest Published.
- Attached the calendar functions to the published Retell agent.
- Restored the agent-level webhook and post-call events.
- Repaired Workflow 5 Retell argument mapping.
- Repaired Workflow 6 nested `body.args` mapping.
- Removed the duplicate calendar writer from Workflow 2.
- Made Workflow 6 the sole calendar writer.
- Added a deterministic event ID and idempotency protection.
- Added nearby availability alternatives to Workflow 5.
- Added Eastern-time event descriptions.
- Fixed the duplicate greeting.
- Removed the stale “Ben” greeting.
- Established Isabella's single platform Welcome Message.
- Increased speech speed to 1.12 without changing the Cimo voice.
- Simplified the booking conversation and post-booking close.
- Successfully validated the booking path with a real inbound call.
