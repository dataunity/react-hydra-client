// import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import HydraProperties from './HydraProperties'
// import { getLabel } from '../jsonld/helper'

// export default class HydraDoc extends Component {

// 	render() {
// 		const { hydraDoc, supportedClass, frameId } = this.props
// 		console.log("[HydraDoc] render()", hydraDoc, supportedClass)
// 		return (
// 			<div>
// 				<h2>{getLabel(supportedClass)}</h2>
// 				<HydraProperties 
// 					hydraDoc={hydraDoc} 
// 					supportedClass={supportedClass}
// 					frameId={frameId} />
// 			</div>
// 		)
// 	}
// }

// HydraDoc.propTypes = {
// 	hydraDoc: PropTypes.object.isRequired,
// 	supportedClass: PropTypes.object,
// 	frameId: PropTypes.string.isRequired
// }