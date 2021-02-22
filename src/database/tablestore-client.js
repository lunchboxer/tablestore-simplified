const TableStore = require('tablestore')

const accessKeyId = process.env.ACCESS_KEY_ID
const secretAccessKey = process.env.ACCESS_KEY_SECRET
const endpoint = process.env.OTS_ENDPOINT
const instancename = process.env.OTS_INSTANCE_NAME

module.exports.client = new TableStore.Client({
  accessKeyId,
  secretAccessKey,
  endpoint,
  instancename,
})
