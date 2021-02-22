const TableStore = require('tablestore')
const { getDataTableName } = require('../src/utils/get-data-table-name')
const { formatInput } = require('../src/utils/format-input')
const { formatAttributes } = require('../src/utils/format-attributes')
const { validateKey } = require('../src/utils/validate-key')

const Long = TableStore.Long
const test = require('tape')

test('ensureDataTableExists returns tableName or throws error', async t => {
  const tableName = process.env.EASY_DATA_TABLE_NAME || 'easy_data'
  let result
  let errors
  try {
    result = await getDataTableName()
  } catch (error) {
    errors = error
  }
  t.ok(result === tableName || errors)
})

test('formatInput requires table to be string', t => {
  const parameters = { table: 1, key: 'slkjsdljs', name: 'james' }
  let result
  try {
    const result = formatInput(parameters)
  } catch (error) {
    t.pass('got error as expected')
  }
  t.end()
})

test('formatInput adds key when no key present', t => {
  t.plan(4)
  const parameters = { table: 'users', name: 'james' }
  let result
  try {
    const result = formatInput(parameters)
    t.ok(
      result && result.sort_id,
      'A parameters object was returned with a sort_id',
    )
    const key = result.sort_id.split('#')[2]
    t.ok(typeof key === 'string', 'key in sort_id is a string')
    const hasOnlySafeCharacters = /[a-z A-Z0-9-_]+/g.test(key)
    t.ok(hasOnlySafeCharacters, 'key is string of safe characters')
    t.ok(key.length === 12, 'key is 12 characters long')
  } catch (error) {
    t.error(error)
  }
  t.end()
})

test('formatInput returns formatted input object', t => {
  const parameters = { table: 'users', key: 'shcnw9w8alab', name: 'james' }
  const result = formatInput(parameters)
  const app = process.env.APP_NAME || 'sandbox'
  const newParameters = {
    name: 'james',
    sort_id: 'testing#users#shcnw9w8alab',
    app,
  }
  t.deepEqual(result, newParameters, 'input parameters reformated correctly.')
  t.end()
})

test('formatAttributes returns formated attributes', t => {
  const attributes = { name: 'james', age: 4 }
  const result = formatAttributes(attributes)
  const expected = [{ name: 'james' }, { age: Long.fromNumber(4) }]
  t.ok(Array.isArray(result), 'got an array back')
  t.deepEqual(result, expected, 'returns correctly formatted array')
  t.end()
})

test('validateKey validates key.', t => {
  t.plan(4)
  const validKey = 'stuff'
  const startsWithNumberKey = '93things'
  const numberKey = 9
  const keyWithSymbols = '4$8*9_-fhs'
  t.ok(validateKey(validKey), `shows valid key, '${validKey}', as valid`)
  try {
    validateKey(startsWithNumberKey)
  } catch (error) {
    t.pass(`throws error for key starting with number: ${startsWithNumberKey}`)
  }
  try {
    validateKey(numberKey)
  } catch (error) {
    t.pass(`throws error for key which is type number: ${numberKey}`)
  }
  try {
    validateKey(keyWithSymbols)
  } catch (error) {
    t.pass(
      `throws error for key containing symbols other than _: ${keyWithSymbols}`,
    )
  }
})
