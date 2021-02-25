const { get } = require('./get')

async function * page (parameters) {
  if (!parameters.table) {
    throw new ReferenceError('table parameter is required')
  }

  let cursor = true

  const internalParameters = { ...parameters }

  while (cursor) {
    if (typeof cursor === 'string') {
      internalParameters.cursor = cursor
    }

    const response = await get(internalParameters)
    cursor = response.cursor

    yield response
  }
}

module.exports = {
  page,
}
