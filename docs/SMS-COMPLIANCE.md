# SMS compliance and A2P 10DLC preparation

Status date: August 20, 2026

## Current status

- Twilio Primary Customer Profile: **Pending review**. Do not edit, replace, or resubmit it while Twilio is reviewing it.
- Authoritative legal business name: **WONDORA BRANDS**.
- Retell production: **Wondora V2, V15 — Human Conversation and Scheduling Safety**.
- Retell preparation: **V16 draft only**; it is not published.
- A2P Brand: not created.
- A2P Campaign: not created.
- Messaging Service: not created.
- Sender planned for the campaign: `+1 239 299 7352`.
- Carrier delivery remains blocked by Twilio error `30034` until the sender is registered and associated with an approved campaign.
- No fee, legal attestation, Brand, Campaign, or sender association has been submitted from this branch.

## Public website disclosures

Prepared pages:

- `https://wondorabrands.com/privacy.html`
- `https://wondorabrands.com/sms-terms.html`

Both pages are linked from the Wondora Brands footer in the prepared website build. They must resolve publicly before campaign submission. The privacy policy covers caller/contact data, appointment data, call records, consent evidence, operational service providers, retention, security, and the commitment not to sell or share mobile information for third-party marketing. The SMS terms describe the Wondora Brands Consultation Confirmation Text Program, voice-call opt-in, frequency, rates, STOP, HELP, support, carrier limitations, and the non-marketing scope.

## Consent flow

Retell V16 draft asks only after `book_appointment_cal` reports success:

> Would you like me to text the booking confirmation to the number you’re calling from? Message and data rates may apply.

Only a clear affirmative answer grants consent. Booking, possession of the caller's number, silence, or an ambiguous response does not. The prompt asks once, acknowledges briefly, then continues to the normal end-of-call check.

V16 draft post-call extraction fields:

- `booking_succeeded` — true only after confirmed tool success; false for a failed or incomplete attempt; empty if no booking was attempted.
- `sms_consent_granted` — true only after the explicit question receives a clear affirmative response; false only for a clear decline; otherwise empty.
- `sms_consent_evidence` — quote or close transcription of the consent question and response; otherwise empty.

Workflow 1 maps those fields from the final `call_analyzed` event and adds the call-end timestamp and `voice_call` source.

## Consent evidence and Workflow 2 gating

Workflow 2 retains consent evidence in the existing Bookings sheet `message` field as a structured JSON record. The record includes:

- `call_id`
- caller phone number
- consent granted state
- consent timestamp
- appointment start
- source (`voice_call`)
- extraction evidence
- prior message value
- eligibility result and skip reason

The SMS branch runs only when all of these are true:

1. `call_id` exists.
2. `booking_succeeded` is exactly `true`.
3. the caller phone is present and valid E.164.
4. `sms_consent_granted` is exactly `true`.
5. the appointment start is present and valid.
6. the call ID has not already claimed an SMS attempt.

Workflow 1 retains its `call_id` duplicate-event filter. Workflow 2 adds a call-scoped workflow-static-data claim immediately before branching to Twilio, then marks the claim submitted with the Twilio message SID after a successful API result. False or missing consent, failed bookings, malformed input, and duplicate call IDs skip cleanly. No new datastore is introduced.

Workflow 2's legacy Google Calendar node remains disabled. **Workflow 6 remains the only calendar writer.**

## Prepared transactional message copy

Production template:

> Wondora Brands: Your consultation is booked for [Day, Date] at [Time] Eastern. Reply STOP to unsubscribe.

A2P sample 1:

> Wondora Brands: Your consultation is booked for Friday, August 21 at 1:00 PM Eastern. Reply STOP to unsubscribe.

A2P sample 2:

> Wondora Brands: Your consultation booking is confirmed for Friday, August 21 at 1:00 PM Eastern. Reply HELP for help or STOP to unsubscribe.

Messages are transactional, contain no marketing, embedded links, or embedded phone numbers, and use `America/New_York` for formatting.

## A2P Brand preparation

Recommended path, subject to volume confirmation: **Direct Customer / Low-Volume Standard Brand**.

| Field | Prepared value |
|---|---|
| Legal business name | WONDORA BRANDS |
| Tax ID | User enters directly in Twilio; never store in this repository |
| Website | `https://wondorabrands.com` |
| Customer type | Direct Customer |
| Business type/entity type | Confirm from the approved Primary Customer Profile/state record |
| Industry | User confirmation required; do not guess |
| Business address | Reuse the approved Primary Customer Profile value exactly |
| Authorized representative | User must enter and personally attest |
| Registration number/state details | Reuse authoritative state record; user confirmation required |
| Expected volume | User must provide daily and monthly estimates |

Do not create the Brand until the Primary Customer Profile is approved and the user approves the fee and attestations.

## A2P Campaign preparation

- Campaign use case: **Low Volume Mixed (`LOW_VOLUME`)**, subject to the user's volume confirmation.
- Messaging category: transactional post-call consultation booking confirmations.
- Marketing: no.
- Age-gated content: no.
- Lending/financial content: no.
- Embedded links: no.
- Embedded phone numbers: no.
- Frequency: normally one confirmation per successfully booked consultation for which the caller expressly consented; STOP/HELP service responses may occur.

Campaign description:

> Wondora Brands sends a single transactional SMS confirmation to callers who successfully book a consultation by phone and expressly agree during the call to receive the confirmation. Messages contain the scheduled consultation date and Eastern Time. No marketing or promotional messages are sent.

Message flow/opt-in description:

> A caller phones Wondora Brands and completes a consultation booking. Only after the booking tool reports success, the AI receptionist asks: “Would you like me to text the booking confirmation to the number you’re calling from? Message and data rates may apply.” Only a clear affirmative answer grants consent. The completed call's ID, caller number, appointment time, consent state, call-end timestamp, voice-call source, and consent evidence are retained. The final post-call event is deduplicated by call ID and triggers at most one confirmation. No text is sent for availability-only calls, failed or incomplete bookings, a decline, or missing/ambiguous consent.

Opt-out handling: standard Twilio long-code STOP filtering blocks subsequent messages and sends Twilio's standard confirmation. Do not send a second application response.

HELP handling: Twilio's standard long-code keyword response is sufficient for launch. If custom wording is later required, configure Advanced Opt-Out on the Messaging Service before enabling it; do not add a duplicate n8n response.

## Messaging Service plan

Planned name: **Wondora Brands – Booking Confirmations**

Planned sender: `+1 239 299 7352`

Configuration after approvals:

1. Create the Messaging Service for transactional notifications.
2. Keep inbound handling set to **Defer to sender's webhook** unless a verified SMS-specific webhook is intentionally introduced.
3. Add the SMS-capable number to the Sender Pool. A Messaging Service sender association is a messaging configuration; do not change the number's Voice/Retell routing.
4. Associate the approved A2P Campaign with the Messaging Service.
5. Verify the sender appears registered/active under the campaign.
6. Change Workflow 2 from an explicit `From` number to the Messaging Service SID only if Twilio's registered configuration requires it. Preserve all consent gates and Workflow 6 calendar ownership.
7. Send one controlled, consented test and inspect the final delivery status. Confirm error `30034` no longer occurs.

The same Twilio number can provide Voice and SMS when it has both capabilities. Adding an SMS-capable number to a Messaging Service does not itself require changing its Voice webhook; nevertheless, verify the Retell phone assignment immediately after sender association.

## STOP and HELP handling

Twilio automatically handles standard opt-out/opt-in/help keywords for long-code numbers and maintains the block list. For the initial single-purpose transactional program, retain the standard behavior. Do not create duplicate STOP or HELP replies in n8n.

Advanced Opt-Out is optional and disabled by default. It is only needed for customized keyword sets/responses or `OptOutType` webhook tracking. Because enabling it applies to all senders in the Messaging Service and cannot be disabled in Console without Twilio support, review its final configuration before enabling it.

## Expected fees

Current Twilio published pricing for the likely Low-Volume Standard / Low Volume Mixed route:

- Low-Volume Standard Brand registration: **$4.50 one time**.
- Campaign manual vetting: **$15.00 one time per submission**; a rejected resubmission may incur another fee.
- Low Volume Mixed Campaign: **$1.50 per month**.
- SMS usage and carrier pass-through fees: additional.

Minimum first-month registration cash requirement: **$21.00**, plus a balance buffer for message and carrier fees. Confirm the price shown in Console immediately before approving payment.

## Tests before enablement

Run:

```bash
node n8n/tests/workflow-02-sms-gating.test.mjs
```

The harness executes the Code node embedded in the Workflow 2 export and verifies booking/consent yes, decline, missing consent, duplicate call ID, failed booking, missing phone, cross-call isolation, consent evidence, exact Eastern-time copy, the Twilio IF branch, and that the Workflow 2 calendar node remains disabled.

Real carrier delivery is intentionally not tested until A2P approval. The two public website URLs must also be verified after deployment and before campaign submission.

## Remaining approvals and user-entered fields

After the Primary Customer Profile is approved, the user must personally:

- confirm the business entity type and industry exactly as supported by authoritative records;
- enter the EIN directly in Twilio;
- confirm the approved business address and registration details;
- enter/confirm the authorized representative's name, title, email, and phone;
- provide expected daily and monthly SMS volume;
- approve the Brand and Campaign fees shown in Console;
- review and accept all Twilio/TCR attestations;
- approve Brand creation, Campaign submission, sender association, and one controlled SMS test;
- confirm the public Privacy Policy and SMS Terms URLs resolve before submission.

Do not publish Retell V16 or n8n consent-gating drafts until their simulations pass and A2P enablement is approved.
