# Google Sheets — The System V.1.1

Spreadsheet: `Wondora Brands AI Receptionist`

## Raw automation tabs

`Call Log`, `Bookings`, and `Messages` remain production automation surfaces. Historical data was not deleted or reordered.

Workflow 1 retains the original nine Call Log fields and adds six columns to the right: call start, call end, duration seconds, Retell recording URL, booking-completion timestamp, and Client View link. Dates are stored as Eastern-offset ISO values so workflow mappings remain deterministic.

## Client View

The additive `Client View` tab is the business-facing operational view:

- Call Date (ET)
- Caller
- Phone
- Outcome
- Booking Status
- Appointment (ET)
- Duration
- Summary
- Recording
- Retell Call ID
- Notes

The tab has a branded title, frozen rows through the header, a colored header band, compact rows, and spill formulas that reference the raw Call Log. The raw tabs remain the source of truth.

Stable link:

`https://docs.google.com/spreadsheets/d/19ekskZGExeGti_9hSGJaCeaOcB3G0E1vxYg9I_yi3no/edit?gid=1129582252#gid=1129582252`

Google Sheets does not provide a stable immutable deep link to an appended row. Calendar events therefore use the Client View link and include Retell Call ID for exact lookup.
