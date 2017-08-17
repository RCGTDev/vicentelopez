import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import bus from 'bus'
import config from 'lib/config'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import topicConnector from 'lib/site/connectors/topic'
import TopicArticle from './topic-article/component'
import Jump from 'ext/lib/site/jump-button/component'
import Anchor from 'ext/lib/site/anchor'
import Footer from 'ext/lib/site/footer/component'

export class TopicLayout extends Component {
  state = {
    topics: null,
    forum: null
  }

  componentDidMount () {
    let name = this.props.params.forum

    if (!name && !config.multiForum) {
      name = config.defaultForum
    }

    forumStore.findOneByName(name)
      .then((forum) => {
        this.setState({
          forum
        })
      })
      .catch((err) => {
        if (err.status === 404) {
          window.location = '/404'
          return
        }

        throw err
      })
  }

  goTop () {
    Anchor.goTo('container')
  }

  render () {
    if (config.visibility === 'hidden' && this.props.user.state.rejected) {
      browserHistory.push('/signin')
      return null
    }

    const { topic } = this.props
    const { forum } = this.state

    return (
      <div>
        <Anchor id='container'>
          <div id='topic-wrapper'>
            {forum && topic && (
              <TopicArticle topic={topic} forum={forum} />
            )}
          </div>
          <Jump goTop={this.goTop} />
          <Footer />
        </Anchor>
      </div>
    )
  }
}

export default userConnector(topicConnector(TopicLayout))
