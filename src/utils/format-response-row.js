module.exports.formatResponseRow = row => {
  if (!row || typeof row !== 'object') {
    throw new TypeError('row must be an object')
  }
  if (!row.primaryKey) return
  const sortId = row.primaryKey.find(pk => pk.name === 'sortId').value
  const [, table, key] = sortId.split('#')
  const newRow = { table, key }
  for (const attribute of row.attributes) {
    newRow[attribute.columnName] = attribute.columnValue
  }
  return newRow
}
