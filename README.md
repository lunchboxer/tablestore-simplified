# Tablestore Simplified

When you look at the documentation for Alibaba Cloud's Tablestore node sdk, you'll thank me for making it so you don't actually need to use it.

This small library simplifies basic database interactions to a single function call with an input object.

The project is very heavily inspired by [begin-data](https://github.com/smallwins/begin-data). In fact, the API is intended to be identical, so that it could serve as a drop-in replacement

Row-level ttl is not supported by Tablestore, so no ttl features are available with this library.

## Setup

This library uses async/await and other features which require node version >= 10.

First thing, you'll need an Alibaba Cloud account, a Tablestore instance, and a table called `simplified` set up with two primary keys. The first (partition key) is called `app` and the second is called `sortId` both of these are string type. Then, create an index table for the two primary keys and call it `simplified_index`.

After that the Tablestore client expects several environment variables:

```sh
ACCESS_KEY_SECRET=
ACCESS_KEY_ID=

OTS_ENDPOINT=https://instancename.region.something.aliyuncs.com
OTS_INSTANCE_NAME=
APP_NAME=whatever-you-like

### OPTIONAL ###
SIMPLIFIED_TABLE_NAME=simplified # default
SIMPLIFIED_INDEX_NAME=simplified_index # defaults to table_name + '_index'
ENV=testing # data stored seperately for each environment

```

## Usage

It's easy. Start by installing this package.

```sh
npm import --save tablestore-simplified
```

... and importing `data` (or whatever you feel like calling it) in your app

```javascript
// app.js
const data = require('tablestore-simplified')
```

### API

Call functions on the `data` object, namely `get`, `set`, and `destroy`. In addition, there are convenience methods `count`, `incr`, and `decr`

Whereas you may expect rows are given UIDs in an attribute labeled `id`, this library, like `@begin/data` which it imitates, uses the label `key`. These keys can be any string.

These functions return promises so `async/await` is recommended.

Tablestore has String, Integer, Double, Boolean, and Binary types. String and Boolean map to javascript primitives. These and floating point numbers can be passed in safely. Binary is mapped a javascript Buffer type, but is currently ignored by this library. Integers are converted to 64-bit signed integers by this library to be compatible with Tablestore. Objects and arrays are supported by converting them to JSON by the user before passing them in as parameters.

Batch operations are limited to 25 items

#### set()

Create a new row in the table or overwrite an existing one. If no key is given, a 12-character UID is generated. Create one row or pass in an array to create multiple rows. Returns the new row as an object, or an array of objects if multiple given.

```javascript
const newUser = await data.set({ table: 'users', name: 'John' })
console.log(newUser) // { table: 'users', name: 'John', key: 'V5j3KZqxCx' }

const newUsers = await data.set([
  { table: 'users', name: 'Susanne' },
  { table: 'users', name: 'Larry' },
])
```

#### get()

Retrieve a row or multiple rows by key, or an entire table by name. Returns a single object or an array of objects. When requesting a whole table the number of items returned is set by `limit` which defaults to 20. A cursor is returned when table is larger than the limit. Pass that cursor back in to get the next page of results.

```javascript
const oneUser = await data.get({ table: 'users', key: 'ajJ92HIho-2_' })
console.log(oneUser) // { table:'users', key: 'ajJ92HIho-2_', name: 'Susanne' }

const allUsers = await data.get({ table: 'users' })
console.log(allUsers) // [{table: 'users', key: 'i9W-a5oqAV52', name: 'Larry'}, {...}, {...}]

const manyFoods = await data.get({ table: 'foods' })
const { cursor } = manyFoods
const moreFoods = await data.get({ table: 'foods', cursor })
```

#### destroy()

Delete a row by key. Returns an empty object, or undefined if called with an array.

```javascript
await data.destroy({ table: 'users', key: 'ajJ92HIho-2_' })
```

#### count()

Get the number of items in a table.

```javascript
const numberOfAnimals = data.count({ table: 'animals' })
console.log(numberOfAnimals) // 42
```

#### incr() and decr()

Increment or decrement a single attribute on an item. If the prop given doesn't exist on the item, then it will be initialized with a value of 0 before adding or subtracting one.

```javascript
const newFreckleCount = await data.incr({
  table: 'children',
  key: 'Rebecca',
  prop: 'freckles', // was 12
})
console.log(newFreckleCount) // { freckles: 13 }
```

#### page()

For convenience this function wraps get() in an async iterator to allow easily paging through results of a whole table.

```javascript
const pages = data.page({ table: 'animals' })
for await (let page of pages) {
  console.log(page)
}
```
