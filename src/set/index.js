const { one } = require('./one')
const { batch } = require('./batch')

module.exports.set = parameters => {
  if (!parameters) {
    throw new ReferenceError('Missing parameters')
  }
  const exec = Array.isArray(parameters) ? batch : one
  return exec(parameters)
}
