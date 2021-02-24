const { counter } = require('./counter')

module.exports.incr = parameters => {
  return counter(parameters, true)
}
