/* Manages Files being uploaded and Document data displayed in the tables
* */
import { Api } from "../../components/Api";

const UPLOAD_FILE = 'UPLOAD_FILE';
const UPLOAD_FILES = 'UPLOAD_FILES';
const CLEAR_FILES = 'CLEAR_FILES';
const REFRESH = 'REFRESH';
const LOADER = 'LOADER';
// const DELETE_FILE = 'DELETE_FILE';
// const MOVE_FILE = 'MOVE_FILE';
// const COPY_FILE = 'COPY_FILE';
// const DOWNLOAD_FILE = 'DOWNLOAD_FILE';
// const DOWNLOAD_ORIGINAL = 'DOWNLOAD_ORIGINAL';

// data: single file object
export function UploadFile(data) {
    return {
        type: UPLOAD_FILE,
        payload: {
            file: data
        }
    }
}

// data = array of file objects
export function UploadFiles(data) {
    return {
        type: UPLOAD_FILES,
        payload: {
            files: data
        }
    }
}

export function ClearFiles() {
    return {
        type: CLEAR_FILES,
        payload: {}
    }
}

export function SetRefresh(bool) {
    return {
        type: REFRESH,
        payload: {
            bool: bool
        }
    }
}

export function SetLoader(bool) {
    return {
        type: LOADER,
        payload: {
            bool: bool
        }
    }
}

const initialState = {
    // files queued for uploading or are being uploaded
    uploading: [],
    // force refresh from another component
    refresh: false,
    // display loading bar
    loader: false
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case UPLOAD_FILE: {
            return Object.assign({}, state, {
                uploading: [...state.uploading, action.payload.file]
            });
        }
        case UPLOAD_FILES: {
            return Object.assign({}, state, {
                uploading: [...state.uploading, ...action.payload.files]
            });
        }
        case CLEAR_FILES: {
            return Object.assign({}, state, {
                uploading: []
            });
        }
        case REFRESH: {
            return Object.assign({}, state, {
                refresh: action.payload.bool
            });
        }
        case LOADER: {
            return Object.assign({}, state, {
                loader: action.payload.bool
            });
        }
        default: {
            return state;
        }
    }
}
