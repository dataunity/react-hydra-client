// import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
// import { 
//   changeHydraDoc, fetchHydraDocIfNeeded, 
//   invalidateHydraDoc, fetchHydraAPIDocIfNeeded
// } from '../actions'
// import IRIEntry from '../components/IRIEntry'

// class HydraApp extends Component {
//   static propTypes = {
//     currentHydraDoc: PropTypes.string.isRequired,
//     currentHydraAPIDoc: PropTypes.string.isRequired,
//     content: PropTypes.object.isRequired,
//     isFetching: PropTypes.bool.isRequired,
//     lastUpdated: PropTypes.number,
//     dispatch: PropTypes.func.isRequired
//   }

//   componentDidMount() {
//     const { dispatch, currentHydraDoc, currentHydraAPIDoc } = this.props
//     dispatch(fetchHydraDocIfNeeded(currentHydraDoc))
//     dispatch(fetchHydraAPIDocIfNeeded(currentHydraAPIDoc))
//   }

//   componentWillReceiveProps(nextProps) {
//     if (nextProps.currentHydraDoc !== this.props.currentHydraDoc) {
//       console.log("Different Hydra Doc requested")
//       const { dispatch, currentHydraDoc } = nextProps
//       dispatch(invalidateHydraDoc(currentHydraDoc))
//       dispatch(fetchHydraDocIfNeeded(currentHydraDoc))
//     }
//   }

//   handleIRISubmit = nextIri => {
//     this.props.dispatch(changeHydraDoc(nextIri))
//   }

//   handleRefreshClick = e => {
//     e.preventDefault()

//     const { dispatch, currentHydraDoc } = this.props
//     dispatch(invalidateHydraDoc(currentHydraDoc))
//     dispatch(fetchHydraDocIfNeeded(currentHydraDoc))
//   }

//   render() {
//     const { currentHydraDoc, isFetching, lastUpdated, content } = this.props
//     console.log("render()", currentHydraDoc, isFetching, lastUpdated)
//     const isEmpty = !content["@type"]
//     return (
//       <div>
//         <IRIEntry value={currentHydraDoc}
//           onSubmit={this.handleIRISubmit} />
//         <p>
//           {lastUpdated &&
//             <span>
//               Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
//               {' '}
//             </span>
//           }
//           {!isFetching &&
//             <button onClick={this.handleRefreshClick}>
//               Refresh
//             </button>
//           }
//         </p>
//         <div>
//           {isEmpty
//             ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
//             : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
//                 Doc
//               </div>
//           }
//         </div>
//       </div>)
//   }
// }

// const mapStateToProps = state => {
//   const { currentHydraDoc, currentHydraAPIDoc, hydraDoc } = state
//   const {
//     isFetching,
//     lastUpdated,
//     content
//   } = hydraDoc.content ? hydraDoc : {
//     isFetching: true,
//     content: {}
//   }

//   return {
//     currentHydraDoc,
//     currentHydraAPIDoc,
//     content,
//     isFetching,
//     lastUpdated
//   }
// }

// export default connect(mapStateToProps)(HydraApp)
