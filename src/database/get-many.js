const { client } = require('./tablestore-client')
const { extractResults } = require('../utils/extract-results')

module.exports.getMany = async (tableName, inputs) => {
  if (!inputs || !Array.isArray(inputs)) {
    throw new TypeError('inputs must be an array')
  }
  if (inputs.length === 0) return []
  const primaryKey = inputs.map(input => {
    const { app, sortId } = input
    return [{ app }, { sortId }]
  })
  const parameters = { tables: [{ tableName, primaryKey }] }
  const response = await client.batchGetRow(parameters)
  return extractResults(response)
}
