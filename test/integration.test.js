require('dotenv').config()
const test = require('tape')
const data = require('../index')

const { listTables } = require('../src/database/list-tables')

let animal
let animals

test('database client should initialize and return table names without error', async t => {
  const tables = await listTables()
  t.ok(Array.isArray(tables), 'listTables returned an array')
  t.end()
})

test('get and destroy all items', async t => {
  const allAnimals = await data.get({ table: 'animals' })
  const result = await data.destroy(allAnimals)
  t.ok(result === undefined, 'destroy returns undefined')
  const animalCount = await data.count({ table: 'animals' })
  console.log(animalCount)
  t.ok(animalCount === 0, 'count of items in animals table is 0')
  t.end()
})

test('set function inserts individual item', async t => {
  const input = { table: 'animals', name: 'wally', type: 'walrus' }
  animal = await data.set(input)
  const { key, ...attributes } = animal
  t.deepEqual(attributes, input, 'record matches input')
  t.ok(key, 'item given a key')
  const hasOnlySafeCharacters = /^[\w -]+$/g.test(key)
  t.ok(hasOnlySafeCharacters, 'key is string of safe characters')
  t.ok(key.length === 12, 'key is 12 characters long')
  t.end()
})

test('set function inserts batch items', async t => {
  const inputs = [
    { table: 'animals', name: 'polly', type: 'parrot' },
    { table: 'animals', name: 'kelly', type: 'kangaroo' },
  ]
  animals = await data.set(inputs)
  t.ok(Array.isArray(animals), 'returns an array')
  const noKeys = inputs.map(a => {
    const { key, ...rest } = a
    return rest
  })
  t.deepEqual(noKeys, inputs, 'return matches inputs')
  t.end()
})

test('get function retrieves individual item', async t => {
  const key = animal.key
  const retrievedAnimal = await data.get({ table: 'animals', key })
  t.ok(retrievedAnimal.key, 'an item was returned')
  t.end()
})

test('get function returns null when item doesnt exist', async t => {
  const retrievedAnimal = await data.get({
    table: 'animals',
    key: 'ahen0w8vn-92',
  })
  // begin/data actually returns null
  t.ok(retrievedAnimal === undefined, 'returned undefined')
  t.end()
})

test('get function retrieves whole table', async t => {
  const allAnimals = await data.get({ table: 'animals' })
  t.ok(Array.isArray(allAnimals), 'an array was returned')
  t.ok(allAnimals.length === 3, 'returned 3 items')
  const count = await data.count({ table: 'animals' })
  t.ok(count === 3, 'data.count returned 3')
  t.end()
})

test('get function returns empty array on multiple nonexistant items', async t => {
  const allVehicles = await data.get({ table: 'vehicles' })
  t.ok(Array.isArray(allVehicles), 'returns array')
  t.ok(allVehicles.length === 0, 'array is empty')
  t.end()
})

test('calling with [], undefined, or {} handled', async t => {
  try {
    await data.get([])
  } catch (error) {
    t.error(error)
  }
})

data.destroy([animal, ...animals])
