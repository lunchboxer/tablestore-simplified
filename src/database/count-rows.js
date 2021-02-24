const TableStore = require('tablestore')
const { client } = require('./tablestore-client')

module.exports.countRows = async (tableName, app, prefix) => {
  const indexName = process.env.SIMPLIFIED_INDEX_NAME || tableName + '_index'
  const parameters = {
    tableName,
    indexName,
    searchQuery: {
      limit: 0, // this tells tablestore to only return a count, no data
      getTotalCount: true,
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
      returnType: TableStore.ColumnReturnType.RETURN_NONE,
    },
  }
  const response = await client.search(parameters)
  return Number.parseInt(response.totalCounts)
}
