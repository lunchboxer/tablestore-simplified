const { listTables } = require('../database/list-tables')

const tableName = process.env.SIMPLIFIED_TABLE_NAME || 'simplified'

const getDataTableName = async () => {
  const tables = await listTables()
  const exists = tables.includes(tableName)
  if (exists) return tableName
  else throw new ReferenceError('Could not find the data table.')
}

module.exports = {
  getDataTableName,
}
