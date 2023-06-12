import * as React from "react";

const DocumentTypeCell = (props) => {
    let type;
    switch (props.dataItem.documenttype) {
        case 1: {
            type = "docx";
            break;
        }
        case 2: {
            type = "csv";
            break;
        }
        case 3: {
            type = "pdf";
            break;
        }
        case 4: {
            type = "folder";
            break;
        }
    }
    return (
        <td>
            {type}
        </td>
    );
}

export default DocumentTypeCell;
