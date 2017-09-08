import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import debounce from 'lodash.debounce'
import jump from 'jump.js'

export default class Anchor extends Component {
  static anchors = {}

  static goTo (id) {
    if (!this.anchors[id]) return
    if (id === 'container' && (window.matchMedia("(max-width: 768px)").matches)) {
      jump(this.anchors[id], {
        duration: 400,
        offset: -180
      })
    } else if (id === 'container' && (window.matchMedia("(max-width: 975px)").matches)) {
      jump(this.anchors[id], {
        duration: 400,
        offset: -230
      })
    } else if (id === 'container') {
      jump(this.anchors[id], {
        duration: 400,
        offset: -250
      })
    } else {
      jump(this.anchors[id], {
        duration: 400,
        offset: -100
      })
    }
  }

  static start () {
    if (this._stop) return
    this._stop = browserHistory.listen(this.handleHashChange)
  }

  static stop () {
    if (this._stop) this._stop()
    delete this._stop
  }

  static handleHashChange = debounce(({ hash }) => {
    if (!hash) return
    Anchor.goTo(hash.slice(1))
  }, 200)

  componentDidMount () {
    Anchor.start()
  }

  componentWillUnmount () {
    const { id } = this.props
    if (id && Anchor.anchors[id]) delete Anchor.anchors[id]
  }

  render () {
    const { id, children } = this.props

    return (
      <div {...this.props} id={id} ref={(el) => { Anchor.anchors[id] = el }}>
        {children}
      </div>
    )
  }
}

Anchor.propTypes = {
  id: React.PropTypes.string
}
