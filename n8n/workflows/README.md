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
