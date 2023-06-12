// returns array of data set up for kendo grid use
export const initializeKData = (data) => {
    return data.map(dataItem => (
        {
            ...dataItem,
            selected: false
        }
    ));
}

export const initializeKObj = (obj) => {
    return {
        ...obj,
        selected: false
    }
}