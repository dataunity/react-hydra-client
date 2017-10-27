// import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import HydraProperty from './HydraProperty'
// import { dearrayify } from '../jsonld/helper'
// import { findSupportedPropertyInClass } from '../hydra/apidoc'

// export default class HydraProperties extends Component {
// 	render() {
// 		const { supportedClass, hydraDoc, frameId } = this.props
// 		// console.log("[HydraProperties] hydraDoc", hydraDoc)
// 		return (
// 			<div>
// 				{Object.keys(hydraDoc).map((prop, i) =>
// 					prop !== '@type' && prop !== '@id' &&
// 					<div key={i}>
// 						<HydraProperty 
// 							val={dearrayify(hydraDoc[prop])} 
// 							supportedProperty={findSupportedPropertyInClass(supportedClass, prop)}
// 							frameId={frameId} />
// 					</div>
// 				)}
// 			</div> 
// 		)
// 	}
// }

// HydraProperties.propTypes = {
// 	hydraDoc: PropTypes.object.isRequired,
// 	supportedClass: PropTypes.object,
// 	frameId: PropTypes.string.isRequired
// }