const { client } = require('../database/tablestore-client')

module.exports.listTables = async () => {
  try {
    const response = await client.listTable()
    return response.tableNames
  } catch {
    throw new Error('unable to get list of tables')
  }
}
