import through from 'through2'

export default (q) => {
  const stream = through.obj()

  q.then(feed => {
    if (!feed.each) {
      throw new Error('Passed in a query with no change feed')
    }
    stream.once('end', () => feed.close())

    feed.each((err, doc) => {
      if (err) return stream.emit('error', err)

      const old = doc.getOldValue()
      if (doc.isSaved() === false) {
        return stream.write({
          type: 'delete',
          data: {
            prev: doc
          }
        })
      }

      if (old == null) {
        return stream.write({
          type: 'insert',
          data: {
            next: doc
          }
        })
      }

      return stream.write({
        type: 'update',
        data: {
          prev: old,
          next: doc
        }
      })
    })
  }).error(err => stream.emit('error', err))

  return stream
}
