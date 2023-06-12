const SET_CURRENT_USER_FILTER = 'SET_CURRENT_USER_FILTER'; // sets user filter with user id
const SET_CURRENT_FOLDER = 'SET_CURRENT_FOLDER'; // sets directory with parent id
const SET_CURRENT_FOLDER_DATA = 'SET_CURRENT_FOLDER_DATA';
const SET_CURRENT_GROUP = 'SET_CURRENT_GROUP'; // sets group filter with group id
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE'; // sets current page of table pagination
const SET_CURRENT_ROWS_PER_PAGE = 'SET_CURRENT_ROWS_PER_PAGE'; // sets number of rows to show in table
const SET_CURRENT_DOCUMENT_ID = 'SET_CURRENT_DOCUMENT_ID'; // sets currently selected document id
const SET_TABLE_DATA = 'SET_TABLE_DATA'; // sets data for the table
const CLEAR_TABLE_DATA = 'CLEAR_TABLE_DATA';
const TOGGLE_TABLE_ROW_SELECTED = 'TOGGLE_TABLE_ROW_SELECTED'; // toggles a single row by index
const SET_TABLE_ROWS_SELECTED = 'SET_TABLE_ROWS_SELECTED'; // sets 'selected' key to bool for the table row by indexes
const SET_LAST_SELECTED_INDEX = 'SET_LAST_SELECTED_INDEX'; // sets last clicked on row

export function SetCurrentUserFilter(id) {
    return {
        type: SET_CURRENT_USER_FILTER,
        payload: {
            user: id
        }
    }
}

export function SetCurrentFolder(int) {
    return {
        type: SET_CURRENT_FOLDER,
        payload: {
            folder: int
        }
    }
}

export function SetCurrentFolderData(data) {
    return {
        type: SET_CURRENT_FOLDER_DATA,
        payload: {
            data: data
        }
    }
}

export function SetCurrentGroup(int) {
    return {
        type: SET_CURRENT_GROUP,
        payload: {
            group: int
        }
    }
}

export function SetCurrentPage(int) {
    return {
        type: SET_CURRENT_PAGE,
        payload: {
            page: int
        }
    }
}

export function SetCurrentRowsPerPage(int) {
    return {
        type: SET_CURRENT_ROWS_PER_PAGE,
        payload: {
            amount: int
        }
    }
}

export function SetCurrentDocumentId(int) {
    return {
        type: SET_CURRENT_DOCUMENT_ID,
        payload: {
            id: int
        }
    }
}

export function SetTableData(data) {
    return {
        type: SET_TABLE_DATA,
        payload: {
            data: data
        }
    }
}

export function ClearTableData(data) {
    return {
        type: CLEAR_TABLE_DATA,
        payload: {}
    }
}

// toggles selected for the specific row by index
export function ToggleTableRowSelected(data, index) {
    return {
        type: TOGGLE_TABLE_ROW_SELECTED,
        payload: {
            data: data,
            index: index
        }
    }
}

export function SetTableRowsSelected(data, indices, boolean) {
    return {
        type: SET_TABLE_ROWS_SELECTED,
        payload: {
            data: data,
            indices: indices,
            boolean: boolean
        }
    }
}

export function SetLastSelectedIndex(int) {
    return {
        type: SET_LAST_SELECTED_INDEX,
        payload: {
            int: int
        }
    }
}

const initialState = {
    tableData: [],
    currentFolder: 0,
    currentFolderData: {},
    currentUserFilter: 0, // set to user id when ?fuser={id} is in url
    currentGroup: 0, // set to group id when ?fgroup={id} is in url
    currentPage: 0,
    currentDocumentId: undefined,
    rowsPerPage: 25,
    selectedRows: [], // set when tableData is set, contains all rows with selected = true,
    lastSelectedIndex: 0
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER_FILTER: {
            return Object.assign({}, state, {
                currentUserFilter: +action.payload.user
            });
        }
        case SET_CURRENT_FOLDER: {
            return Object.assign({}, state, {
                currentFolder: +action.payload.folder
            });
        }
        case SET_CURRENT_FOLDER_DATA: {
            return Object.assign({}, state, {
                currentFolderData: action.payload.data
            })
        }
        case SET_CURRENT_GROUP: {
            return Object.assign({}, state, {
                currentGroup: +action.payload.group
            });
        }
        case SET_CURRENT_PAGE: {
            return Object.assign({}, state, {
                currentPage: +action.payload.page
            });
        }
        case SET_CURRENT_DOCUMENT_ID: {
            return Object.assign({}, state, {
                currentDocumentId: +action.payload.id
            });
        }
        case SET_CURRENT_ROWS_PER_PAGE: {
            return Object.assign({}, state, {
                rowsPerPage: +action.payload.amount
            });
        }
        case SET_TABLE_DATA: {
            action.payload.data.map(data => {
                if (data.selected == undefined) data.selected = false;
            });
            return Object.assign({}, state, {
                tableData: action.payload.data,
                selectedRows: action.payload.data.filter(row => row.selected)
            });
        }
        case CLEAR_TABLE_DATA: {
            return Object.assign({}, state, {
                tableData: [],
                selectedRows: [],
            });
        }
        case TOGGLE_TABLE_ROW_SELECTED: {
            // untoggle all rows
            const newData = action.payload.data.map((row, index) => {
                let selected = false;
                if (index === action.payload.index) {
                    selected = true;
                }
                return {
                    ...row,
                    selected: selected
                }
            });
            return Object.assign({}, state, {
                tableData: newData,
                selectedRows: newData.filter(row => row.selected)
            });
        }
        case SET_TABLE_ROWS_SELECTED: {
            const newData = action.payload.data.map((row, index) => {
                let selected = false;
                if (action.payload.indices.includes(index)) {
                    selected = true;
                }
                return {
                    ...row,
                    selected: selected
                }
            });
            return Object.assign({}, state, {
                tableData: newData,
                selectedRows: newData.filter(row => row.selected)
            });
        }
        case SET_LAST_SELECTED_INDEX: {
            return Object.assign({}, state, {
                lastSelectedIndex: action.payload.int
            });
        }
        default: {
            return state;
        }
    }
}


