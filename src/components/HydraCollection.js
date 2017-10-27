import React, { Component } from 'react'
import HydraDoc from '../containers/HydraDoc'
import PropTypes from 'prop-types'
import { getLabel } from '../jsonld/helper'
import { HydraNamespace } from '../namespaces/Hydra'
import { findSupportedClass } from '../hydra/apidoc'

export default class HydraCollection extends Component {
	render() {
		const { supportedClass, hydraDoc, apiDoc, frameId } = this.props
		var cachedClassesByIRI = {}
		var getClass = function (types) {
			// Gets the API Doc class (using a cache)
			const key = String(types)
			
			console.log("types", types, key)
			if (cachedClassesByIRI[key]) {
				return cachedClassesByIRI[key]
			}

			const apiDocClass = findSupportedClass(apiDoc, types)
			cachedClassesByIRI[key] = apiDocClass
			console.log("[HydraCollection] Got class", key, apiDocClass)
			return apiDocClass
		}
		// console.log("[HydraCollection] hydraDoc", hydraDoc)
		return (
			<div>
				<h2>{getLabel(supportedClass)}</h2>
				<div>
				{hydraDoc[HydraNamespace.member].map((member, i) =>
					<div key={i} style={{ border: "1px solid grey", padding: "10px", marginBottom: "10px" }}>
						<HydraDoc hydraDoc={member} supportedClass={getClass(member["@type"])} frameId={frameId} />
					</div>
				)}
				</div>
			</div> 
		)
	}
}

HydraCollection.propTypes = {
	hydraDoc: PropTypes.object.isRequired,
	apiDoc: PropTypes.object.isRequired,
	supportedClass: PropTypes.object
}