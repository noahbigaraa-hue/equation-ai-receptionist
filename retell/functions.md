# Retell functions

## `check_availability_cal`

**Description**

> Checks whether the caller's requested appointment window is available. Use this during a booking flow before offering or confirming any appointment time. Wait for and use the returned availability result; never end the call while this function is pending.

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

The system prompt adds the production guardrails: it may not fire during availability or booking, and it may fire only after a booking result has been communicated, the caller cancels/declines, a transfer completes, or a normal closing exchange finishes.

## Transfer note

The system prompt references `transfer_call` to the business main number, but the V14-derived Functions panel showed only `end_call`, `check_availability_cal`, and `book_appointment_cal`. Do not assume transfer is available after a restore; inspect and configure it deliberately before testing transfer behavior.
