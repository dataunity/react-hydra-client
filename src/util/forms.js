export default function submitForm(data) {
    var body = null,
        containsFiles = false,
        filelistKeys = [],
        formUrl = `http://localhost:8080/csvw/create-csvw-from-csv`,
        headers: {'Accept': 'application/json'}

    // Find out if data contains files
    Object.keys(data).forEach(( key ) => {
        var val = data[key]
        if (Array.isArray(val)) {
            if (val.length && val[0].constructor === File) {
                // console.log("First array item", val[0], val.constructor)
                // console.log("A file")
                containsFiles = true,
                filelistKeys.push(key)
            }
        }
    })

    // Prepare data
    if (containsFiles)
    {
        body = new FormData()

        Object.keys(data).forEach(( key ) => {
            var val = data[ key ]
            // console.log("form item", typeof val)
            // console.log(val)
            if (filelistKeys.indexOf(key) > -1) {
                // Add files
                for (var i = 0; i < val.length; i++) {
                    console.log("File", val[i]);
                    body.append(key, val[i])
                }
            } else {
                body.append(key, val)
            }

        })
    } else {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(data)
    }

    console.info('POST', body, data)

    fetch(formUrl, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: body
    })
        .then(res => res.json())
        // .then(res => console.log(res))
        .then(res => alert("Done"))
        .catch(err => console.error(err))
}
