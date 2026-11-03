const fs = require('node:fs')
const ts = require('typescript')
const assert = require('node:assert/strict')
const vm = require('node:vm')
function load(path, dependencies = {}) {
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText
  const exports = {}
  vm.runInNewContext(code, {
    exports,
    require: (name) => {
      if (name in dependencies) return dependencies[name]
      throw new Error(`Unexpected import: ${name}`)
    },
    Date,
    Buffer,
  })
  return exports
}
const config = load('lib/mf-control/integrations-config.ts')
const catalog = load('lib/company/catalog.ts', {
  '@/lib/mf-control/integrations-config': config,
})
assert.equal(catalog.COMPANY_AGENTS.length, 50)
assert.equal(new Set(catalog.COMPANY_AGENTS.map((a) => a.id)).size, 50)
assert.equal(catalog.DEPARTMENTS.length, 16)
assert.equal(catalog.COMPANY_AGENTS.filter((a) => !a.managerId).length, 1)
for (const a of catalog.COMPANY_AGENTS) {
  const seen = new Set([a.id])
  let id = a.managerId
  while (id) {
    assert(!seen.has(id), 'Reporting hierarchy must not contain cycles')
    seen.add(id)
    const manager = catalog.COMPANY_AGENTS.find((b) => b.id === id)
    assert(manager, 'Manager must exist')
    id = manager.managerId
  }
}
assert.equal(config.INTEGRATED_PROJECTS.length, 16)
assert.equal(new Set(config.INTEGRATED_PROJECTS.map((p) => p.slug)).size, 16)
const valid = {
  version: 1,
  source: 'Supabase',
  capturedAt: new Date().toISOString(),
  metrics: { leads: 0 },
}
assert(config.parseOperationalReport(valid), 'Measured zero must remain valid')
assert.equal(
  config.parseOperationalReport({ ...valid, metrics: { leads: -1 } }),
  null,
)
assert.equal(
  config.parseOperationalReport({ ...valid, metrics: { leads: '4' } }),
  null,
)
assert.equal(
  config.parseOperationalReport({ ...valid, metrics: { customerEmail: 1 } }),
  null,
)
assert.equal(
  config.parseOperationalReport({ ...valid, metrics: { leads: null } }),
  null,
)
assert.equal(config.parseOperationalReport({ ...valid, metrics: {} }), null)
assert.equal(
  config.parseOperationalReport({
    ...valid,
    capturedAt: '2099-01-01T00:00:00Z',
  }),
  null,
)
assert.equal(
  config.parseOperationalReport({
    ...valid,
    capturedAt: '2000-01-01T00:00:00Z',
  }),
  null,
)
console.log(
  'Passed: 50 agents, 16 departments, acyclic hierarchy, exact project selection and aggregate validation.',
)
