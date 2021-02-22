const { one } = require('./one')
const { batch } = require('./batch')

module.exports.set = async parameters => {
  if (!parameters) {
    throw new ReferenceError('Missing parameters')
  }
  const exec = Array.isArray(parameters) ? batch : one
  return await exec(parameters)
}
