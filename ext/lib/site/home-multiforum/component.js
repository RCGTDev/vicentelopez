import React, { Component } from 'react'
import {Link} from 'react-router'
import config from 'lib/config'
import Footer from 'ext/lib/site/footer/component'
import Barrios from 'ext/lib/site/barrios/component'
import ThumbsVoto from 'ext/lib/site/thumbs-voto/component'
import BannerForoVecinal from 'ext/lib/site/banner-foro-vecinal/component'
import Carrusel from 'ext/lib/site/carrusel/component'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'

export default class HomeMultiforumOverride extends Component {
  constructor(props){
    super(props)
    this.state = {
      forums: null
    }
  }

  componentWillMount () {
    forumStore.findAll().then((forums) => {
      this.setState({ forums: forums })
    })
  }

  render () {
    const { topics, forums } = this.state
    return (
      <div className='ext-home-multiforum'>
        <BannerForoVecinal />
        <ThumbsVoto />
        <div className='seccion-proyectos container-fluid'>
              <h2 className='title'>
                Proyectos
              </h2>
          <Carrusel />
        </div>
        <section className='seccion-barrios container'>
          <h2 className='title'>Barrios</h2>
          <Barrios forums={forums}/>
        </section>
        <Footer />
      </div>
    )
  }
}
