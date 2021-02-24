const TableStore = require('tablestore')
const { getDataTableName } = require('../src/utils/get-data-table-name')
const { formatInput } = require('../src/utils/format-input')
const { formatAttributes } = require('../src/utils/format-attributes')
const { validateKey } = require('../src/utils/validate-key')
const { formatResponseRow } = require('../src/utils/format-response-row')

const Long = TableStore.Long
const test = require('tape')

test('getDataTableName returns tableName or throws error', async t => {
  const tableName = process.env.EASY_DATA_TABLE_NAME || 'simplified'
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
  try {
    formatInput(parameters)
  } catch (error) {
    t.pass(`got error as expected, ${error}`)
  }
  t.end()
})

test('formatInput adds key when no key present', t => {
  t.plan(4)
  const parameters = { table: 'users', name: 'james' }
  try {
    const result = formatInput(parameters)
    t.ok(
      result && result.sortId,
      'A parameters object was returned with a sortId',
    )
    const key = result.sortId.split('#')[2]
    t.ok(typeof key === 'string', 'key in sortId is a string')
    const hasOnlySafeCharacters = /^[\w -]+$/g.test(key)
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
    sortId: 'testing#users#shcnw9w8alab',
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
  } catch {
    t.pass(`throws error for key starting with number: ${startsWithNumberKey}`)
  }
  try {
    validateKey(numberKey)
  } catch {
    t.pass(`throws error for key which is type number: ${numberKey}`)
  }
  try {
    validateKey(keyWithSymbols)
  } catch {
    t.pass(
      `throws error for key containing symbols other than _: ${keyWithSymbols}`,
    )
  }
})

test('formatResponseRow reformats a row correctly', t => {
  const date = new Date()
  const dateString = date.toISOString()
  const timestamp = Long.fromNumber(dateString)
  const row = {
    primaryKey: [
      { name: 'app', value: 'ja-graphql' },
      { name: 'sortId', value: 'staging#students#dMuqVrEZfP8Q' },
    ],
    attributes: [
      {
        columnName: 'birthdate',
        columnValue: '2014-11-04',
        timestamp,
      },
      { columnName: 'name', columnValue: 'tom', timestamp },
    ],
  }
  const expected = {
    table: 'students',
    key: 'dMuqVrEZfP8Q',
    birthdate: '2014-11-04',
    name: 'tom',
  }
  const formattedRow = formatResponseRow(row)
  t.deepEqual(formattedRow, expected)
  t.end()
})
