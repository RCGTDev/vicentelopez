const api = require('lib/api-v2/db-api')
const topicScopes = require('lib/api-v2/db-api/topics/scopes')

exports.parseTags = (req, res, next) => {
  req.query.tags = req.query.tags.split(',').filter((t) => !!t)
  next()
}

exports.parseStates = (req, res, next) => {
  req.query.state = req.query.state.split(',').filter((t) => !!t)
  next()
}

exports.findPropuestasForum = (req, res, next) => {
  api.forums.find({ name: 'propuestas' })
    .findOne()
    .exec()
    .then((forum) => {
      if (!forum) {
        const err = new Error('Forum "propuestas" not found.')
        err.status = 404
        err.code = 'FORUM_NOT_FOUND'
        return next(err)
      }

      req.forum = forum

      next()
    })
    .catch(next)
}

const queryTopics = (opts) => {
  const {
    state,
    forum,
    tags,
    barrio
  } = opts

  const query = {
    forum: forum._id,
    publishedAt: { $ne: null }
  }

  if (barrio) query['attrs.barrio'] = barrio
  if (tags.length > 0) query.tags = { $in: tags }
  if (state.length > 0) query['attrs.state'] = { $in: state }

  return api.topics.find().where(query)
}

const sortMap = {
  newest: '-createdAt',
  popular: '-action.count'
}

exports.findTopics = (opts) => {
  const {
    forum,
    limit = 30,
    page = 1,
    sort
  } = opts

  return queryTopics(opts)
    .populate(topicScopes.ordinary.populate)
    .select(topicScopes.ordinary.select)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort(sortMap[sort])
    .exec()
    .then((topics) => Promise.all(topics.map((topic) => {
      return topicScopes.ordinary.expose(topic, forum)
    })))
}

exports.findTopicsCount = (opts) => queryTopics(opts).count().exec()
