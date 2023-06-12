import { EDIT } from "../UploadProgress/AppProgress";

export default function newEditActionPayload(row, newCase) {
    return {
        action: EDIT,
        row: row,
        newCase: newCase,
    }
}
