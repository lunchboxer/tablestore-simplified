const { get } = require('./get')
const { set } = require('./set')

module.exports.counter = async ({ table, key, prop }, isIncr) => {
  // 1. Check parameters
  if (!table) throw new ReferenceError('Missing parameter: table')
  if (!key) throw new ReferenceError('Missing parameter: key')
  if (!prop) throw new ReferenceError('Missing parameter: prop')
  // 2. Get the item from the database
  const item = await get({ table, key })
  // 3. Get the prop, update the value
  if (!item) throw new Error('item not found')
  console.log('original item to increment', item)
  const originalValue = {}.propertyIsEnumerable.call(item, prop)
    ? item[prop]
    : 0
  item[prop] = isIncr ? originalValue + 1 : originalValue - 1
  // 4. update the database
  const updatedRow = await set(item)
  // 5. return just new prop key:value object
  const simpleResponse = {}
  simpleResponse[prop] = updatedRow[prop]
  return simpleResponse
}
