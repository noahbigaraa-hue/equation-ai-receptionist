# Production safety invariants

These rules protect the proven working configuration.

- Workflow 6 is the **only** calendar writer in the live call path.
- Do not connect or invoke Workflow 1's retained older embedded subworkflow-trigger groups; they are outside the live Retell webhook route.
- Workflow 2 handles follow-up only; its calendar node remains deactivated.
- Never send a booking-confirmation SMS unless `booking_succeeded` and `sms_consent_granted` are exactly true, `call_id` and a valid caller number exist, and that call ID has not already claimed an SMS attempt.
- SMS consent must be asked once only after booking succeeds. Booking, possession of a phone number, silence, or ambiguity is not consent.
- Keep consent evidence scoped to the completed call: call ID, caller number, state, timestamp, appointment start, `voice_call` source, and transcript/extraction evidence.
- Do not publish the SMS-enabled Retell/n8n drafts or send another real test until the A2P sender is approved and associated with its campaign.
- Do not edit, resubmit, replace, or duplicate a Twilio Primary Customer Profile while it is pending review.
- Do not create an A2P Brand or Campaign, accept legal attestations, incur fees, or attach the sender without the user's explicit approval.
- Do not implement duplicate STOP/HELP replies in n8n when Twilio's long-code keyword handling is active.
- Never pin the live phone number to an old Retell version.
- Use **Latest Published** unless intentionally conducting an isolated test.
- Never confirm a booking before `book_appointment_cal` returns success.
- Reject invalid or past appointment starts in both Retell and n8n before any calendar write.
- Workflow 6's calendar node must stop the workflow on an error; it must never continue into a success response.
- Never use Knowledge Base Retrieval for calendar availability.
- Keep scheduling logic in `America/New_York`.
- Consultations are exactly 30 minutes.
- Workflow 5 returns three alternatives from one request; the agent must not recheck a returned alternative.
- Retell webhook payloads may place tool inputs inside `body.args`; direct payload compatibility must also remain.
- Duplicate booking requests must be idempotent.
- The deterministic event ID continues to use Retell call identity plus appointment start.
- The platform Welcome Message is the only greeting; the LLM must not introduce itself again.
- Do not invoke `end_call` while availability or booking is pending.
- Do not attach or claim a live transfer until the destination is independently verified; use message-taking meanwhile.
- Do not create or commit pinned execution data, credentials, environment files, tokens, cookies, or session exports.
- Validate changes in simulation before publishing, then confirm live-phone behavior with one controlled inbound call.
