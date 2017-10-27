import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { HydraNamespace } from '../namespaces/Hydra'
import { getLiteralValue } from '../jsonld/helper'
import HydraOperations from '../containers/HydraOperations'

export default class HydraProperty extends Component {
	getLabel () {
		return getLiteralValue(this.props.supportedProperty, HydraNamespace.title, "Unknown")
	}
	render() {
		const { supportedProperty, val, frameId } = this.props
		let label = this.getLabel()
		const isSimpleValue = val.hasOwnProperty("@value")
		// console.log("[HydraProperty] supportedProperty", val, supportedProperty)

		return (
			<div>
				<span>{label}: </span>
				{isSimpleValue &&
					<span>{val["@value"]}</span>
				}
				<HydraOperations
					val={val}
					supportedProperty={supportedProperty}
					frameId={frameId} />
			</div>
		)
	}
}

HydraProperty.propTypes = {
	val: PropTypes.object,	// The value of the Hydra Doc property
	supportedProperty: PropTypes.object.isRequired,
	frameId: PropTypes.string.isRequired
}
