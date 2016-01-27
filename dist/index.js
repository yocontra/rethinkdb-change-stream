'use strict';

exports.__esModule = true;

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (q) {
  var stream = _through2.default.obj();

  q.then(function (feed) {
    if (!feed.each) {
      throw new Error('Passed in a query with no change feed');
    }
    stream.once('end', function () {
      return feed.close();
    });

    feed.each(function (err, doc) {
      if (err) return stream.emit('error', err);

      var old = doc.getOldValue();
      if (doc.isSaved() === false) {
        return stream.write({
          type: 'delete',
          data: {
            prev: doc
          }
        });
      }

      if (old == null) {
        return stream.write({
          type: 'insert',
          data: {
            next: doc
          }
        });
      }

      return stream.write({
        type: 'update',
        data: {
          prev: old,
          next: doc
        }
      });
    });
  }).error(function (err) {
    return stream.emit('error', err);
  });

  return stream;
};

module.exports = exports['default'];