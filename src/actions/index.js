import jsonld from 'jsonld'

// export const REQUEST_POSTS = 'REQUEST_POSTS'
// export const RECEIVE_POSTS = 'RECEIVE_POSTS'
// export const SELECT_REDDIT = 'SELECT_REDDIT'
// export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'

// export const selectReddit = reddit => ({
//   type: SELECT_REDDIT,
//   reddit
// })

// export const invalidateReddit = reddit => ({
//   type: INVALIDATE_REDDIT,
//   reddit
// })

// export const requestPosts = reddit => ({
//   type: REQUEST_POSTS,
//   reddit
// })

// export const receivePosts = (reddit, json) => ({
//   type: RECEIVE_POSTS,
//   reddit,
//   posts: json.data.children.map(child => child.data),
//   receivedAt: Date.now()
// })

// const fetchPosts = reddit => dispatch => {
//   dispatch(requestPosts(reddit))
//   return fetch(`https://www.reddit.com/r/${reddit}.json`)
//     .then(response => response.json())
//     .then(json => dispatch(receivePosts(reddit, json)))
// }

// const shouldFetchPosts = (state, reddit) => {
//   const posts = state.postsByReddit[reddit]
//   if (!posts) {
//     return true
//   }
//   if (posts.isFetching) {
//     return false
//   }
//   return posts.didInvalidate
// }

// export const fetchPostsIfNeeded = reddit => (dispatch, getState) => {
//   if (shouldFetchPosts(getState(), reddit)) {
//     return dispatch(fetchPosts(reddit))
//   }
// }


// ---------------
// Hydra
// ---------------

// export const CHANGE_HYDRA_DOC = 'CHANGE_HYDRA_DOC'
export const CHANGE_HYDRA_API_DOC = 'CHANGE_HYDRA_API_DOC'
export const INVALIDATE_HYDRA_DOC = 'INVALIDATE_HYDRA_DOC'
export const INVALIDATE_HYDRA_API_DOC = 'INVALIDATE_HYDRA_API_DOC'
// export const REQUEST_HYDRA_DOC = 'REQUEST_HYDRA_DOC'
export const REQUEST_HYDRA_API_DOC = 'REQUEST_HYDRA_API_DOC'
// export const RECEIVE_HYDRA_DOC = 'RECEIVE_HYDRA_DOC'
export const RECEIVE_HYDRA_API_DOC = 'RECEIVE_HYDRA_API_DOC'

// export const changeHydraDoc = iri => ({
//   type: CHANGE_HYDRA_DOC,
//   iri
// })

export const changeHydraAPIDoc = iri => ({
  type: CHANGE_HYDRA_API_DOC,
  iri
})

// export const invalidateHydraDoc = iri => ({
//   type: INVALIDATE_HYDRA_DOC,
//   iri
// })

export const invalidateHydraAPIDoc = iri => ({
  type: INVALIDATE_HYDRA_API_DOC,
  iri
})

// export const requestHydraDoc = iri => ({
//   type: REQUEST_HYDRA_DOC,
//   iri
// })

export const requestHydraAPIDoc = iri => ({
  type: REQUEST_HYDRA_API_DOC,
  iri
})

// export const receiveHydraDoc = (iri, json) => ({
//   type: RECEIVE_HYDRA_DOC,
//   iri,
//   // JSON-LD expansion puts content under "0"
//   doc: json["0"],
//   receivedAt: Date.now()
// })

export const receiveHydraAPIDoc = (iri, json) => ({
  type: RECEIVE_HYDRA_API_DOC,
  iri,
  // JSON-LD expansion puts content under "0"
  doc: json["0"],
  receivedAt: Date.now()
})

function expandJsonld(json) {
  var promises = jsonld.promises
  return promises.expand(json)
}

// const fetchHydraDoc = iri => dispatch => {
//   dispatch(requestHydraDoc(iri))

//   // Temp hack to keep development offline.
//   // TODO: use iri instead
//   switch (iri) {
//     case 'http://localhost:8079/hydra/entrypoint':
//       iri = '/tmpdata/entry_point.json'
//       break
//     case 'http://localhost:8079/csvw/table-summaries':
//       iri = '/tmpdata/table_summaries.json'
//       break
//     default:
//       throw new Error("Unknown Hydra Doc IRI")
//   }

//   return fetch(iri)
//     .then(response => response.json())
//     .then(json => expandJsonld(json))
//     .then(json => dispatch(receiveHydraDoc(iri, json)))
// }

const fetchHydraAPIDoc = iri => dispatch => {
  dispatch(requestHydraAPIDoc(iri))

  // Temp hack to keep development offline.
  // TODO: use iri instead
  switch (iri) {
    case 'http://localhost:8079/hydra/api-doc':
      iri = '/tmpdata/api_doc.json'
      break
    default:
      iri = iri
      break
  }

  return fetch(iri)
    .then(response => response.json())
    .then(json => expandJsonld(json))
    .then(json => dispatch(receiveHydraAPIDoc(iri, json)))
}

// const shouldFetchHydraDoc = (state, iri) => {
//   const hydraDoc = state.hydraDoc
//   if (!hydraDoc.content) {
//     return true
//   }
//   if (hydraDoc.isFetching) {
//     return false
//   }
//   return hydraDoc.didInvalidate
// }

const shouldFetchHydraDoc = (hydraDoc, iri) => {
  if (!hydraDoc.content) {
    return true
  }
  if (hydraDoc.isFetching) {
    return false
  }
  return hydraDoc.didInvalidate
}

// export const fetchHydraDocIfNeeded = iri => (dispatch, getState) => {
//   if (shouldFetchHydraDoc(getState().hydraDoc, iri)) {
//     return dispatch(fetchHydraDoc(iri))
//   }
// }

export const fetchHydraAPIDocIfNeeded = iri => (dispatch, getState) => {
  if (shouldFetchHydraDoc(getState().hydra.hydraAPIDoc, iri)) {
    return dispatch(fetchHydraAPIDoc(iri))
  }
}

// Hydra Forms
export const SET_FORM_FOR_FRAME = 'SET_FORM_FOR_FRAME'
export const REMOVE_FORM_FOR_FRAME = 'REMOVE_FORM_FOR_FRAME'

export const setFormForFrame = (frameId, method, formUrl, expectedClass) => ({
  type: SET_FORM_FOR_FRAME,
  frameId,
  method,
  formUrl,
  expectedClass
})

export const removeFormForFrame = frameId => ({
  type: REMOVE_FORM_FOR_FRAME,
  frameId
})

// Hydra Browsing by Frame

export const REQUEST_DOC_FOR_FRAME = 'REQUEST_DOC_FOR_FRAME'
export const RECEIVE_DOC_FOR_FRAME = 'RECEIVE_DOC_FOR_FRAME'
export const INVALIDATE_FRAME = 'INVALIDATE_FRAME'
export const CHANGE_IRI_FOR_FRAME = 'CHANGE_IRI_FOR_FRAME'

export const changeIRIForFrame = (frameId, iri) => (dispatch, getState) => {
  dispatch(removeFormForFrame(frameId))
  dispatch({
    type: CHANGE_IRI_FOR_FRAME,
    frameId,
    iri
  })
}

// export const changeIRIForFrame = (frameId, iri) => ({
//   type: CHANGE_IRI_FOR_FRAME,
//   frameId,
//   iri
// })

export const invalidateFrame = frameId => ({
  type: INVALIDATE_FRAME,
  frameId
})

export const requestDocForFrame = (frameId, iri) => ({
  type: REQUEST_DOC_FOR_FRAME,
  frameId,
  iri
})

export const receiveDocForFrame = (frameId, json) => ({
  type: RECEIVE_DOC_FOR_FRAME,
  frameId,
  // JSON-LD expansion puts content under "0"
  doc: json["0"],
  receivedAt: Date.now()
})

const fetchDocForFrame = (frameId, iri) => dispatch => {
  dispatch(requestDocForFrame(frameId, iri))

  // Temp hack to keep development offline.
  // TODO: use iri instead
  switch (iri) {
    case 'http://localhost:8079/hydra/entrypoint':
      iri = '/tmpdata/entry_point.json'
      break
    case 'http://localhost:8079/csvw/table-summaries':
      iri = '/tmpdata/table_summaries.json'
      break
    case 'http://localhost:8079/wot/device-summaries':
        iri = '/tmpdata/devices.json'
        break
    default:
      iri = iri
      //throw new Error("Unknown Hydra Doc IRI: " + iri)
      break
  }

  // return fetch(iri)
  return fetch(iri, {
      credentials: 'include',
      headers: {
          Accept: 'application/ld+json'
      }
  })
    .then(response => response.json())
    .then(json => expandJsonld(json))
    .then(json => dispatch(receiveDocForFrame(frameId, json)))
}

const shouldFetchDocForFrame = (state, frameId) => {
  const docInfo = state.hydraDocByFrameId[frameId]
  if (!docInfo) {
    return true
  }
  if (docInfo.isFetching) {
    return false
  }
  return docInfo.didInvalidate
}

export const fetchDocForFrameIfNeeded = (frameId, iri) => (dispatch, getState) => {
  if (shouldFetchDocForFrame(getState().hydra, frameId)) {
    return dispatch(fetchDocForFrame(frameId, iri))
  }
}
