// Taken from SepiaGroup comment on https://github.com/erikras/redux-form/issues/71#issuecomment-255028641
import React from 'react';
import Dropzone from 'react-dropzone';

const ReduxFormDropzone = (field) => {
    let {
        input,
        meta,
        dropzoneOnDrop,
        ...props
    } = field;
    const files = field.input.value;

    return (
        <div>
            <Dropzone
                onDrop={(acceptedFiles, rejectedFiles, e) => {
                    field.input.onChange(acceptedFiles);
                    field.dropzoneOnDrop && field.dropzoneOnDrop(acceptedFiles, rejectedFiles, e);
                }}
                {...props}>
                <div>Drop a file here, or click to select files to upload.</div>
            </Dropzone>
            {field.meta.touched &&
                field.meta.error &&
                <span className="error">{field.meta.error}</span>}
            {files && Array.isArray(files) && (
                <ul>
                  { files.map((file, i) => <li key={i}>{file.name}</li>) }
                </ul>
            )}
        </div>
    );
}

export default ReduxFormDropzone;