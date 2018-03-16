import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import HydraProperty from '../components/HydraProperty'
import { dearrayify } from '../jsonld/helper'
import { findSupportedPropertyInClass } from '../hydra/apidoc'
import { withRouter } from 'react-router-dom'

class HydraProperties extends Component {

	getHydraPropertyElement(hydraPropIRI, hydraProp) {
		const { overrideHydraPropertyComponents, supportedClass, frameId } = this.props
		const overrideComponent = overrideHydraPropertyComponents[hydraPropIRI]
		const supportedProperty = findSupportedPropertyInClass(supportedClass, hydraPropIRI)
		const val = dearrayify(hydraProp)

		if (supportedProperty === null) {
			throw new Error("SupportedProperty is missing for property IRI " + hydraPropIRI)
		}

		if (overrideComponent) {
			return React.createElement(overrideComponent, {val, supportedProperty, frameId})
		} else {
			return <HydraProperty
				val={val}
				supportedProperty={supportedProperty}
				frameId={frameId} />
		}
	}

	render() {
		const { supportedClass, hydraDoc, frameId } = this.props
		// console.log("[HydraProperties] hydraDoc", hydraDoc)
		return (
			<div>
				{Object.keys(hydraDoc).map((prop, i) =>
					prop !== '@type' && prop !== '@id' &&
					<div key={i}>
						{this.getHydraPropertyElement(prop, hydraDoc[prop])}
					</div>
				)}
			</div>
		)
	}
}

HydraProperties.propTypes = {
	hydraDoc: PropTypes.object.isRequired,
	supportedClass: PropTypes.object,
	frameId: PropTypes.string.isRequired
}

function mapStateToProps(state) {
	const { overrideHydraPropertyComponents } = state.hydra

	return {
		overrideHydraPropertyComponents
	}
}

export default withRouter(connect(mapStateToProps)(HydraProperties))
