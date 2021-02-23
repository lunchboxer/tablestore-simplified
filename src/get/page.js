const { getDataTableName } = require('../utils/get-data-table-name')
const { getPage } = require('../database/get-page')
const { formatResponseRow } = require('../utils/format-response-row')

module.exports.page = async ({ table, limit, cursor }) => {
  // only table is required
  // 1. make sure the data table exists in db, get the name
  const tableName = await getDataTableName()
  // 2. make the query prefix
  const environment = process.env.NODE_ENV || 'staging'
  const app = process.env.APP_NAME || 'sandbox'
  const prefix = `${environment}#${table}#`
  // 3. send the query
  const rows = await getPage(tableName, { limit, cursor, app, prefix })
  // 4. format the results
  const formattedRows =
    rows && rows.length > 0 ? rows.map(row => formatResponseRow(row)) : []
  // 5. include the cursor this isn't everything
  if (rows.cursor) formattedRows.cursor = rows.cursor
  return formattedRows
}
