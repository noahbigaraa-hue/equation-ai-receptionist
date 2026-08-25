# Google Calendar baseline

Calendar: **Equation Discovery Calls**

The latest confirmed real booking execution inspected was Workflow 6 execution `146`. It succeeded once and created a 30-minute event in `America/New_York`.

Baseline event title:

`Marketing Consultation — [Caller] — [Time] ET`

Baseline description fields:

- Booked by Wondora AI Receptionist
- caller name
- caller phone
- caller email
- confirmed appointment date and time
- business timezone
- Retell call ID

Missing from the baseline event:

- booking-call timestamp;
- call duration;
- Google Sheet call-summary link;
- stable Retell call-detail or recording link;
- explicit 30-minute duration line.

The workflow uses a deterministic Google event ID derived from the call identity and appointment start. Workflow 6 remains the sole calendar writer.
