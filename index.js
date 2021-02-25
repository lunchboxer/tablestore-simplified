const { get } = require('./src/get')
const { set } = require('./src/set')
const { destroy } = require('./src/destroy')
const { page } = require('./src/page')
const { count } = require('./src/count')
const { incr } = require('./src/incr')
const { decr } = require('./src/decr')

module.exports = {
  get,
  set,
  destroy,
  page,
  count,
  incr,
  decr,
}
