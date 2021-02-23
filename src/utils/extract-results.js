module.exports.extractResults = response => {
  return response.tables[0]
    .map(row => {
      const { isOk, primaryKey, attributes } = row
      return isOk && primaryKey && { primaryKey, attributes }
    })
    .filter(row => !!row)
}
