const { getDataTableName } = require('../utils/get-data-table-name')
const { formatInput } = require('../utils/format-input')
const { putOne } = require('../database/put-one')
const { getOrMakeKey } = require('../utils/get-or-make-key')

module.exports.one = async parameters => {
  // 1. make sure that data table exists in db
  const tableName = await getDataTableName()
  // 2. Get or make a key if none provided
  const parametersWithKey = getOrMakeKey(parameters)
  // 3. format the input
  const input = formatInput(parametersWithKey)
  // 4. write to the db
  const rowsWritten = await putOne(tableName, input)
  // 5. return the complete row with key
  return rowsWritten === 1 ? parametersWithKey : undefined
}
