import { AIOPERATION } from "../UploadProgress/AppProgress";

export default function newAIOperationActionPayload(rows, body, type) {
    return {
        action: AIOPERATION,
        row: rows,
        body: body,
        type: type,
    }
}
