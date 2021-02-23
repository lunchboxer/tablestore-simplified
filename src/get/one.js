const { getDataTableName } = require('../utils/get-data-table-name')
const { formatInput } = require('../utils/format-input')
const { getOne } = require('../database/get-one')
const { formatResponseRow } = require('../utils/format-response-row')

module.exports.one = async parameters => {
  // 1. make sure that data table exists in db, get the name
  const tableName = await getDataTableName()
  // 2.  format the query params needed from given table and key
  const input = formatInput(parameters)
  // 3. send the query
  const row = await getOne(tableName, input)
  // 4. format the results
  if (row) {
    return formatResponseRow(row)
  }
}
