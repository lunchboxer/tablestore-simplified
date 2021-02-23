const { getOrMakeKey } = require('./get-or-make-key')

module.exports.formatInput = parameters => {
  let { table, key, ...attributes } = parameters
  if (!table || typeof table !== 'string') {
    throw new TypeError("'table' attribute must be set to a string value.")
  }
  if (!key) key = getOrMakeKey(parameters).key
  const environment = process.env.NODE_ENV || 'staging'
  const app = process.env.APP_NAME || 'sandbox'
  const sortId = `${environment}#${table}#${key}`
  return { app, sortId, ...attributes }
}
