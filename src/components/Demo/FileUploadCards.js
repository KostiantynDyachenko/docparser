import React from "react";
import FileUploadCard from "../Card/FileUploadCard";

function FileUploadCards(props) {
    const getTotalTime = (file) => {
        return (file.status === "failed" ? file.time : (file.status === "uploading" ? file.uploadTime : file.processTime));
    }

    return (
        props.files.map((file, i) => (
            <FileUploadCard name={file.name}
                            size={file.size}
                            type={file.type}
                            filetype={file.filetype}
                            status={file.status}
                            time={file.time}
                            totalTime={getTotalTime(file)}
                            index={i}
                            viewFile={props.viewFile}
                            stopFile={props.stopFile}
                            retryFile={props.retryFile}
                            {...file}
                            key={`${file.name}-${i}`}
            />
        ))
    );
}

export default FileUploadCards;