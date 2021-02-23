const { getDataTableName } = require('../utils/get-data-table-name')
const { formatInput } = require('../utils/format-input')
const { getMany } = require('../database/get-many')
const { formatResponseRow } = require('../utils/format-response-row')

const MAX_BATCH_SIZE = 30

module.exports.batch = async parameters => {
  if (parameters.length > MAX_BATCH_SIZE) {
    throw new Error(
      `Batch size ${parameters.length} exceeds maximum size (${MAX_BATCH_SIZE})`,
    )
  }
  // 1. make sure that data table exists in db, get the name
  const tableName = await getDataTableName()
  // 2.  format the query params needed from given table and key
  const inputs = parameters.map(item => formatInput(item))
  // 3. send the query
  const rows = await getMany(tableName, inputs)
  // 4. format the results
  return rows && rows.length > 0 ? rows.map(row => formatResponseRow(row)) : []
}
