# n8n production exports

These are the six workflows currently published in the production n8n project. Their workflow logic, IDs, version IDs, credential references, node positions, and connections are preserved.

For repository safety, all `pinData` and n8n instance `meta` blocks were removed. Those fields are not required to import the workflows. One pinned sample contained a live Retell call access token, so no pinned execution samples are retained.

Credential names and n8n credential IDs remain as safe references; credential values are never part of an n8n workflow export.

## Workflow 1 snapshot note

The exact Workflow 1 export contains older embedded error, booking, and message trigger groups on the same canvas. They are not connected to the live `Retell Webhook` route. The live route calls the separate Workflow 2 and Workflow 3 workflows.

Do not connect or invoke the embedded `When Called by Main Router` calendar branch. Workflow 6 is the only calendar writer in the proven live path.
