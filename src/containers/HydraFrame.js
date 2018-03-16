import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  fetchDocForFrameIfNeeded,
  invalidateFrame, changeIRIForFrame
} from '../actions'
import IRIEntry from '../components/IRIEntry'
import HydraDoc from '../containers/HydraDoc'
import HydraCollection from '../components/HydraCollection'
import { findSupportedClass, isSubClassOf } from '../hydra/apidoc'
import { HydraNamespace } from '../namespaces/Hydra'
import { typesContainAny } from '../jsonld/helper'
import { withRouter, Link } from 'react-router-dom'

class HydraFrame extends Component {
    constructor(props) {
        console.log("[HydraFrame] constructor()")
		super(props)

		this.handleIRISubmit = this.handleIRISubmit.bind(this)
		this.handleRefreshClick = this.handleRefreshClick.bind(this)
        // this.handleHomeClick = this.handleHomeClick.bind(this)
	}

    updateToNewIRI(newIRI) {
        // Updates the componenent to point to a new IRI
        const { dispatch, frameId } = this.props
        dispatch(changeIRIForFrame(frameId, newIRI))
        dispatch(invalidateFrame(frameId))
        dispatch(fetchDocForFrameIfNeeded(frameId, newIRI))
    }

    componentDidMount() {
        const { dispatch, frameId, iri, requestedIri, useRoutes } = this.props
        console.log("[HydraFrame] componentDidMount()", frameId, iri, requestedIri, useRoutes)
        if (useRoutes) {
            // Using React Routes to navigate this Frame - use requestedIri param
            if (iri !== requestedIri) {
                // State IRI out of sync with the requested IRI, update the state
                this.updateToNewIRI(requestedIri)
            } else {
                dispatch(fetchDocForFrameIfNeeded(frameId, iri))
            }
        } else {
            // Not using React Routes - ignore requestedIri param
            dispatch(fetchDocForFrameIfNeeded(frameId, iri))
        }

    }

    // Works with defaultIri
    // componentDidMount() {
    //     const { dispatch, frameId, iri } = this.props
    //     console.log("[HydraFrame] componentDidMount()", frameId, iri)
    //     dispatch(fetchDocForFrameIfNeeded(frameId, iri))
    // }

    componentWillReceiveProps(nextProps) {
        const { dispatch, frameId, iri } = this.props
        const { useRoutes } = nextProps
        console.log("[HydraFrame] componentWillReceiveProps()", nextProps.iri, this.props.iri, useRoutes)

        if (useRoutes) {
            // Using React Routes to navigate this Frame - use requestedIri param
            // passed from Router
            if (nextProps.requestedIri !== iri) {
            // if (nextProps.iri !== this.props.iri) {
                // console.log("[HydraFrame] Different Hydra Doc requested", currentIri, nextProps.requestedIri)
                console.log("[HydraFrame] Different Hydra Doc requested")
                const { requestedIri } = nextProps
                this.updateToNewIRI(requestedIri)
                // dispatch(changeIRIForFrame(frameId, requestedIri))
                // dispatch(invalidateFrame(frameId))
                // dispatch(fetchDocForFrameIfNeeded(frameId, requestedIri))
            }
        } else {
            // Not using React Routes - ignore requestedIri param and navigate
            // with currentIRIForFrame in Redux State
            if (nextProps.iri !== iri) {
               console.log("[HydraFrame] Hydra Doc IRI changed by action", iri, nextProps.iri)
               // const { iri } = nextProps
               dispatch(invalidateFrame(frameId))
               dispatch(fetchDocForFrameIfNeeded(frameId, nextProps.iri))
           }
        }

        // const currentIri = this.props.currentIri

        // if (nextProps.iri !== this.props.iri) {
        //     console.log("[HydraFrame] Different Hydra Doc requested", currentIri, nextProps.requestedIri)
        //     const { dispatch, frameId, iri } = nextProps
        //     dispatch(invalidateFrame(frameId))
        //     dispatch(fetchDocForFrameIfNeeded(frameId, iri))
        // }
    }

  handleIRISubmit(nextIri) {
    const { dispatch, frameId } = this.props
    dispatch(changeIRIForFrame(frameId, nextIri))
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, frameId, iri } = this.props
    dispatch(invalidateFrame(frameId))
    dispatch(fetchDocForFrameIfNeeded(frameId, iri))
  }

  // handleHomeClick(e) {
  //   e.preventDefault()
  //
  //   const { dispatch, frameId, defaultIri } = this.props
  //   console.log("[HydraFrame.handleHomeClick()]", frameId, defaultIri)
  //   dispatch(changeIRIForFrame(frameId, defaultIri))
  // }

  isHydraDocEmpty() {
    const { hydraDoc } = this.props
    return hydraDoc == null || Object.keys(hydraDoc).length === 0
  }

  isCollection() {
    // Finds out whether the Hydra doc contains a collection
    const { hydraDoc, apiDocClass } = this.props
    const hydraCollectionIRIs = [HydraNamespace.Collection, HydraNamespace.PagedCollection]

    if (this.isHydraDocEmpty()) {
      return false
    }

    // Check if Hydra doc is a collection or if it's sub class of collection
    return typesContainAny(hydraDoc["@type"], hydraCollectionIRIs) ||
      isSubClassOf(apiDocClass, hydraCollectionIRIs)
  }

  render() {
    const { iri,
        isFetching,
        lastUpdated,
        hydraDoc,
        frameId,
        apiDocClass,
        apiDoc,
        advancedMode } = this.props
    const isEmpty = this.isHydraDocEmpty()
    const isCollectn = this.isCollection()
    if (!isEmpty && apiDocClass == null) {
        throw new Error("Couldn't find the Hydra API SupportedClass for " + hydraDoc['@type'])
    }

    // Old home ilnk (without routes)
    // <div><a href="#" onClick={this.handleHomeClick}>Home</a> ({frameId} frame)</div>

    return (
      <div>
        {advancedMode &&
            <div>
                <IRIEntry value={iri}
                  onSubmit={this.handleIRISubmit} />
                <p>
                  {lastUpdated &&
                    <span>
                      Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
                      {' '}
                    </span>
                  }
                  {!isFetching &&
                    <button onClick={this.handleRefreshClick}>
                      Refresh
                    </button>
                  }
                </p>
            </div>
        }
        <div>
          {isEmpty
            ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
            : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                {isCollectn
                  ? <HydraCollection hydraDoc={hydraDoc} supportedClass={apiDocClass} apiDoc={apiDoc} frameId={frameId} />
                  : <HydraDoc hydraDoc={hydraDoc} supportedClass={apiDocClass} frameId={frameId} />
                }
              </div>
          }
        </div>
      </div>)
  }
}

HydraFrame.propTypes = {
  frameId: PropTypes.string.isRequired,
  iri: PropTypes.string.isRequired,
  requestedIri: PropTypes.string.isRequired,
  currentIri: PropTypes.string.isRequired,
  apiDoc: PropTypes.object.isRequired,
  apiDocClass: PropTypes.object,
  hydraDoc: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
  advancedMode: PropTypes.bool.isRequired,
  useRoutes: PropTypes.bool.isRequired
}

const mapStateToProps = (state, ownProps) => {
    const { frameId, requestedIri } = ownProps
    const { hydraDocByFrameId, currentIRIForFrame, advancedMode } = state.hydra

    const {
        isFetching,
        lastUpdated,
        useRoutes,
        content: hydraDoc
    } = hydraDocByFrameId[frameId] || {
        useRoutes: true,
        isFetching: true,
        content: null
    }

    const currentIri = currentIRIForFrame[frameId] // || requestedIri

    const iri = currentIRIForFrame[frameId] // || requestedIri
    console.log("[HydraFrame] using iri, requested iri", iri, requestedIri, useRoutes)
    const apiDocClass = hydraDoc ? findSupportedClass(ownProps.apiDoc, hydraDoc['@type']) : null

    return {
        currentIri,
        requestedIri,
        iri,
        hydraDoc,
        apiDocClass,
        isFetching,
        lastUpdated,
        useRoutes,
        advancedMode
    }
}

export default withRouter(connect(mapStateToProps)(HydraFrame))
