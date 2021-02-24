const { getDataTableName } = require('../utils/get-data-table-name')
const { formatInput } = require('../utils/format-input')
const { batchWrite } = require('../database/batch-write')
const { getOrMakeKey } = require('../utils/get-or-make-key')

const MAX_BATCH_SIZE = 30

module.exports.batch = async parameters => {
  if (parameters.length > MAX_BATCH_SIZE) {
    throw new Error(
      `Batch size ${parameters.length} exceeds maximum size (${MAX_BATCH_SIZE})`,
    )
  }

  // 1. make sure that data table exists in db
  const tableName = await getDataTableName()
  // 2. Get or make a key if none provided
  const parametersWithKeys = parameters.map(item => getOrMakeKey(item))
  // 3. format the alll the inputs
  const inputs = parametersWithKeys.map(item => formatInput(item))
  // 4. write them to the db
  const keysWritten = await batchWrite(tableName, inputs, 'PUT')
  // 5. return the list of rows with keys, but only the ones that got written
  return keysWritten && keysWritten.length > 0
    ? parametersWithKeys.filter(row => keysWritten.includes(row.key))
    : undefined
}
