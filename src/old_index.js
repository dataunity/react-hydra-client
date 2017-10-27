import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducer from './reducers'
import App from './containers/App'
// import DeviceDashboardHydraDoc from '../../dataunity-web/duweb/static/devicedashboard/src/containers/DeviceDashboardHydraDoc'



//*******************************
// Testing override components
import { Component } from 'react'
// import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { HydraNamespace } from './namespaces/Hydra'
import { getLiteralValue } from './jsonld/helper'
import HydraOperations from './containers/HydraOperations'

export default class TestHydraProperty extends Component {
  getLabel () {
    return getLiteralValue(this.props.supportedProperty, HydraNamespace.title, "Unknown")
  }
  render() {
    const { supportedProperty, val, frameId } = this.props
    let label = this.getLabel()
    const isSimpleValue = val.hasOwnProperty("@value")
    // console.log("[TestHydraProperty] supportedProperty", val, supportedProperty)

    return (
      <div>
        <strong>Override for EntryPoint devices</strong>
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

TestHydraProperty.propTypes = {
  val: PropTypes.object,  // The value of the Hydra Doc property
  supportedProperty: PropTypes.object,
  frameId: PropTypes.string.isRequired
}

class TestReplacementHydraDoc extends Component {
  render() {
      const { frameId } = this.props

    return (
      <div>
        Replacement Hydra Doc in {frameId}
      </div>
    )
  }
}

TestReplacementHydraDoc.propTypes = {
  hydraDoc: PropTypes.object.isRequired,  // The value of the Hydra Doc property
  supportedClass: PropTypes.object.isRequired,
  frameId: PropTypes.string.isRequired
}

//*******************************


const middleware = [ thunk ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

// overrideHydraPropertyComponents: overrides a Hydra Property with a
//  replacement component
// overrideHydraDocByClassComponents: overrides a Hydra Doc with a Component
//  when the Hydra Doc matches the class given in the key
const intialState = {
	entryPoint: 'http://localhost:8080/hydra/entrypoint',
	currentHydraAPIDoc: 'http://localhost:8080/hydra/api-doc',
    // overrideHydraPropertyComponents: {
    //     'http://localhost:8080/hydra/api-doc#EntryPoint/devicesummaries': TestHydraProperty
    // },
    overrideHydraDocByClassComponents: {
        'http://iot.linkeddata.es/def/wot#Thing': TestReplacementHydraDoc,
        // 'http://iot.linkeddata.es/def/wot#Thing': DeviceDashboardHydraDoc
    }
}

const store = createStore(
  reducer,
  intialState,
  applyMiddleware(...middleware)
)

render(
  <Provider store={store}>
  	<App />
  </Provider>,
  document.getElementById('root')
)
