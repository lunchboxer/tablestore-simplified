const { batch } = require('./batch')
const { one } = require('./one')
const { page } = require('./page')

module.exports.get = parameters => {
  if (!parameters) {
    throw new ReferenceError('Missing parameters')
  }
  if (Array.isArray(parameters)) {
    return batch(parameters)
  }
  if (parameters.table && parameters.key) {
    return one(parameters)
  } else if (parameters.table) {
    return page(parameters)
  } else {
    throw new ReferenceError(
      'Invalid args; expected [{table, key}], {table, key} or {table}',
    )
  }
}
