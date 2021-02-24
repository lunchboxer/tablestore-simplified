require('dotenv').config()
const test = require('tape')
const data = require('../index')

const { listTables } = require('../src/database/list-tables')

// Nothing that relies on being up to date with the action preceeding it can be garanteed to work
// if we add three rows and delete one row and want the row count to come back as exactly one
// then we may fail unless there is a very slow connection.
// the sequence on this end is reliable though

test('database client should initialize and return table names without error', async t => {
  t.plan(1)

  const tables = await listTables()
  t.ok(Array.isArray(tables), 'listTables returned an array')
})

const animalsToDelete = []

test('set function inserts individual item', async t => {
  t.plan(4)
  const input = { table: 'animals', name: 'wally', type: 'walrus' }
  const animal = await data.set(input)
  animalsToDelete.push(animal)
  const { key, ...attributes } = animal
  t.deepEqual(attributes, input, 'record matches input')
  t.ok(key, 'item given a key')
  const hasonlysafecharacters = /^[\w -]+$/g.test(key)
  t.ok(hasonlysafecharacters, 'key is string of safe characters')
  t.ok(key.length === 12, 'key is 12 characters long')
})

test('set function inserts batch items', async t => {
  t.plan(2)
  const inputs = [
    { table: 'animals', name: 'polly', type: 'parrot' },
    { table: 'animals', name: 'kelly', type: 'kangaroo' },
  ]
  const animals = await data.set(inputs)
  animalsToDelete.push(...animals)
  t.ok(Array.isArray(animals), 'returns an array')
  const nokeys = inputs.map(a => {
    const { key, ...rest } = a
    return rest
  })
  t.deepEqual(nokeys, inputs, 'return matches inputs')
})

test('get function retrieves individual item', async t => {
  t.plan(1)
  const key = animalsToDelete[0].key
  const retrievedanimal = await data.get({ table: 'animals', key })
  t.ok(retrievedanimal.key, 'an item was returned')
})

test('get function returns undefined when item doesnt exist', async t => {
  t.plan(1)
  const retrievedanimal = await data.get({
    table: 'animals',
    key: 'ahen0w8vn-92',
  })
  // begin/data actually returns null
  t.ok(retrievedanimal === undefined, 'returned undefined')
})

test('get function retrieves whole table', async t => {
  t.plan(2)
  const allanimals2 = await data.get({ table: 'animals' })
  t.ok(Array.isArray(allanimals2), 'an array was returned')
  const count = await data.count({ table: 'animals' })
  t.ok(Number.isInteger(count), 'data.count returned an integer')
})

test('get function returns empty array on multiple nonexistant items', async t => {
  t.plan(2)
  const allvehicles = await data.get({ table: 'vehicles' })
  t.ok(Array.isArray(allvehicles), 'returns array')
  t.ok(allvehicles.length === 0, 'array is empty')
})

test('calling with [], undefined, or {} handled', async t => {
  t.plan(1)
  try {
    const response = await data.get([])
    t.ok(
      Array.isArray(response) && response.length === 0,
      'get([]) returned []',
    )
  } catch (error) {
    t.error(error)
  }
})

test('clean up', async t => {
  t.plan(1)
  await data.destroy(animalsToDelete)
  t.ok(true)
})
