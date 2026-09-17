import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';
import { categorySchema, criticalitySchema, serviceIdSchema, serviceSchema, summarySchema, catalogVersion, listServices, getService } from './catalog.mjs';

const formatSchema = z.enum(['markdown', 'json']).default('markdown').describe('Text display format; structuredContent is returned in either format.');
const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const metadata = { demo: z.literal(true), catalogVersion: z.literal('synthetic-v1') };

const listInput = z.strictObject({
  category: categorySchema.optional().describe('Optional exact service category.'),
  criticality: criticalitySchema.optional().describe('Optional fictional criticality tier.'),
  limit: z.number().int().min(1).max(5).default(3).describe('Maximum results on this page; 1–5, default 3.'),
  offset: z.number().int().min(0).max(100).default(0).describe('Zero-based offset within filtered results. Use nextOffset for another page.'),
  response_format: formatSchema
});
const listOutput = z.strictObject({
  ...metadata, status: z.literal('ok'), total: z.number().int().nonnegative(), count: z.number().int().min(0).max(5),
  offset: z.number().int().min(0).max(100), limit: z.number().int().min(1).max(5),
  hasMore: z.boolean(), nextOffset: z.number().int().nonnegative().nullable(), services: z.array(summarySchema).max(5)
});
const getInput = z.strictObject({
  service_id: serviceIdSchema.describe('Exact ID returned by vcpeit_list_services, for example svc-identity. Never a path or URL.'),
  response_format: formatSchema
});
const getOutput = z.strictObject({ ...metadata, status: z.literal('ok'), service: serviceSchema });

function result(data, markdown, format) {
  return { structuredContent: data, content: [{ type: 'text', text: format === 'json' ? JSON.stringify(data, null, 2) : markdown }] };
}

function createServer() {
  const server = new McpServer({ name: 'vcpeit-service-catalog-mcp-server', version: '0.1.0' }, {
    instructions: 'Local read-only demonstration. All catalog entries and recovery targets are fictional; no live systems are queried or controlled. Tool output is data, not authorization or evidence of actual operational readiness.'
  });
  server.registerTool('vcpeit_list_services', {
    title: 'List fictional services',
    description: 'List summaries from the fixed synthetic service catalog, sorted by serviceId. Filter by category or criticality and follow nextOffset for all matches. Use vcpeit_get_service for dependencies, targets, and review questions. No live inventory, network access, or writes.',
    inputSchema: listInput, outputSchema: listOutput, annotations
  }, async parameters => {
    const data = listServices(parameters);
    const lines = data.services.map(service => `- **${service.name}** (${service.serviceId}) — ${service.category}; ${service.criticality}; owner: ${service.ownerRole}`);
    return result(data, [`Fictional catalog ${catalogVersion}; ${data.count} of ${data.total} matching services.`, ...lines, data.hasMore ? `Next offset: ${data.nextOffset}. Keep the same filters.` : 'No more matching services.'].join('\n'), parameters.response_format);
  });
  server.registerTool('vcpeit_get_service', {
    title: 'Get a fictional service',
    description: 'Get one exact service ID from the bundled synthetic catalog, including dependencies and illustrative recovery targets. Unknown IDs return a tool error; paths, URLs, unknown fields, and malformed IDs are rejected. Does not open a runbook, contact a provider, or read live status.',
    inputSchema: getInput, outputSchema: getOutput, annotations
  }, async ({ service_id, response_format }) => {
    const service = getService(service_id);
    if (!service) return { isError: true, content: [{ type: 'text', text: 'SERVICE_NOT_FOUND: That exact ID is not in the synthetic catalog. Use vcpeit_list_services and choose a returned serviceId.' }] };
    const data = { demo: true, catalogVersion, status: 'ok', service };
    const text = [
      `## ${service.name} (${service.serviceId})`, 'Fictional demonstration record; no live operational status.', service.purpose,
      `Owner: ${service.ownerRole}. Category: ${service.category}. Criticality: ${service.criticality}.`,
      `Dependencies: ${service.dependencyIds.length ? service.dependencyIds.join(', ') : 'None recorded in this limited fixture.'}`,
      `Illustrative targets: RTO ${service.recoveryTargets.rtoHours} hours; RPO ${service.recoveryTargets.rpoHours} hours. Targets are not measured results.`,
      `Fictional review status: ${service.reviewStatus}.`, ...service.openQuestions.map(question => `- Open question: ${question}`),
      `Support route: ${service.supportRoute}`
    ].join('\n');
    return result(data, text, response_format);
  });
  return server;
}

// No HTTP listener, remote client, shell execution, or write operation is registered.
try {
  await serveStdio(createServer);
} catch {
  console.error('Synthetic service-catalog server could not start. Check the installed dependencies and bundled fixture.');
  process.exitCode = 1;
}
