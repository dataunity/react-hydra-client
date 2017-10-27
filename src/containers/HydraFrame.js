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

class HydraFrame extends Component {
    constructor(props) {
		super(props)

		this.handleIRISubmit = this.handleIRISubmit.bind(this)
		this.handleRefreshClick = this.handleRefreshClick.bind(this)
        this.handleHomeClick = this.handleHomeClick.bind(this)
	}

  componentDidMount() {
    const { dispatch, frameId, iri } = this.props
    dispatch(fetchDocForFrameIfNeeded(frameId, iri))
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps()", nextProps.iri, this.props.iri)
    if (nextProps.iri !== this.props.iri) {
      console.log("Different Hydra Doc requested")
      const { dispatch, frameId, iri } = nextProps
      dispatch(invalidateFrame(frameId))
      dispatch(fetchDocForFrameIfNeeded(frameId, iri))
    }
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

  handleHomeClick(e) {
    e.preventDefault()

    const { dispatch, frameId, defaultIri } = this.props
    console.log("[HydraFrame.handleHomeClick()]", frameId, defaultIri)
    dispatch(changeIRIForFrame(frameId, defaultIri))
  }

  isHydraDocEmpty() {
    const { hydraDoc } = this.props
    return hydraDoc == null || Object.keys(hydraDoc).length === 0
  }

  isCollection() {
    // Finds out whether the Hydra doc contains a collection
    const { hydraDoc, apiDocClass } = this.props
    const hydraCollectionIRIs = [HydraNamespace.Collection, HydraNamespace.PagedCollection]

    if (this.isHydraDocEmpty()) {
      return false;
    }

    // Check if Hydra doc is a collection or if it's sub class of collection
    return typesContainAny(hydraDoc["@type"], hydraCollectionIRIs) ||
      isSubClassOf(apiDocClass, hydraCollectionIRIs)
  }

  render() {
    const { iri, isFetching, lastUpdated, hydraDoc, frameId, apiDocClass, apiDoc, defaultIri } = this.props
    const isEmpty = this.isHydraDocEmpty()
    const isCollectn = this.isCollection()
    if (!isEmpty && apiDocClass == null) {
        throw new Error("Couldn't find the Hydra API SupportedClass for " + hydraDoc['@type'])
    }

    return (
      <div>
        <div><a href="#" onClick={this.handleHomeClick}>Home</a> ({frameId} frame)</div>
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
  apiDoc: PropTypes.object.isRequired,
  apiDocClass: PropTypes.object,
  hydraDoc: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const { frameId, defaultIri } = ownProps
  const { hydraDocByFrameId, currentIRIForFrame } = state.hydra

  const {
    isFetching,
    lastUpdated,
    content: hydraDoc
  } = hydraDocByFrameId[frameId] || {
    isFetching: true,
    content: null
  }
  const iri = currentIRIForFrame[frameId] || defaultIri
  const apiDocClass = hydraDoc ? findSupportedClass(ownProps.apiDoc, hydraDoc['@type']) : null

  return {
    iri,
    hydraDoc,
    apiDocClass,
    isFetching,
    lastUpdated,
    defaultIri
  }
}

export default connect(mapStateToProps)(HydraFrame)
