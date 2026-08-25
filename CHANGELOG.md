# Changelog

## Unreleased — The System V.1.1 controlled refinement

- Created Retell V17 draft titled `The System V.1.1` from V16 without publishing it or changing the inbound phone assignment.
- Replaced the greeting with the approved Wondora Brands wording and strengthened barge-in priority, concise booking confirmation, and Won-Dor-Ah pronunciation guidance.
- Kept Cimo, speed 1.12, temperature 1.0, volume 1.0, response eagerness 1.0, interruption sensitivity 0.9, fast transcription, denoising, and no background audio.
- Added the `Wondora` boosted keyword; Cimo still does not support Retell pronunciation dictionaries.
- Added Workflow 1 call start/end, duration, stable Retell recording URL, booking-completion timestamp, and Client View link mappings.
- Added a fail-closed post-call enrichment path from Workflow 1 into Workflow 6; Workflow 6 remains the only calendar writer.
- Added clean booking-time notes at calendar creation and final duration, summary, Client View, and recording details after `call_analyzed`.
- Added the non-destructive Google Sheets `Client View` tab and six additive raw Call Log metadata columns.
- Added a 20-scenario structural regression suite while preserving the existing SMS eligibility and deduplication tests.
- Preserved the immutable `the-system-v1` tag and did not create a V1.1 tag or release.

## The System V.1 — production snapshot — 2026-08-25

- Captured sanitized exports of all six active/published production n8n workflows with exact workflow and version IDs.
- Captured the live Retell V16 draft prompt and voice/settings inventory without changing production.
- Recorded that `+1 239 299 7352` was explicitly pinned to V16 Draft while V15 remained the latest published Retell version.
- Documented the pre-refinement Google Sheets schema and the latest confirmed real Google Calendar event format.
- Added SHA-256 checksums and retained all prior unpublished SMS/A2P preparation outside the immutable snapshot directory.

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
