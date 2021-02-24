const { counter } = require('./counter')

module.exports.decr = parameters => {
  return counter(parameters, false)
}
