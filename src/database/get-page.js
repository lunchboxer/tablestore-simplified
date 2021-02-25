const TableStore = require('tablestore')
const { client } = require('./tablestore-client')

module.exports.getPage = async (tableName, { limit, cursor, app, prefix }) => {
  limit = limit || 20
  const token = cursor ? Buffer.from(cursor, 'base64') : undefined
  const indexName = process.env.SIMPLIFIED_INDEX_NAME || tableName + '_index'

  const parameters = {
    tableName,
    indexName,
    searchQuery: {
      limit,
      token,
      query: {
        queryType: TableStore.QueryType.BOOL_QUERY,
        query: {
          filterQueries: [
            {
              queryType: TableStore.QueryType.PREFIX_QUERY,
              query: {
                fieldName: 'sortId',
                prefix,
              },
            },
            {
              queryType: TableStore.QueryType.TERM_QUERY,
              query: {
                fieldName: 'app',
                term: app,
              },
            },
          ],
        },
      },
    },
    columnToGet: {
      returnType: TableStore.ColumnReturnType.RETURN_ALL,
    },
  }
  const response = await client.search(parameters)
  const rows = [...response.rows]

  // return a cursor if we didn't get all the items
  if (response.nextToken && response.nextToken.length > 0) {
    rows.cursor = response.nextToken.toString('base64')
  }
  return rows
}
