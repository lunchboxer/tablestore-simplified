const test = require('tape')
require('dotenv').config()

const { listTables } = require('../src/database/list-tables')

test('database client should initialize and return table names without error', async t => {
  const tables = await listTables()
  t.ok(Array.isArray(tables), 'listTables returned an array')
  t.end()
})
