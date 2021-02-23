const TableStore = require('tablestore')
const { client } = require('./tablestore-client')

module.exports.deleteMany = async (tableName, inputs) => {
  if (!inputs || !Array.isArray(inputs)) {
    throw new TypeError('inputs must be an array')
  }

  const rows = inputs.map(input => {
    const { app, sortId } = input
    return {
      type: 'DELETE',
      condition: new TableStore.Condition(
        TableStore.RowExistenceExpectation.IGNORE,
      ),
      primaryKey: [{ app }, { sortId }],
    }
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
  // return an array of the items destroyed
  // return response.tables.map(deletion => {
  //   if (deletion.isOk) {
  //     return deletion.primaryKey[1].value.split('#')[2]
  //   }
  // })
  return []
}
