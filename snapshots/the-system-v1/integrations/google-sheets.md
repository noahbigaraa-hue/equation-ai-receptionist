# Google Sheets baseline

Workbook: **Wondora Brands AI Receptionist**

The workbook had three visible tabs: `Call Log`, `Bookings`, and `Messages`. Each tab used the same nine raw columns:

1. `call_id`
2. `caller_phone`
3. `caller_name`
4. `caller_email`
5. `intent`
6. `appointment_start`
7. `appointment_end`
8. `message`
9. `call_summary`

Baseline observations:

- no frozen header rows;
- no filters or native tables;
- no formulas or charts;
- ISO-8601 appointment timestamps stored as text;
- no client-facing dashboard tab;
- no call duration, booking-created timestamp, recording link, or deep-link column;
- historical raw values were intact and were not changed during the audit.

V1.1 should add a separate client-facing view rather than restructure these production logging targets.
