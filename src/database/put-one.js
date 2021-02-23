const TableStore = require('tablestore')
const { client } = require('./tablestore-client')
const { formatAttributes } = require('../utils/format-attributes')

module.exports.putOne = async (tableName, input) => {
  if (!input || !typeof input === 'object') {
    throw new TypeError('input must be non-null object')
  }
  const { app, sortId, ...attributes } = input
  const attributeColumns = formatAttributes(attributes)
  const parameters = {
    tableName,
    condition: new TableStore.Condition(
      TableStore.RowExistenceExpectation.IGNORE,
    ),
    primaryKey: [{ app }, { sortId }],
    attributeColumns,
  }
  const response = await client.putRow(parameters)
  // return the number of rows written to the database
  return response.consumed.capacityUnit.write
}
