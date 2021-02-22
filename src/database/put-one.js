const TableStore = require('tablestore')
const { client } = require('./tablestore-client')
const { formatAttributes } = require('../utils/format-attributes')

module.exports.putOne = async (tableName, input) => {
  if (!input || !typeof input === 'object') {
    throw new TypeError('input must be non-null object')
  }
  const { app, sort_id, ...attributes } = input
  const attributeColumns = formatAttributes(attributes)
  const parameters = {
    tableName,
    condition: new TableStore.Condition(
      TableStore.RowExistenceExpectation.IGNORE,
      null,
    ),
    primaryKey: [{ app }, { sort_id }],
    attributeColumns,
  }
  const response = await client.putRow(parameters)
  // return the number of rows written to the database
  const numWritten = response.consumed.capacityUnit.write
  return numWritten
}
