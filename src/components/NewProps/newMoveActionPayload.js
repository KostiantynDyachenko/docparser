import { MOVE } from "../UploadProgress/AppProgress";

export default function newMoveActionPayload(rows, newParent) {
    return {
        action: MOVE,
        row: rows,
        newParent: newParent,
    }
}
