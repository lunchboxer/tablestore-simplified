const TableStore = require('tablestore')
const { client } = require('./tablestore-client')
const { formatAttributes } = require('../utils/format-attributes')

module.exports.putMany = async (tableName, inputs) => {
  if (!inputs || !Array.isArray(inputs)) {
    throw new TypeError('inputs must be an array')
  }
  // Make an array of rows from the inputs array
  const rows = inputs.map(input => {
    const { app, sort_id, ...attributes } = input
    const attributeColumns = formatAttributes(attributes)
    const row = {
      type: 'PUT',
      condition: new TableStore.Condition(
        TableStore.RowExistenceExpectation.IGNORE,
        undefined,
      ),
      primaryKey: [{ app }, { sort_id }],
      attributeColumns,
      returnContent: { returnType: TableStore.ReturnType.Primarykey },
    }
    return row
  })
  // construct the parameters object to send the server
  const parameters = {
    tables: [
      {
        tableName,
        rows,
      },
    ],
  }
  const response = await client.batchWriteRow(parameters)
  const writtenKeys = response.tables.map(write => {
    if (write.isOk) {
      return write.primaryKey[1].value.split('#')[2]
    }
    return 'error'
  })
  return writtenKeys
}
