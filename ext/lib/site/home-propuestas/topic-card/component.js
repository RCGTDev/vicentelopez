import React, { Component } from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import userConnector from 'lib/site/connectors/user'

const estados = (state) => {
  switch (state) {
    case 'no-factible':
      return 'No factible'
      break
    case 'integrado':
      return 'Integrada'
      break
    default:
      return 'Factible'
      break
  }
}

export class TopicCard extends Component {
  componentWillMount() {
    this.setStateFromProps(this.props)
  }

  componentWillReceiveProps(props) {
    this.setStateFromProps(props)
  }
  setStateFromProps(props) {
    const { topic, user } = props

    let userAttrs = user.state.fulfilled && (user.state.value || {})
    let userSuscribed = false
    if(userAttrs && topic.attrs.subscribers){
      let userSuscribers = topic.attrs.subscribers.split(',')
      userSuscribed = userSuscribers.find(user => user === userAttrs.id);
    } else {
      userSuscribed = false
    }

    return this.setState({
      subscribed: !!userSuscribed
    })
    
  }
  render() {
    const { topic, onVote, onSubscribe } = this.props
    const { subscribed } = this.state
    
    return (
      <div className='ext-topic-card ideas-topic-card'>
        <div className='topic-card-info'>
          <div className='topic-creation'>
            <span>{topic.attrs.nombre}</span>
            <span
              className={`date ${(topic.attrs.state !== 'pendiente') && 'space'}`}>
              {moment(topic.createdAt).format('D/M/YY')}
            </span>
            {topic.attrs.state !== 'pendiente' &&
              <span className={`estado ${topic.attrs.state !== 'no-factible' && topic.attrs.state !== 'integrado' ? 'factible' : ''}`}>{estados(topic.attrs.state)}</span>
            }
          </div>
          <h1 className='topic-card-title'>
            <Link to={`/propuestas/topic/${topic.id}`}>
              {topic.mediaTitle}
            </Link>
            <p className='topic-card-description'>
              <Link to={`/propuestas/topic/${topic.id}`}>
                {createClauses(topic)}
              </Link>
            </p>
          </h1>
          {
            topic.tags && topic.tags.length > 0 && (
              <div className='topic-card-tags'>
                {topic.tags.slice(0, 12).map((tag, i) => (
                  <a href={`${window.location.origin + '/propuestas?tags=' + tag}`} key={`${tag}-${i}`} className='badge badge-default'>{tag}</a>

                ))}
              </div>
            )
          }
        </div>
        <div className='topic-card-footer'>
          <div className='subscribe-wrapper'>
            <div className='participants'>
              {topic.attrs.subscribers && topic.attrs.subscribers.split(',').length || 0}
              &nbsp;
            <span className={`icon-bell ${subscribed ? 'blue' : 'gray'}`} />
            </div>
            {subscribed && (
              <button
                className='btn btn-primary'
                onClick={() => onSubscribe(topic.id)}>
                Desuscribirse
              </button>
            )}
            {!subscribed && (
              <button
                disabled={!topic.privileges.canVote}
                className='btn btn-primary btn-empty'
                onClick={() => onSubscribe(topic.id)}>
                Suscribirse
              </button>
            )}
          </div>
          <div className='cause-wrapper'>
            <div className='participants'>
              {topic.action.count}
              &nbsp;
            <span className={`icon-like ${topic.voted ? 'blue' : 'gray'}`} />
            </div>
            {topic.voted && (
              <button disabled className='btn btn-primary btn-filled'>
                Te gusta
              </button>
            )}
            {!topic.voted && (
              <button
                disabled={!topic.privileges.canVote}
                onClick={() => onVote(topic.id)}
                className='btn btn-primary btn-empty'>
                Me gusta
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
}

function createClauses({ attrs, clauses }) {
  let div = document.createElement('div')
  let content
  if (!attrs) {
    content = clauses
      .sort(function (a, b) {
        return a.position > b.position ? 1 : -1
      })
      .map(function (clause) {
        return clause.markup
      })
      .join('')
  } else {
    const { problema, solucion, beneficios } = attrs
    content = `${problema} ${solucion} ${beneficios}`
  }
  div.innerHTML = content
  return div.textContent.replace(/\r?\n|\r/g, '').slice(0, 140) + '...'
}

export default userConnector(TopicCard)
