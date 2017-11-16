import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  invalidateHydraAPIDoc,
  changeHydraAPIDoc,
  fetchHydraAPIDocIfNeeded
} from '../actions'
import IRIEntry from '../components/IRIEntry'
import HydraFrame from './HydraFrame'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class HydraApp extends Component {
    constructor(props) {
		super(props)

		this.handleIRISubmit = this.handleIRISubmit.bind(this)
		this.handleRefreshClick = this.handleRefreshClick.bind(this)
        this.handleDebugLogIn = this.handleDebugLogIn.bind(this)
	}

  componentDidMount() {
    const { dispatch, currentHydraAPIDoc } = this.props
    dispatch(fetchHydraAPIDocIfNeeded(currentHydraAPIDoc))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentHydraAPIDoc !== this.props.currentHydraAPIDoc) {
      console.log("Different Hydra API Doc requested")
      const { dispatch, currentHydraDoc } = nextProps
      dispatch(invalidateHydraAPIDoc(currentHydraDoc))
      dispatch(fetchHydraAPIDocIfNeeded(currentHydraDoc))
    }
  }

  handleIRISubmit(nextIri) {
    this.props.dispatch(changeHydraAPIDoc(nextIri))
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, currentHydraAPIDoc } = this.props
    dispatch(invalidateHydraAPIDoc(currentHydraAPIDoc))
    dispatch(fetchHydraAPIDocIfNeeded(currentHydraAPIDoc))
  }

  // TODO: remove this debug method of logging in
  handleDebugLogIn(e) {
    e.preventDefault()

    // Response will set an auth cookie
    fetch('http://localhost:8080/temp-authenticate', {
        method: 'POST',
        credentials: 'include',
        headers: {

        }
    })
        .then(response => console.log('Logged in'))
  }

  hydraFrame() {
      return
  }

  render() {
    const { currentHydraAPIDoc,
        isFetching,
        lastUpdated,
        apiDoc,
        entryPoint,
        advancedMode } = this.props
    const isEmpty = !apiDoc["@type"]

    return (
        <Router>
      <div>
        {advancedMode &&
            <div>
                <IRIEntry value={currentHydraAPIDoc}
                  onSubmit={this.handleIRISubmit} />
                <p><button onClick={this.handleDebugLogIn}>Debug Login</button></p>
                <p>
                  {lastUpdated &&
                    <span>
                      API Doc Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
                      {' '}
                    </span>
                  }
                  {!isFetching &&
                    <button onClick={this.handleRefreshClick}>
                      Refresh
                    </button>
                  }
                </p>
                <hr />
            </div>
        }

        <div>
          {isEmpty
            ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
            : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                <Link to="/">Home</Link>

                <Route exact path="/" render={(props) => (
                    <HydraFrame frameId="main" apiDoc={apiDoc} defaultIri={entryPoint} />
                )}/>
                <Route path='/view' render={(props) => {
                    const params = new URLSearchParams(props.location.search)
                    const iri = params.get('iri')
                    if (!iri) {
                        throw new Error("Not a valid view URL, missing iri parameter.")
                    }
                    return (<HydraFrame frameId="main" apiDoc={apiDoc} defaultIri={iri} />)
                }}/>

              </div>
          }
        </div>
      </div>
    </Router>)
  }
}

HydraApp.propTypes = {
  currentHydraAPIDoc: PropTypes.string.isRequired,
  apiDoc: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
  advancedMode: PropTypes.bool.isRequired
}

const mapStateToProps = state => {
  const { currentHydraAPIDoc,
      hydraAPIDoc,
      entryPoint,
      advancedMode } = state.hydra
  const {
    isFetching,
    lastUpdated,
    content: apiDoc
  } = hydraAPIDoc.content ? hydraAPIDoc : {
    isFetching: true,
    content: {}
  }

  return {
    entryPoint,
    currentHydraAPIDoc,
    apiDoc,
    isFetching,
    lastUpdated,
    advancedMode
  }
}

export default connect(mapStateToProps)(HydraApp)
