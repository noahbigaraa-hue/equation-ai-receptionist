# Changelog

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
