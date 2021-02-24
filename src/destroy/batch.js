const { getDataTableName } = require('../utils/get-data-table-name')
const { formatInput } = require('../utils/format-input')
const { batchWrite } = require('../database/batch-write')

const MAX_BATCH_SIZE = 25

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
  await batchWrite(tableName, inputs, 'DELETE')
  // 4. Is this what @begin/data returns?
  // it would seem more meaningful to return the keys
  // return keysOfDeletedRows
}
