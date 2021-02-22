const { one } = require('./one')
const { batch } = require('./batch')

module.exports.set = async parameters => {
  if (!parameters) {
    throw new ReferenceError('Missing parameters')
  }
  let exec = Array.isArray(parameters) ? batch : one
  return await exec(parameters)
}
