import { COPY } from "../UploadProgress/AppProgress";

export default function newCopyActionPayload(rows, newParent) {
    return {
        action: COPY,
        row: rows,
        newParent: newParent,
    }
}
