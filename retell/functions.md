# Retell functions

## `check_availability_cal`

**Description**

> Checks whether the caller's requested appointment window is available. Use this during a booking flow before offering or confirming any appointment time. Wait for and use the returned availability result; never end the call while this function is pending.

The start must be a valid future time in `America/New_York`. Retell rejects past times conversationally, and Workflow 5 independently rejects them before querying Google Calendar.

- Method: `POST`
- Endpoint: `https://equation-us.app.n8n.cloud/webhook/check-availability`
- Timeout: `120000` ms
- Headers shown in the published configuration: none
- Query parameters shown in the published configuration: none
- Talk after action completed: enabled

```json
{
  "type": "object",
  "properties": {
    "start_time": {
      "type": "string",
      "description": "Requested appointment start time as an ISO 8601 date-time with timezone."
    },
    "end_time": {
      "type": "string",
      "description": "Requested appointment end time as an ISO 8601 date-time with timezone."
    }
  },
  "required": ["start_time", "end_time"]
}
```

## `book_appointment_cal`

**Description**

> Creates the confirmed Marketing Consulting appointment after the caller has approved the exact date and time. Use only after a successful availability check and explicit caller confirmation. Wait for the success response and communicate the booking outcome before any end_call.

The confirmed start must be a valid future time in `America/New_York`. Workflow 6 independently rejects invalid or past starts before the Google Calendar create request, and always derives an exact 30-minute end.

- Method: `POST`
- Endpoint: `https://equation-us.app.n8n.cloud/webhook/book-appointment`
- Timeout: `120000` ms
- Headers shown in the published configuration: none
- Query parameters shown in the published configuration: none
- Talk after action completed: enabled

```json
{
  "type": "object",
  "properties": {
    "start_time": {
      "type": "string",
      "description": "Confirmed appointment start time as an ISO 8601 date-time with timezone."
    },
    "end_time": {
      "type": "string",
      "description": "Confirmed appointment end time as an ISO 8601 date-time with timezone."
    },
    "caller_name": {
      "type": "string",
      "description": "Caller full name."
    },
    "caller_phone": {
      "type": "string",
      "description": "Caller phone number, normally {{user_number}}."
    },
    "caller_email": {
      "type": "string",
      "description": "Caller email. Use mail@example.com when no caller email is collected."
    }
  },
  "required": [
    "start_time",
    "end_time",
    "caller_name",
    "caller_phone",
    "caller_email"
  ]
}
```

## `end_call`

Retell's End Call function is attached as `end_call` with the platform description:

> End the call when user has to leave (like says bye) or you are instructed to do so.

The draft guardrails prohibit `end_call` during any tool call, while caller confirmation is pending, or immediately after saying that something will be checked. It is permitted only after the spoken final outcome and a completed booking, cancellation, message, or normal closing.

## Transfer status

No `transfer_call` function is attached. The previously documented destination has not been verified, so the unpublished refinement uses message-taking as the fallback. Do not add or activate a transfer function until the destination is independently verified and a controlled transfer test is approved.
