# Production safety invariants

These rules protect the proven working configuration.

- Workflow 6 is the **only** calendar writer in the live call path.
- Do not connect or invoke Workflow 1's retained older embedded subworkflow-trigger groups; they are outside the live Retell webhook route.
- Workflow 2 handles follow-up only; its calendar node remains deactivated.
- Never pin the live phone number to an old Retell version.
- Use **Latest Published** unless intentionally conducting an isolated test.
- Never confirm a booking before `book_appointment_cal` returns success.
- Never use Knowledge Base Retrieval for calendar availability.
- Keep scheduling logic in `America/New_York`.
- Consultations are exactly 30 minutes.
- Workflow 5 returns three alternatives from one request; the agent must not recheck a returned alternative.
- Retell webhook payloads may place tool inputs inside `body.args`; direct payload compatibility must also remain.
- Duplicate booking requests must be idempotent.
- The deterministic event ID continues to use Retell call identity plus appointment start.
- The platform Welcome Message is the only greeting; the LLM must not introduce itself again.
- Do not invoke `end_call` while availability or booking is pending.
- Do not create or commit pinned execution data, credentials, environment files, tokens, cookies, or session exports.
- Validate changes in simulation before publishing, then confirm live-phone behavior with one controlled inbound call.
