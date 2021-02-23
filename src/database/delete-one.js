const TableStore = require('tablestore')
const { client } = require('./tablestore-client')

module.exports.deleteOne = async (tableName, { app, sortId }) => {
  if (!app || !sortId) {
    throw new TypeError('app and sortId are required')
  }
  const parameters = {
    tableName,
    condition: new TableStore.Condition(
      TableStore.RowExistenceExpectation.IGNORE,
    ),
    primaryKey: [{ app }, { sortId }],
  }
  const response = await client.deleteRow(parameters)
  if (response.consumed.capacityUnit.write === 1) return {}
}
