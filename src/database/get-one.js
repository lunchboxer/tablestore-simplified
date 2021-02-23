const { client } = require('./tablestore-client')

module.exports.getOne = async (tableName, input) => {
  // query the database for one row by key
  if (!input || !typeof input === 'object') {
    throw new TypeError('input must be non-null object')
  }
  const { app, sortId } = input
  const parameters = {
    maxVersions: 1,
    tableName,
    primaryKey: [{ app }, { sortId }],
  }
  const response = await client.getRow(parameters)
  return response.row
}
