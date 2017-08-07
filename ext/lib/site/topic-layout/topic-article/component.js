import React, { Component } from 'react'
import bus from 'bus'
import t from 't-component'
import urlBuilder from 'lib/url-builder'
import userConnector from 'lib/site/connectors/user'
import Header from './header/component'
import Content from './content/component'
import Footer from './footer/component'
import Social from './social/component'
import Vote from './vote/component'
import Poll from './poll/component'
import Cause from './cause/component'
import Comments from './comments/component'
import AdminActions from './admin-actions/component'
import Proyectos from 'ext/lib/site/proyectos/component'
import {Link} from 'react-router'

class TopicArticle extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showSidebar: false
    }
  }

  componentWillMount () {
    bus.on('sidebar:show', this.toggleSidebar)
  }

  componentDidUpdate () {
    document.body.scrollTop = 0
  }

  componentWillUnmount () {
    bus.off('sidebar:show', this.toggleSidebar)
  }

  toggleSidebar = (bool) => {
    this.setState({
      showSidebar: bool
    })
  }

  handleCreateTopic = () => {
    window.location = urlBuilder.for('admin.topics.create', {
      forum: this.props.forum.name
    })
  }

  render () {
    const {
      topic,
      forum,
      user
    } = this.props

    const userAttrs = user.state.fulfilled && (user.state.value || {})
    const canCreateTopics = userAttrs.privileges &&
      userAttrs.privileges.canManage &&
      forum &&
      forum.privileges &&
      forum.privileges.canChangeTopics

    if (!topic) {
      return (
        <div className='no-topics'>
          <p>{t('homepage.no-topics')}</p>
          {
            canCreateTopics && (
              <button
                className='btn btn-primary'
                onClick={this.handleCreateTopic} >
                {t('homepage.create-debate')}
              </button>
            )
          }
        </div>
      )
    }

    return (
      <div className='topic-article-wrapper'>
        {
          this.state.showSidebar &&
            <div onClick={hideSidebar} className='topic-overlay' />
        }
        {
          topic.coverUrl && <div className="cover" style={{backgroundImage: 'url("' + topic.coverUrl + '")'}}></div>
        }
        <AdminActions forum={forum} topic={topic} />
        <Header
          closingAt={topic.closingAt}
          closed={topic.closed}
          author={topic.author}
          authorUrl={topic.authorUrl}
          tags={topic.tags}
          forumName={forum.name}
          mediaTitle={topic.mediaTitle} />
        {topic.clauses && <Content clauses={topic.clauses} />}
        {
          topic.links && (
            <Footer
              source={topic.source}
              links={topic.links}
              socialUrl={topic.url}
              title={topic.mediaTitle} />
          )
        }
        {
          topic.action.method && topic.action.method === 'vote' && (
            <Vote
              votes={{
                positive: topic.upvotes || [],
                negative: topic.downvotes || [],
                neutral: topic.abstentions || []
              }}
              closed={topic.closed}
              id={topic.id}
              url={topic.url}
              closingAt={topic.closingAt}
              canVoteAndComment={forum.privileges.canVoteAndComment} />
          )
        }
        {
          topic.action.method && topic.action.method === 'poll' && (
            <div className='topic-article-content'>
              <Poll
                topic={topic}
                canVoteAndComment={forum.privileges.canVoteAndComment} />
            </div>
          )
        }
        {
          topic.action.method && topic.action.method === 'cause' && (
            <div className='topic-article-content'>
              <Cause
                topic={topic}
                canVoteAndComment={forum.privileges.canVoteAndComment} />
            </div>
          )
        }
        <Social topic={topic} />
        <div className='topic-tags topic-article-content'>
          {topic.tags && topic.tags.map((t) => `#${t}`).join(' ')}
        </div>
        <div className='topic-tags topic-article-content votar-este'>
          <Link className='boton-azul btn' to='/s/acerca-de#mapa'>VOTAR ESTE PROYECTO</Link>
        </div>
        {
          !user.state.pending && <Comments forum={forum} topic={topic} />
        }
        <Proyectos />
      </div>
    )
  }
}

export default userConnector(TopicArticle)

function hideSidebar () {
  bus.emit('sidebar:show', false)
}
