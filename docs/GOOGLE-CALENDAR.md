# Google Calendar — The System V.1.1

Calendar: `Equation Discovery Calls`

Workflow 6 remains the only calendar writer.

## Booking-time description

The existing Retell webhook branch creates one deterministic 30-minute event and records:

- confirmed appointment and Eastern timezone;
- exact Workflow 6 booking-write time in Eastern;
- caller name, phone, and email when available;
- call start when present in the tool payload;
- Retell Call ID;
- stable Google Sheets Client View link; and
- placeholders explaining that duration and recording arrive after call completion.

## Post-call enrichment

Workflow 1 receives final `call_analyzed` data, deduplicates by call ID, and calls Workflow 6 only after confirmed booking success. Workflow 6 derives the original deterministic event ID, retrieves that event, and appends:

- call completion time;
- call duration;
- final call summary;
- stable Client View link; and
- Retell's real `recording_url` when supplied.

The original description is preserved, so the booking-write timestamp is not confused with call completion or appointment time. No Retell URL format is invented.
