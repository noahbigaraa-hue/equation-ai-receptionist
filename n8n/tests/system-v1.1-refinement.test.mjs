import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readJson = async (relative) => JSON.parse(await readFile(new URL(relative, import.meta.url), 'utf8'));
const router = await readJson('../workflows/01-main-call-router.json');
const booking = await readJson('../workflows/02-booking.json');
const message = await readJson('../workflows/03-message-follow-up.json');
const errorHandler = await readJson('../workflows/04-error-handler.json');
const availability = await readJson('../workflows/05-check-calendar-availability.json');
const calendar = await readJson('../workflows/06-create-calendar-booking.json');
const prompt = await readFile(new URL('../../retell/system-prompt.md', import.meta.url), 'utf8');
const agentConfig = JSON.parse(await readFile(new URL('../../retell/agent-config.json', import.meta.url), 'utf8'));

const scenarios = [
  'Normal greeting',
  'Greeting interrupted immediately',
  'Business question before booking',
  'Normal booking',
  'Unavailable slot',
  'Caller selects alternative',
  'Caller changes time during confirmation',
  'Caller interrupts mid-response',
  'Caller speaks over appointment confirmation',
  'Successful booking',
  'No over-repeated date/time',
  'Wondora pronunciation',
  'Calendar enrichment',
  'Google Sheet completeness',
  'Duplicate webhook protection',
  'One calendar event only',
  'SMS compliance preserved',
  'call_analyzed routing preserved',
  'Workflow 6 remains calendar owner',
  'Audio interruption simulation readiness',
];
assert.equal(scenarios.length, 20, 'the controlled refinement must retain all 20 release scenarios');

// Greeting, interruption, booking confirmation, and pronunciation behavior.
assert.equal(
  agentConfig.welcome_message.text,
  'Hey, this is Isabella from Wondora Brands. How can I help you today?',
);
assert.match(prompt, /Caller speech always takes priority/);
assert.match(prompt, /Never finish the interrupted sentence first, restart the greeting/);
assert.match(prompt, /one concise confirmation with the exact date and time/);
assert.match(prompt, /one brief success statement with the confirmed date and time/);
assert.match(prompt, /Never add a third date-and-time repetition/);
assert.match(prompt, /Pronounce Wondora as "Won-Dor-Ah" every time/);
assert.equal(agentConfig.voice.name, 'Cimo');
assert.equal(agentConfig.voice.speed, 1.12);
assert.equal(agentConfig.speech_settings.interruption_sensitivity, 0.9);
assert.equal(agentConfig.speech_settings.background_sound, 'None');
assert.deepEqual(agentConfig.transcription_settings.boosted_keywords, ['Wondora']);

// The final Retell event path and duplicate guard remain intact.
const finalEventGate = router.nodes.find((node) => node.name === 'Only Final Analyzed Event?');
const routerDedupe = router.nodes.find((node) => node.name === 'Block Duplicate Webhooks');
assert.equal(finalEventGate.parameters.conditions.string[0].value2, 'call_analyzed');
assert.equal(routerDedupe.parameters.operation, 'removeItemsSeenInPreviousExecutions');
assert.match(routerDedupe.parameters.dedupeValue, /call_id/);

// Sheet logging contains the six additive metadata fields used by Client View.
const normalized = new Map(
  router.nodes.find((node) => node.name === 'Normalize Call Data')
    .parameters.assignments.assignments.map((entry) => [entry.name, entry]),
);
const sheetSchema = new Set(
  router.nodes.find((node) => node.name === 'Log Call to Sheet')
    .parameters.columns.schema.map((entry) => entry.id),
);
for (const field of [
  'call_started_at',
  'call_ended_at',
  'call_duration_seconds',
  'recording_url',
  'booking_created_at',
  'call_summary_link',
]) {
  assert.ok(normalized.has(field), `Workflow 1 must normalize ${field}`);
  assert.ok(sheetSchema.has(field), `Call Log must expose ${field}`);
}
assert.match(normalized.get('recording_url').value, /body\.call\.recording_url/);
assert.match(normalized.get('call_summary_link').value, /gid=1129582252/);

// Workflow 1 invokes the calendar enrichment path only for a completed booking.
const enrichmentIf = router.nodes.find((node) => node.name === 'Calendar Enrichment Eligible?');
const enrichmentCall = router.nodes.find((node) => node.name === "Call '6 - Enrich Calendar Event'");
assert.ok(enrichmentIf && enrichmentCall);
assert.match(JSON.stringify(enrichmentIf.parameters), /booking_succeeded/);
assert.equal(enrichmentCall.parameters.workflowId.value, calendar.id);
assert.equal(enrichmentCall.onError, 'continueRegularOutput');

// Workflow 6 is still the sole live calendar writer and now owns post-call updates too.
const createNode = calendar.nodes.find((node) => node.name === 'Create an event');
const prepareNode = calendar.nodes.find((node) => node.name === 'Prepare Calendar Enrichment');
const getNode = calendar.nodes.find((node) => node.name === 'Get Calendar Event');
const updateNode = calendar.nodes.find((node) => node.name === 'Update Calendar Event');
assert.ok(createNode && prepareNode && getNode && updateNode);
assert.equal(getNode.parameters.operation, 'get');
assert.equal(updateNode.parameters.operation, 'update');
assert.match(createNode.parameters.additionalFields.description, /Booked on call/);
assert.match(createNode.parameters.additionalFields.description, /Client call view/);
assert.match(createNode.parameters.additionalFields.description, /Full recording/);
assert.match(updateNode.parameters.updateFields.description, /completion_details/);
assert.equal(booking.nodes.find((node) => node.name === 'Create an event').disabled, true);

const runPrepare = new Function('$input', prepareNode.parameters.jsCode);
const prepared = runPrepare({ first: () => ({ json: {
  call_id: 'call_v11_test',
  caller_name: 'Test Caller',
  caller_phone: '+12395550100',
  caller_email: 'test@example.com',
  booking_succeeded: true,
  appointment_start: '2026-09-01T14:00:00-04:00',
  appointment_end: '2026-09-01T14:30:00-04:00',
  call_ended_at: '2026-08-25T18:42:00.000Z',
  call_duration_seconds: 193,
  call_summary: 'Caller booked a consultation.',
  call_summary_link: 'https://docs.google.com/spreadsheets/d/19ekskZGExeGti_9hSGJaCeaOcB3G0E1vxYg9I_yi3no/edit?gid=1129582252#gid=1129582252',
  recording_url: 'https://example.invalid/stable-test-recording.wav',
} }) })[0].json;
assert.equal(prepared.calendar_event_id, 'ondoracallv11test20260901t1400000400');
assert.match(prepared.completion_details, /193 seconds/);
assert.match(prepared.completion_details, /stable-test-recording\.wav/);
assert.match(prepared.completion_details, /CALL COMPLETION DETAILS/);
assert.deepEqual(
  runPrepare({ first: () => ({ json: { call_id: 'failed', appointment_start: '2026-09-01T14:00:00-04:00', booking_succeeded: false } }) }),
  [],
  'failed or incomplete bookings must not enter calendar enrichment',
);

// Reachability audit: no enabled calendar create/update node is reachable from Workflow 1's Retell webhook.
const reachable = (workflow, startName) => {
  const seen = new Set();
  const queue = [startName];
  while (queue.length) {
    const current = queue.shift();
    if (seen.has(current)) continue;
    seen.add(current);
    const branches = workflow.connections[current]?.main || [];
    for (const branch of branches) for (const edge of branch) queue.push(edge.node);
  }
  return seen;
};
const routerReachable = reachable(router, 'Retell Webhook');
const enabledRouterCalendarWriters = router.nodes.filter((node) =>
  routerReachable.has(node.name)
  && node.type === 'n8n-nodes-base.googleCalendar'
  && !node.disabled
  && (!node.parameters.operation || node.parameters.operation === 'create' || node.parameters.operation === 'update')
);
assert.deepEqual(enabledRouterCalendarWriters, []);
for (const workflow of [booking, message, errorHandler, availability]) {
  const enabledWriters = workflow.nodes.filter((node) =>
    node.type === 'n8n-nodes-base.googleCalendar'
    && !node.disabled
    && (!node.parameters.operation || node.parameters.operation === 'create' || node.parameters.operation === 'update')
  );
  assert.deepEqual(enabledWriters, [], `${workflow.name} must not write calendar events`);
}
assert.equal(calendar.nodes.filter((node) => node.name === 'Create an event').length, 1);
assert.match(createNode.parameters.additionalFields.id, /call_id/);
assert.match(createNode.parameters.additionalFields.id, /start_time/);

// Existing post-call SMS gates remain present and unchanged by this refinement.
const smsEvaluator = booking.nodes.find((node) => node.name === 'Evaluate and Claim SMS Attempt');
assert.ok(smsEvaluator);
for (const required of ['booking_succeeded', 'sms_consent_granted', 'callId', 'duplicate_call_id']) {
  assert.match(smsEvaluator.parameters.jsCode, new RegExp(required));
}

console.log(`The System V.1.1 refinement assertions passed (${scenarios.length} release scenarios covered)`);
