# TableStore Simplified

When you look at the documentation for Alibaba Cloud's TableStore node sdk, you'll thank me for making it so you don't actually need to use it.

This small library simplifies basic database interactions to a single function call with an input object.

The project is very heavily inspired by [begin-data](https://github.com/smallwins/begin-data). In fact, the API is intended to be identical, so that it could serve as a drop-in replacement

## Features

- [x] write single row to table
- [x] write multiple rows
- [x] read a single row from table
- [x] fetch all rows from a "table"
- [ ] pagination with 'cursor'/'token'
- [x] delete a row from table
- [x] delete multiple rows
- [x] increment a value for a single row
- [x] decrement a value
- [x] fetch row count for a table
- [ ] allow setting ttl

## Setup

First thing, you'll need an Alibaba Cloud account, a tablestore instance, and a table called `simplified` set up with two primary keys. The first (partition key) is called `app` and the second is called `sortId` both of these are string type.

After that the tablestore client expects several environment variables:

```sh
ACCESS_KEY_SECRET=
ACCESS_KEY_ID=

OTS_ENDPOINT=https://instancename.region.something.aliyuncs.com
OTS_INSTANCE_NAME=
APP_NAME=whatever-you-like
```
