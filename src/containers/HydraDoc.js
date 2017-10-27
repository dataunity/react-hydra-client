import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import HydraProperties from '../containers/HydraProperties'
import { getLabel } from '../jsonld/helper'

// Testing for redux-form
import showResults from './showResults'
import HydraForm from './HydraForm'

class HydraDoc extends Component {

	renderComponent() {
		const { hydraDoc,
			supportedClass,
			frameId,
			formMethod,
			formUrl,
			formExpectedClass,
			overrideHydraDocByClassComponents } = this.props
		const showFormView = Boolean(formMethod)
		const hydraDocClasses = hydraDoc['@type']
		var overrideComponent = null

		// Find any override Components for the current Hydra Doc
		hydraDocClasses.forEach(function (val, index) {
			console.log('[HydraDoc.renderComponent()]', val)
			if (typeof overrideHydraDocByClassComponents[val] !== 'undefined') {
				overrideComponent = overrideHydraDocByClassComponents[val]
				console.log('[HydraDoc.renderComponent()] found replacement')
			}
		})

		if (overrideComponent) {
			return React.createElement(overrideComponent,
				{
					hydraDoc,
					supportedClass,
					frameId
				})
		} else if (showFormView) {
			return <div>
				<h2>{getLabel(supportedClass)}</h2>

				<HydraForm form={'form-' + frameId}
					onSubmit={showResults}
					formMethod={formMethod}
					formUrl={formUrl}
					expectedClass={formExpectedClass} />
			</div>
		} else {
			return <div>
				<h2>{getLabel(supportedClass)}</h2>

				<HydraProperties
					hydraDoc={hydraDoc}
					supportedClass={supportedClass}
					frameId={frameId} />
			</div>
		}
	}

	render() {
		// const renderComponent = this.renderComponent
		return (
			<div>
				{this.renderComponent()}
			</div>
		)
	}

	/*
	render() {
		const { hydraDoc, supportedClass, frameId, formMethod, formUrl, formExpectedClass } = this.props
		const showFormView = Boolean(formMethod)
		return (
			<div>
				<h2>{getLabel(supportedClass)}</h2>
				{showFormView
					? <HydraForm form={'form-' + frameId}
						onSubmit={showResults}
						formMethod={formMethod}
						formUrl={formUrl}
						expectedClass={formExpectedClass} />
					: <HydraProperties
						hydraDoc={hydraDoc}
						supportedClass={supportedClass}
						frameId={frameId} />
				}
			</div>
		)
	}
	*/
}

HydraDoc.propTypes = {
	hydraDoc: PropTypes.object.isRequired,
	supportedClass: PropTypes.object.isRequired,
	frameId: PropTypes.string.isRequired,
	formMethod: PropTypes.string,
	formUrl: PropTypes.string,
	formExpectedClass: PropTypes.object,
	overrideHydraDocByClassComponents: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const { formByFrameId, overrideHydraDocByClassComponents } = state.hydra
  const { frameId } = ownProps
  const {
    method: formMethod,
    formUrl,
    expectedClass: formExpectedClass
  } = formByFrameId[frameId] || {
    method: "",
    formUrl: "",
    expectedClass: null
  }

  return {
    formMethod,
    formUrl,
    formExpectedClass,
	overrideHydraDocByClassComponents
  }
}

export default connect(mapStateToProps)(HydraDoc)
