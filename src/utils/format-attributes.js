const TableStore = require('tablestore')
const { validateKey } = require('./validate-key')
const Long = TableStore.Long
// the tableStore client requires attributes to be sent as an arrray of JSON
// key:value pairs like:
// [
//   {'name': 'John'},
//   {'age': 4}
// ]
// Also tablestore types map to Javascript types in the case of boolean and string
// integers requires conversion to an Int64 type
// floating point numbers can be safely passed on
// Binary is allowed, but ignored here
// objects and arrays are converted to JSON by the user

module.exports.formatAttributes = attributes => {
  if (!attributes || typeof attributes !== 'object') {
    throw new TypeError('attributes must be non-null object')
  }
  const propertyNumber = Object.keys(attributes).length
  if (!propertyNumber) throw new Error('attributes object is empty')
  const attributesArray = Object.keys(attributes).map(key => {
    validateKey(key)
    const row = {}
    const value = Number.isInteger(attributes[key])
      ? Long.fromNumber(attributes[key])
      : attributes[key]
    row[key] = value
    return row
  })

  return attributesArray
}
