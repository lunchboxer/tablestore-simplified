const { getDataTableName } = require('./utils/get-data-table-name')
const { countRows } = require('./database/count-rows')

module.exports.count = async ({ table }) => {
  if (!table) {
    throw new ReferenceError('Missing table parameter')
  }
  // 1. make sure that data table exists in db, get the name
  const tableName = await getDataTableName()
  // 2. make the query prefix
  const environment = process.env.NODE_ENV || 'staging'
  const app = process.env.APP_NAME || 'sandbox'
  const prefix = `${environment}#${table}#`
  // 3. send the query and return the integer received
  return await countRows(tableName, app, prefix)
}
