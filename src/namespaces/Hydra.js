const hydraBase = 'http://www.w3.org/ns/hydra/core#'
export const HydraNamespace = {
    _base: hydraBase,
    supportedClass: hydraBase + "supportedClass",
    supportedProperty: hydraBase + "supportedProperty",
    supportedOperation: hydraBase + "supportedOperation",
    operation: hydraBase + "operation",
    property: hydraBase + "property",
    title: hydraBase + "title",
    method: hydraBase + "method",
    expects: hydraBase + "expects",
    Link: hydraBase + "Link",
    Class: hydraBase + "Class",
    returns: hydraBase + "returns",
    Collection: hydraBase + "Collection",
    PagedCollection: hydraBase + "PagedCollection",
    member: hydraBase + "member"
}

// Experimental extensions to Hydra
const hydraExtBase = 'http://dataunity.org/ns/hydra-ext#'
export const HydraExtNamespace = {
    _base: hydraExtBase,
    inputTypeFileUpload: hydraExtBase + "inputTypeFileUpload"
}