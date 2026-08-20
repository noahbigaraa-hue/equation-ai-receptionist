# Restore guide

This guide rebuilds the current Wondora receptionist without copying secrets.

## 1. Create or connect the Retell agent

Create an agent named **Wondora V2** or open the intended replacement. Do not attach the live phone number yet.

## 2. Restore prompt and voice settings

1. Copy `retell/system-prompt.md` into the agent's main prompt.
2. Set the Welcome Message to: `Howzit, thanks for calling Wondora. I'm Isabella, how can I help you today?`
3. Set the conversation mode to AI speaks first with a custom message and a 0-second pause.
4. Select the **Cimo** voice.
5. Set voice speed to **1.12**.
6. Verify the additional settings listed in `retell/agent-config.json`.

## 3. Import n8n workflows

Import all six JSON files from `n8n/workflows/` into the same n8n project. Keep their names and note the new workflow IDs if n8n assigns different ones.

The exact Workflow 1 export contains older embedded subworkflow-trigger groups retained on its canvas. Do not connect or invoke those groups. The live webhook route must call the separate Workflow 2 and Workflow 3 imports, and Workflow 6 must remain the only live calendar writer.

## 4. Reconnect credentials

Using n8n's credential manager, reconnect:

- Google Calendar OAuth
- Google Sheets OAuth
- Gmail OAuth
- Twilio

Never paste credential values into a workflow node or commit them to Git.

## 5. Repair internal workflow references

If imports produce new IDs, update Workflow 1's Execute Workflow nodes so they point to the restored Workflow 2 and Workflow 3. Configure Workflow 4 as the error workflow where appropriate.

## 6. Set the calendar

Point Workflow 5 and Workflow 6 at **Equation Discovery Calls**. Confirm the business timezone is `America/New_York` and appointments are exactly 30 minutes.

Workflow 2's calendar node must stay deactivated. Workflow 6 must be the only node that creates calendar events.

## 7. Configure webhooks

Publish/activate the restored n8n workflows and obtain their production URLs. Configure Retell using `retell/functions.md` and `retell/webhooks.md`.

If the n8n hostname changes, replace all three webhook URLs in Retell:

- call intake
- check availability
- book appointment

## 8. Add Retell functions

Create `check_availability_cal`, `book_appointment_cal`, and `end_call` exactly as documented. Keep the function timeouts at 120,000 ms for the two n8n functions.

The current V14 view showed only those three attached functions. The prompt references `transfer_call`, so transfer capability and its destination must be manually verified before relying on transfers in a rebuilt agent.

## 9. Configure agent-level webhook events

Set the Agent Level Webhook URL and enable:

- Call started
- Call ended
- Call analyzed

Leave transcript and transfer lifecycle events disabled unless a later production change intentionally enables them.

## 10. Publish and assign the phone

Publish the restored agent only after configuration review. Assign **+1 239 299 7352** to **Wondora V2 — Latest Published**. Do not pin it to an old version.

## 11. Test availability

Use a controlled direct request or Retell simulation. Verify one Workflow 5 execution and either `available: true` or three valid nearby alternatives.

## 12. Test booking

Verify one Workflow 6 execution, one Google Calendar event, a deterministic event ID, a 30-minute duration, and Eastern Time details. Repeat the identical request and verify it does not create a duplicate. Remove validation events when safe.

## 13. Perform a real inbound test

Call the number manually. Request a consultation, choose a time, confirm it, and verify:

1. one greeting from Isabella;
2. one availability request;
3. one booking request;
4. one event in `Equation Discovery Calls`;
5. verbal confirmation only after booking succeeds;
6. follow-up/logging completes;
7. `end_call` occurs only after the outcome is communicated.
