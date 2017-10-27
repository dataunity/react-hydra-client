import { getLiteralValue, typesContainAny } from '../jsonld/helper'
// import { hasId, getIdValue } from '../jsonld/helper'
import { HydraNamespace } from '../namespaces/Hydra'
import { RDFSNamespace } from '../namespaces/RDFS'

// Finds the specified Hydra SupportedClass in the API Documentation
export const findSupportedClass = function (apiDoc, classType) {
    var supportedClasses = apiDoc[HydraNamespace.supportedClass]

    // Note: slightly inefficient as it doesn't break
    // when item found, but easier to read
    if (supportedClasses) {
        for (const cls of supportedClasses) {
            for (const clsIri of Array.isArray(classType) ? classType : [classType]) {
                if (cls["@id"] === clsIri) {
                    return cls
                }
            }
        }
    }

    return null
}

function getProperty (suppProp) {
    // Gets the property from a SupportedProperty.
    // The JSON-LD must be expanded.
    return Array.isArray(suppProp[HydraNamespace.property]) ? suppProp[HydraNamespace.property][0] : suppProp[HydraNamespace.property]
}

// Finds the SupportedProperty in given SupportedClass
export const findSupportedPropertyInClass = function (cls, propType) {
    var apiDocSuppProp = null,
        suppProps, typesToCheck

    if (cls == null) {
        return apiDocSuppProp
    }

    suppProps = cls[HydraNamespace.supportedProperty];
    if (suppProps) {
        for(let suppProp of suppProps) {
            typesToCheck = Array.isArray(propType) ? propType : [propType]
            let prop = getProperty(suppProp)
            if (prop == null) {
                throw new Error("Couldn't find property for SupportedProperty in SupportedClass " +
                    String(cls["@id"]) + ". Check all SupportedProperty items have " +
                    "a 'property' property.")
            }
            for(let propIri of typesToCheck) {
                if (prop["@id"] === propIri) {
                    apiDocSuppProp = suppProp
                }
            }
        }
    }

    return apiDocSuppProp
}

export const getSupportedOperations = function (suppProp) {
    let prop = getProperty(suppProp)

    if (prop) {
        return prop[HydraNamespace.supportedOperation]
    } else {
        return []
    }
}

export const isSubClassOf = function (suppClass, baseClassIRIs) {
    // Find the class in API Doc
    var baseClass = "",
        isSubClass = false

    if (suppClass == null) {
        return false
    }

    baseClass = suppClass[RDFSNamespace.subClassOf]

    if (baseClass) {
        isSubClass = typesContainAny(baseClass, baseClassIRIs)
    }

    return isSubClass
}

export const getTitle = function (obj) {
    return getLiteralValue (obj, HydraNamespace.title, "Unknown")
}