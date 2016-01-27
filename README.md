# rethinkdb-change-stream [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url]

## Information

- Turns a [RethinkDB change feed](https://rethinkdb.com/docs/changefeeds/javascript/) into a node stream.

## Install

```
npm install rethinkdb-change-stream --save
```

## API

### changeStream(query)

- `query` argument is a rethinkdb query object
  - This can be from thinky, rethinkdb, or rethinkdbdash
- Returns a node.js [Readable Stream](https://nodejs.org/api/stream.html#stream_class_stream_readable)
  - This stream can be piped anywhere you want, including http
  - Ending the stream will also end and clean up the change feed
  - If the change feed encounters an error, the stream will end
- Readable stream emits data events with two attributes:
  - `type` is either insert, update, or delete
  - `data` is an object with two possible fields:
    - `prev` exists if the type is update or delete
      - This is the old value that was removed or updated
    - `next` exists if the type is update or insert
      - This is the new value that was inserted or updated to
    - If using thinky, both `prev` and `next` will be instances of their Model class

## Example (using thinky)

### ES6

```js
import changeStream from 'rethinkdb-change-stream'
import User from 'models/User'

// tail all 18 year olds named "Eric"
var query = User.filter({
  first_name: 'Eric',
  age: 18
}).changes()

var stream = changeStream(query)
stream.on('data', () => {
  // obj.type === insert, update, or delete
  // obj.data === object with prev and next objects
})
```

### ES5

```js
var changeStream = require('rethinkdb-change-stream');
var User = require('models/User');

// tail all 18 year olds named "Eric"
var query = User.filter({
  first_name: 'Eric',
  age: 18
}).changes();

var stream = changeStream(query);
stream.on('data', function(obj){
  // obj.type === insert, update, or delete
  // obj.data === object with prev and next objects
});
```

[downloads-image]: http://img.shields.io/npm/dm/rethinkdb-change-stream.svg
[npm-url]: https://npmjs.org/package/rethinkdb-change-stream
[npm-image]: http://img.shields.io/npm/v/rethinkdb-change-stream.svg
