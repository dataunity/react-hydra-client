import { RDFSNamespace } from '../namespaces/RDFS'
import jsonld from 'jsonld'

export function dearrayify (obj) {
    // If a item is wrapped in an array, remove the array, otherwise
    // just return the item
    if (Array.isArray(obj) && obj.length !== 1) {
        throw new Error("dearrayify expected exactly one item in the array");
    }
    return Array.isArray(obj) ? obj[0] : obj;
}

export function getValue (subject, property, defaultVal) {
    let vals = jsonld.getValues(subject, property),
        val = null,
        defaultValue = null;
    if (typeof defaultVal !== 'undefined') {
        defaultValue = defaultVal;
    }
    if (vals.length < 1) {
        return defaultValue;
    }
    val = vals[0];
    return val;
}

// Gets a literal value from subject using the property
export function getLiteralValue (subject, property, defaultVal) {
    let val = getValue(subject, property, defaultVal);
    if (val && typeof val === 'object' && jsonld.hasProperty(val, "@value")) {
        val = val["@value"]
    }
    return val;
}

// Gets the rdfs:label for an object
export function getLabel (obj) {
    return getLiteralValue(obj, RDFSNamespace.label);
}

// Gets the JSON-LD @id from an object
export function hasId (idObj) {
    const idObject = Array.isArray(idObj) ? idObj[0] : idObj
    return typeof idObject["@id"] !== 'undefined'
}

// Gets the JSON-LD @id from an object
export function getIdValue (idObj) {
    const idObject = Array.isArray(idObj) ? idObj[0] : idObj,
        vals = jsonld.getValues(idObject, "@id")
    if (vals.length !== 1) {
        throw new Error("Expected one value for id object, instead got " + String(vals.length))
    }
    return vals[0]
}

// Checks whether any of the IRIs in testForIRIs are present in typesToCheck
export function typesContainAny(typesToCheck, testForIRIs) {
    var containsIRI = false

    typesToCheck = Array.isArray(typesToCheck) ? typesToCheck : [typesToCheck]
    testForIRIs = Array.isArray(testForIRIs) ? testForIRIs : [testForIRIs]

    typesToCheck.forEach(function (typeToCheck) {
        var iriToCheck = typeToCheck
        if (hasId(iriToCheck)) {
            iriToCheck = getIdValue(iriToCheck)
        }
        testForIRIs.forEach(function (testForIRI) {
            if (iriToCheck === testForIRI) {
                containsIRI = true
            }
        })
    })

    return containsIRI
}