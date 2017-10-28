import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getLabel, getLiteralValue, getIdValue } from '../jsonld/helper'
import { getSupportedOperations, findSupportedClass } from '../hydra/apidoc'
import { HydraNamespace } from '../namespaces/Hydra'
import { changeIRIForFrame, setFormForFrame } from '../actions'

class HydraOperations extends Component {

	constructor(props) {
		super(props)

		this.handleGETClick = this.handleGETClick.bind(this)
		this.handlePOSTClick = this.handlePOSTClick.bind(this)
	}

	getOperations() {
		return getSupportedOperations(this.props.supportedProperty)
	}

	handleGETClick(evt) {
		const { frameId, dispatch } = this.props
		evt.preventDefault()
		dispatch(changeIRIForFrame(frameId, evt.target.href))
	}

	handlePOSTClick(method, formUrl, expectedClassIRI) {
		const { frameId, dispatch, apiDoc } = this.props
		const expectedClass = findSupportedClass(apiDoc, expectedClassIRI)
		if (expectedClass == null) {
			throw new Error("Couldn't find form's expected SupportedClass in Hydra API Doc for " + expectedClassIRI)
		}
		dispatch(setFormForFrame(frameId, method, formUrl, expectedClass))
	}

	createOpElement(op, val, index) {
		const { advancedMode } = this.props
		const formMethod = getLiteralValue(op, HydraNamespace.method, "")

		if (!val || !val.hasOwnProperty("@id")) {
			throw new Error("Expected property value to be an id link")
		}
		var url = val["@id"]

		switch (formMethod) {
			case "GET":
				return <span key={index}>
						<a onClick={this.handleGETClick} href={url}>{getLabel(op)}</a>
						{advancedMode && ' (GET)'}
					</span>
				// return (
				// 	<div key={i}>
				// 		<span>GET Op {getLabel(op)}</span>
				// 		<span onClick={e => this.handleIriChange(e)}>Click</span>
				// 	</div>)
			case "POST":
				return <span key={index}>
					<a onClick={e => {e.preventDefault(); this.handlePOSTClick(formMethod, url, getIdValue(op[HydraNamespace.expects]))}} href={url}>{getLabel(op)}</a>
					{advancedMode && ' (POST)'}
				  </span>
			default:
				return <span>Unknown Operation</span>
		}
	}

	render() {
		const { val } = this.props
		let ops = this.getOperations()
		return (
			<span>
				{ops.map((op, i) =>
					this.createOpElement(op, val, i)
				)}
			</span>

		)
	}
}

HydraOperations.propTypes = {
	val: PropTypes.object,	// The value of the Hydra Doc property
	supportedProperty: PropTypes.object,
	frameId: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
	advancedMode: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
	const { hydraAPIDoc,
	 	advancedMode } = state.hydra
	const apiDoc = hydraAPIDoc.content

	return {
		apiDoc,
		advancedMode
	}
}

export default connect(mapStateToProps)(HydraOperations)
