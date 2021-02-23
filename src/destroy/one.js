const { getDataTableName } = require('../utils/get-data-table-name')
const { formatInput } = require('../utils/format-input')
const { deleteOne } = require('../database/delete-one')

module.exports.one = async parameters => {
  // 1. maske usre that data table exists in db, and get the data table name
  const tableName = await getDataTableName()
  // 2. Format the input
  const input = formatInput(parameters)
  // 3. remove row from db
  const emptyObject = await deleteOne(tableName, input)
  // 4. @begin/data.destroy returns {} so we do too
  return emptyObject
}
