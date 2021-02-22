const { listTables } = require('../database/list-tables')

const tableName = process.env.EASY_DATA_TABLE_NAME || 'easy_data'

const getDataTableName = async () => {
  const tables = await listTables()
  const exists = tables.includes(tableName)
  if (exists) return tableName
  else throw new ReferenceError('Could not find the data table.')
}

module.exports = {
  getDataTableName,
}
