import React from 'react'
import ReactDOM from 'react-dom'

import styles from './style.css'


if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

const getHashUrl = (hash) => {
  return hash.replace('#', '') || '/'
}


class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = this._getInitialState()
  }

  _getInitialState() {
    const url = getHashUrl(window.location.hash)
    this._loadPage(url)

    return {
      url,
      page: null,
    }
  }

  componentDidMount() {
    window.addEventListener('hashchange', this._onHashChange)
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this._onHashChange)
  }

  _onHashChange = () => {
    const url = getHashUrl(window.location.hash)
    this._loadPage(url)
    this.setState({ url }) 
  }

  _loadPage(url) {
    if (url === 'druha-stranka') {
      require.ensure([], (require) => {
        const page = React.createFactory(require('./druha-stranka'))
        this.setState({ page, url })
      })

      return
    }

    if (url === '/') {
      require.ensure([], (require) => {
        const page = React.createFactory(require('./prvni-stranka'))
        this.setState({ page, url })
      })
      
      return
    }

  }

  render() {
    return this.props.children({  ...this.state  })
  }
} 



const App = (props) => {
  return (
    <Container>
      {({ url, page }) => (
        <div className="app">
          {page && page()}
          <a href={(url === 'druha-stranka' ? '/#' : '/#druha-stranka')}>Odkaz na druhou stránku</a>
        </div>
      )}
    </Container>
  )
}

ReactDOM.render(React.createElement(App, {}), document.getElementById('root'))
