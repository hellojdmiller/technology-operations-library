import { readFileSync } from 'node:fs';
import * as z from 'zod/v4';

export const categorySchema = z.enum(['identity', 'collaboration', 'research', 'fund-operations', 'recovery', 'automation']);
export const criticalitySchema = z.enum(['tier-1', 'tier-2', 'tier-3']);
export const serviceIdSchema = z.string().min(5).max(40).regex(/^svc-[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const serviceSchema = z.strictObject({
  serviceId: serviceIdSchema,
  name: z.string().min(1).max(80),
  category: categorySchema,
  criticality: criticalitySchema,
  ownerRole: z.string().min(1).max(80),
  purpose: z.string().min(1).max(300),
  dependencyIds: z.array(serviceIdSchema).max(10),
  recoveryTargets: z.strictObject({ rtoHours: z.number().positive().max(720), rpoHours: z.number().positive().max(720) }),
  reviewStatus: z.enum(['documented', 'gap', 'not-reviewed']),
  openQuestions: z.array(z.string().min(1).max(250)).max(10),
  supportRoute: z.string().min(1).max(250)
});
export const summarySchema = serviceSchema.pick({ serviceId: true, name: true, category: true, criticality: true, ownerRole: true });

const catalogSchema = z.strictObject({
  catalogVersion: z.literal('synthetic-v1'),
  synthetic: z.literal(true),
  services: z.array(serviceSchema).min(1).max(100)
});

// Fixed bundled file only: neither arguments, environment variables, nor tool input select a path.
const catalog = catalogSchema.parse(JSON.parse(readFileSync(new URL('../fixtures/services.json', import.meta.url), 'utf8')));
const ids = new Set(catalog.services.map(service => service.serviceId));
if (ids.size !== catalog.services.length || catalog.services.some(service => service.dependencyIds.some(id => !ids.has(id) || id === service.serviceId))) {
  throw new Error('Invalid synthetic catalog relationships.');
}

const freeze = value => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};
freeze(catalog);

export const catalogVersion = catalog.catalogVersion;

export function listServices({ category, criticality, limit, offset }) {
  const matches = catalog.services
    .filter(service => (!category || service.category === category) && (!criticality || service.criticality === criticality))
    .toSorted((left, right) => left.serviceId.localeCompare(right.serviceId));
  const services = matches.slice(offset, offset + limit).map(({ serviceId, name, category, criticality, ownerRole }) => summarySchema.parse({ serviceId, name, category, criticality, ownerRole }));
  const hasMore = offset + services.length < matches.length;
  return { demo: true, catalogVersion, status: 'ok', total: matches.length, count: services.length, offset, limit, hasMore, nextOffset: hasMore ? offset + services.length : null, services };
}

export function getService(serviceId) {
  const service = catalog.services.find(service => service.serviceId === serviceId);
  return service ? structuredClone(service) : null;
}
