export default function showResults(values) {
  window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
}

// Build environment currently doesn't support async
// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
//
// export default (async function showResults(values) {
//   await sleep(500) // simulate server latency
//   window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
// })
