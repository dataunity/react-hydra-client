import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getLabel, getLiteralValue, getIdValue } from '../jsonld/helper'
import { getSupportedOperations, findSupportedClass } from '../hydra/apidoc'
import { HydraNamespace, HydraExtNamespace } from '../namespaces/Hydra'
import { changeIRIForFrame,
	invalidateFrame,
	setFormForFrame,
	dontUseRoutesForFrame } from '../actions'
import { withRouter, Link } from 'react-router-dom'

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
		// Navigate by actions rather than Routes (don't use Route urls anymore)
	    dispatch(dontUseRoutesForFrame(frameId))

		dispatch(changeIRIForFrame(frameId, evt.target.href))
		dispatch(invalidateFrame(frameId))
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
		const { useRoutes, advancedMode } = this.props
		const formMethod = getLiteralValue(op, HydraNamespace.method, ""),
			returns = op[HydraNamespace.returns],
			label = getLabel(op)
		var isExternalLink = false

		// Hydra extension hack to find out whether link should break out
		// of the Hydra client
		if (returns) {
			if (getIdValue(returns) === HydraExtNamespace.externalLink) {
				isExternalLink = true
			}
		}

		if (!val || !val.hasOwnProperty("@id")) {
			throw new Error("Expected property value to be an id link")
		}
		var url = val["@id"]

		switch (formMethod) {
			case "GET":
				if (isExternalLink) {
					return <span key={index}>
						<a href={url} target="_blank">{label}</a>
						{advancedMode && ' (GET)'}
					</span>
				} else {
					return <span key={index}>
						{useRoutes
							? <Link to={{
									pathname: '/view',
									search: '?iri=' + encodeURIComponent(url)
								}}>{label}</Link>
							: <a onClick={this.handleGETClick} href={url}>{label}</a>
						}
						{advancedMode && ' (GET)'}
					</span>
				}
				// return <span key={index}>
				// 		{isExternalLink
				// 			? <a href={url} target="_blank">{label}</a>
				// 			: <div> <a onClick={this.handleGETClick} href={url}>{label}</a> <Link to={{
				// 				  pathname: '/view',
				// 				  search: '?iri=' + encodeURIComponent(url)
				// 			  }}>{label}</Link> </div>
				// 		}
				// 		{advancedMode && ' (GET)'}
				// 	</span>

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
	advancedMode: PropTypes.bool.isRequired,
	useRoutes: PropTypes.bool.isRequired
}

const mapStateToProps = (state, ownProps) => {
	const { frameId } = ownProps
	const { hydraAPIDoc,
	 	advancedMode,
		hydraDocByFrameId } = state.hydra
	const apiDoc = hydraAPIDoc.content
	const useRoutes = hydraDocByFrameId[frameId].useRoutes

	return {
		apiDoc,
		advancedMode,
		useRoutes
	}
}

export default connect(mapStateToProps)(HydraOperations)
