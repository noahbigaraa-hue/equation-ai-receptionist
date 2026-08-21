import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const workflowPath = new URL('../workflows/02-booking.json', import.meta.url);
const workflow = JSON.parse(await readFile(workflowPath, 'utf8'));
const routerPath = new URL('../workflows/01-main-call-router.json', import.meta.url);
const router = JSON.parse(await readFile(routerPath, 'utf8'));
const evaluator = workflow.nodes.find((node) => node.name === 'Evaluate and Claim SMS Attempt');

assert.ok(evaluator, 'Workflow 2 must contain the SMS eligibility evaluator');

const runEvaluator = new Function(
  '$input',
  '$getWorkflowStaticData',
  evaluator.parameters.jsCode,
);

const state = {};
const evaluate = (input) => runEvaluator(
  { first: () => ({ json: input }) },
  () => state,
)[0].json;

const base = {
  call_id: 'call-consent-yes',
  caller_phone: '+12395550100',
  booking_succeeded: true,
  sms_consent_granted: true,
  sms_consent_timestamp: '2026-08-20T20:01:02.000Z',
  sms_consent_source: 'voice_call',
  sms_consent_evidence: 'Isabella asked; caller answered yes.',
  appointment_start: '2026-08-21T17:00:00.000Z',
  message: 'Original booking note',
};

const yes = evaluate(base);
assert.equal(yes.sms_eligible, true, 'booking plus explicit consent should be eligible');
assert.equal(
  yes.sms_body,
  'Wondora Brands: Your consultation is booked for Friday, August 21 at 1:00 PM Eastern. Reply STOP to unsubscribe.',
  'SMS must use Eastern Time and approved transactional copy',
);

const duplicate = evaluate(base);
assert.equal(duplicate.sms_eligible, false, 'duplicate call IDs must not create another SMS attempt');
assert.equal(duplicate.sms_skip_reason, 'duplicate_call_id');

const declined = evaluate({ ...base, call_id: 'call-consent-no', sms_consent_granted: false });
assert.equal(declined.sms_eligible, false);
assert.equal(declined.sms_skip_reason, 'sms_consent_not_granted');

const missingConsent = evaluate({ ...base, call_id: 'call-consent-missing', sms_consent_granted: undefined });
assert.equal(missingConsent.sms_eligible, false);
assert.equal(missingConsent.sms_skip_reason, 'sms_consent_not_granted');

const failedBooking = evaluate({ ...base, call_id: 'call-booking-failed', booking_succeeded: false });
assert.equal(failedBooking.sms_eligible, false);
assert.equal(failedBooking.sms_skip_reason, 'booking_not_successful');

const missingPhone = evaluate({ ...base, call_id: 'call-phone-missing', caller_phone: '' });
assert.equal(missingPhone.sms_eligible, false);
assert.equal(missingPhone.sms_skip_reason, 'missing_caller_phone');

const differentCall = evaluate({ ...base, call_id: 'call-different' });
assert.equal(differentCall.sms_eligible, true, 'consent and dedupe state must remain call-scoped');

const consentRecord = JSON.parse(yes.sms_consent_record);
assert.deepEqual(
  {
    call_id: consentRecord.call_id,
    caller_phone: consentRecord.caller_phone,
    consent_granted: consentRecord.consent_granted,
    consent_timestamp: consentRecord.consent_timestamp,
    appointment_start: consentRecord.appointment_start,
    source: consentRecord.source,
    evidence: consentRecord.evidence,
  },
  {
    call_id: base.call_id,
    caller_phone: base.caller_phone,
    consent_granted: true,
    consent_timestamp: base.sms_consent_timestamp,
    appointment_start: base.appointment_start,
    source: 'voice_call',
    evidence: base.sms_consent_evidence,
  },
  'consent evidence must be tied to the completed call',
);

const smsIf = workflow.nodes.find((node) => node.name === 'SMS Eligible?');
const smsNode = workflow.nodes.find((node) => node.type === 'n8n-nodes-base.twilio');
const calendarNode = workflow.nodes.find((node) => node.name === 'Create an event');
assert.ok(smsIf && smsNode, 'SMS branch nodes must exist');
assert.equal(calendarNode?.disabled, true, 'Workflow 2 calendar node must remain disabled');
assert.match(smsNode.parameters.message, /sms_body/, 'Twilio must send the normalized compliant message');
assert.equal(workflow.connections['SMS Eligible?'].main[0][0].node, smsNode.name);

const routerDedupe = router.nodes.find((node) => node.name === 'Block Duplicate Webhooks');
assert.equal(routerDedupe?.parameters.operation, 'removeItemsSeenInPreviousExecutions');
assert.match(routerDedupe?.parameters.dedupeValue || '', /call_id/);

const normalizedFields = new Set(
  router.nodes
    .find((node) => node.name === 'Normalize Call Data')
    .parameters.assignments.assignments
    .map((assignment) => assignment.name),
);
for (const field of ['booking_succeeded', 'sms_consent_granted', 'sms_consent_evidence', 'sms_consent_timestamp', 'sms_consent_source']) {
  assert.ok(normalizedFields.has(field), `Workflow 1 must map ${field}`);
}

console.log('Workflow 1 → Workflow 2 SMS compliance assertions passed');
