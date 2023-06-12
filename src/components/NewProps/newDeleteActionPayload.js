import { DELETE } from "../UploadProgress/AppProgress";

export default function newDeleteActionPayload(rows) {
    return {
        action: DELETE,
        row: rows,
    }
}
