import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { fileURLToPath } from 'node:url';

const client = new Client({ name: 'vcpeit-catalog-demo-client', version: '0.1.0' });
const transport = new StdioClientTransport({ command: process.execPath, args: [fileURLToPath(new URL('../src/server.mjs', import.meta.url))], stderr: 'pipe' });
try {
  await client.connect(transport);
  const tools = await client.listTools();
  console.log('Available tools:', tools.tools.map(tool => tool.name).join(', '));
  const page = await client.callTool({ name: 'vcpeit_list_services', arguments: { criticality: 'tier-1', limit: 2, response_format: 'json' } });
  if (page.isError) throw new Error('The synthetic list tool returned an error. Run npm test for details.');
  console.log(JSON.stringify(page.structuredContent, null, 2));
  const detail = await client.callTool({ name: 'vcpeit_get_service', arguments: { service_id: 'svc-fund-operations' } });
  if (detail.isError) throw new Error('The synthetic get tool returned an error. Run npm test for details.');
  for (const block of detail.content ?? []) if (block.type === 'text') console.log(block.text);
} finally {
  await client.close();
}
