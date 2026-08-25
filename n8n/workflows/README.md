# n8n production exports

These are the six workflows from the production n8n project plus prepared, unpublished compliance refinements on the current branch. Workflow IDs, credential references, and the established calendar architecture are preserved.

For repository safety, all `pinData` and n8n instance `meta` blocks were removed. Those fields are not required to import the workflows. One pinned sample contained a live Retell call access token, so no pinned execution samples are retained.

Credential names and n8n credential IDs remain as safe references; credential values are never part of an n8n workflow export.

## Workflow 1 snapshot note

The exact Workflow 1 export contains older embedded error, booking, and message trigger groups on the same canvas. They are not connected to the live `Retell Webhook` route. The live route calls the separate Workflow 2 and Workflow 3 workflows.

Do not connect or invoke the embedded `When Called by Main Router` calendar branch. Workflow 6 is the only calendar writer in the proven live path.

## Prepared SMS compliance draft

Workflow 1 maps `booking_succeeded`, `sms_consent_granted`, `sms_consent_evidence`, the call-end timestamp, and the `voice_call` source from the final Retell analysis payload.

Workflow 2's prepared draft:

- requires exact booking success and explicit consent;
- requires a call ID, valid E.164 caller phone, and valid appointment start;
- atomically claims the call ID in workflow static data before the Twilio branch;
- sends the approved transactional copy in `America/New_York`;
- stores structured, call-scoped consent evidence through the existing Bookings sheet `message` field;
- skips false/missing consent and malformed inputs without failing; and
- keeps its Google Calendar node disabled.

The test harness at `../tests/workflow-02-sms-gating.test.mjs` executes the Code node embedded in the export. These refinements must not be published until Retell V16 simulation passes and A2P enablement is approved.

## The System V.1.1 enrichment draft

Workflow 1 adds these raw Call Log fields without changing existing columns:

- `call_started_at`
- `call_ended_at`
- `call_duration_seconds`
- `recording_url`
- `booking_created_at`
- `call_summary_link`

After the final `call_analyzed` event is deduplicated and logged, a separate branch calls Workflow 6 only when `booking_succeeded` is exactly true and both `call_id` and `appointment_start` exist. Errors on this optional enrichment branch do not block the established Workflow 2/3 follow-up route.

Workflow 6 retains the original webhook-to-create-to-response booking path. Its additional execute-workflow trigger validates the post-call payload, derives the same deterministic event ID used at creation, retrieves the event, and appends final call duration, summary, Client View, and the real Retell `recording_url`. This design keeps Workflow 6 as the sole calendar writer.

Run both release checks before any import or publish:

```bash
node n8n/tests/workflow-02-sms-gating.test.mjs
node n8n/tests/system-v1.1-refinement.test.mjs
```
