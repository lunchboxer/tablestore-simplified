const { client } = require('../database/tablestore-client')

async function listTables() {
  try {
    const response = await client.listTable()
    return response.tableNames
  } catch (error) {
    console.error('error:', error)
  }
}

module.exports = {
  listTables,
}
