const TableStore = require('tablestore')

module.exports.formatResponseRow = row => {
  if (!row || typeof row !== 'object') {
    throw new TypeError('row must be an object')
  }
  if (!row.primaryKey) return
  const sortId = row.primaryKey.find(pk => pk.name === 'sortId').value
  const [, table, key] = sortId.split('#')
  const newRow = { table, key }
  for (const attribute of row.attributes) {
    // this is a bit of a hack, but if the value is an object then we can
    // assume it is a number, unless its a buff
    if (
      !Buffer.isBuffer(attribute.columnValue) &&
      typeof attribute.columnValue === 'object'
    ) {
      newRow[attribute.columnName] = attribute.columnValue.toNumber()
    } else {
      newRow[attribute.columnName] = attribute.columnValue
    }
  }
  return newRow
}
