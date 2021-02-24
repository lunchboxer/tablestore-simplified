const { getDataTableName } = require('../utils/get-data-table-name')
const { formatInput } = require('../utils/format-input')
const { batchWrite } = require('../database/batch-write')

const MAX_BATCH_SIZE = 30

module.exports.batch = async parameters => {
  if (parameters.length > MAX_BATCH_SIZE) {
    throw new Error(
      `Batch size ${parameters.length} exceeds maximum size (${MAX_BATCH_SIZE})`,
    )
  }
  // 1. maske sure that data table exists in db, and get the data table name
  const tableName = await getDataTableName()
  // 2. Format the inputs
  const inputs = parameters.map(item => formatInput(item))
  // 3. remove rows from db
  const keysOfDeletedRows = await batchWrite(tableName, inputs, 'DELETE')
  // 4. Is this what @begin/data returns?
  return keysOfDeletedRows
}
