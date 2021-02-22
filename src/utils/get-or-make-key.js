const { nanoid } = require('nanoid')

module.exports.getOrMakeKey = parameters => {
  let { key } = parameters
  if (!key) {
    key = nanoid(12)
  }
  return { key, ...parameters }
}
