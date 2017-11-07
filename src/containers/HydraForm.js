import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { HydraNamespace, HydraExtNamespace } from '../namespaces/Hydra'
import { RDFSNamespace } from '../namespaces/RDFS'
import { getTitle as getHydraTitle } from '../hydra/apidoc'
import { dearrayify, getIdValue } from '../jsonld/helper'
import ReduxFormDropzone from '../components/ReduxFormDropzone'

// Testing - example of data loading
// import { load as loadAccount } from './account'
// const data = {
//   // used to populate "account" reducer when "Load" is clicked
//   firstName: 'Jane',
//   lastName: 'Doe',
//   age: '42',
//   sex: 'female',
//   employed: true,
//   favoriteColor: 'Blue',
//   bio: 'Born to write amazing Redux code.',
// }
// const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet']

class HydraForm extends Component {

  prepareFieldName(fieldName) {
    // Unfortunately redux-forms intercepts field names with dots in them
    // and makes them nested, so IRI field names get nested (e.g. with
    // exampleDOTcom). Replace the dot before assigning the Field name
    // then convert back later (in submit handler?)
    return fieldName.replace('.', '!')
  }

  createField(suppProp) {
    const rdfProperty = dearrayify(suppProp[HydraNamespace.property])
    const fieldName = this.prepareFieldName(getIdValue(rdfProperty))
    const propertyRange = rdfProperty[RDFSNamespace.range]
    const propertyRangeIRI = propertyRange ? getIdValue(propertyRange) : ''
    // console.log("[HydraForm] createField", rdfProperty, propertyRangeIRI, propertyRange)

    switch (propertyRangeIRI) {
      // Hack to specify File input field, need to find out how to do it in Hydra proper
      case HydraExtNamespace.inputTypeFileUpload:
        return <Field
              name={fieldName}
              component={ReduxFormDropzone}
              //style={style.dropzone}
              multiple={false}
              dropzoneOnDrop={this.handleDrop} />
      default:
        return <Field
              name={fieldName}
              component="input"
              type="text"
              placeholder="Testing" />
    }

  }

  render() {
    const { handleSubmit, load, pristine, reset, submitting } = this.props
    const { expectedClass } = this.props
    const suppProps = expectedClass[HydraNamespace.supportedProperty]

    // Create field for each Hyrda Class property (from hydra:expects class).
    // Populate field values with any values from current doc (if it's an method is PUT?)
    return (
      <form onSubmit={handleSubmit}>
        <h2>Hydra Form</h2>
        {suppProps &&
          Object.keys(suppProps).map((prop, i) =>
          <div key={i}>
            <label>{getHydraTitle(suppProps[prop])}</label>
            {this.createField(suppProps[prop])}
          </div>
        )}

        <div>
          <button type="submit" disabled={pristine || submitting}>Submit</button>
          <button type="button" disabled={pristine || submitting} onClick={reset}>
            Undo Changes
          </button>
        </div>
      </form>
    )
  }

  /*
  OLD VERSION of render function with form data loading
  render() {
    const { handleSubmit, load, pristine, reset, submitting } = this.props
    const { expectedClass } = this.props
    const suppProps = expectedClass[HydraNamespace.supportedProperty]

    // Create field for each Hyrda Class property (from hydra:expects class).
    // Populate field values with any values from current doc (if it's an method is PUT?)
    return (
      <form onSubmit={handleSubmit}>
        <h2>Hydra Form</h2>
        {suppProps &&
          Object.keys(suppProps).map((prop, i) =>
          <div key={i}>
            <label>{getHydraTitle(suppProps[prop])}</label>
            {this.createField(suppProps[prop])}
          </div>
        )}
        <div>
          <button type="button" onClick={() => load(data)}>Load Account</button>
        </div>
        <div>
          <label>First Name</label>
          <div>
            <Field
              name="firstName"
              component="input"
              type="text"
              placeholder="First Name"
            />
          </div>
        </div>
        <div>
          <label>Last Name</label>
          <div>
            <Field
              name="lastName"
              component="input"
              type="text"
              placeholder="Last Name"
            />
          </div>
        </div>
        <div>
          <label>Age</label>
          <div>
            <Field name="age" component="input" type="number" placeholder="Age" />
          </div>
        </div>
        <div>
          <label>Sex</label>
          <div>
            <label>
              <Field name="sex" component="input" type="radio" value="male" />
              {' '}
              Male
            </label>
            <label>
              <Field name="sex" component="input" type="radio" value="female" />
              {' '}
              Female
            </label>
          </div>
        </div>
        <div>
          <label>Favorite Color</label>
          <div>
            <Field name="favoriteColor" component="select">
              <option value="">Select a color...</option>
              {colors.map(colorOption => (
                <option value={colorOption} key={colorOption}>
                  {colorOption}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <div>
          <label htmlFor="employed">Employed</label>
          <div>
            <Field
              name="employed"
              id="employed"
              component="input"
              type="checkbox"
            />
          </div>
        </div>
        <div>
          <label>Bio</label>
          <div>
            <Field name="bio" component="textarea" />
          </div>
        </div>
        <div>
          <button type="submit" disabled={pristine || submitting}>Submit</button>
          <button type="button" disabled={pristine || submitting} onClick={reset}>
            Undo Changes
          </button>
        </div>
      </form>
    )
  }
  */

}

HydraForm.propTypes = {
  expectedClass: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
HydraForm = reduxForm({
  form: 'hydraForm', // a unique identifier for this form
})(HydraForm)


const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps)(HydraForm)

/*
OLD VERSION - with example of data loading
// You have to connect() to any reducers that you wish to connect to yourself
HydraForm = connect(
  state => ({
    initialValues: state.hydra.account.data, // pull initial values from account reducer
  }),
  { load: loadAccount }, // bind account loading action creator
)(HydraForm)

export default HydraForm
*/
